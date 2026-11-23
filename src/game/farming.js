/**
 * Palevest Mon — Farming, Ranching, Foraging, Fishing & Item Economy System
 * Manages the 8x5 crop plots, Meadow Ranch animals, wild forage spawns, and active hotbar tool use.
 */

export const CROPS = {
  turnip: {
    id: 'turnip',
    name: 'Lobak Segar',
    seedId: 'turnip_seed',
    harvestItemId: 'turnip',
    growthDays: 2,
    maxStage: 3,
    buyPrice: 20,
    sellPrice: 55,
    energyRestore: 15,
    color: '#f8fafc',
    accentColor: '#a855f7',
    leafColor: '#22c55e',
    description: 'Lobak renyah yang tumbuh cepat dalam 2 hari.',
  },
  strawberry: {
    id: 'strawberry',
    name: 'Stroberi Manis',
    seedId: 'strawberry_seed',
    harvestItemId: 'strawberry',
    growthDays: 3,
    maxStage: 3,
    buyPrice: 40,
    sellPrice: 110,
    energyRestore: 25,
    color: '#ef4444',
    accentColor: '#fca5a5',
    leafColor: '#16a34a',
    description: 'Buah beri merah manis kesukaan warga desa, tumbuh dalam 3 hari.',
  },
  corn: {
    id: 'corn',
    name: 'Jagung Madu',
    seedId: 'corn_seed',
    harvestItemId: 'corn',
    growthDays: 4,
    maxStage: 3,
    buyPrice: 60,
    sellPrice: 165,
    energyRestore: 30,
    color: '#facc15',
    accentColor: '#eab308',
    leafColor: '#15803d',
    description: 'Jagung bulir keemasan yang manis dan mengenyangkan, tumbuh 4 hari.',
  },
  pumpkin: {
    id: 'pumpkin',
    name: 'Labu Lembah',
    seedId: 'pumpkin_seed',
    harvestItemId: 'pumpkin',
    growthDays: 5,
    maxStage: 3,
    buyPrice: 90,
    sellPrice: 260,
    energyRestore: 45,
    color: '#f97316',
    accentColor: '#ea580c',
    leafColor: '#166534',
    description: 'Labu kebanggaan Lembah Palevest bernilai jual tinggi, tumbuh 5 hari.',
  },
};

export const ITEMS = {
  // Tools
  hoe: {
    id: 'hoe',
    name: 'Cangkul',
    category: 'tool',
    type: 'tool',
    sellPrice: 0,
    buyPrice: 0,
    energyRestore: 0,
    icon: '⛏️',
    color: '#a16207',
    description: 'Gunakan untuk menggemburkan petak tanah ladang sebelum menanam.',
  },
  watering_can: {
    id: 'watering_can',
    name: 'Penyiram',
    category: 'tool',
    type: 'tool',
    sellPrice: 0,
    buyPrice: 0,
    energyRestore: 0,
    icon: '🚿',
    color: '#38bdf8',
    description: 'Menyiram tanaman setiap hari. Isi ulang di sungai, sumur, atau tepi air.',
  },
  hand: {
    id: 'hand',
    name: 'Tangan / Panen',
    category: 'tool',
    type: 'tool',
    sellPrice: 0,
    buyPrice: 0,
    energyRestore: 0,
    icon: '✋',
    color: '#f59e0b',
    description: 'Memanen tanaman matang, memungut hasil hutan/pantai, dan mengelus ternak.',
  },
  fishing_rod: {
    id: 'fishing_rod',
    name: 'Pancingan',
    category: 'tool',
    type: 'tool',
    sellPrice: 0,
    buyPrice: 0,
    energyRestore: 0,
    icon: '🎣',
    color: '#0284c7',
    description: 'Gunakan di tepi sungai, kolam, atau dermaga Pantai Selatan untuk memancing.',
  },

  // Seeds
  turnip_seed: {
    id: 'turnip_seed',
    name: 'Bibit Lobak',
    category: 'seed',
    type: 'seed',
    cropId: 'turnip',
    sellPrice: 10,
    buyPrice: 20,
    energyRestore: 0,
    icon: '🌱',
    color: '#86efac',
    description: 'Bibit Lobak unggul. Tumbuh dalam 2 hari (Jual panen: 55G).',
  },
  strawberry_seed: {
    id: 'strawberry_seed',
    name: 'Bibit Stroberi',
    category: 'seed',
    type: 'seed',
    cropId: 'strawberry',
    sellPrice: 20,
    buyPrice: 40,
    energyRestore: 0,
    icon: '🍓',
    color: '#fda4af',
    description: 'Bibit Stroberi Manis. Tumbuh dalam 3 hari (Jual panen: 110G).',
  },
  corn_seed: {
    id: 'corn_seed',
    name: 'Bibit Jagung Madu',
    category: 'seed',
    type: 'seed',
    cropId: 'corn',
    sellPrice: 30,
    buyPrice: 60,
    energyRestore: 0,
    icon: '🌽',
    color: '#fde047',
    description: 'Bibit Jagung Madu. Tumbuh dalam 4 hari (Jual panen: 165G).',
  },
  pumpkin_seed: {
    id: 'pumpkin_seed',
    name: 'Bibit Labu Lembah',
    category: 'seed',
    type: 'seed',
    cropId: 'pumpkin',
    sellPrice: 45,
    buyPrice: 90,
    energyRestore: 0,
    icon: '🎃',
    color: '#fdba74',
    description: 'Bibit Labu Lembah. Tumbuh dalam 5 hari (Jual panen: 260G).',
  },

  // Harvested Crops
  turnip: {
    id: 'turnip',
    name: 'Lobak Segar',
    category: 'crop',
    type: 'crop',
    sellPrice: 55,
    buyPrice: 55,
    energyRestore: 15,
    icon: '🥔',
    color: '#e9d5ff',
    description: 'Umbi lobak putih keunguan hasil panen kebun sendiri.',
  },
  strawberry: {
    id: 'strawberry',
    name: 'Stroberi Manis',
    category: 'crop',
    type: 'crop',
    sellPrice: 110,
    buyPrice: 110,
    energyRestore: 25,
    icon: '🍓',
    color: '#ef4444',
    description: 'Stroberi merah segar beraroma harum dan manis.',
  },
  corn: {
    id: 'corn',
    name: 'Jagung Madu',
    category: 'crop',
    type: 'crop',
    sellPrice: 165,
    buyPrice: 165,
    energyRestore: 30,
    icon: '🌽',
    color: '#facc15',
    description: 'Jagung manis keemasan yang kaya gizi.',
  },
  pumpkin: {
    id: 'pumpkin',
    name: 'Labu Lembah',
    category: 'crop',
    type: 'crop',
    sellPrice: 260,
    buyPrice: 260,
    energyRestore: 45,
    icon: '🎃',
    color: '#f97316',
    description: 'Labu besar berdaging tebal dengan harga jual tinggi.',
  },

  // Ranch Products
  milk: {
    id: 'milk',
    name: 'Susu Sapi Segar',
    category: 'ranch',
    type: 'food',
    sellPrice: 75,
    buyPrice: 95,
    energyRestore: 35,
    icon: '🥛',
    color: '#f8fafc',
    description: 'Susu perah pagi hari yang gurih dan menyehatkan (+35 Energi).',
  },
  egg: {
    id: 'egg',
    name: 'Telur Ayam Kampung',
    category: 'ranch',
    type: 'food',
    sellPrice: 45,
    buyPrice: 60,
    energyRestore: 20,
    icon: '🥚',
    color: '#fef3c7',
    description: 'Telur segar dari ayam yang bahagia di Padang Hijau (+20 Energi).',
  },
  wool: {
    id: 'wool',
    name: 'Wol Domba Halus',
    category: 'ranch',
    type: 'item',
    sellPrice: 95,
    buyPrice: 120,
    energyRestore: 0,
    icon: '🧶',
    color: '#e2e8f0',
    description: 'Pintalan bulu domba lembut kualitas premium untuk kerajinan.',
  },

  // Wild Forage
  herb: {
    id: 'herb',
    name: 'Daun Herbal Hutan',
    category: 'forage',
    type: 'food',
    sellPrice: 35,
    buyPrice: 50,
    energyRestore: 18,
    icon: '🌿',
    color: '#4ade80',
    description: 'Tanaman obat aromatik dari Hutan Bisik Barat (+18 Energi).',
  },
  mushroom: {
    id: 'mushroom',
    name: 'Jamur Hutan Embun',
    category: 'forage',
    type: 'food',
    sellPrice: 45,
    buyPrice: 60,
    energyRestore: 22,
    icon: '🍄',
    color: '#f87171',
    description: 'Jamur liar lezat yang tumbuh di bawah rindang pepohonan (+22 Energi).',
  },
  seashell: {
    id: 'seashell',
    name: 'Kerang Mutiara Pantai',
    category: 'forage',
    type: 'item',
    sellPrice: 50,
    buyPrice: 70,
    energyRestore: 0,
    icon: '🐚',
    color: '#7dd3fc',
    description: 'Cangkang kerang berkilau yang terdampar di pasir Pantai Selatan.',
  },

  // Fish
  fish_carp: {
    id: 'fish_carp',
    name: 'Ikan Mas Sungai',
    category: 'fish',
    type: 'food',
    sellPrice: 65,
    buyPrice: 45,
    energyRestore: 25,
    icon: '🐟',
    color: '#fb923c',
    description: 'Ikan air tawar bersisik keemasan dari aliran sungai desa.',
  },
  fish_snapper: {
    id: 'fish_snapper',
    name: 'Ikan Kakap Merah',
    category: 'fish',
    type: 'food',
    sellPrice: 125,
    buyPrice: 150,
    energyRestore: 40,
    icon: '🐠',
    color: '#f43f5e',
    description: 'Ikan laut unggulan tangkapan perairan dalam Pantai Selatan.',
  },

  // Cooked Foods & Ranch Supplies
  honey_bread: {
    id: 'honey_bread',
    name: 'Roti Madu',
    category: 'food',
    type: 'food',
    sellPrice: 25,
    buyPrice: 35,
    energyRestore: 35,
    icon: '🥖',
    color: '#f59e0b',
    description: 'Roti gandum hangat berlapis madu hutan (+35 Energi).',
  },
  chamomile_tea: {
    id: 'chamomile_tea',
    name: 'Teh Chamomile Lembah',
    category: 'food',
    type: 'food',
    sellPrice: 20,
    buyPrice: 30,
    energyRestore: 30,
    icon: '🍵',
    color: '#fde047',
    description: 'Seduhan bunga chamomile hangat yang menenangkan (+30 Energi).',
  },
  pumpkin_pie: {
    id: 'pumpkin_pie',
    name: 'Pai Labu Spesial Liora',
    category: 'food',
    type: 'food',
    sellPrice: 55,
    buyPrice: 75,
    energyRestore: 80,
    icon: '🥧',
    color: '#ea580c',
    description: 'Pai labu manis berempah kayu manis (+80 Energi).',
  },
  herbal_tonic: {
    id: 'herbal_tonic',
    name: 'Tonik Stamina Hutan',
    category: 'food',
    type: 'food',
    sellPrice: 32,
    buyPrice: 45,
    energyRestore: 55,
    icon: '🧪',
    color: '#10b981',
    description: 'Ramuan herbal Dr. Elian untuk memulihkan tenaga (+55 Energi).',
  },
  grilled_fish_meal: {
    id: 'grilled_fish_meal',
    name: 'Ikan Bakar Bumbu Pesisir',
    category: 'food',
    type: 'food',
    sellPrice: 35,
    buyPrice: 50,
    energyRestore: 45,
    icon: '🍱',
    color: '#d97706',
    description: 'Ikan bakar segar racikan Kapten Tio (+45 Energi).',
  },
  animal_feed: {
    id: 'animal_feed',
    name: 'Pakan Ternak',
    category: 'supply',
    type: 'item',
    sellPrice: 12,
    buyPrice: 25,
    energyRestore: 0,
    icon: '🌾',
    color: '#eab308',
    description: 'Campuran rumput kering dan biji-bijian bergizi untuk hewan ternak.',
  },
};

export const DEFAULT_HOTBAR = [
  { id: 'hoe', name: 'Cangkul', type: 'tool', count: 1, level: 1 },
  {
    id: 'watering_can',
    name: 'Penyiram',
    type: 'tool',
    count: 1,
    water: 20,
    maxWater: 20,
    level: 1,
  },
  { id: 'hand', name: 'Tangan / Panen', type: 'tool', count: 1 },
  { id: 'fishing_rod', name: 'Pancingan', type: 'tool', count: 1, level: 1 },
  {
    id: 'turnip_seed',
    name: 'Bibit Lobak',
    type: 'seed',
    cropId: 'turnip',
    count: 8,
  },
  {
    id: 'strawberry_seed',
    name: 'Bibit Stroberi',
    type: 'seed',
    cropId: 'strawberry',
    count: 4,
  },
  { id: 'animal_feed', name: 'Pakan Ternak', type: 'item', count: 5 },
  {
    id: 'honey_bread',
    name: 'Roti Madu',
    type: 'food',
    energyRestore: 35,
    count: 2,
  },
];

const FORAGE_SPAWN_TEMPLATE = [
  // Whispering Woods (West Forest)
  { id: 'forage_woods_1', itemId: 'herb', x: 7, y: 35, area: 'Hutan Bisik' },
  { id: 'forage_woods_2', itemId: 'mushroom', x: 10, y: 38, area: 'Hutan Bisik' },
  { id: 'forage_woods_3', itemId: 'herb', x: 13, y: 42, area: 'Hutan Bisik' },
  { id: 'forage_woods_4', itemId: 'mushroom', x: 8, y: 44, area: 'Hutan Bisik' },
  { id: 'forage_woods_5', itemId: 'herb', x: 15, y: 37, area: 'Hutan Bisik' },
  // Sunny Beach (South Coast)
  { id: 'forage_beach_1', itemId: 'seashell', x: 24, y: 49, area: 'Pantai Selatan' },
  { id: 'forage_beach_2', itemId: 'seashell', x: 33, y: 50, area: 'Pantai Selatan' },
  { id: 'forage_beach_3', itemId: 'seashell', x: 45, y: 49, area: 'Pantai Selatan' },
  { id: 'forage_beach_4', itemId: 'seashell', x: 52, y: 50, area: 'Pantai Selatan' },
];

export class FarmingSystem {
  constructor() {
    this.bounds = {
      startX: 8,
      startY: 13,
      cols: 8,
      rows: 5,
    };
    this.ranchBounds = {
      minX: 53,
      maxX: 65,
      minY: 12,
      maxY: 20,
    };

    this.plots = [];
    this.plotMap = new Map();
    this.animals = [];
    this.forageItems = [];

    this._initFarmPlots();
    this._initAnimals();
    this._spawnDailyForage();
  }

  _plotKey(tx, ty) {
    return `${tx},${ty}`;
  }

  _initFarmPlots() {
    this.plots = [];
    this.plotMap.clear();

    const { startX, startY, cols, rows } = this.bounds;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c;
        const y = startY + r;
        const plot = {
          x,
          y,
          tilled: false,
          watered: false,
          cropId: null,
          stage: 0,
          daysGrown: 0,
        };
        this.plots.push(plot);
        this.plotMap.set(this._plotKey(x, y), plot);
      }
    }

    // Pre-plant inviting starter crops on Day 1 so the farm looks alive immediately
    const starterLayouts = [
      // Row 0: 3 ripe turnips ready to harvest right away!
      { x: 8, y: 13, cropId: 'turnip', stage: 3, daysGrown: 2, watered: true },
      { x: 9, y: 13, cropId: 'turnip', stage: 3, daysGrown: 2, watered: true },
      { x: 10, y: 13, cropId: 'turnip', stage: 2, daysGrown: 1, watered: true },
      { x: 11, y: 13, cropId: 'turnip', stage: 1, daysGrown: 1, watered: false },
      // Row 1: Growing strawberries
      { x: 8, y: 14, cropId: 'strawberry', stage: 3, daysGrown: 3, watered: true },
      { x: 9, y: 14, cropId: 'strawberry', stage: 2, daysGrown: 2, watered: true },
      { x: 10, y: 14, cropId: 'strawberry', stage: 1, daysGrown: 1, watered: false },
      // Row 2: Growing honey corn & tilled empty plots
      { x: 8, y: 15, cropId: 'corn', stage: 2, daysGrown: 2, watered: true },
      { x: 9, y: 15, cropId: 'corn', stage: 1, daysGrown: 1, watered: false },
      { x: 10, y: 15, cropId: null, stage: 0, daysGrown: 0, watered: false },
      { x: 11, y: 15, cropId: null, stage: 0, daysGrown: 0, watered: false },
    ];

    for (const s of starterLayouts) {
      const plot = this.getPlot(s.x, s.y);
      if (plot) {
        plot.tilled = true;
        plot.watered = s.watered;
        plot.cropId = s.cropId;
        plot.stage = s.stage;
        plot.daysGrown = s.daysGrown;
      }
    }
  }

  _initAnimals() {
    this.animals = [
      {
        id: 'cow_mooi',
        name: 'Sapi Mooi',
        type: 'cow',
        x: 55,
        y: 14,
        targetX: 55,
        targetY: 14,
        dir: 'down',
        frame: 0,
        moveTimer: 2.0,
        fed: true,
        hasProduce: true,
        produceItemId: 'milk',
        produceName: 'Susu Sapi Segar',
        happiness: 75,
      },
      {
        id: 'cow_daisy',
        name: 'Sapi Daisy',
        type: 'cow',
        x: 61,
        y: 15,
        targetX: 61,
        targetY: 15,
        dir: 'left',
        frame: 0,
        moveTimer: 3.1,
        fed: true,
        hasProduce: true,
        produceItemId: 'milk',
        produceName: 'Susu Sapi Segar',
        happiness: 70,
      },
      {
        id: 'sheep_awan',
        name: 'Domba Awan',
        type: 'sheep',
        x: 57,
        y: 17,
        targetX: 57,
        targetY: 17,
        dir: 'right',
        frame: 0,
        moveTimer: 2.4,
        fed: true,
        hasProduce: true,
        produceItemId: 'wool',
        produceName: 'Wol Domba Halus',
        happiness: 80,
      },
      {
        id: 'sheep_kapas',
        name: 'Domba Kapas',
        type: 'sheep',
        x: 63,
        y: 18,
        targetX: 63,
        targetY: 18,
        dir: 'down',
        frame: 0,
        moveTimer: 3.6,
        fed: true,
        hasProduce: true,
        produceItemId: 'wool',
        produceName: 'Wol Domba Halus',
        happiness: 75,
      },
      {
        id: 'chicken_koko',
        name: 'Ayam Koko',
        type: 'chicken',
        x: 54,
        y: 18,
        targetX: 54,
        targetY: 18,
        dir: 'right',
        frame: 0,
        moveTimer: 1.5,
        fed: true,
        hasProduce: true,
        produceItemId: 'egg',
        produceName: 'Telur Ayam Kampung',
        happiness: 85,
      },
      {
        id: 'chicken_pipit',
        name: 'Ayam Pipit',
        type: 'chicken',
        x: 59,
        y: 19,
        targetX: 59,
        targetY: 19,
        dir: 'left',
        frame: 0,
        moveTimer: 2.2,
        fed: true,
        hasProduce: true,
        produceItemId: 'egg',
        produceName: 'Telur Ayam Kampung',
        happiness: 80,
      },
      {
        id: 'chicken_lurik',
        name: 'Ayam Lurik',
        type: 'chicken',
        x: 62,
        y: 13,
        targetX: 62,
        targetY: 13,
        dir: 'down',
        frame: 0,
        moveTimer: 1.8,
        fed: true,
        hasProduce: true,
        produceItemId: 'egg',
        produceName: 'Telur Ayam Kampung',
        happiness: 80,
      },
    ];
  }

  _spawnDailyForage() {
    this.forageItems = FORAGE_SPAWN_TEMPLATE.map((tpl, idx) => {
      const itemDef = ITEMS[tpl.itemId];
      return {
        id: tpl.id,
        itemId: tpl.itemId,
        name: itemDef ? itemDef.name : tpl.itemId,
        x: tpl.x,
        y: tpl.y,
        area: tpl.area,
        collected: false,
        bobPhase: idx * 0.9,
      };
    });
  }

  update(dt) {
    this.updateAnimals(dt);
  }

  updateAnimals(dt) {
    const delta = dt > 10 ? dt / 1000 : dt;
    if (!Number.isFinite(delta) || delta <= 0) return;

    const { minX, maxX, minY, maxY } = this.ranchBounds;

    for (const animal of this.animals) {
      const dx = animal.targetX - animal.x;
      const dy = animal.targetY - animal.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 0.04) {
        const speed = animal.type === 'chicken' ? 1.4 : 0.95;
        const step = Math.min(dist, speed * delta);
        animal.x += (dx / dist) * step;
        animal.y += (dy / dist) * step;
        if (Math.abs(dx) >= Math.abs(dy)) {
          animal.dir = dx > 0 ? 'right' : 'left';
        } else {
          animal.dir = dy > 0 ? 'down' : 'up';
        }
        animal.frame = (animal.frame + delta * 5) % 4;
      } else {
        animal.x = animal.targetX;
        animal.y = animal.targetY;
        animal.frame = 0;
        animal.moveTimer -= delta;

        if (animal.moveTimer <= 0) {
          animal.moveTimer = 2.0 + Math.random() * 3.2;
          const stepX = Math.floor(Math.random() * 5) - 2;
          const stepY = Math.floor(Math.random() * 5) - 2;
          animal.targetX = Math.max(minX, Math.min(maxX, Math.round(animal.x + stepX)));
          animal.targetY = Math.max(minY, Math.min(maxY, Math.round(animal.y + stepY)));
        }
      }
    }
  }

  isFarmPlot(tx, ty) {
    return this.plotMap.has(this._plotKey(Math.round(tx), Math.round(ty)));
  }

  getPlot(tx, ty) {
    return this.plotMap.get(this._plotKey(Math.round(tx), Math.round(ty))) || null;
  }

  getPlots() {
    return this.plots;
  }

  getAnimals() {
    return this.animals;
  }

  getForageItems() {
    return this.forageItems;
  }

  getNearbyAnimal(tx, ty, maxDist = 2.2) {
    let closest = null;
    let bestDist = maxDist;
    for (const animal of this.animals) {
      const dist = Math.hypot(animal.x - tx, animal.y - ty);
      if (dist <= bestDist) {
        bestDist = dist;
        closest = animal;
      }
    }
    return closest;
  }

  getNearbyForage(tx, ty, maxDist = 2.0) {
    let closest = null;
    let bestDist = maxDist;
    for (const item of this.forageItems) {
      if (item.collected) continue;
      const dist = Math.hypot(item.x - tx, item.y - ty);
      if (dist <= bestDist) {
        bestDist = dist;
        closest = item;
      }
    }
    return closest;
  }

  _giveItemToPlayer(itemId, count, playerState, worldHelpers) {
    const def = ITEMS[itemId];
    if (!def) return null;

    const itemPayload = {
      id: def.id,
      name: def.name,
      type: def.type || def.category,
      category: def.category,
      count,
      sellPrice: def.sellPrice || 0,
      energyRestore: def.energyRestore || 0,
      cropId: def.cropId || null,
    };

    if (typeof worldHelpers?.addItem === 'function') {
      worldHelpers.addItem(itemPayload);
      return itemPayload;
    }
    if (typeof playerState?.addItem === 'function') {
      playerState.addItem(itemPayload);
      return itemPayload;
    }

    const hotbar = playerState?.hotbar;
    if (Array.isArray(hotbar)) {
      const existing = hotbar.find((slot) => slot && slot.id === itemId);
      if (existing) {
        existing.count = (existing.count || 1) + count;
        return itemPayload;
      }
      const emptyIdx = hotbar.findIndex((slot) => !slot || !slot.id || slot.count <= 0);
      if (emptyIdx !== -1) {
        hotbar[emptyIdx] = { ...itemPayload };
        return itemPayload;
      }
    }

    if (Array.isArray(playerState?.inventory)) {
      const existing = playerState.inventory.find((i) => i && i.id === itemId);
      if (existing) {
        existing.count = (existing.count || 1) + count;
      } else {
        playerState.inventory.push({ ...itemPayload });
      }
    }

    return itemPayload;
  }

  _consumeSlotItem(slotItem, amount, playerState) {
    if (!slotItem) return;
    slotItem.count = Math.max(0, (slotItem.count || 1) - amount);
    if (slotItem.count <= 0 && Array.isArray(playerState?.hotbar)) {
      const idx = playerState.hotbar.indexOf(slotItem);
      if (idx !== -1) {
        playerState.hotbar[idx] = null;
      }
    }
  }

  _checkNearWater(tx, ty, playerState, worldHelpers) {
    if (typeof worldHelpers?.isNearWater === 'function') {
      if (worldHelpers.isNearWater(tx, ty)) return true;
      if (
        playerState &&
        typeof playerState.x === 'number' &&
        worldHelpers.isNearWater(playerState.x, playerState.y)
      ) {
        return true;
      }
    }
    if (typeof worldHelpers?.isWater === 'function') {
      const checkCoords = [
        [tx, ty],
        [tx + 1, ty],
        [tx - 1, ty],
        [tx, ty + 1],
        [tx, ty - 1],
      ];
      for (const [cx, cy] of checkCoords) {
        if (worldHelpers.isWater(Math.round(cx), Math.round(cy))) return true;
      }
    }
    // Built-in fallback for village fountain/well, river, and south beach pier
    const rx = Math.round(tx);
    const ry = Math.round(ty);
    const nearSouthBeach = ry >= 46;
    const nearTownFountain = Math.hypot(rx - 35, ry - 23) <= 3.5;
    const nearFarmWell = Math.hypot(rx - 17, ry - 14) <= 2.8;
    const nearEastStream = rx >= 50 && rx <= 53 && ry >= 22 && ry <= 48;
    return nearSouthBeach || nearTownFountain || nearFarmWell || nearEastStream;
  }

  /**
   * Executes the player's active hotbar item at tile (tx, ty).
   * Returns { ok, message, sound, energyDelta, goldDelta, itemAdded }
   */
  useActiveSlot(slotItem, tx, ty, playerState = {}, worldHelpers = {}) {
    if (!slotItem || !slotItem.id) {
      return {
        ok: false,
        message: 'Pilih alat atau barang di hotbar terlebih dahulu.',
        sound: 'error',
        energyDelta: 0,
        goldDelta: 0,
      };
    }

    const tileX = Math.round(tx);
    const tileY = Math.round(ty);
    const px = typeof playerState.x === 'number' ? playerState.x : tileX;
    const py = typeof playerState.y === 'number' ? playerState.y : tileY;
    const plot = this.getPlot(tileX, tileY) || this.getPlot(px, py);

    // 1. HOE — Till farm soil
    if (slotItem.id === 'hoe') {
      if (!plot) {
        return {
          ok: false,
          message: 'Cangkul hanya bisa digunakan di petak ladang pertanian!',
          sound: 'error',
          energyDelta: 0,
          goldDelta: 0,
        };
      }
      if (plot.cropId) {
        const crop = CROPS[plot.cropId];
        return {
          ok: false,
          message: `Petak ini sudah ditanami ${crop ? crop.name : 'tanaman'}.`,
          sound: 'error',
          energyDelta: 0,
          goldDelta: 0,
        };
      }
      if (plot.tilled) {
        return {
          ok: false,
          message: 'Tanah ini sudah gembur. Pilih bibit di hotbar untuk menanam!',
          sound: 'error',
          energyDelta: 0,
          goldDelta: 0,
        };
      }
      plot.tilled = true;
      const energyCost = (slotItem.level || 1) > 1 ? 1 : 2;
      return {
        ok: true,
        message: 'Tanah ladang berhasil dicangkul dan siap ditanami bibit!',
        sound: 'till',
        energyDelta: -energyCost,
        goldDelta: 0,
      };
    }

    // 2. WATERING CAN — Water soil/crop or refill near water/well
    if (slotItem.id === 'watering_can') {
      const maxWater = slotItem.maxWater || 20;
      const currentWater =
        typeof slotItem.water === 'number' ? slotItem.water : maxWater;

      if (!plot && this._checkNearWater(tileX, tileY, playerState, worldHelpers)) {
        slotItem.water = maxWater;
        return {
          ok: true,
          message: `Penyiram diisi penuh dengan air segar (${maxWater}/${maxWater})!`,
          sound: 'water_refill',
          energyDelta: 0,
          goldDelta: 0,
        };
      }

      if (!plot) {
        if (currentWater < maxWater) {
          return {
            ok: false,
            message: 'Arahkan ke petak ladang untuk menyiram, atau ke air/sumur untuk mengisi ulang.',
            sound: 'error',
            energyDelta: 0,
            goldDelta: 0,
          };
        }
        return {
          ok: false,
          message: 'Gunakan penyiram di petak ladang pertanian.',
          sound: 'error',
          energyDelta: 0,
          goldDelta: 0,
        };
      }

      if (currentWater <= 0) {
        if (this._checkNearWater(tileX, tileY, playerState, worldHelpers)) {
          slotItem.water = maxWater;
          return {
            ok: true,
            message: `Penyiram diisi penuh (${maxWater}/${maxWater})!`,
            sound: 'water_refill',
            energyDelta: 0,
            goldDelta: 0,
          };
        }
        return {
          ok: false,
          message: 'Air penyiram habis! Isi ulang di dekat sumur, air mancur, sungai, atau pantai.',
          sound: 'error',
          energyDelta: 0,
          goldDelta: 0,
        };
      }

      if (plot.watered) {
        return {
          ok: false,
          message: 'Petak tanah ini sudah disiram hari ini.',
          sound: 'error',
          energyDelta: 0,
          goldDelta: 0,
        };
      }

      plot.tilled = true;
      plot.watered = true;
      slotItem.water = Math.max(0, currentWater - 1);
      const energyCost = (slotItem.level || 1) > 1 ? 1 : 2;
      const crop = plot.cropId ? CROPS[plot.cropId] : null;
      return {
        ok: true,
        message: crop
          ? `Menyiram ${crop.name} hingga segar (Air: ${slotItem.water}/${maxWater}).`
          : `Tanah ladang disiram hingga lembap (Air: ${slotItem.water}/${maxWater}).`,
        sound: 'water',
        energyDelta: -energyCost,
        goldDelta: 0,
      };
    }

    // 3. SEED — Plant seed on tilled or untilled farm plot (auto-tills for smooth gameplay)
    const cropId = slotItem.cropId || ITEMS[slotItem.id]?.cropId;
    if (slotItem.type === 'seed' || cropId) {
      const crop = CROPS[cropId];
      if (!crop) {
        return {
          ok: false,
          message: 'Bibit tidak dikenali.',
          sound: 'error',
          energyDelta: 0,
          goldDelta: 0,
        };
      }
      if (!plot) {
        return {
          ok: false,
          message: 'Bibit hanya bisa ditanam di petak ladang pertanian!',
          sound: 'error',
          energyDelta: 0,
          goldDelta: 0,
        };
      }
      if (plot.cropId) {
        const existingCrop = CROPS[plot.cropId];
        return {
          ok: false,
          message: `Petak ini sudah ditanami ${existingCrop ? existingCrop.name : 'tanaman'}!`,
          sound: 'error',
          energyDelta: 0,
          goldDelta: 0,
        };
      }

      const wasUntilled = !plot.tilled;
      plot.tilled = true;
      plot.cropId = crop.id;
      plot.stage = 0;
      plot.daysGrown = 0;
      this._consumeSlotItem(slotItem, 1, playerState);

      return {
        ok: true,
        message: wasUntilled
          ? `Mencangkul dan menanam ${crop.name}! Jangan lupa disiram agar tumbuh.`
          : `Berhasil menanam bibit ${crop.name}! Siramlah setiap hari.`,
        sound: 'plant',
        energyDelta: wasUntilled ? -2 : -1,
        goldDelta: 0,
      };
    }

    // 4. HAND — Harvest ripe stage-3 crop, collect wild forage, or pet/collect from ranch animal
    if (slotItem.id === 'hand') {
      // Check A: Ripe crop on target plot (or immediate plot under player)
      let harvestPlot = plot;
      if (!harvestPlot || !harvestPlot.cropId || harvestPlot.stage < 3) {
        // Look for any ripe crop within 1.35 tiles of target
        for (const p of this.plots) {
          if (
            p.cropId &&
            p.stage >= 3 &&
            Math.hypot(p.x - tileX, p.y - tileY) <= 1.35
          ) {
            harvestPlot = p;
            break;
          }
        }
      }

      if (harvestPlot && harvestPlot.cropId && harvestPlot.stage >= 3) {
        const crop = CROPS[harvestPlot.cropId];
        const harvestedId = crop ? crop.harvestItemId : harvestPlot.cropId;
        const added = this._giveItemToPlayer(
          harvestedId,
          1,
          playerState,
          worldHelpers
        );

        harvestPlot.cropId = null;
        harvestPlot.stage = 0;
        harvestPlot.daysGrown = 0;
        harvestPlot.watered = false;
        harvestPlot.tilled = true;

        return {
          ok: true,
          message: `Panen berhasil! Kamu mendapatkan 1 ${crop ? crop.name : 'Hasil Panen'} (Nilai jual: ${crop ? crop.sellPrice : 50}G).`,
          sound: 'harvest',
          energyDelta: -1,
          goldDelta: 0,
          itemAdded: added,
        };
      }

      // Check B: Nearby wild forage item (herb, mushroom, seashell)
      const forage =
        this.getNearbyForage(tileX, tileY, 1.9) ||
        this.getNearbyForage(px, py, 2.1);
      if (forage) {
        forage.collected = true;
        const added = this._giveItemToPlayer(
          forage.itemId,
          1,
          playerState,
          worldHelpers
        );
        const itemDef = ITEMS[forage.itemId];
        return {
          ok: true,
          message: `Memungut 1 ${forage.name} segar di ${forage.area}!`,
          sound: 'pickup',
          energyDelta: 0,
          goldDelta: 0,
          itemAdded: added,
          forageCollected: forage.id,
          sellPrice: itemDef ? itemDef.sellPrice : 40,
        };
      }

      // Check C: Nearby ranch animal (pet & collect milk, wool, egg)
      const animal =
        this.getNearbyAnimal(tileX, tileY, 2.2) ||
        this.getNearbyAnimal(px, py, 2.4);
      if (animal) {
        animal.happiness = Math.min(100, (animal.happiness || 70) + 8);
        if (animal.hasProduce) {
          animal.hasProduce = false;
          const added = this._giveItemToPlayer(
            animal.produceItemId,
            1,
            playerState,
            worldHelpers
          );
          return {
            ok: true,
            message: `${animal.name} senang dielus! Kamu memperoleh 1 ${animal.produceName}.`,
            sound: 'animal_happy',
            energyDelta: -1,
            goldDelta: 0,
            itemAdded: added,
          };
        }
        return {
          ok: true,
          message: `${animal.name} tampak gembira dielus! Beri Pakan Ternak atau tunggu esok pagi untuk hasil ternak baru.`,
          sound: 'animal_pet',
          energyDelta: 0,
          goldDelta: 0,
        };
      }

      // Check D: Inspect growing crop if player clicked on a non-ripe crop plot
      if (plot && plot.cropId) {
        const crop = CROPS[plot.cropId];
        const remaining = Math.max(1, (crop?.growthDays || 3) - plot.daysGrown);
        const waterStatus = plot.watered
          ? 'Sudah disiram hari ini'
          : 'Belum disiram hari ini';
        return {
          ok: false,
          message: `${crop ? crop.name : 'Tanaman'} sedang tumbuh (Tahap ${plot.stage}/3 • ~${remaining} hari lagi • ${waterStatus}).`,
          sound: 'inspect',
          energyDelta: 0,
          goldDelta: 0,
        };
      }

      return {
        ok: false,
        message: 'Arahkan Tangan pada tanaman matang (Tahap 3), hewan ternak, atau tanaman liar.',
        sound: 'error',
        energyDelta: 0,
        goldDelta: 0,
      };
    }

    // 5. ANIMAL FEED — Feed nearby ranch animal to make them immediately ready to produce
    if (slotItem.id === 'animal_feed') {
      const animal =
        this.getNearbyAnimal(tileX, tileY, 2.4) ||
        this.getNearbyAnimal(px, py, 2.6);
      if (!animal) {
        return {
          ok: false,
          message: 'Dekati sapi, domba, atau ayam di Peternakan Padang Hijau untuk memberi pakan.',
          sound: 'error',
          energyDelta: 0,
          goldDelta: 0,
        };
      }
      animal.fed = true;
      animal.hasProduce = true;
      animal.happiness = Math.min(100, (animal.happiness || 75) + 15);
      this._consumeSlotItem(slotItem, 1, playerState);

      return {
        ok: true,
        message: `${animal.name} makan dengan lahap! Gunakan alat Tangan untuk mengambil ${animal.produceName}.`,
        sound: 'feed',
        energyDelta: 0,
        goldDelta: 0,
      };
    }

    // 6. FISHING ROD — Catch fish near water/pier tiles
    if (slotItem.id === 'fishing_rod') {
      if (!this._checkNearWater(tileX, tileY, playerState, worldHelpers)) {
        return {
          ok: false,
          message: 'Arahkan pancingan ke air sungai, kolam, atau dermaga Pantai Selatan!',
          sound: 'error',
          energyDelta: 0,
          goldDelta: 0,
        };
      }

      const isBeach = tileY >= 45 || py >= 45;
      const rodLevel = slotItem.level || 1;
      const snapperChance = isBeach
        ? rodLevel > 1
          ? 0.72
          : 0.48
        : rodLevel > 1
          ? 0.35
          : 0.15;

      const caughtId = Math.random() < snapperChance ? 'fish_snapper' : 'fish_carp';
      const fishDef = ITEMS[caughtId];
      const added = this._giveItemToPlayer(
        caughtId,
        1,
        playerState,
        worldHelpers
      );

      return {
        ok: true,
        message: `Strike! Kamu berhasil memancing 1 ${fishDef.name} (Nilai jual: ${fishDef.sellPrice}G)!`,
        sound: 'fish_catch',
        energyDelta: -3,
        goldDelta: 0,
        itemAdded: added,
      };
    }

    // 7. FOOD / CONSUMABLE — Restore player stamina/energy
    const itemDef = ITEMS[slotItem.id];
    const restoreAmount =
      slotItem.energyRestore || (itemDef ? itemDef.energyRestore : 0);
    if (slotItem.type === 'food' || restoreAmount > 0) {
      this._consumeSlotItem(slotItem, 1, playerState);
      return {
        ok: true,
        message: `Menikmati ${slotItem.name || itemDef?.name} yang lezat (+${restoreAmount} Energi)!`,
        sound: 'eat',
        energyDelta: restoreAmount,
        goldDelta: 0,
      };
    }

    return {
      ok: false,
      message: `${slotItem.name} tidak dapat digunakan langsung di sini. Jual di Kotak Pengiriman atau berikan pada warga.`,
      sound: 'error',
      energyDelta: 0,
      goldDelta: 0,
    };
  }

  addAnimal(animalType) {
    const count = this.animals.filter((a) => a.type === animalType).length + 1;
    if (animalType === 'chicken') {
      const chickenNames = ['Ayam Mentari', 'Ayam Bintang', 'Ayam Kemuning', 'Ayam Pelangi'];
      const name = chickenNames[(count - 1) % chickenNames.length];
      const newAnimal = {
        id: `chicken_${Date.now()}_${count}`,
        name,
        type: 'chicken',
        x: 56 + (count % 6),
        y: 16 + (count % 3),
        targetX: 56 + (count % 6),
        targetY: 16 + (count % 3),
        dir: 'down',
        frame: 0,
        moveTimer: 1.5,
        fed: true,
        hasProduce: true,
        produceItemId: 'egg',
        produceName: 'Telur Ayam Kampung',
        happiness: 85,
      };
      this.animals.push(newAnimal);
      return newAnimal;
    }

    if (animalType === 'sheep') {
      const sheepNames = ['Domba Salju', 'Domba Sutera', 'Domba Embun', 'Domba Mutiara'];
      const name = sheepNames[(count - 1) % sheepNames.length];
      const newAnimal = {
        id: `sheep_${Date.now()}_${count}`,
        name,
        type: 'sheep',
        x: 58 + (count % 5),
        y: 15 + (count % 4),
        targetX: 58 + (count % 5),
        targetY: 15 + (count % 4),
        dir: 'down',
        frame: 0,
        moveTimer: 2.2,
        fed: true,
        hasProduce: true,
        produceItemId: 'wool',
        produceName: 'Wol Domba Halus',
        happiness: 85,
      };
      this.animals.push(newAnimal);
      return newAnimal;
    }

    const cowNames = ['Sapi Melati', 'Sapi Caramel', 'Sapi Bintang'];
    const name = cowNames[(count - 1) % cowNames.length];
    const newAnimal = {
      id: `cow_${Date.now()}_${count}`,
      name,
      type: 'cow',
      x: 57 + (count % 5),
      y: 14 + (count % 4),
      targetX: 57 + (count % 5),
      targetY: 14 + (count % 4),
      dir: 'down',
      frame: 0,
      moveTimer: 2.5,
      fed: true,
      hasProduce: true,
      produceItemId: 'milk',
      produceName: 'Susu Sapi Segar',
      happiness: 85,
    };
    this.animals.push(newAnimal);
    return newAnimal;
  }

  /**
   * Advances all watered crops by 1 day, resets watering flags,
   * refreshes daily animal produce, and respawns wild forage items.
   */
  advanceDay() {
    let grownCount = 0;
    let ripeCount = 0;

    for (const plot of this.plots) {
      if (plot.cropId) {
        const crop = CROPS[plot.cropId];
        if (plot.watered && crop) {
          plot.daysGrown += 1;
          const progressRatio = plot.daysGrown / crop.growthDays;
          if (plot.daysGrown >= crop.growthDays) {
            plot.stage = 3;
          } else if (progressRatio >= 0.6) {
            plot.stage = 2;
          } else {
            plot.stage = 1;
          }
          grownCount += 1;
        }
        if (plot.stage >= 3) {
          ripeCount += 1;
        }
      }
      plot.watered = false;
    }

    for (const animal of this.animals) {
      animal.hasProduce = true;
      animal.fed = true;
    }

    this._spawnDailyForage();

    return {
      grownCount,
      ripeCount,
    };
  }

  serialize() {
    return {
      plots: this.plots.map((p) => ({
        x: p.x,
        y: p.y,
        tilled: Boolean(p.tilled),
        watered: Boolean(p.watered),
        cropId: p.cropId || null,
        stage: p.stage || 0,
        daysGrown: p.daysGrown || 0,
      })),
      animals: this.animals.map((a) => ({
        id: a.id,
        name: a.name,
        type: a.type,
        x: Number(a.x.toFixed(2)),
        y: Number(a.y.toFixed(2)),
        fed: Boolean(a.fed),
        hasProduce: Boolean(a.hasProduce),
        produceItemId: a.produceItemId,
        produceName: a.produceName,
        happiness: a.happiness || 75,
      })),
      forageItems: this.forageItems.map((f) => ({
        id: f.id,
        collected: Boolean(f.collected),
      })),
    };
  }

  deserialize(data) {
    if (!data || typeof data !== 'object') return;

    if (Array.isArray(data.plots)) {
      for (const savedPlot of data.plots) {
        const plot = this.getPlot(savedPlot.x, savedPlot.y);
        if (!plot) continue;
        plot.tilled = Boolean(savedPlot.tilled);
        plot.watered = Boolean(savedPlot.watered);
        plot.cropId = savedPlot.cropId || null;
        plot.stage = Number(savedPlot.stage) || 0;
        plot.daysGrown = Number(savedPlot.daysGrown) || 0;
      }
    }

    if (Array.isArray(data.animals) && data.animals.length > 0) {
      this.animals = data.animals.map((a, idx) => ({
        id: a.id || `animal_${idx}`,
        name: a.name || 'Ternak Lembah',
        type: a.type || 'chicken',
        x: typeof a.x === 'number' ? a.x : 56,
        y: typeof a.y === 'number' ? a.y : 15,
        targetX: typeof a.x === 'number' ? a.x : 56,
        targetY: typeof a.y === 'number' ? a.y : 15,
        dir: 'down',
        frame: 0,
        moveTimer: 2.0 + (idx % 3),
        fed: a.fed !== undefined ? Boolean(a.fed) : true,
        hasProduce: a.hasProduce !== undefined ? Boolean(a.hasProduce) : true,
        produceItemId:
          a.produceItemId ||
          (a.type === 'cow' ? 'milk' : a.type === 'sheep' ? 'wool' : 'egg'),
        produceName:
          a.produceName ||
          (a.type === 'cow'
            ? 'Susu Sapi Segar'
            : a.type === 'sheep'
              ? 'Wol Domba Halus'
              : 'Telur Ayam Kampung'),
        happiness: typeof a.happiness === 'number' ? a.happiness : 75,
      }));
    }

    if (Array.isArray(data.forageItems)) {
      for (const savedForage of data.forageItems) {
        const found = this.forageItems.find((f) => f.id === savedForage.id);
        if (found) {
          found.collected = Boolean(savedForage.collected);
        }
      }
    }
  }
}
