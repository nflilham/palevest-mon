import { NPC_CATALOG, DAILY_QUESTS } from '../game/npcs.js';
import { ITEMS, DEFAULT_HOTBAR } from '../game/farming.js';
import { sprites } from '../game/sprites.js';
import {
  ZONES,
  BUILDINGS,
  MAP_COLS,
  MAP_ROWS,
  TILES,
  SHIPPING_BIN,
  QUEST_BOARD_POS,
  FISHING_SPOTS,
} from '../game/worldMap.js';
import { sound } from '../game/audio.js';
import {
  getAuthState,
  initAuthListener,
  signUpUser,
  signInUser,
  signInWithGoogle,
  startGuestSession,
  signOutUser,
  canAccessProtectedGame,
  saveGameData,
  loadGameData,
  getLocalSaveSummary,
} from '../services/saveService.js';

export class UIManager {
  constructor(options = {}, extraCallbacks = {}) {
    let rootEl = null;
    let callbacks = {};

    if (typeof HTMLElement !== 'undefined' && options instanceof HTMLElement) {
      rootEl = options;
      callbacks = extraCallbacks || {};
    } else if (typeof options === 'string') {
      rootEl = document.querySelector(options);
      callbacks = extraCallbacks || {};
    } else if (options && typeof options === 'object') {
      rootEl =
        options.root ||
        options.container ||
        (typeof document !== 'undefined' ? document.getElementById('app') : null);
      callbacks = { ...options, ...extraCallbacks };
    }

    this.root =
      rootEl ||
      (typeof document !== 'undefined' ? document.getElementById('app') : null);
    this.callbacks = callbacks;
    this.game = callbacks.game || null;

    this.activeAuthTab = 'login';
    this.activeModal = null;
    this.activeNpc = null;
    this.activeNpcTab = 'chat';
    this.currentView = 'home';
    this.lastSaveSummary = getLocalSaveSummary();
    this.previewAnimFrame = null;
    this.previewTick = 0;

    this.cachedGameState = {
      username: 'Petani',
      farmName: 'Kebun Lembah',
      day: 1,
      season: 'Semi',
      timeString: '08:00',
      hour: 8,
      minute: 0,
      district: 'Kebun & Rumah Lembah',
      gold: 500,
      energy: 100,
      maxEnergy: 100,
      activeSlot: 0,
      hotbar: DEFAULT_HOTBAR.map((item) => ({ ...item })),
      completedQuests: [],
    };

    if (this.root) {
      this.renderShell();
      this.bindEvents();
      this.startPreviewCanvasLoop();
      initAuthListener((authState) => {
        this.onAuthStateChanged(authState);
      });
      this.handleHashChange();
    }
  }

  init(callbacks = {}) {
    this.callbacks = { ...this.callbacks, ...callbacks };
    if (callbacks.game) {
      this.game = callbacks.game;
    }
    if (!this.root && typeof document !== 'undefined') {
      this.root = document.getElementById('app');
      if (this.root) {
        this.renderShell();
        this.bindEvents();
        this.startPreviewCanvasLoop();
      }
    }
    this.refreshAuthSection();
    return this;
  }

  bindGame(gameInstance) {
    this.game = gameInstance;
    return this;
  }

  setCallbacks(callbacks = {}) {
    this.callbacks = { ...this.callbacks, ...callbacks };
    if (callbacks.game) {
      this.game = callbacks.game;
    }
  }

  getGameCanvas() {
    return document.getElementById('game-canvas');
  }

  isModalOpen() {
    return Boolean(this.activeModal);
  }

  renderShell() {
    sprites.init();

    const districtGuides = [
      {
        name: 'Kebun & Rumah Lembah',
        desc: 'Rumah kayu pemain, 40 petak sawah (8x5), sumur air, dan kotak penjualan panen.',
      },
      {
        name: 'Alun-Alun Pusat Desa',
        desc: 'Balai Desa Mayor Bram, papan permintaan warga, air mancur batu, dan pepohonan sakura.',
      },
      {
        name: 'Distrik Pertokoan',
        desc: 'Toko Bibit Hana, Bengkel Besi Garrick, Kedai Roti Chef Liora, dan Pustaka Kayu Nadia.',
      },
      {
        name: 'Peternakan Padang Hijau',
        desc: 'Kandang ternak Pak Darto, kincir angin, serta padang rumput sapi, domba, dan ayam.',
      },
      {
        name: 'Hutan Barat & Sungai',
        desc: 'Klinik Herbal Dr. Elian, tempat mencari jamur dan daun herbal, serta tepian sungai.',
      },
      {
        name: 'Pantai Selatan & Dermaga',
        desc: 'Pondok Pancing Kapten Tio, pasir pantai tempat memungut kerang, dan dermaga kayu.',
      },
    ];

    const npcCardsHtml = NPC_CATALOG.map((npc) => {
      const portraitUrl = sprites.getPortraitDataURL(npc.id);
      return `
        <article class="npc-card" data-npc-id="${npc.id}">
          <div class="npc-card-top">
            <div class="npc-portrait-frame">
              <img
                class="npc-portrait-img"
                src="${portraitUrl}"
                alt="Potret ${this.escapeHtml(npc.name)}"
                width="64"
                height="64"
              />
            </div>
            <div class="npc-title-group">
              <h3 class="npc-name">${this.escapeHtml(npc.name)}</h3>
              <span class="npc-job-badge">${this.escapeHtml(npc.job)}</span>
            </div>
          </div>
          <div class="npc-meta-box">
            <div class="npc-meta-row">
              <span class="npc-meta-label">Tempat:</span>
              <span class="npc-meta-val">${this.escapeHtml(npc.buildingName)}</span>
            </div>
            <div class="npc-meta-row">
              <span class="npc-meta-label">Area:</span>
              <span class="npc-meta-val">${this.escapeHtml(npc.areaName)}</span>
            </div>
          </div>
          <p class="npc-bio">${this.escapeHtml(npc.bio)}</p>
          <div class="npc-gift-tag">
            Hadiah favorit: ${this.escapeHtml(npc.favoriteGift)}
          </div>
        </article>
      `;
    }).join('');

    const headerPortraitsHtml = ['player', 'hana', 'mayor_bram', 'chef_liora', 'kapten_tio']
      .map(
        (id) => `
        <img
          src="${sprites.getPortraitDataURL(id)}"
          alt="${id}"
          width="36"
          height="36"
          style="image-rendering: pixelated; border: 2px solid var(--border-gold); border-radius: 4px; background: var(--bg-wood-dark);"
        />
      `
      )
      .join('');

    const districtCardsHtml = districtGuides
      .map(
        (d) => `
        <div class="district-info-card">
          <h4>${this.escapeHtml(d.name)}</h4>
          <p>${this.escapeHtml(d.desc)}</p>
        </div>
      `
      )
      .join('');

    this.root.innerHTML = `
      <div class="palevest-shell">
        <div id="homepage-view" class="homepage-view">
          <div class="homepage-container">
            <header class="home-header">
              <div class="brand-block">
                <div class="brand-crest">
                  <img
                    src="/favicon.svg"
                    alt="Ikon Desa Palevest"
                    width="48"
                    height="48"
                    style="image-rendering: pixelated; display: block;"
                  />
                </div>
                <div>
                  <h1 class="brand-title">PALEVEST MON</h1>
                  <p class="brand-subtitle">Simulasi Bertani dan Kehidupan Desa</p>
                </div>
              </div>
              <div class="header-actions">
                <div style="display: flex; align-items: center; gap: 6px;" aria-label="Karakter Desa">
                  ${headerPortraitsHtml}
                </div>
                <button
                  type="button"
                  id="btn-home-audio"
                  class="btn btn-secondary"
                  aria-label="Aktifkan atau bisukan suara"
                >
                  ${this.svgIcon('sound')}
                  <span id="home-audio-label">Suara: Aktif</span>
                </button>
              </div>
            </header>

            <section class="hero-grid" aria-label="Halaman Utama dan Login">
              <div class="wood-card village-preview-card">
                <h2 class="card-heading">Desa Lembah Palevest</h2>
                <p class="card-lead">
                  Garap sawah di depan rumahmu, beli bibit dari Hana, rawat sapi dan ayam di padang milik Pak Darto, atau memancing di dermaga selatan bersama Kapten Tio.
                </p>

                <div class="preview-canvas-wrap">
                  <canvas id="home-preview-canvas" width="640" height="240"></canvas>
                </div>

                <div class="gameplay-highlights">
                  <div class="highlight-box">
                    <strong>Sawah &amp; Kebun</strong>
                    <span>Cangkul tanah, tanam lobak, stroberi, jagung, dan labu, lalu siram setiap pagi.</span>
                  </div>
                  <div class="highlight-box">
                    <strong>Peternakan</strong>
                    <span>Beri makan sapi, domba, dan ayam untuk memanen susu segar, wol, serta telur.</span>
                  </div>
                  <div class="highlight-box">
                    <strong>8 Warga Desa</strong>
                    <span>Setiap warga mengelola bangunan sendiri, membuka toko, dan memberikan pekerjaan harian.</span>
                  </div>
                  <div class="highlight-box">
                    <strong>Hutan &amp; Pantai</strong>
                    <span>Kumpulkan jamur, daun herbal, dan kerang laut, atau memancing ikan di dermaga.</span>
                  </div>
                </div>

                <div class="preview-actions">
                  <button type="button" id="btn-hero-enter-game" class="btn btn-primary">
                    ${this.svgIcon('play')}
                    <span>Mulai Bermain</span>
                  </button>
                  <a href="#npc-showcase-section" class="btn btn-parchment">
                    ${this.svgIcon('users')}
                    <span>Lihat Warga Desa</span>
                  </a>
                </div>
              </div>

              <div class="wood-card auth-panel-card">
                <div class="auth-panel-header">
                  <h2 class="card-heading">Masuk Akun</h2>
                  <p style="margin: 4px 0 0; font-size: 0.92rem; color: var(--text-muted-cream);">
                    Masuk dengan Google atau email untuk menyimpan data permainanmu.
                  </p>
                </div>

                <div id="auth-feedback-box" class="auth-feedback hidden" role="status" aria-live="polite"></div>

                <div id="auth-guest-or-login-container" class="parchment-panel">
                  <button type="button" id="btn-google-login" class="btn btn-secondary" style="width: 100%; justify-content: center; background: #ffffff; color: #1f2937; border-color: #d1d5db;">
                    ${this.svgIcon('google')}
                    <span>Masuk dengan Google</span>
                  </button>

                  <div style="text-align: center; font-size: 0.82rem; font-weight: 700; color: var(--text-dark-muted); margin: 4px 0;">
                    atau gunakan email
                  </div>

                  <div class="auth-tabs" role="tablist" aria-label="Pilih Masuk atau Daftar">
                    <button
                      type="button"
                      class="auth-tab active"
                      role="tab"
                      aria-selected="true"
                      data-auth-tab="login"
                    >
                      Masuk Email
                    </button>
                    <button
                      type="button"
                      class="auth-tab"
                      role="tab"
                      aria-selected="false"
                      data-auth-tab="register"
                    >
                      Daftar Baru
                    </button>
                    <button
                      type="button"
                      class="auth-tab"
                      role="tab"
                      aria-selected="false"
                      data-auth-tab="guest"
                    >
                      Main Langsung
                    </button>
                  </div>

                  <form id="form-auth-login" class="auth-form" novalidate>
                    <div class="form-field">
                      <label class="form-label" for="login-email">Email</label>
                      <input
                        id="login-email"
                        name="email"
                        type="email"
                        class="form-input"
                        placeholder="nama@email.com"
                        autocomplete="email"
                        required
                      />
                    </div>
                    <div class="form-field">
                      <label class="form-label" for="login-password">Kata Sandi</label>
                      <input
                        id="login-password"
                        name="password"
                        type="password"
                        class="form-input"
                        placeholder="Minimal 6 karakter"
                        autocomplete="current-password"
                        required
                      />
                    </div>
                    <button type="submit" id="btn-submit-login" class="btn btn-primary">
                      ${this.svgIcon('login')}
                      <span>Masuk</span>
                    </button>
                  </form>

                  <form id="form-auth-register" class="auth-form hidden" novalidate>
                    <div class="form-field">
                      <label class="form-label" for="reg-username">Nama Karakter</label>
                      <input
                        id="reg-username"
                        name="username"
                        type="text"
                        class="form-input"
                        placeholder="Nama panggilanmu"
                        required
                      />
                    </div>
                    <div class="form-field">
                      <label class="form-label" for="reg-farmname">Nama Kebun</label>
                      <input
                        id="reg-farmname"
                        name="farmName"
                        type="text"
                        class="form-input"
                        placeholder="Contoh: Kebun Lembah"
                        required
                      />
                    </div>
                    <div class="form-field">
                      <label class="form-label" for="reg-email">Email</label>
                      <input
                        id="reg-email"
                        name="email"
                        type="email"
                        class="form-input"
                        placeholder="nama@email.com"
                        autocomplete="email"
                        required
                      />
                    </div>
                    <div class="form-field">
                      <label class="form-label" for="reg-password">Kata Sandi</label>
                      <input
                        id="reg-password"
                        name="password"
                        type="password"
                        class="form-input"
                        placeholder="Minimal 6 karakter"
                        autocomplete="new-password"
                        required
                      />
                    </div>
                    <button type="submit" id="btn-submit-register" class="btn btn-amber">
                      ${this.svgIcon('userPlus')}
                      <span>Buat Akun</span>
                    </button>
                  </form>

                  <form id="form-auth-guest" class="auth-form hidden" novalidate>
                    <div class="form-field">
                      <label class="form-label" for="guest-username">Nama Karakter</label>
                      <input
                        id="guest-username"
                        name="username"
                        type="text"
                        class="form-input"
                        placeholder="Nama panggilanmu"
                        value="Aruna"
                        required
                      />
                    </div>
                    <div class="form-field">
                      <label class="form-label" for="guest-farmname">Nama Kebun</label>
                      <input
                        id="guest-farmname"
                        name="farmName"
                        type="text"
                        class="form-input"
                        placeholder="Contoh: Kebun Lembah"
                        value="Kebun Lembah"
                        required
                      />
                    </div>
                    <button type="submit" id="btn-submit-guest" class="btn btn-primary">
                      ${this.svgIcon('play')}
                      <span>Masuk ke Desa</span>
                    </button>
                  </form>
                </div>

                <div id="auth-authenticated-container" class="parchment-panel authenticated-box hidden">
                  <div class="farmer-profile-strip">
                    <div class="farmer-badge-avatar">
                      <img
                        src="${sprites.getPortraitDataURL('player')}"
                        alt="Avatar Pemain"
                        width="44"
                        height="44"
                        style="image-rendering: pixelated; display: block;"
                      />
                    </div>
                    <div>
                      <div id="auth-profile-name" style="font-weight: 800; font-size: 1.1rem; color: var(--accent-wheat);">
                        Petani
                      </div>
                      <div id="auth-profile-farm" style="font-size: 0.9rem; color: var(--text-cream);">
                        Kebun Lembah
                      </div>
                      <div id="auth-profile-mode" style="font-size: 0.78rem; color: var(--text-muted-cream);">
                        Aktif
                      </div>
                    </div>
                  </div>

                  <div class="save-stat-grid">
                    <div class="save-stat-box">
                      <span class="save-stat-label">Waktu</span>
                      <span id="save-summary-day" class="save-stat-val">Hari 1 (Semi)</span>
                    </div>
                    <div class="save-stat-box">
                      <span class="save-stat-label">Uang</span>
                      <span id="save-summary-gold" class="save-stat-val">500 G</span>
                    </div>
                    <div class="save-stat-box">
                      <span class="save-stat-label">Stamina</span>
                      <span id="save-summary-energy" class="save-stat-val">100 / 100</span>
                    </div>
                    <div class="save-stat-box">
                      <span class="save-stat-label">Status Simpan</span>
                      <span id="save-summary-source" class="save-stat-val">Tersimpan</span>
                    </div>
                  </div>

                  <button type="button" id="btn-auth-enter-village" class="btn btn-primary">
                    ${this.svgIcon('play')}
                    <span>Lanjutkan Permainan</span>
                  </button>
                  <button type="button" id="btn-auth-logout" class="btn btn-danger">
                    ${this.svgIcon('logout')}
                    <span>Keluar Akun</span>
                  </button>
                </div>
              </div>
            </section>

            <section id="npc-showcase-section" class="section-block" aria-label="Warga Desa">
              <div class="section-header">
                <div>
                  <h2 class="section-title">Warga Desa &amp; Pekerjaan</h2>
                  <p class="section-subtitle">
                    Delapan warga tinggal dan bekerja di desa. Kunjungi rumah atau toko mereka untuk berbelanja, menempa alat, dan mengobrol.
                  </p>
                </div>
              </div>
              <div class="npc-grid">
                ${npcCardsHtml}
              </div>
            </section>

            <section class="section-block" aria-label="Wilayah Desa dan Kontrol">
              <div class="section-header">
                <div>
                  <h2 class="section-title">Wilayah Desa &amp; Tombol Kontrol</h2>
                </div>
              </div>

              <div class="guide-split-grid">
                <div class="districts-cards-grid">
                  ${districtCardsHtml}
                </div>
                <div class="controls-list" aria-label="Daftar Tombol Kontrol">
                  <div class="control-row">
                    <span>Jalan</span>
                    <span class="kbd-badge">WASD / Panah</span>
                  </div>
                  <div class="control-row">
                    <span>Pakai Alat / Tanam / Panen</span>
                    <span class="kbd-badge">Spasi / Klik</span>
                  </div>
                  <div class="control-row">
                    <span>Bicara / Buka Toko / Tidur</span>
                    <span class="kbd-badge">Tombol E</span>
                  </div>
                  <div class="control-row">
                    <span>Pilih Slot Barang</span>
                    <span class="kbd-badge">Angka 1 - 8</span>
                  </div>
                  <div class="control-row">
                    <span>Buka Peta Desa</span>
                    <span class="kbd-badge">Tombol M</span>
                  </div>
                  <div class="control-row">
                    <span>Papan Permintaan Warga</span>
                    <span class="kbd-badge">Tombol Q</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div id="game-view" class="game-view hidden" aria-label="Layar Permainan Desa Palevest">
          <canvas id="game-canvas"></canvas>

          <header class="hud-top-bar">
            <div class="hud-cluster">
              <div class="hud-farmer-info">
                <span id="hud-farm-name" class="hud-farm-title">Kebun Lembah</span>
                <span id="hud-farmer-name" class="hud-farmer-sub">Petani</span>
              </div>
              <div id="hud-clock-display" class="hud-clock-pill">
                Hari 1 (Semi) 08:00
              </div>
              <div id="hud-district-badge" class="hud-district-pill">
                Kebun &amp; Rumah Lembah
              </div>
            </div>

            <div class="hud-cluster">
              <div class="hud-gold-pill" title="Uang">
                ${this.svgIcon('coin')}
                <span id="hud-gold-value">500 G</span>
              </div>

              <div class="hud-energy-box" title="Stamina">
                <span style="font-size: 0.78rem; font-weight: 800; color: var(--accent-wheat);">STAMINA</span>
                <div class="hud-energy-track">
                  <div id="hud-energy-fill" class="hud-energy-fill" style="width: 100%;"></div>
                </div>
                <span id="hud-energy-text" class="hud-energy-text">100/100</span>
              </div>

              <button type="button" id="btn-hud-save" class="hud-btn btn-save-cloud" title="Simpan Permainan">
                ${this.svgIcon('cloud')}
                <span>Simpan</span>
              </button>
              <button type="button" id="btn-hud-map" class="hud-btn" title="Peta Desa [M]">
                ${this.svgIcon('map')}
                <span>Peta [M]</span>
              </button>
              <button type="button" id="btn-hud-quests" class="hud-btn" title="Permintaan Warga [Q]">
                ${this.svgIcon('scroll')}
                <span>Misi [Q]</span>
              </button>
              <button type="button" id="btn-hud-audio" class="hud-btn" title="Suara">
                ${this.svgIcon('sound')}
                <span id="hud-audio-label">Suara</span>
              </button>
              <button type="button" id="btn-hud-home" class="hud-btn" title="Menu Utama">
                ${this.svgIcon('home')}
                <span>Menu</span>
              </button>
            </div>
          </header>

          <div id="interaction-prompt" class="hud-prompt-pill hidden" aria-live="polite">
            [E] Interaksi
          </div>

          <div class="mobile-controls" aria-label="Kontrol Sentuh">
            <div class="dpad-cluster">
              <button type="button" class="dpad-btn dpad-up" data-dir="up" aria-label="Atas">▲</button>
              <button type="button" class="dpad-btn dpad-left" data-dir="left" aria-label="Kiri">◀</button>
              <button type="button" class="dpad-btn dpad-right" data-dir="right" aria-label="Kanan">▶</button>
              <button type="button" class="dpad-btn dpad-down" data-dir="down" aria-label="Bawah">▼</button>
            </div>
            <div class="mobile-action-cluster">
              <button type="button" id="btn-mobile-interact" class="mobile-act-btn act-primary">
                [E] Aksi
              </button>
              <button type="button" id="btn-mobile-tool" class="mobile-act-btn">
                [Spasi] Alat
              </button>
            </div>
          </div>

          <nav class="hud-bottom-bar" aria-label="Slot Alat dan Barang">
            <div id="hotbar-container" class="hotbar-grid"></div>
          </nav>
        </div>

        <div id="modal-root" class="modal-backdrop hidden" role="dialog" aria-modal="true"></div>
        <div id="toast-container" class="toast-container" aria-live="polite"></div>
      </div>
    `;

    this.renderHotbar(this.cachedGameState.hotbar, this.cachedGameState.activeSlot);
  }

  bindEvents() {
    window.addEventListener('hashchange', () => {
      this.handleHashChange();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isModalOpen()) {
        e.preventDefault();
        this.closeModal();
      }
    });

    document.getElementById('btn-home-audio')?.addEventListener('click', () => this.toggleAudio());
    document.getElementById('btn-hero-enter-game')?.addEventListener('click', () => this.attemptEnterGame());
    document.getElementById('btn-auth-enter-village')?.addEventListener('click', () => this.attemptEnterGame());

    document.getElementById('btn-google-login')?.addEventListener('click', async () => {
      this.setAuthFeedback('Menghubungkan ke akun Google...', 'info');
      const res = await signInWithGoogle();
      if (!res.ok) {
        this.setAuthFeedback(res.error, 'error');
        return;
      }
      this.setAuthFeedback(res.message, 'success');
      if (canAccessProtectedGame()) {
        this.refreshAuthSection();
        this.attemptEnterGame();
      }
    });

    document.getElementById('btn-auth-logout')?.addEventListener('click', async () => {
      await signOutUser();
      this.showToast('Berhasil keluar dari akun.', 'info');
      this.refreshAuthSection();
    });

    const tabButtons = this.root.querySelectorAll('[data-auth-tab]');
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-auth-tab');
        this.switchAuthTab(tabName);
      });
    });

    document.getElementById('form-auth-login')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value || '';
      const password = document.getElementById('login-password')?.value || '';
      this.setAuthFeedback('Memeriksa akun...', 'info');
      const res = await signInUser({ email, password });
      if (!res.ok) {
        this.setAuthFeedback(res.error, 'error');
        return;
      }
      this.setAuthFeedback(res.message, 'success');
      await this.refreshSaveSummaryFromCloud();
      this.refreshAuthSection();
      this.attemptEnterGame();
    });

    document.getElementById('form-auth-register')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('reg-username')?.value || 'Petani';
      const farmName = document.getElementById('reg-farmname')?.value || 'Kebun Lembah';
      const email = document.getElementById('reg-email')?.value || '';
      const password = document.getElementById('reg-password')?.value || '';
      this.setAuthFeedback('Membuat akun baru...', 'info');
      const res = await signUpUser({ email, password, username, farmName });
      if (!res.ok) {
        this.setAuthFeedback(res.error, 'error');
        return;
      }
      this.setAuthFeedback(res.message, 'success');
      this.refreshAuthSection();
      if (!res.requiresConfirmation && canAccessProtectedGame()) {
        this.attemptEnterGame();
      }
    });

    document.getElementById('form-auth-guest')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('guest-username')?.value || 'Aruna';
      const farmName = document.getElementById('guest-farmname')?.value || 'Kebun Lembah';
      const res = startGuestSession({ username, farmName });
      this.setAuthFeedback(res.message, 'success');
      this.refreshAuthSection();
      this.attemptEnterGame();
    });

    document.getElementById('btn-hud-save')?.addEventListener('click', () => {
      this.triggerCloudSave();
    });

    document.getElementById('btn-hud-map')?.addEventListener('click', () => {
      this.openMinimapModal(this.getLiveGameState());
    });

    document.getElementById('btn-hud-quests')?.addEventListener('click', () => {
      this.openQuestModal(DAILY_QUESTS, this.getLiveGameState());
    });

    document.getElementById('btn-hud-audio')?.addEventListener('click', () => {
      this.toggleAudio();
    });

    document.getElementById('btn-hud-home')?.addEventListener('click', () => {
      this.navigateTo('home');
    });

    const dpadButtons = this.root.querySelectorAll('.dpad-btn');
    dpadButtons.forEach((btn) => {
      const dir = btn.getAttribute('data-dir');
      const startMove = (e) => {
        e.preventDefault();
        this.emitMobileInput('dir_down', dir);
      };
      const endMove = (e) => {
        e.preventDefault();
        this.emitMobileInput('dir_up', dir);
      };
      btn.addEventListener('pointerdown', startMove);
      btn.addEventListener('pointerup', endMove);
      btn.addEventListener('pointerleave', endMove);
      btn.addEventListener('pointercancel', endMove);
    });

    document.getElementById('btn-mobile-interact')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.emitMobileInput('interact');
    });

    document.getElementById('btn-mobile-tool')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.emitMobileInput('use_tool');
    });

    document.getElementById('modal-root')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-root') {
        this.closeModal();
      }
    });
  }

  emitMobileInput(action, dir = null) {
    if (typeof this.callbacks.onMobileInput === 'function') {
      this.callbacks.onMobileInput(action, dir);
    } else if (this.game && typeof this.game.handleMobileInput === 'function') {
      this.game.handleMobileInput(action, dir);
    }
  }

  toggleAudio() {
    let muted = false;
    if (typeof this.callbacks.onToggleSound === 'function') {
      muted = Boolean(this.callbacks.onToggleSound());
    } else {
      muted = sound.toggleMute();
    }

    const homeLabel = document.getElementById('home-audio-label');
    const hudLabel = document.getElementById('hud-audio-label');
    if (homeLabel) homeLabel.textContent = muted ? 'Suara: Mati' : 'Suara: Aktif';
    if (hudLabel) hudLabel.textContent = muted ? 'Bisu' : 'Suara';
  }

  switchAuthTab(tabName) {
    this.activeAuthTab = tabName;
    const tabs = this.root.querySelectorAll('[data-auth-tab]');
    tabs.forEach((btn) => {
      const isMatch = btn.getAttribute('data-auth-tab') === tabName;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    document.getElementById('form-auth-login')?.classList.toggle('hidden', tabName !== 'login');
    document.getElementById('form-auth-register')?.classList.toggle('hidden', tabName !== 'register');
    document.getElementById('form-auth-guest')?.classList.toggle('hidden', tabName !== 'guest');
    this.setAuthFeedback('', 'clear');
  }

  setAuthFeedback(message, type = 'info') {
    const box = document.getElementById('auth-feedback-box');
    if (!box) return;
    if (!message || type === 'clear') {
      box.className = 'auth-feedback hidden';
      box.textContent = '';
      return;
    }
    box.className = `auth-feedback ${type === 'error' ? 'error' : 'success'}`;
    box.textContent = message;
  }

  async refreshSaveSummaryFromCloud() {
    const loaded = await loadGameData();
    if (loaded.ok && loaded.save) {
      this.lastSaveSummary = {
        username: loaded.save.username || 'Petani',
        farmName: loaded.save.farmName || loaded.save.farm_name || 'Kebun Lembah',
        day: loaded.save.day || 1,
        season: loaded.save.season || 'Semi',
        gold: loaded.save.gold ?? 500,
        energy: loaded.save.energy ?? 100,
        maxEnergy: loaded.save.maxEnergy ?? loaded.save.max_energy ?? 100,
        source: loaded.source,
      };
    } else {
      this.lastSaveSummary = getLocalSaveSummary();
    }
  }

  onAuthStateChanged(authState) {
    this.refreshAuthSection(authState);
    if (!canAccessProtectedGame() && this.currentView === 'game') {
      this.showHomepage();
    }
  }

  refreshAuthSection(passedState = null) {
    const authState = passedState || getAuthState();
    const loginOrGuestBox = document.getElementById('auth-guest-or-login-container');
    const authedBox = document.getElementById('auth-authenticated-container');

    if (!loginOrGuestBox || !authedBox) return;

    if (authState.isAuthenticated || authState.isGuest) {
      loginOrGuestBox.classList.add('hidden');
      authedBox.classList.remove('hidden');

      const summary = this.lastSaveSummary || getLocalSaveSummary() || {};
      const nameEl = document.getElementById('auth-profile-name');
      const farmEl = document.getElementById('auth-profile-farm');
      const modeEl = document.getElementById('auth-profile-mode');

      if (nameEl) nameEl.textContent = authState.profile.username || summary.username || 'Petani';
      if (farmEl) farmEl.textContent = authState.profile.farmName || summary.farmName || 'Kebun Lembah';
      if (modeEl) {
        modeEl.textContent = authState.isAuthenticated
          ? authState.profile.email
          : 'Tersimpan di Perangkat';
      }

      const dayEl = document.getElementById('save-summary-day');
      const goldEl = document.getElementById('save-summary-gold');
      const energyEl = document.getElementById('save-summary-energy');
      const sourceEl = document.getElementById('save-summary-source');

      if (dayEl) dayEl.textContent = `Hari ${summary.day || 1} (${summary.season || 'Semi'})`;
      if (goldEl) goldEl.textContent = `${summary.gold ?? 500} G`;
      if (energyEl) energyEl.textContent = `${summary.energy ?? 100} / ${summary.maxEnergy ?? 100}`;
      if (sourceEl) sourceEl.textContent = authState.isAuthenticated ? 'Akun Tersambung' : 'Perangkat';
    } else {
      loginOrGuestBox.classList.remove('hidden');
      authedBox.classList.add('hidden');
    }
  }

  handleHashChange() {
    const hash = window.location.hash || '#home';
    if (hash === '#game') {
      if (!canAccessProtectedGame()) {
        window.location.hash = '#home';
        this.showHomepage();
        this.showToast('Silakan masuk akun atau pilih Main Langsung terlebih dahulu.', 'warn');
        this.switchAuthTab('guest');
        return;
      }
      this.showGameView();
    } else {
      this.showHomepage();
    }
  }

  navigateTo(route) {
    const target = route === 'game' || route === '#game' ? '#game' : '#home';
    if (window.location.hash !== target) {
      window.location.hash = target;
    } else {
      this.handleHashChange();
    }
  }

  async attemptEnterGame() {
    if (!canAccessProtectedGame()) {
      startGuestSession({ username: 'Aruna', farmName: 'Kebun Lembah' });
      this.refreshAuthSection();
    }
    this.navigateTo('game');
  }

  showHomepage() {
    this.currentView = 'home';
    document.getElementById('homepage-view')?.classList.remove('hidden');
    document.getElementById('game-view')?.classList.add('hidden');
    this.closeModal();
    this.lastSaveSummary = getLocalSaveSummary() || this.lastSaveSummary;
    this.refreshAuthSection();
    this.startPreviewCanvasLoop();
    if (typeof this.callbacks.onExitGame === 'function') {
      this.callbacks.onExitGame();
    }
  }

  async showGameView() {
    if (!canAccessProtectedGame()) {
      this.navigateTo('home');
      return;
    }

    this.currentView = 'game';
    this.stopPreviewCanvasLoop();
    document.getElementById('homepage-view')?.classList.add('hidden');
    document.getElementById('game-view')?.classList.remove('hidden');

    const authState = getAuthState();
    const loaded = await loadGameData();

    if (typeof this.callbacks.onEnterGame === 'function') {
      this.callbacks.onEnterGame({
        authState,
        save: loaded.ok ? loaded.save : null,
        source: loaded.source,
      });
    } else if (this.game && typeof this.game.start === 'function') {
      this.game.start(loaded.ok ? loaded.save : null, authState);
    }
  }

  startPreviewCanvasLoop() {
    if (this.previewAnimFrame) return;
    const renderPreview = () => {
      if (this.currentView !== 'home') {
        this.previewAnimFrame = null;
        return;
      }
      this.previewTick += 1;
      this.drawHomepagePreviewCanvas(this.previewTick);
      this.previewAnimFrame = window.requestAnimationFrame(renderPreview);
    };
    this.previewAnimFrame = window.requestAnimationFrame(renderPreview);
  }

  stopPreviewCanvasLoop() {
    if (this.previewAnimFrame) {
      window.cancelAnimationFrame(this.previewAnimFrame);
      this.previewAnimFrame = null;
    }
  }

  drawHomepagePreviewCanvas(tick = 0) {
    const canvas = document.getElementById('home-preview-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const cols = 14;
    const rows = 5;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let tile = TILES.GRASS;
        if (r === 3) tile = TILES.PATH;
        else if (c >= 11 && r >= 4) tile = TILES.WATER;
        else if ((c + r) % 3 === 0) tile = TILES.FLOWER_GRASS;
        sprites.drawTile(ctx, tile, c * 48, r * 48, tick);
      }
    }

    // Draw a detailed 16x16 style cottage & farm scene in preview
    sprites.drawBuilding(
      ctx,
      {
        name: 'Rumah Kebun',
        tileX: 1,
        tileY: 0,
        widthTiles: 4,
        heightTiles: 3,
        doorX: 2,
        roofColor: '#b85d3b',
        wallColor: '#f3e5ab',
        signIcon: 'home',
      },
      1 * 48,
      -8,
      false
    );

    sprites.drawCrop(ctx, 'turnip', 3, true, 6 * 48, 1 * 48, tick);
    sprites.drawCrop(ctx, 'strawberry', 3, true, 7 * 48, 1 * 48, tick);
    sprites.drawCrop(ctx, 'corn', 3, true, 8 * 48, 1 * 48, tick);
    sprites.drawCrop(ctx, 'pumpkin', 3, true, 9 * 48, 1 * 48, tick);
    sprites.drawProp(ctx, 'oak_tree', 0 * 48, 1 * 48, tick, false);
    sprites.drawProp(ctx, 'cherry_tree', 5 * 48, 0 * 48, tick, false);
    sprites.drawProp(ctx, 'bush', 5 * 48, 2 * 48, tick, false);
    sprites.drawProp(ctx, 'well', 10 * 48, 1 * 48, tick, false);
    sprites.drawAnimal(ctx, 'cow', 11 * 48, 1 * 48, 'left', Math.floor(tick / 20) % 2, true);
    sprites.drawAnimal(ctx, 'chicken', 12 * 48, 2 * 48, 'right', Math.floor(tick / 15) % 2, false);

    const farmerX = 140 + Math.sin(tick * 0.025) * 65;
    const frame = Math.floor(tick / 12) % 4;
    const dir = Math.cos(tick * 0.025) >= 0 ? 'right' : 'left';
    sprites.drawCharacter(ctx, 'player', farmerX, 3 * 48 - 10, dir, frame, true, 'Petani');
    sprites.drawCharacter(ctx, 'hana', 7 * 48, 2 * 48 - 6, 'down', 0, false, 'Hana');
    sprites.drawCharacter(ctx, 'mayor_bram', 9.2 * 48, 3 * 48 - 8, 'down', 0, false, 'Mayor Bram');
  }

  getLiveGameState() {
    if (typeof this.callbacks.getGameState === 'function') {
      const s = this.callbacks.getGameState();
      if (s) return s;
    }
    if (this.game && typeof this.game.getStateSnapshot === 'function') {
      return this.game.getStateSnapshot();
    }
    if (this.game && this.game.state) {
      return this.game.state;
    }
    return this.cachedGameState;
  }

  updateHUD(state = {}) {
    if (!state || typeof state !== 'object') return;
    this.cachedGameState = {
      ...this.cachedGameState,
      ...state,
    };

    const authState = getAuthState();
    const farmerName =
      state.username ||
      state.player?.username ||
      authState.profile.username ||
      this.cachedGameState.username ||
      'Petani';
    const farmName =
      state.farmName ||
      state.player?.farmName ||
      authState.profile.farmName ||
      this.cachedGameState.farmName ||
      'Kebun Lembah';

    const day = state.day ?? this.cachedGameState.day ?? 1;
    const season = state.season || this.cachedGameState.season || 'Semi';
    const timeStr =
      state.timeString ||
      state.clockText ||
      this.formatClock(state.hour ?? 8, state.minute ?? 0);
    const district =
      state.district ||
      state.zoneName ||
      state.areaName ||
      this.cachedGameState.district ||
      'Kebun & Rumah Lembah';
    const gold = state.gold ?? state.player?.gold ?? this.cachedGameState.gold ?? 500;
    const energy = Math.max(
      0,
      Math.round(state.energy ?? state.player?.energy ?? this.cachedGameState.energy ?? 100)
    );
    const maxEnergy = Math.max(
      1,
      Math.round(
        state.maxEnergy ?? state.player?.maxEnergy ?? this.cachedGameState.maxEnergy ?? 100
      )
    );

    const farmEl = document.getElementById('hud-farm-name');
    const farmerEl = document.getElementById('hud-farmer-name');
    const clockEl = document.getElementById('hud-clock-display');
    const districtEl = document.getElementById('hud-district-badge');
    const goldEl = document.getElementById('hud-gold-value');
    const energyFillEl = document.getElementById('hud-energy-fill');
    const energyTextEl = document.getElementById('hud-energy-text');

    if (farmEl) farmEl.textContent = farmName;
    if (farmerEl) farmerEl.textContent = farmerName;
    if (clockEl) clockEl.textContent = `Hari ${day} (${season}) ${timeStr}`;
    if (districtEl) districtEl.textContent = district;
    if (goldEl) goldEl.textContent = `${gold} G`;

    const pct = Math.max(0, Math.min(100, Math.round((energy / maxEnergy) * 100)));
    if (energyFillEl) {
      energyFillEl.style.width = `${pct}%`;
      energyFillEl.style.backgroundColor =
        pct > 50 ? '#48bb78' : pct > 22 ? '#f0b429' : '#e53e3e';
    }
    if (energyTextEl) {
      energyTextEl.textContent = `${energy}/${maxEnergy}`;
    }

    if (Array.isArray(state.hotbar)) {
      const activeIdx =
        typeof state.activeSlot === 'number'
          ? state.activeSlot
          : typeof state.selectedSlot === 'number'
            ? state.selectedSlot
            : this.cachedGameState.activeSlot || 0;
      this.renderHotbar(state.hotbar, activeIdx);
    }

    if (state.interactionPrompt !== undefined) {
      this.setInteractionPrompt(state.interactionPrompt);
    }
  }

  renderHUD(state) {
    this.updateHUD(state);
  }

  formatClock(hour = 8, minute = 0) {
    const h = String(Math.floor(hour) % 24).padStart(2, '0');
    const m = String(Math.floor(minute / 10) * 10).padStart(2, '0');
    return `${h}:${m}`;
  }

  setInteractionPrompt(text) {
    const pill = document.getElementById('interaction-prompt');
    if (!pill) return;
    if (!text) {
      pill.classList.add('hidden');
      pill.textContent = '';
    } else {
      pill.textContent = text;
      pill.classList.remove('hidden');
    }
  }

  renderHotbar(hotbar = [], activeIndex = 0) {
    this.cachedGameState.hotbar = hotbar;
    this.cachedGameState.activeSlot = activeIndex;

    const container = document.getElementById('hotbar-container');
    if (!container) return;

    const slotsHtml = Array.from({ length: 8 }, (_, idx) => {
      const slot = hotbar[idx] || null;
      const isActive = idx === activeIndex;
      if (!slot || !slot.id) {
        return `
          <button
            type="button"
            class="hotbar-slot ${isActive ? 'active' : ''}"
            data-slot-index="${idx}"
            aria-label="Slot ${idx + 1} Kosong"
          >
            <span class="slot-key">${idx + 1}</span>
            <span class="slot-name" style="margin-top: auto; color: var(--text-dark-muted);">Kosong</span>
          </button>
        `;
      }

      const def = ITEMS[slot.id] || {};
      const name = slot.name || def.name || slot.id;
      let badgeText = '';
      if (slot.id === 'watering_can') {
        const w = slot.water ?? slot.maxWater ?? 20;
        const mw = slot.maxWater ?? 20;
        badgeText = `${w}/${mw}`;
      } else if (slot.type !== 'tool' && (slot.count ?? 1) > 0) {
        badgeText = `x${slot.count ?? 1}`;
      } else if ((slot.level || 1) > 1) {
        badgeText = `Lv.${slot.level}`;
      }

      return `
        <button
          type="button"
          class="hotbar-slot ${isActive ? 'active' : ''}"
          data-slot-index="${idx}"
          title="${this.escapeHtml(name)}"
          aria-label="Slot ${idx + 1}: ${this.escapeHtml(name)} ${badgeText}"
        >
          <span class="slot-key">${idx + 1}</span>
          ${badgeText ? `<span class="slot-count-badge">${this.escapeHtml(badgeText)}</span>` : ''}
          <canvas class="slot-icon-canvas" width="32" height="32" data-item-id="${this.escapeHtml(slot.id)}"></canvas>
          <span class="slot-name">${this.escapeHtml(name)}</span>
        </button>
      `;
    }).join('');

    container.innerHTML = slotsHtml;

    const iconCanvases = container.querySelectorAll('.slot-icon-canvas');
    iconCanvases.forEach((cvs) => {
      const itemId = cvs.getAttribute('data-item-id');
      this.drawItemPixelIcon(cvs, itemId);
    });

    const slotBtns = container.querySelectorAll('.hotbar-slot');
    slotBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-slot-index'));
        this.cachedGameState.activeSlot = idx;
        this.renderHotbar(this.cachedGameState.hotbar, idx);
        if (typeof this.callbacks.onSelectHotbar === 'function') {
          this.callbacks.onSelectHotbar(idx);
        } else if (this.game && typeof this.game.selectHotbarSlot === 'function') {
          this.game.selectHotbarSlot(idx);
        }
      });
    });
  }

  updateHotbar(hotbar, activeIndex) {
    this.renderHotbar(hotbar, activeIndex);
  }

  drawItemPixelIcon(canvas, itemId) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const def = ITEMS[itemId] || {};
    const mainColor = def.color || '#d4a359';

    // 16x16 pixel icon scaled 2x on 32x32 canvas
    const p = (gx, gy, gw, gh, c) => {
      ctx.fillStyle = c;
      ctx.fillRect(gx * 2, gy * 2, gw * 2, gh * 2);
    };

    switch (itemId) {
      case 'hoe':
        p(3, 11, 2, 3, '#5c381c');
        p(5, 9, 2, 2, '#784828');
        p(7, 7, 2, 2, '#8c5630');
        p(9, 5, 2, 2, '#8c5630');
        p(8, 3, 6, 2, '#9aa3ad');
        p(12, 5, 2, 3, '#6c757d');
        break;
      case 'watering_can':
        p(4, 6, 8, 7, '#0284c7');
        p(5, 7, 6, 5, '#38bdf8');
        p(2, 7, 2, 4, '#0369a1');
        p(12, 5, 3, 2, '#7dd3fc');
        p(5, 4, 6, 2, '#0369a1');
        break;
      case 'hand':
        p(5, 6, 6, 7, '#d97706');
        p(5, 3, 6, 4, '#fbbf24');
        p(6, 7, 4, 4, '#fef3c7');
        break;
      case 'fishing_rod':
        p(2, 12, 2, 2, '#5c381c');
        p(4, 10, 2, 2, '#784828');
        p(6, 8, 2, 2, '#8c5630');
        p(8, 6, 2, 2, '#a16207');
        p(10, 4, 2, 2, '#b45309');
        p(12, 4, 1, 8, '#cbd5e1');
        p(11, 12, 3, 2, '#38bdf8');
        break;
      default:
        if (itemId && itemId.endsWith('_seed')) {
          p(3, 3, 10, 11, '#5c381c');
          p(4, 4, 8, 9, '#d6b88d');
          p(5, 6, 6, 5, mainColor);
          p(7, 7, 2, 2, '#166534');
        } else {
          p(3, 4, 10, 10, '#231812');
          p(4, 5, 8, 8, mainColor);
          p(5, 6, 3, 2, '#ffffff');
          p(6, 2, 4, 2, '#3f8236');
        }
        break;
    }
  }

  async triggerCloudSave() {
    const snapshot = this.getLiveGameState();
    const res = await saveGameData(snapshot);
    sound.playSfx('save');
    this.lastSaveSummary = getLocalSaveSummary();
    if (res.source === 'supabase') {
      this.showToast('Permainan berhasil disimpan ke akunmu.', 'success');
    } else if (res.error) {
      this.showToast(res.error, 'warn');
    } else {
      this.showToast('Permainan disimpan.', 'success');
    }
    if (typeof this.callbacks.onSaveGame === 'function') {
      this.callbacks.onSaveGame(res);
    }
    return res;
  }

  closeModal() {
    this.activeModal = null;
    this.activeNpc = null;
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      modalRoot.classList.add('hidden');
      modalRoot.innerHTML = '';
    }
  }

  openNPCModal(npcOrId, passedState = null, initialTab = 'chat') {
    const gameState = passedState || this.getLiveGameState();
    const npc =
      typeof npcOrId === 'string'
        ? NPC_CATALOG.find((n) => n.id === npcOrId)
        : npcOrId;
    if (!npc) return;

    this.activeModal = 'npc';
    this.activeNpc = npc;
    this.activeNpcTab = initialTab;
    sound.playSfx('talk');

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    const portraitUrl = sprites.getPortraitDataURL(npc.id);
    const friendship = Math.max(0, Math.min(100, Math.round(npc.friendship ?? 20)));
    const heartsCount = Math.max(1, Math.round(friendship / 20));
    const heartsDisplay = '♥'.repeat(heartsCount) + '♡'.repeat(Math.max(0, 5 - heartsCount));

    const hour = gameState.hour ?? 9;
    const greeting =
      hour < 12
        ? npc.greetings?.morning
        : hour < 18
          ? npc.greetings?.afternoon
          : npc.greetings?.evening;
    const dialogueLine =
      Array.isArray(npc.dialogues) && npc.dialogues.length > 0
        ? npc.dialogues[(npc.dialogueIndex || 0) % npc.dialogues.length]
        : '';

    let tabBodyHtml = '';

    if (this.activeNpcTab === 'chat') {
      tabBodyHtml = `
        <div class="npc-speech-box">
          <p style="margin: 0 0 8px;">"${this.escapeHtml(greeting || 'Halo!')}"</p>
          <p style="margin: 0; color: var(--text-dark-muted);">"${this.escapeHtml(dialogueLine)}"</p>
        </div>
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px;">
          <span style="font-size: 0.9rem; color: var(--text-muted-cream);">
            Kesukaan: <strong style="color: var(--accent-wheat);">${this.escapeHtml(npc.favoriteGift)}</strong>
          </span>
          <button type="button" id="btn-npc-talk-more" class="btn btn-primary">
            Lanjut Mengobrol (+2 Hati)
          </button>
        </div>
      `;
    } else if (this.activeNpcTab === 'shop') {
      const items = Array.isArray(npc.shopItems) ? npc.shopItems : [];
      const rows = items
        .map(
          (item) => `
          <div class="shop-item-row">
            <div>
              <div class="shop-item-title">${this.escapeHtml(item.name)}</div>
              <div class="shop-item-sub">${this.escapeHtml(item.description || '')}</div>
            </div>
            <button
              type="button"
              class="btn btn-primary"
              data-buy-item-id="${this.escapeHtml(item.id)}"
            >
              Beli (${item.price} G)
            </button>
          </div>
        `
        )
        .join('');

      tabBodyHtml = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong>${this.escapeHtml(npc.shopTitle || npc.buildingName)}</strong>
          <span style="color: var(--accent-wheat); font-weight: 800;">Uangmu: ${gameState.gold ?? 500} G</span>
        </div>
        <div class="shop-list">
          ${rows || '<p>Belum ada barang dagangan hari ini.</p>'}
        </div>
      `;
    } else if (this.activeNpcTab === 'gift') {
      const giftableSlots = this.getPlayerActionableItems(gameState, 'gift');
      const favIds = Array.isArray(npc.favoriteGiftIds) ? npc.favoriteGiftIds : [];
      const rows = giftableSlots
        .map((entry) => {
          const isFav = favIds.includes(entry.id);
          return `
            <div class="shop-item-row">
              <div>
                <div class="shop-item-title">
                  ${this.escapeHtml(entry.name)} (x${entry.count})
                  ${isFav ? '<span style="color: var(--accent-amber); font-size: 0.82rem;">Favorit (+15 Hati)</span>' : '<span style="font-size: 0.82rem; color: var(--text-dark-muted);">(+6 Hati)</span>'}
                </div>
                <div class="shop-item-sub">${this.escapeHtml(ITEMS[entry.id]?.description || '')}</div>
              </div>
              <button
                type="button"
                class="btn btn-amber"
                data-gift-item-id="${this.escapeHtml(entry.id)}"
              >
                Berikan
              </button>
            </div>
          `;
        })
        .join('');

      tabBodyHtml = `
        <p style="margin: 0; font-size: 0.92rem;">
          Pilih hasil panen atau masakan dari tasmu untuk diberikan kepada <strong>${this.escapeHtml(npc.name)}</strong>.
        </p>
        <div class="shop-list">
          ${rows || '<div class="parchment-panel">Tasmu belum berisi hasil panen atau makanan untuk diberikan.</div>'}
        </div>
      `;
    } else if (this.activeNpcTab === 'sell') {
      tabBodyHtml = this.buildSellItemsListHtml(gameState);
    }

    modalRoot.innerHTML = `
      <div class="modal-window" id="npc-modal">
        <div class="modal-header">
          <h2 class="modal-title">${this.escapeHtml(npc.buildingName)}</h2>
          <button type="button" class="modal-close-btn" id="btn-close-modal">Tutup [Esc]</button>
        </div>
        <div class="modal-body">
          <div class="npc-modal-profile">
            <img
              class="npc-modal-portrait"
              src="${portraitUrl}"
              alt="${this.escapeHtml(npc.name)}"
              width="72"
              height="72"
            />
            <div class="npc-modal-details">
              <h3>${this.escapeHtml(npc.name)}</h3>
              <div class="npc-modal-meta">${this.escapeHtml(npc.job)} (${this.escapeHtml(npc.areaName)})</div>
              <div class="friendship-bar">
                <span style="color: #f687b3;">${heartsDisplay}</span>
                <span>Keakraban: ${friendship}/100</span>
              </div>
            </div>
          </div>

          <div class="modal-tabs" role="tablist">
            <button type="button" class="modal-tab ${this.activeNpcTab === 'chat' ? 'active' : ''}" data-npc-tab="chat">
              Mengobrol
            </button>
            <button type="button" class="modal-tab ${this.activeNpcTab === 'shop' ? 'active' : ''}" data-npc-tab="shop">
              Toko
            </button>
            <button type="button" class="modal-tab ${this.activeNpcTab === 'gift' ? 'active' : ''}" data-npc-tab="gift">
              Beri Hadiah
            </button>
            <button type="button" class="modal-tab ${this.activeNpcTab === 'sell' ? 'active' : ''}" data-npc-tab="sell">
              Jual Panen
            </button>
          </div>

          ${tabBodyHtml}
        </div>
      </div>
    `;

    modalRoot.classList.remove('hidden');

    document.getElementById('btn-close-modal')?.addEventListener('click', () => this.closeModal());

    modalRoot.querySelectorAll('[data-npc-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextTab = btn.getAttribute('data-npc-tab');
        this.openNPCModal(npc, this.getLiveGameState(), nextTab);
      });
    });

    document.getElementById('btn-npc-talk-more')?.addEventListener('click', () => {
      npc.dialogueIndex = ((npc.dialogueIndex || 0) + 1) % (npc.dialogues?.length || 1);
      npc.friendship = Math.min(100, (npc.friendship ?? 20) + 2);
      sound.playSfx('talk');
      this.openNPCModal(npc, this.getLiveGameState(), 'chat');
    });

    modalRoot.querySelectorAll('[data-buy-item-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-buy-item-id');
        const shopItem = (npc.shopItems || []).find((i) => i.id === itemId);
        if (!shopItem) return;
        this.handleBuyShopItem(npc, shopItem);
      });
    });

    modalRoot.querySelectorAll('[data-gift-item-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-gift-item-id');
        this.handleGiftItemToNPC(npc, itemId);
      });
    });

    this.bindSellButtonsInModal(modalRoot, () => {
      this.openNPCModal(npc, this.getLiveGameState(), 'sell');
    });
  }

  openShippingBinModal(passedState = null) {
    const gameState = passedState || this.getLiveGameState();
    this.activeModal = 'shipping';

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="modal-window" id="shipping-modal">
        <div class="modal-header">
          <h2 class="modal-title">Kotak Penjualan Panen</h2>
          <button type="button" class="modal-close-btn" id="btn-close-modal">Tutup [Esc]</button>
        </div>
        <div class="modal-body">
          <p style="margin: 0;">
            Jual hasil kebun, produk ternak, dan ikan tangkapanmu di sini.
          </p>
          ${this.buildSellItemsListHtml(gameState)}
        </div>
      </div>
    `;

    modalRoot.classList.remove('hidden');
    document.getElementById('btn-close-modal')?.addEventListener('click', () => this.closeModal());
    this.bindSellButtonsInModal(modalRoot, () => {
      this.openShippingBinModal(this.getLiveGameState());
    });
  }

  buildSellItemsListHtml(gameState) {
    const sellable = this.getPlayerActionableItems(gameState, 'sell');
    if (sellable.length === 0) {
      return `
        <div class="parchment-panel">
          Belum ada hasil panen, telur, susu, atau ikan di tasmu. Panen tanaman di sawah atau memancing di dermaga terlebih dahulu.
        </div>
      `;
    }

    const rows = sellable
      .map(
        (item) => `
        <div class="shop-item-row">
          <div>
            <div class="shop-item-title">${this.escapeHtml(item.name)} (x${item.count})</div>
            <div class="shop-item-sub">Harga satuan: <strong>${item.sellPrice} G</strong></div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button
              type="button"
              class="btn btn-primary"
              data-sell-item-id="${this.escapeHtml(item.id)}"
              data-sell-qty="1"
            >
              Jual 1 (+${item.sellPrice} G)
            </button>
            ${
              item.count > 1
                ? `<button
                    type="button"
                    class="btn btn-amber"
                    data-sell-item-id="${this.escapeHtml(item.id)}"
                    data-sell-qty="${item.count}"
                  >
                    Jual Semua (+${item.sellPrice * item.count} G)
                  </button>`
                : ''
            }
          </div>
        </div>
      `
      )
      .join('');

    return `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>Barang di tasmu:</span>
        <strong style="color: var(--accent-wheat);">Uangmu: ${gameState.gold ?? 500} G</strong>
      </div>
      <div class="shop-list">${rows}</div>
    `;
  }

  bindSellButtonsInModal(modalRoot, refreshFn) {
    modalRoot.querySelectorAll('[data-sell-item-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-sell-item-id');
        const qty = Number(btn.getAttribute('data-sell-qty')) || 1;
        this.handleSellItem(itemId, qty);
        if (typeof refreshFn === 'function') refreshFn();
      });
    });
  }

  getPlayerActionableItems(gameState, mode = 'sell') {
    const hotbar = Array.isArray(gameState?.hotbar)
      ? gameState.hotbar
      : this.cachedGameState.hotbar;
    const list = [];
    for (const slot of hotbar) {
      if (!slot || !slot.id || slot.type === 'tool' || (slot.count ?? 0) <= 0) continue;
      const def = ITEMS[slot.id] || {};
      const sellPrice = slot.sellPrice ?? def.sellPrice ?? 25;
      if (mode === 'sell' && sellPrice <= 0) continue;
      if (mode === 'gift' && slot.type === 'seed') continue;
      list.push({
        id: slot.id,
        name: slot.name || def.name || slot.id,
        count: slot.count || 1,
        sellPrice,
      });
    }
    return list;
  }

  handleBuyShopItem(npc, shopItem) {
    const state = this.getLiveGameState();
    const currentGold = state.gold ?? 500;
    if (currentGold < shopItem.price) {
      this.showToast(`Uang tidak cukup. Butuh ${shopItem.price} G.`, 'warn');
      return;
    }

    state.gold = currentGold - shopItem.price;

    if (shopItem.type === 'service') {
      state.energy = state.maxEnergy || 100;
      this.showToast(`${shopItem.name}: Stamina pulih penuh.`, 'success');
    } else if (shopItem.type === 'max_energy_upgrade') {
      state.maxEnergy = (state.maxEnergy || 100) + (shopItem.bonusEnergy || 25);
      state.energy = state.maxEnergy;
      this.showToast(`Batas stamina naik menjadi ${state.maxEnergy}.`, 'success');
    } else if (shopItem.type === 'friendship_boost') {
      const bonus = shopItem.bonusFriendship || 10;
      NPC_CATALOG.forEach((n) => {
        n.friendship = Math.min(100, (n.friendship ?? 20) + bonus);
      });
      npc.friendship = Math.min(100, (npc.friendship ?? 20) + bonus);
      this.showToast(`Keakraban warga bertambah (+${bonus} Hati).`, 'success');
    } else if (shopItem.type === 'tool_upgrade') {
      const toolSlot = (state.hotbar || []).find((s) => s && s.id === shopItem.toolTarget);
      if (toolSlot) {
        toolSlot.level = (toolSlot.level || 1) + 1;
        if (toolSlot.id === 'watering_can') {
          toolSlot.maxWater = 30;
          toolSlot.water = 30;
        }
      }
      this.showToast(`${shopItem.name} selesai ditempa.`, 'success');
    } else if (shopItem.type === 'adopt_animal') {
      if (this.game?.farming && typeof this.game.farming.addAnimal === 'function') {
        const added = this.game.farming.addAnimal(shopItem.animalType || 'chicken');
        this.showToast(`${added.name} ditambahkan ke kandang peternakan.`, 'success');
      }
    } else {
      this.addItemToHotbarState(state, shopItem.id, 1);
      this.showToast(`Membeli ${shopItem.name} (-${shopItem.price} G).`, 'success');
    }

    sound.playSfx('buy');
    this.updateHUD(state);
    this.openNPCModal(npc, state, 'shop');
  }

  handleGiftItemToNPC(npc, itemId) {
    const state = this.getLiveGameState();
    const consumed = this.consumeItemFromHotbarState(state, itemId, 1);
    if (!consumed) return;

    const isFav = Array.isArray(npc.favoriteGiftIds) && npc.favoriteGiftIds.includes(itemId);
    const gain = isFav ? 15 : 6;
    npc.friendship = Math.min(100, (npc.friendship ?? 20) + gain);
    sound.playSfx('harvest');
    this.showToast(
      isFav
        ? `${npc.name} sangat menyukai pemberianmu (+${gain} Hati).`
        : `${npc.name} menerima hadiahmu (+${gain} Hati).`,
      'success'
    );
    this.updateHUD(state);
    this.openNPCModal(npc, state, 'gift');
  }

  handleSellItem(itemId, qty = 1) {
    const state = this.getLiveGameState();
    const def = ITEMS[itemId] || {};
    const price = def.sellPrice || 30;
    const consumed = this.consumeItemFromHotbarState(state, itemId, qty);
    if (!consumed) return;

    const earned = price * qty;
    state.gold = (state.gold ?? 500) + earned;
    sound.playSfx('coin');
    this.showToast(`Terjual ${qty}x ${def.name || itemId} (+${earned} G).`, 'success');
    this.updateHUD(state);
  }

  addItemToHotbarState(state, itemId, count = 1) {
    const def = ITEMS[itemId] || { id: itemId, name: itemId, type: 'item' };
    if (!Array.isArray(state.hotbar)) {
      state.hotbar = DEFAULT_HOTBAR.map((i) => ({ ...i }));
    }
    const existing = state.hotbar.find((s) => s && s.id === itemId);
    if (existing) {
      existing.count = (existing.count || 1) + count;
      return;
    }
    const emptyIdx = state.hotbar.findIndex((s) => !s || !s.id || (s.count ?? 1) <= 0);
    const payload = {
      id: itemId,
      name: def.name || itemId,
      type: def.type || def.category || 'item',
      cropId: def.cropId || null,
      energyRestore: def.energyRestore || 0,
      sellPrice: def.sellPrice || 0,
      count,
    };
    if (emptyIdx !== -1) {
      state.hotbar[emptyIdx] = payload;
    } else if (state.hotbar.length < 8) {
      state.hotbar.push(payload);
    } else {
      state.hotbar[7] = payload;
    }
  }

  consumeItemFromHotbarState(state, itemId, count = 1) {
    if (!Array.isArray(state.hotbar)) return false;
    const idx = state.hotbar.findIndex((s) => s && s.id === itemId && (s.count ?? 1) >= count);
    if (idx === -1) return false;
    state.hotbar[idx].count = (state.hotbar[idx].count || 1) - count;
    if (state.hotbar[idx].count <= 0 && state.hotbar[idx].type !== 'tool') {
      state.hotbar[idx] = null;
    }
    return true;
  }

  openQuestModal(quests = DAILY_QUESTS, passedState = null) {
    const gameState = passedState || this.getLiveGameState();
    const questList = Array.isArray(quests) && quests.length > 0 ? quests : DAILY_QUESTS;
    const completedIds = Array.isArray(gameState.completedQuests)
      ? gameState.completedQuests
      : [];

    this.activeModal = 'quests';
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    const cardsHtml = questList
      .map((q) => {
        const isDone = Boolean(q.completed || completedIds.includes(q.id));
        const playerSlot = (gameState.hotbar || []).find((s) => s && s.id === q.targetItem);
        const haveCount = playerSlot ? playerSlot.count || 0 : 0;
        const canClaim = !isDone && haveCount >= q.targetCount;

        return `
          <div class="quest-card ${isDone ? 'completed' : ''}">
            <div class="quest-top-row">
              <div>
                <strong style="font-size: 1.05rem;">${this.escapeHtml(q.title)}</strong>
                <div style="font-size: 0.84rem; color: var(--text-dark-muted);">
                  Dari: <strong>${this.escapeHtml(q.giverName)}</strong> (${this.escapeHtml(q.targetItemName)} ${Math.min(haveCount, q.targetCount)}/${q.targetCount})
                </div>
              </div>
              <span class="npc-job-badge" style="background-color: ${isDone ? 'var(--accent-leaf)' : 'var(--bg-wood-panel)'};">
                ${isDone ? 'Selesai' : `${haveCount}/${q.targetCount}`}
              </span>
            </div>
            <p style="margin: 0; font-size: 0.92rem;">${this.escapeHtml(q.description)}</p>
            <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px;">
              <span style="font-size: 0.86rem; font-weight: 800; color: var(--accent-amber);">
                Imbalan: +${q.rewardGold} G dan +${q.rewardFriendship} Hati
              </span>
              ${
                isDone
                  ? '<span style="font-weight: 800; color: var(--accent-leaf);">Sudah Diambil</span>'
                  : `<button
                      type="button"
                      class="btn btn-primary"
                      data-claim-quest-id="${this.escapeHtml(q.id)}"
                      ${canClaim ? '' : 'disabled'}
                    >
                      ${canClaim ? 'Serahkan Barang' : 'Belum Cukup'}
                    </button>`
              }
            </div>
          </div>
        `;
      })
      .join('');

    modalRoot.innerHTML = `
      <div class="modal-window" id="quest-modal">
        <div class="modal-header">
          <h2 class="modal-title">Papan Permintaan Warga</h2>
          <button type="button" class="modal-close-btn" id="btn-close-modal">Tutup [Esc]</button>
        </div>
        <div class="modal-body">
          <div class="shop-list">${cardsHtml}</div>
        </div>
      </div>
    `;

    modalRoot.classList.remove('hidden');
    document.getElementById('btn-close-modal')?.addEventListener('click', () => this.closeModal());

    modalRoot.querySelectorAll('[data-claim-quest-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const questId = btn.getAttribute('data-claim-quest-id');
        const quest = questList.find((item) => item.id === questId);
        if (!quest) return;
        this.handleClaimQuest(quest, questList);
      });
    });
  }

  handleClaimQuest(quest, questList) {
    const state = this.getLiveGameState();
    const ok = this.consumeItemFromHotbarState(state, quest.targetItem, quest.targetCount);
    if (!ok) return;

    quest.completed = true;
    if (!Array.isArray(state.completedQuests)) state.completedQuests = [];
    if (!state.completedQuests.includes(quest.id)) state.completedQuests.push(quest.id);

    state.gold = (state.gold ?? 500) + quest.rewardGold;
    const giver = NPC_CATALOG.find((n) => n.id === quest.giverId);
    if (giver) {
      giver.friendship = Math.min(100, (giver.friendship ?? 20) + quest.rewardFriendship);
    }

    sound.playSfx('coin');
    this.showToast(`Permintaan "${quest.title}" selesai (+${quest.rewardGold} G).`, 'success');
    this.updateHUD(state);
    this.openQuestModal(questList, state);
  }

  openMinimapModal(passedState = null) {
    const gameState = passedState || this.getLiveGameState();
    this.activeModal = 'minimap';

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    const fastTravelTargets = [
      ...BUILDINGS.map((b) => ({
        id: b.id,
        label: b.name,
        sub: b.roleLabel,
        x: b.doorX,
        y: b.doorY + 1,
      })),
      {
        id: 'river_fish',
        label: 'Tepi Sungai Hutan',
        sub: 'Memancing & Herbal',
        x: FISHING_SPOTS[1].tileX - 1,
        y: FISHING_SPOTS[1].tileY,
      },
      {
        id: 'beach_pier',
        label: 'Dermaga Pantai Selatan',
        sub: 'Memancing Laut',
        x: FISHING_SPOTS[0].tileX,
        y: FISHING_SPOTS[0].tileY - 1,
      },
    ];

    const buttonsHtml = fastTravelTargets
      .map(
        (t) => `
        <button
          type="button"
          class="fast-travel-btn"
          data-ft-x="${t.x}"
          data-ft-y="${t.y}"
          data-ft-label="${this.escapeHtml(t.label)}"
        >
          <div>
            <div style="font-weight: 800;">${this.escapeHtml(t.label)}</div>
            <div style="font-size: 0.76rem; color: var(--text-dark-muted);">${this.escapeHtml(t.sub)}</div>
          </div>
        </button>
      `
      )
      .join('');

    modalRoot.innerHTML = `
      <div class="modal-window" id="minimap-modal">
        <div class="modal-header">
          <h2 class="modal-title">Peta Desa Palevest</h2>
          <button type="button" class="modal-close-btn" id="btn-close-modal">Tutup [Esc]</button>
        </div>
        <div class="modal-body">
          <div class="minimap-canvas-box">
            <canvas id="minimap-canvas" width="576" height="448"></canvas>
          </div>
          <div>
            <div style="font-weight: 800; margin-bottom: 8px; color: var(--accent-wheat);">
              Pilih Lokasi Tujuan:
            </div>
            <div class="fast-travel-grid">
              ${buttonsHtml}
            </div>
          </div>
        </div>
      </div>
    `;

    modalRoot.classList.remove('hidden');
    this.drawMinimapCanvas(gameState);

    document.getElementById('btn-close-modal')?.addEventListener('click', () => this.closeModal());

    modalRoot.querySelectorAll('[data-ft-x]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tx = Number(btn.getAttribute('data-ft-x'));
        const ty = Number(btn.getAttribute('data-ft-y'));
        const label = btn.getAttribute('data-ft-label');
        this.handleFastTravel(tx, ty, label);
      });
    });
  }

  drawMinimapCanvas(gameState) {
    const canvas = document.getElementById('minimap-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = 8;
    ctx.fillStyle = '#4f9943';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#39692c';
    ctx.fillRect(3 * scale, 24 * scale, 23 * scale, 19 * scale);

    ctx.fillStyle = '#efd595';
    ctx.fillRect(0, 43 * scale, MAP_COLS * scale, 5 * scale);
    ctx.fillStyle = '#3490bf';
    ctx.fillRect(0, 48 * scale, MAP_COLS * scale, 8 * scale);
    ctx.fillRect(21 * scale, 24 * scale, 3 * scale, 24 * scale);

    ctx.fillStyle = '#b4b9c2';
    ctx.fillRect(30 * scale, 10 * scale, 11 * scale, 16 * scale);

    ctx.fillStyle = '#8c583a';
    ctx.fillRect(8 * scale, 13 * scale, 8 * scale, 5 * scale);

    ctx.fillStyle = '#c9a675';
    ctx.fillRect(9 * scale, 10 * scale, 50 * scale, 2 * scale);
    ctx.fillRect(18 * scale, 10 * scale, 2 * scale, 11 * scale);
    ctx.fillRect(18 * scale, 20 * scale, 34 * scale, 2 * scale);
    ctx.fillRect(34 * scale, 26 * scale, 3 * scale, 22 * scale);
    ctx.fillRect(14 * scale, 31 * scale, 34 * scale, 2 * scale);

    for (const b of BUILDINGS) {
      ctx.fillStyle = b.roofColor || '#b85d3b';
      ctx.fillRect(b.tileX * scale, b.tileY * scale, b.widthTiles * scale, b.heightTiles * scale);
      ctx.strokeStyle = '#1f1610';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(b.tileX * scale, b.tileY * scale, b.widthTiles * scale, b.heightTiles * scale);

      ctx.fillStyle = '#fff8eb';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(b.name, (b.tileX + b.widthTiles / 2) * scale, (b.tileY - 0.5) * scale);
    }

    const npcs =
      Array.isArray(gameState?.npcs) && gameState.npcs.length > 0
        ? gameState.npcs
        : NPC_CATALOG.map((n) => ({ ...n, x: n.homeTile.x, y: n.homeTile.y }));

    for (const npc of npcs) {
      const nx = (npc.x ?? npc.homeTile?.x ?? 35) * scale;
      const ny = (npc.y ?? npc.homeTile?.y ?? 12) * scale;
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(nx, ny, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1f1610';
      ctx.stroke();
    }

    const px = (gameState?.player?.x ?? gameState?.x ?? 10) * scale;
    const py = (gameState?.player?.y ?? gameState?.y ?? 10) * scale;
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1f1610';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  handleFastTravel(tx, ty, label) {
    if (typeof this.callbacks.onFastTravel === 'function') {
      this.callbacks.onFastTravel(tx, ty, label);
    } else if (this.game && typeof this.game.teleportPlayer === 'function') {
      this.game.teleportPlayer(tx, ty);
    }
    this.closeModal();
    sound.playSfx('step');
    this.showToast(`Pindah ke ${label}.`, 'info');
  }

  showToast(message, type = 'info') {
    if (!message) return;
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3200);
  }

  escapeHtml(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  svgIcon(name) {
    const icons = {
      google:
        '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-1.8H12z"/></svg>',
      play:
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11l9-5.5-9-5.5z"/></svg>',
      users:
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M5.5 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm5 1a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-5 1C3 9 1 10.3 1 12v1.5h9V12c0-1.7-2-3-4.5-3zm5 .5c-.7 0-1.4.2-2 .5 1 .7 1.5 1.6 1.5 2.5v1H15V12c0-1.4-1.8-2.5-4.5-2.5z"/></svg>',
      sound:
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 2.5 4.5 5.5H2v5h2.5L8 13.5v-11zm2.5 2.2v1.6a2.5 2.5 0 0 1 0 3.4v1.6a4 4 0 0 0 0-6.6z"/></svg>',
      login:
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M6.5 2h7v12h-7v-1.5h5.5v-9H6.5V2zm1.8 3.2L11 8l-2.7 2.8-1.1-1.1 1-1H2V7.3h6.2l-1-1 1.1-1.1z"/></svg>',
      userPlus:
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 1.5c-2.7 0-5 1.3-5 3V14h10v-1.5c0-1.7-2.3-3-5-3zm6.5-4.5V3h-1.5v2H9v1.5h2v2h1.5v-2h2V5h-2z"/></svg>',
      logout:
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M2.5 2h7v1.5H4v9h5.5V14h-7V2zm8.8 3.2L14 8l-2.7 2.8-1.1-1.1 1-1H6V7.3h5.2l-1-1 1.1-1.1z"/></svg>',
      coin:
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="#fbbf24" aria-hidden="true"><circle cx="8" cy="8" r="6.5" stroke="#92400e" stroke-width="1.5"/><rect x="7" y="4.5" width="2" height="7" fill="#78350f"/></svg>',
      cloud:
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M12.5 7.2A4 4 0 0 0 5 6a3 3 0 0 0-.5 6h8a2.5 2.5 0 0 0 0-4.8z"/></svg>',
      map:
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M1.5 3 5.5 1.5l5 2 4-1.5v11l-4 1.5-5-2-4 1.5V3zm4.5-.2v8.8l4 1.6V4.4L6 2.8z"/></svg>',
      scroll:
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm1.5 3v1.5h6V5h-6zm0 3v1.5h6V8h-6zm0 3v1.5h4V11h-4z"/></svg>',
      home:
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 2 1.5 7.5h2V14h3.5v-4h2v4h3.5V7.5h2L8 2z"/></svg>',
    };
    return icons[name] || '';
  }
}
