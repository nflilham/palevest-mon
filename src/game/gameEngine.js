import { TILE_SIZE, sprites } from './sprites.js';
import {
  MAP_COLS,
  MAP_ROWS,
  TILES,
  createWorldMap,
  SHIPPING_BIN,
  WELL_POS,
  QUEST_BOARD_POS,
  FISHING_SPOTS,
} from './worldMap.js';
import { NPC_CATALOG, DAILY_QUESTS, NPCManager } from './npcs.js';
import { DEFAULT_HOTBAR, ITEMS, FarmingSystem } from './farming.js';
import { sound } from './audio.js';

const SEASONS = ['Semi', 'Panas', 'Gugur', 'Dingin'];

export class GameEngine {
  constructor(ui) {
    this.ui = ui;
    this.world = createWorldMap();
    this.npcManager = new NPCManager();
    this.farming = new FarmingSystem();

    this.canvas = null;
    this.ctx = null;
    this.running = false;
    this.rafId = null;
    this.lastTime = 0;
    this.tick = 0;

    this.keys = new Set();
    this.mobileDirs = new Set();
    this.stepSoundTimer = 0;
    this.clockAccum = 0;
    this.hudSyncTimer = 0;

    this.state = {
      username: 'Petani Lembah',
      farmName: 'Kebun Embun Pagi',
      day: 1,
      season: 'Semi',
      hour: 8,
      minute: 0,
      gold: 500,
      energy: 100,
      maxEnergy: 100,
      activeSlot: 0,
      hotbar: DEFAULT_HOTBAR.map((item) => ({ ...item })),
      completedQuests: [],
      district: 'Kebun & Rumah Lembah',
      interactionPrompt: '',
    };

    this.player = {
      x: 10,
      y: 11,
      dir: 'down',
      frame: 0,
      isMoving: false,
      speed: 5.4,
    };

    this.camera = { x: 0, y: 0 };
    this.particles = [];
    this.floatingTexts = [];

    this._initParticles();
    this._bindGlobalControls();
  }

  _initParticles() {
    this.particles = Array.from({ length: 36 }, (_, i) => ({
      x: Math.random() * MAP_COLS * TILE_SIZE,
      y: Math.random() * MAP_ROWS * TILE_SIZE,
      vx: (Math.random() - 0.3) * 18,
      vy: 10 + Math.random() * 16,
      size: i % 3 === 0 ? 4 : 3,
      phase: Math.random() * Math.PI * 2,
      color: i % 2 === 0 ? '#ffd6e0' : '#fef08a',
    }));
  }

  _bindGlobalControls() {
    window.addEventListener('keydown', (e) => {
      if (!this.running) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (this.ui && this.ui.isModalOpen()) {
        return;
      }

      const key = e.key.toLowerCase();

      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        this.keys.add(key);
        sound.ensureContext();
        sound.startBgm();
        return;
      }

      if (key >= '1' && key <= '8') {
        e.preventDefault();
        this.selectHotbarSlot(Number(key) - 1);
        return;
      }

      if (key === ' ') {
        e.preventDefault();
        this.useActiveTool();
        return;
      }

      if (key === 'e' || key === 'enter') {
        e.preventDefault();
        this.interact();
        return;
      }

      if (key === 'm') {
        e.preventDefault();
        this.ui?.openMinimapModal(this.getStateSnapshot());
        return;
      }

      if (key === 'q') {
        e.preventDefault();
        this.ui?.openQuestModal(DAILY_QUESTS, this.getStateSnapshot());
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key.toLowerCase());
    });

    window.addEventListener('resize', () => {
      this._resizeCanvas();
    });
  }

  _bindCanvasPointer() {
    if (!this.canvas || this.canvas._palevestBound) return;
    this.canvas._palevestBound = true;

    this.canvas.addEventListener('click', (e) => {
      if (!this.running || this.ui?.isModalOpen()) return;
      sound.ensureContext();
      sound.startBgm();

      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left + this.camera.x;
      const clickY = e.clientY - rect.top + this.camera.y;
      const tileX = Math.floor(clickX / TILE_SIZE);
      const tileY = Math.floor(clickY / TILE_SIZE);

      // Face towards clicked tile
      const dx = tileX - this.player.x;
      const dy = tileY - this.player.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        this.player.dir = dx >= 0 ? 'right' : 'left';
      } else {
        this.player.dir = dy >= 0 ? 'down' : 'up';
      }

      const dist = Math.hypot(dx, dy);
      if (dist <= 2.6) {
        const nearbyNpc = this.npcManager.getNearbyNPC(tileX, tileY, 1.5);
        if (nearbyNpc) {
          this.ui?.openNPCModal(nearbyNpc, this.getStateSnapshot(), 'chat');
          return;
        }
        this.useActiveTool(tileX, tileY);
      } else {
        this.useActiveTool();
      }
    });
  }

  _resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = false;
    }
  }

  start(savedData = null, authState = null) {
    sprites.init();
    this.canvas = this.ui?.getGameCanvas() || document.getElementById('game-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this._resizeCanvas();
    this._bindCanvasPointer();

    if (authState?.profile) {
      if (authState.profile.username) this.state.username = authState.profile.username;
      if (authState.profile.farmName) this.state.farmName = authState.profile.farmName;
    }

    if (savedData) {
      this.applyLoadedSave(savedData);
    }

    this._centerCameraImmediate();
    this._updateZoneAndPrompt();
    this.ui?.updateHUD(this.getStateSnapshot());

    if (!this.running) {
      this.running = true;
      this.lastTime = performance.now();
      const loop = (now) => {
        if (!this.running) return;
        const dt = Math.min(0.08, (now - this.lastTime) / 1000);
        this.lastTime = now;
        this.update(dt);
        this.render();
        this.rafId = window.requestAnimationFrame(loop);
      };
      this.rafId = window.requestAnimationFrame(loop);
    }
  }

  stop() {
    this.running = false;
    this.keys.clear();
    this.mobileDirs.clear();
    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  handleMobileInput(action, dir = null) {
    sound.ensureContext();
    sound.startBgm();
    if (action === 'dir_down' && dir) {
      this.mobileDirs.add(dir);
    } else if (action === 'dir_up' && dir) {
      this.mobileDirs.delete(dir);
    } else if (action === 'interact') {
      this.interact();
    } else if (action === 'use_tool') {
      this.useActiveTool();
    }
  }

  selectHotbarSlot(idx) {
    if (idx < 0 || idx > 7) return;
    this.state.activeSlot = idx;
    this.ui?.updateHotbar(this.state.hotbar, idx);
  }

  teleportPlayer(tx, ty) {
    this.player.x = tx;
    this.player.y = ty;
    this.player.dir = 'down';
    this._centerCameraImmediate();
    this._updateZoneAndPrompt();
    this.ui?.updateHUD(this.getStateSnapshot());
  }

  _centerCameraImmediate() {
    if (!this.canvas) return;
    const worldW = MAP_COLS * TILE_SIZE;
    const worldH = MAP_ROWS * TILE_SIZE;
    const targetX = this.player.x * TILE_SIZE + TILE_SIZE / 2 - this.canvas.width / 2;
    const targetY = this.player.y * TILE_SIZE + TILE_SIZE / 2 - this.canvas.height / 2;
    this.camera.x = Math.max(0, Math.min(Math.max(0, worldW - this.canvas.width), targetX));
    this.camera.y = Math.max(0, Math.min(Math.max(0, worldH - this.canvas.height), targetY));
  }

  getFacingTile() {
    const offsets = {
      down: [0, 1],
      up: [0, -1],
      left: [-1, 0],
      right: [1, 0],
    };
    const [ox, oy] = offsets[this.player.dir] || [0, 1];
    return {
      tx: Math.round(this.player.x) + ox,
      ty: Math.round(this.player.y) + oy,
    };
  }

  addFloatingText(text, tileX, tileY, color = '#fef08a') {
    this.floatingTexts.push({
      text,
      x: tileX * TILE_SIZE + TILE_SIZE / 2,
      y: tileY * TILE_SIZE,
      color,
      life: 1.35,
    });
  }

  useActiveTool(overrideTx = null, overrideTy = null) {
    if (this.ui?.isModalOpen()) return;
    const slotItem = this.state.hotbar[this.state.activeSlot];
    if (!slotItem) {
      this.ui?.showToast('Slot hotbar ini kosong. Pilih slot 1-8.', 'info');
      return;
    }

    if (this.state.energy <= 1 && slotItem.type !== 'food' && slotItem.id !== 'hand') {
      this.ui?.showToast(
        'Stamina hampir habis! Makan bekal, kunjungi Klinik Dr. Elian, atau tidur di Rumah Kebun.',
        'warn'
      );
      return;
    }

    const facing = this.getFacingTile();
    const tx = overrideTx !== null ? overrideTx : facing.tx;
    const ty = overrideTy !== null ? overrideTy : facing.ty;

    const worldHelpers = {
      isWater: (cx, cy) => this.world.grid[cy]?.[cx] === TILES.WATER,
      isNearWater: (cx, cy) => {
        const rx = Math.round(cx);
        const ry = Math.round(cy);
        if (Math.hypot(rx - WELL_POS.tileX, ry - WELL_POS.tileY) <= 2.2) return true;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (this.world.grid[ry + dy]?.[rx + dx] === TILES.WATER) return true;
          }
        }
        return false;
      },
    };

    const res = this.farming.useActiveSlot(slotItem, tx, ty, this.state, worldHelpers);

    if (res.energyDelta) {
      this.state.energy = Math.max(
        0,
        Math.min(this.state.maxEnergy, this.state.energy + res.energyDelta)
      );
    }
    if (res.goldDelta) {
      this.state.gold = Math.max(0, this.state.gold + res.goldDelta);
    }

    if (res.ok) {
      const sfxMap = {
        till: 'hoe',
        water: 'water',
        water_refill: 'water',
        plant: 'plant',
        harvest: 'harvest',
        forage: 'pickup',
        animal: 'harvest',
        fish: 'fish',
        eat: 'pickup',
      };
      sound.playSfx(sfxMap[res.sound] || 'pickup');
      this.addFloatingText(res.message, tx, ty, '#a7f3d0');
      this.ui?.showToast(res.message, 'success');
    } else if (res.message) {
      this.ui?.showToast(res.message, 'info');
    }

    this.ui?.updateHUD(this.getStateSnapshot());
  }

  interact() {
    if (this.ui?.isModalOpen()) return;

    const px = this.player.x;
    const py = this.player.y;
    const { tx, ty } = this.getFacingTile();

    // 1. Check nearby NPC first
    const nearbyNpc = this.npcManager.getNearbyNPC(px, py, 2.3);
    if (nearbyNpc) {
      this.ui?.openNPCModal(nearbyNpc, this.getStateSnapshot(), 'chat');
      return;
    }

    // 2. Check interactable tile in front or under player
    const target =
      this.world.getInteractableAt(tx, ty) ||
      this.world.getInteractableAt(Math.round(px), Math.round(py));

    if (target) {
      if (target.type === 'building') {
        if (target.actionType === 'sleep') {
          this.sleepAndAdvanceDay();
          return;
        }
        if (target.npcId) {
          const npc =
            this.npcManager.getNPCById(target.npcId) ||
            NPC_CATALOG.find((n) => n.id === target.npcId);
          if (npc) {
            this.ui?.openNPCModal(npc, this.getStateSnapshot(), 'shop');
            return;
          }
        }
      }

      if (target.type === 'shipping_bin') {
        this.ui?.openShippingBinModal(this.getStateSnapshot());
        return;
      }

      if (target.type === 'quest_board') {
        this.ui?.openQuestModal(DAILY_QUESTS, this.getStateSnapshot());
        return;
      }

      if (target.type === 'well' || target.type === 'fountain') {
        const can = this.state.hotbar.find((s) => s && s.id === 'watering_can');
        if (can) {
          can.water = can.maxWater || 20;
          sound.playSfx('water');
          this.addFloatingText('Penyiram Penuh!', tx, ty, '#7dd3fc');
          this.ui?.showToast(`${target.name}: Penyiram air telah diisi penuh!`, 'success');
          this.ui?.updateHUD(this.getStateSnapshot());
          return;
        }
      }

      if (target.type === 'fishing_spot') {
        const rodIdx = this.state.hotbar.findIndex((s) => s && s.id === 'fishing_rod');
        if (rodIdx !== -1) {
          this.selectHotbarSlot(rodIdx);
          this.useActiveTool(tx, ty);
          return;
        }
      }
    }

    // 3. Check nearby forage item or ranch animal
    const forage = this.farming.getNearbyForage(px, py, 2.0);
    const animal = this.farming.getNearbyAnimal(px, py, 2.2);
    if (forage || animal) {
      const handSlot = this.state.hotbar.find((s) => s && s.id === 'hand') || {
        id: 'hand',
        type: 'tool',
      };
      const res = this.farming.useActiveSlot(handSlot, tx, ty, {
        ...this.state,
        x: px,
        y: py,
      });
      if (res.ok) {
        sound.playSfx('harvest');
        this.addFloatingText(res.message, px, py, '#fde047');
        this.ui?.showToast(res.message, 'success');
        this.ui?.updateHUD(this.getStateSnapshot());
        return;
      }
    }

    // 4. Check ripe crop on current/facing plot
    const plot = this.farming.getPlot(tx, ty) || this.farming.getPlot(px, py);
    if (plot && plot.cropId && plot.stage >= 3) {
      const handSlot = { id: 'hand', type: 'tool' };
      const res = this.farming.useActiveSlot(handSlot, plot.x, plot.y, this.state);
      if (res.ok) {
        sound.playSfx('harvest');
        this.addFloatingText(res.message, plot.x, plot.y, '#86efac');
        this.ui?.showToast(res.message, 'success');
        this.ui?.updateHUD(this.getStateSnapshot());
        return;
      }
    }

    this.ui?.showToast(
      'Dekati warga NPC, pintu toko/rumah, kotak pengiriman, papan misi, hewan ternak, atau tanaman untuk berinteraksi.',
      'info'
    );
  }

  async sleepAndAdvanceDay() {
    sound.playSfx('sleep');
    this.farming.advanceDay();
    this.state.day += 1;
    const seasonIdx = Math.floor((this.state.day - 1) / 7) % SEASONS.length;
    this.state.season = SEASONS[seasonIdx];
    this.state.hour = 7;
    this.state.minute = 0;
    this.state.energy = this.state.maxEnergy;

    this.addFloatingText(`Selamat Pagi! Hari ${this.state.day}`, this.player.x, this.player.y, '#fde047');
    this.ui?.updateHUD(this.getStateSnapshot());
    this.ui?.showToast(
      `Hari ${this.state.day} (${this.state.season}): Stamina pulih penuh & tanaman yang disiram telah tumbuh!`,
      'success'
    );
    await this.ui?.triggerCloudSave();
  }

  update(dt) {
    this.tick += 1;

    if (!this.ui?.isModalOpen()) {
      this._updatePlayerMovement(dt);
      this._updateClock(dt);
    }

    this.npcManager.update(dt, (tx, ty) => this.world.isWalkable(tx, ty));
    this.farming.update(dt);
    this._updateParticles(dt);
    this._updateFloatingTexts(dt);
    this._updateCamera(dt);

    this.hudSyncTimer += dt;
    if (this.hudSyncTimer >= 0.25) {
      this.hudSyncTimer = 0;
      this._updateZoneAndPrompt();
      this.ui?.updateHUD(this.getStateSnapshot());
    }
  }

  _updatePlayerMovement(dt) {
    let dx = 0;
    let dy = 0;

    if (this.keys.has('w') || this.keys.has('arrowup') || this.mobileDirs.has('up')) dy -= 1;
    if (this.keys.has('s') || this.keys.has('arrowdown') || this.mobileDirs.has('down')) dy += 1;
    if (this.keys.has('a') || this.keys.has('arrowleft') || this.mobileDirs.has('left')) dx -= 1;
    if (this.keys.has('d') || this.keys.has('arrowright') || this.mobileDirs.has('right')) dx += 1;

    if (dx !== 0 && dy !== 0) {
      const inv = 1 / Math.SQRT2;
      dx *= inv;
      dy *= inv;
    }

    if (dx !== 0 || dy !== 0) {
      this.player.isMoving = true;
      if (Math.abs(dx) >= Math.abs(dy)) {
        this.player.dir = dx > 0 ? 'right' : 'left';
      } else {
        this.player.dir = dy > 0 ? 'down' : 'up';
      }

      const step = this.player.speed * dt;
      const nextX = this.player.x + dx * step;
      const nextY = this.player.y + dy * step;

      if (this._canOccupy(nextX, this.player.y)) {
        this.player.x = nextX;
      }
      if (this._canOccupy(this.player.x, nextY)) {
        this.player.y = nextY;
      }

      this.player.frame = (this.player.frame + dt * 9) % 4;
      this.stepSoundTimer -= dt;
      if (this.stepSoundTimer <= 0) {
        this.stepSoundTimer = 0.34;
        sound.playSfx('step');
      }
    } else {
      this.player.isMoving = false;
      this.player.frame = 0;
    }
  }

  _canOccupy(x, y) {
    const r = 0.28;
    const points = [
      [x - r, y - r],
      [x + r, y - r],
      [x - r, y + r],
      [x + r, y + r],
    ];
    for (const [px, py] of points) {
      if (!this.world.isWalkable(Math.round(px), Math.round(py))) {
        return false;
      }
    }
    return true;
  }

  _updateClock(dt) {
    this.clockAccum += dt;
    if (this.clockAccum >= 3.5) {
      this.clockAccum = 0;
      this.state.minute += 10;
      if (this.state.minute >= 60) {
        this.state.minute = 0;
        this.state.hour += 1;
        if (this.state.hour >= 24) {
          this.sleepAndAdvanceDay();
        }
      }
    }
  }

  _updateZoneAndPrompt() {
    const px = Math.round(this.player.x);
    const py = Math.round(this.player.y);
    const zone = this.world.getZoneAt(px, py);
    this.state.district = zone?.name || 'Lembah Palevest';

    // Determine context-sensitive prompt pill
    const nearbyNpc = this.npcManager.getNearbyNPC(this.player.x, this.player.y, 2.2);
    if (nearbyNpc) {
      this.state.interactionPrompt = `[E] Bicara / Toko: ${nearbyNpc.name} (${nearbyNpc.buildingName})`;
      return;
    }

    const { tx, ty } = this.getFacingTile();
    const target =
      this.world.getInteractableAt(tx, ty) || this.world.getInteractableAt(px, py);

    if (target) {
      if (target.type === 'building') {
        if (target.actionType === 'sleep') {
          this.state.interactionPrompt = `[E] Tidur & Simpan Hari Berikutnya (${target.name})`;
          return;
        }
        this.state.interactionPrompt = `[E] Masuk / Buka ${target.name} (${target.roleLabel})`;
        return;
      }
      if (target.type === 'shipping_bin') {
        this.state.interactionPrompt = `[E] Buka ${target.name} (Jual Hasil Panen)`;
        return;
      }
      if (target.type === 'quest_board') {
        this.state.interactionPrompt = `[E] Lihat ${target.name}`;
        return;
      }
      if (target.type === 'well' || target.type === 'fountain') {
        this.state.interactionPrompt = `[E] Isi Ulang Air di ${target.name}`;
        return;
      }
      if (target.type === 'fishing_spot') {
        this.state.interactionPrompt = `[E / Spasi] Memancing di ${target.name}`;
        return;
      }
      if (target.type === 'farm_plot') {
        const plot = this.farming.getPlot(target.tileX, target.tileY);
        if (plot?.cropId && plot.stage >= 3) {
          this.state.interactionPrompt = `[E / Spasi] Panen Tanaman Matang!`;
        } else {
          const activeItem = this.state.hotbar[this.state.activeSlot];
          this.state.interactionPrompt = `[Spasi / Klik] Gunakan ${activeItem?.name || 'Alat'} di Petak Ladang`;
        }
        return;
      }
    }

    const forage = this.farming.getNearbyForage(this.player.x, this.player.y, 1.9);
    if (forage) {
      this.state.interactionPrompt = `[E] Pungut ${forage.name}`;
      return;
    }

    const animal = this.farming.getNearbyAnimal(this.player.x, this.player.y, 2.0);
    if (animal) {
      this.state.interactionPrompt = animal.hasProduce
        ? `[E] Elus & Ambil ${animal.produceName} dari ${animal.name}`
        : `[E] Sapa ${animal.name}`;
      return;
    }

    this.state.interactionPrompt = '';
  }

  _updateParticles(dt) {
    const worldW = MAP_COLS * TILE_SIZE;
    const worldH = MAP_ROWS * TILE_SIZE;
    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.phase += dt * 2.2;
      if (p.y > worldH) p.y = 0;
      if (p.x > worldW) p.x = 0;
      if (p.x < 0) p.x = worldW;
    }
  }

  _updateFloatingTexts(dt) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 26 * dt;
      ft.life -= dt;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  _updateCamera(dt) {
    if (!this.canvas) return;
    const worldW = MAP_COLS * TILE_SIZE;
    const worldH = MAP_ROWS * TILE_SIZE;
    const targetX = this.player.x * TILE_SIZE + TILE_SIZE / 2 - this.canvas.width / 2;
    const targetY = this.player.y * TILE_SIZE + TILE_SIZE / 2 - this.canvas.height / 2;
    const clampedX = Math.max(0, Math.min(Math.max(0, worldW - this.canvas.width), targetX));
    const clampedY = Math.max(0, Math.min(Math.max(0, worldH - this.canvas.height), targetY));

    const lerp = Math.min(1, dt * 8);
    this.camera.x += (clampedX - this.camera.x) * lerp;
    this.camera.y += (clampedY - this.camera.y) * lerp;
  }

  render() {
    const ctx = this.ctx;
    if (!ctx || !this.canvas) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const camX = Math.round(this.camera.x);
    const camY = Math.round(this.camera.y);
    const isNight = this.state.hour >= 19 || this.state.hour < 6;
    const isSunset = this.state.hour >= 17 && this.state.hour < 19;

    const startCol = Math.max(0, Math.floor(camX / TILE_SIZE) - 1);
    const endCol = Math.min(MAP_COLS - 1, Math.ceil((camX + this.canvas.width) / TILE_SIZE) + 1);
    const startRow = Math.max(0, Math.floor(camY / TILE_SIZE) - 1);
    const endRow = Math.min(MAP_ROWS - 1, Math.ceil((camY + this.canvas.height) / TILE_SIZE) + 1);

    // 1. Draw Ground Tiles
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const tileType = this.world.grid[r][c];
        sprites.drawTile(ctx, tileType, c * TILE_SIZE - camX, r * TILE_SIZE - camY, this.tick);
      }
    }

    // 2. Draw Farm Plots & Growing Crops
    for (const plot of this.farming.getPlots()) {
      if (plot.x < startCol - 1 || plot.x > endCol + 1 || plot.y < startRow - 1 || plot.y > endRow + 1) {
        continue;
      }
      const sx = plot.x * TILE_SIZE - camX;
      const sy = plot.y * TILE_SIZE - camY;
      if (plot.cropId) {
        sprites.drawCrop(ctx, plot.cropId, plot.stage, plot.watered, sx, sy, this.tick);
      } else if (plot.tilled) {
        sprites.drawCrop(ctx, null, 0, plot.watered, sx, sy, this.tick);
      }
    }

    // 3. Draw Target Tile Selection Indicator on Farm Plots
    const facing = this.getFacingTile();
    if (this.farming.isFarmPlot(facing.tx, facing.ty)) {
      ctx.save();
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.85)';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        facing.tx * TILE_SIZE - camX + 3,
        facing.ty * TILE_SIZE - camY + 3,
        TILE_SIZE - 6,
        TILE_SIZE - 6
      );
      ctx.restore();
    }

    // 4. Draw Wild Forage Items
    for (const item of this.farming.getForageItems()) {
      if (item.collected) continue;
      const sx = item.x * TILE_SIZE - camX;
      const sy = item.y * TILE_SIZE - camY;
      sprites.drawForageItem(ctx, item.itemId, sx, sy, this.tick);
    }

    // 5. Collect & Y-Sort Buildings, Props, Animals, NPCs, and Player
    const renderList = [];

    for (const b of this.world.buildings) {
      renderList.push({
        sortY: (b.tileY + b.heightTiles) * TILE_SIZE,
        draw: () => {
          sprites.drawBuilding(
            ctx,
            b,
            b.tileX * TILE_SIZE - camX,
            b.tileY * TILE_SIZE - camY,
            isNight
          );
        },
      });
    }

    for (const prop of this.world.props) {
      const px = prop.x ?? prop.tileX ?? 0;
      const py = prop.y ?? prop.tileY ?? 0;
      if (px < startCol - 3 || px > endCol + 3 || py < startRow - 3 || py > endRow + 3) {
        continue;
      }
      renderList.push({
        sortY: (py + 1) * TILE_SIZE,
        draw: () => {
          sprites.drawProp(
            ctx,
            prop,
            px * TILE_SIZE - camX,
            py * TILE_SIZE - camY,
            this.tick,
            isNight
          );
        },
      });
    }

    for (const animal of this.farming.getAnimals()) {
      renderList.push({
        sortY: (animal.y + 1) * TILE_SIZE,
        draw: () => {
          sprites.drawAnimal(
            ctx,
            animal.type,
            Math.round(animal.x * TILE_SIZE - camX),
            Math.round(animal.y * TILE_SIZE - camY),
            animal.dir,
            Math.floor(animal.frame),
            animal.hasProduce
          );
        },
      });
    }

    for (const npc of this.npcManager.getNPCs()) {
      renderList.push({
        sortY: (npc.y + 1) * TILE_SIZE,
        draw: () => {
          sprites.drawCharacter(
            ctx,
            npc.id,
            Math.round(npc.x * TILE_SIZE - camX),
            Math.round(npc.y * TILE_SIZE - camY),
            npc.dir,
            Math.floor(npc.frame || 0),
            Boolean(npc.isMoving),
            npc.name
          );
        },
      });
    }

    renderList.push({
      sortY: (this.player.y + 1) * TILE_SIZE,
      draw: () => {
        sprites.drawCharacter(
          ctx,
          'player',
          Math.round(this.player.x * TILE_SIZE - camX),
          Math.round(this.player.y * TILE_SIZE - camY),
          this.player.dir,
          Math.floor(this.player.frame),
          this.player.isMoving,
          this.state.username
        );
      },
    });

    renderList.sort((a, b) => a.sortY - b.sortY);
    for (const entry of renderList) {
      entry.draw();
    }

    // 6. Cozy Atmospheric Particles (Blossom petals by day, glowing fireflies at night)
    ctx.save();
    for (const p of this.particles) {
      const sx = p.x - camX + Math.sin(p.phase) * 10;
      const sy = p.y - camY;
      if (sx < -20 || sx > this.canvas.width + 20 || sy < -20 || sy > this.canvas.height + 20) {
        continue;
      }
      if (isNight) {
        const alpha = 0.45 + 0.45 * Math.sin(p.phase * 2);
        ctx.fillStyle = `rgba(253, 224, 71, ${alpha.toFixed(2)})`;
        ctx.fillRect(Math.round(sx), Math.round(sy), p.size + 1, p.size + 1);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(sx), Math.round(sy), p.size, p.size);
      }
    }
    ctx.restore();

    // 7. Golden Hour / Night Ambient Lighting Tint
    if (isSunset) {
      ctx.fillStyle = 'rgba(234, 120, 45, 0.16)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    } else if (isNight) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.34)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // 8. Floating Feedback Texts
    ctx.save();
    ctx.font = 'bold 14px "Nunito", sans-serif';
    ctx.textAlign = 'center';
    for (const ft of this.floatingTexts) {
      const sx = Math.round(ft.x - camX);
      const sy = Math.round(ft.y - camY);
      ctx.fillStyle = 'rgba(20, 14, 10, 0.85)';
      ctx.fillText(ft.text, sx + 1, sy + 1);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, sx, sy);
    }
    ctx.restore();
  }

  getStateSnapshot() {
    return {
      username: this.state.username,
      farmName: this.state.farmName,
      day: this.state.day,
      season: this.state.season,
      hour: this.state.hour,
      minute: this.state.minute,
      timeString: this.ui ? this.ui.formatClock(this.state.hour, this.state.minute) : '08:00',
      district: this.state.district,
      gold: this.state.gold,
      energy: this.state.energy,
      maxEnergy: this.state.maxEnergy,
      activeSlot: this.state.activeSlot,
      hotbar: this.state.hotbar,
      completedQuests: this.state.completedQuests,
      interactionPrompt: this.state.interactionPrompt,
      player: {
        x: Number(this.player.x.toFixed(2)),
        y: Number(this.player.y.toFixed(2)),
        dir: this.player.dir,
      },
      farming: this.farming.serialize(),
      npcs: this.npcManager.getNPCs().map((n) => ({
        id: n.id,
        name: n.name,
        x: n.x,
        y: n.y,
        friendship: n.friendship,
      })),
      npcState: this.npcManager.serialize(),
    };
  }

  applyLoadedSave(saveObj) {
    if (!saveObj || typeof saveObj !== 'object') return;
    const gs = saveObj.game_state && typeof saveObj.game_state === 'object'
      ? saveObj.game_state
      : saveObj;

    if (saveObj.username || gs.username) this.state.username = saveObj.username || gs.username;
    if (saveObj.farm_name || saveObj.farmName || gs.farmName) {
      this.state.farmName = saveObj.farm_name || saveObj.farmName || gs.farmName;
    }
    if (typeof (saveObj.day ?? gs.day) === 'number') this.state.day = saveObj.day ?? gs.day;
    if (saveObj.season || gs.season) this.state.season = saveObj.season || gs.season;
    if (typeof (saveObj.gold ?? gs.gold) === 'number') this.state.gold = saveObj.gold ?? gs.gold;
    if (typeof (saveObj.energy ?? gs.energy) === 'number') {
      this.state.energy = saveObj.energy ?? gs.energy;
    }
    if (typeof (saveObj.max_energy ?? saveObj.maxEnergy ?? gs.maxEnergy) === 'number') {
      this.state.maxEnergy = saveObj.max_energy ?? saveObj.maxEnergy ?? gs.maxEnergy;
    }
    if (typeof gs.hour === 'number') this.state.hour = gs.hour;
    if (typeof gs.minute === 'number') this.state.minute = gs.minute;

    if (Array.isArray(gs.hotbar) && gs.hotbar.length > 0) {
      this.state.hotbar = gs.hotbar;
    }
    if (Array.isArray(gs.completedQuests)) {
      this.state.completedQuests = gs.completedQuests;
      for (const q of DAILY_QUESTS) {
        q.completed = this.state.completedQuests.includes(q.id);
      }
    }
    if (gs.player && typeof gs.player.x === 'number' && typeof gs.player.y === 'number') {
      this.player.x = gs.player.x;
      this.player.y = gs.player.y;
      if (gs.player.dir) this.player.dir = gs.player.dir;
    }
    if (gs.farming) {
      this.farming.deserialize(gs.farming);
    }
    if (gs.npcState) {
      this.npcManager.deserialize(gs.npcState);
    }
  }
}
