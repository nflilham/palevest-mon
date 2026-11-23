// src/game/worldMap.js
// World Layout, Zones, 9 Village Buildings, Road Network & 130+ Decorative Props for Palevest Mon

export const MAP_COLS = 72;
export const MAP_ROWS = 56;

export const TILES = {
  GRASS: 0,
  FLOWER_GRASS: 1,
  PATH: 2,
  STONE_PLAZA: 3,
  DIRT_FARM: 4,
  WATER: 5,
  SAND: 6,
  WOOD_BRIDGE: 7,
  PIER_WOOD: 8,
  DARK_GRASS: 9
};

const ZONE_LIST = [
  { id: 'homestead', name: 'Kebun & Rumah Lembah', label: 'Kebun & Rumah Lembah', x1: 3, y1: 3, x2: 24, y2: 22 },
  { id: 'town_square', name: 'Alun-Alun Pusat Desa', label: 'Alun-Alun Pusat Desa', x1: 25, y1: 5, x2: 45, y2: 36 },
  { id: 'market_row', name: 'Distrik Pertokoan Timur', label: 'Distrik Pertokoan Timur', x1: 43, y1: 15, x2: 56, y2: 36 },
  { id: 'meadow_ranch', name: 'Peternakan Padang Hijau', label: 'Peternakan Padang Hijau', x1: 48, y1: 3, x2: 69, y2: 23 },
  { id: 'whispering_woods', name: 'Hutan Rindang & Sungai', label: 'Hutan Rindang & Sungai', x1: 3, y1: 23, x2: 26, y2: 43 },
  { id: 'sunny_beach', name: 'Pantai Cerah & Dermaga', label: 'Pantai Cerah & Dermaga', x1: 3, y1: 43, x2: 69, y2: 54 }
];

// Support both array iteration (for..of, .find, .map) and direct keyed lookup (ZONES.homestead)
for (const z of ZONE_LIST) {
  Object.defineProperty(ZONE_LIST, z.id, { value: z, enumerable: false });
}
export const ZONES = ZONE_LIST;

export const BUILDINGS = [
  {
    id: 'player_house',
    name: 'Rumah Kebun Pemain',
    ownerId: 'player',
    roleLabel: 'Rumahmu',
    tileX: 8,
    tileY: 5,
    widthTiles: 5,
    heightTiles: 4,
    doorX: 10,
    doorY: 9,
    roofColor: '#b85d3b',
    wallColor: '#f3e5ab',
    signIcon: 'home',
    actionType: 'sleep',
    description: 'Tempat beristirahat dan menyimpan buku harian kebun.'
  },
  {
    id: 'town_hall',
    name: 'Balai Desa Palevest',
    ownerId: 'mayor_bram',
    roleLabel: 'Mayor Bram (Kepala Desa)',
    tileX: 32,
    tileY: 6,
    widthTiles: 6,
    heightTiles: 4,
    doorX: 35,
    doorY: 10,
    roofColor: '#3b5998',
    wallColor: '#e8dfd1',
    signIcon: 'crown',
    actionType: 'npc',
    npcId: 'mayor_bram',
    description: 'Pusat administrasi desa dan papan misi harian Mayor Bram.'
  },
  {
    id: 'seed_shop',
    name: 'Toko Bibit Hijau Daun',
    ownerId: 'hana',
    roleLabel: 'Hana (Botanis & Bibit)',
    tileX: 20,
    tileY: 16,
    widthTiles: 5,
    heightTiles: 4,
    doorX: 22,
    doorY: 20,
    roofColor: '#4a8f47',
    wallColor: '#f5ebd6',
    signIcon: 'seed',
    actionType: 'npc',
    npcId: 'hana',
    description: 'Menyediakan bibit unggul musiman dan membeli hasil panen.'
  },
  {
    id: 'blacksmith',
    name: 'Bengkel Tempa Besi',
    ownerId: 'garrick',
    roleLabel: 'Garrick (Pandai Besi)',
    tileX: 46,
    tileY: 16,
    widthTiles: 5,
    heightTiles: 4,
    doorX: 48,
    doorY: 20,
    roofColor: '#5c5346',
    wallColor: '#d9cfc1',
    signIcon: 'anvil',
    actionType: 'npc',
    npcId: 'garrick',
    description: 'Tempat menempa dan meng-upgrade alat pertanian.'
  },
  {
    id: 'ranch_barn',
    name: 'Peternakan Padang Hijau',
    ownerId: 'pak_darto',
    roleLabel: 'Pak Darto (Peternak)',
    tileX: 55,
    tileY: 6,
    widthTiles: 6,
    heightTiles: 4,
    doorX: 58,
    doorY: 10,
    roofColor: '#a8383b',
    wallColor: '#f0dec2',
    signIcon: 'barn',
    actionType: 'npc',
    npcId: 'pak_darto',
    description: 'Kandang sapi, domba, dan ayam serta toko pakan ternak.'
  },
  {
    id: 'bakery_cafe',
    name: 'Kedai Hangat & Roti',
    ownerId: 'chef_liora',
    roleLabel: 'Chef Liora (Koki & Baker)',
    tileX: 27,
    tileY: 27,
    widthTiles: 5,
    heightTiles: 4,
    doorX: 29,
    doorY: 31,
    roofColor: '#c96a4b',
    wallColor: '#fff3e0',
    signIcon: 'bread',
    actionType: 'npc',
    npcId: 'chef_liora',
    description: 'Aroma roti madu hangat dan teh herbal pemulih stamina.'
  },
  {
    id: 'herbal_clinic',
    name: 'Klinik Herbal Lembah',
    ownerId: 'dr_elian',
    roleLabel: 'Dr. Elian (Tabib Desa)',
    tileX: 13,
    tileY: 26,
    widthTiles: 5,
    heightTiles: 4,
    doorX: 15,
    doorY: 30,
    roofColor: '#3d8b85',
    wallColor: '#eef7f5',
    signIcon: 'cross',
    actionType: 'npc',
    npcId: 'dr_elian',
    description: 'Klinik kesehatan dan apotek ramuan herbal alami.'
  },
  {
    id: 'wood_library',
    name: 'Studio Kayu & Pustaka',
    ownerId: 'nadia',
    roleLabel: 'Nadia (Pengrajin & Pustakawan)',
    tileX: 44,
    tileY: 27,
    widthTiles: 5,
    heightTiles: 4,
    doorX: 46,
    doorY: 31,
    roofColor: '#7a5285',
    wallColor: '#f3eaf7',
    signIcon: 'book',
    actionType: 'npc',
    npcId: 'nadia',
    description: 'Perpustakaan sejarah desa dan bengkel kriya kayu.'
  },
  {
    id: 'fisher_shack',
    name: 'Pondok Pancing Dermaga',
    ownerId: 'kapten_tio',
    roleLabel: 'Kapten Tio (Nelayan)',
    tileX: 38,
    tileY: 43,
    widthTiles: 4,
    heightTiles: 3,
    doorX: 40,
    doorY: 46,
    roofColor: '#2e6f95',
    wallColor: '#e3eff7',
    signIcon: 'fish',
    actionType: 'npc',
    npcId: 'kapten_tio',
    description: 'Pondok nelayan di tepi pantai dan tempat jual beli ikan.'
  }
];

export const FARM_PLOT_BOUNDS = { startX: 8, startY: 13, cols: 8, rows: 5 };
export const SHIPPING_BIN = { tileX: 15, tileY: 9, name: 'Kotak Pengiriman Panen' };
export const WELL_POS = { tileX: 17, tileY: 13, name: 'Sumur Air Kebun' };
export const FOUNTAIN_POS = { tileX: 34, tileY: 20, width: 3, height: 3, name: 'Air Mancur Alun-Alun' };
export const QUEST_BOARD_POS = { tileX: 31, tileY: 11, name: 'Papan Pengumuman Desa' };
export const FISHING_SPOTS = [
  { tileX: 35, tileY: 51, name: 'Dermaga Pantai Selatan' },
  { tileX: 23, tileY: 38, name: 'Tepi Sungai Hutan' }
];

function fillRect(grid, x1, y1, x2, y2, tileType) {
  const minX = Math.max(0, Math.min(x1, x2));
  const maxX = Math.min(MAP_COLS - 1, Math.max(x1, x2));
  const minY = Math.max(0, Math.min(y1, y2));
  const maxY = Math.min(MAP_ROWS - 1, Math.max(y1, y2));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      grid[y][x] = tileType;
    }
  }
}

export function createWorldMap() {
  // 1. Initialize 56 x 72 grid with lush GRASS and natural FLOWER_GRASS patches
  const grid = Array.from({ length: MAP_ROWS }, (_, y) =>
    Array.from({ length: MAP_COLS }, (__, x) => ((x * 13 + y * 7) % 11 === 0 ? TILES.FLOWER_GRASS : TILES.GRASS))
  );

  // 2. Whispering Woods forest floor (DARK_GRASS)
  fillRect(grid, 3, 24, 25, 42, TILES.DARK_GRASS);
  for (let y = 25; y <= 41; y += 3) {
    for (let x = 5; x <= 23; x += 4) {
      grid[y][x] = TILES.FLOWER_GRASS;
    }
  }

  // 3. Sunny Beach (SAND) and Southern Ocean (WATER)
  fillRect(grid, 0, 43, MAP_COLS - 1, 47, TILES.SAND);
  fillRect(grid, 0, 48, MAP_COLS - 1, MAP_ROWS - 1, TILES.WATER);

  // 4. Forest River flowing through Whispering Woods into the Southern Ocean
  fillRect(grid, 21, 24, 22, 28, TILES.WATER);
  fillRect(grid, 21, 29, 24, 30, TILES.WATER);
  fillRect(grid, 23, 30, 24, 48, TILES.WATER);

  // 5. Town Square Central Stone Plaza
  fillRect(grid, 30, 10, 40, 26, TILES.STONE_PLAZA);

  // 6. Homestead Farm Dirt Margin & Tilled Area
  fillRect(
    grid,
    FARM_PLOT_BOUNDS.startX - 1,
    FARM_PLOT_BOUNDS.startY - 1,
    FARM_PLOT_BOUNDS.startX + FARM_PLOT_BOUNDS.cols,
    FARM_PLOT_BOUNDS.startY + FARM_PLOT_BOUNDS.rows,
    TILES.DIRT_FARM
  );

  // 7. Ranch Pasture Meadow Flowers
  for (let y = 13; y <= 20; y += 2) {
    for (let x = 54; x <= 64; x += 3) {
      grid[y][x] = TILES.FLOWER_GRASS;
    }
  }

  // 8. Cobblestone Village Roads (TILES.PATH) connecting all 9 buildings and zones
  // Northern Highway: Player House (10,9) -> Town Hall (35,10) -> Ranch Barn (58,10)
  fillRect(grid, 9, 10, 59, 11, TILES.PATH);
  fillRect(grid, 10, 9, 11, 10, TILES.PATH);

  // Homestead East Connector: passes Farm Plot & Well to Seed Shop (22,20) -> Town Square
  fillRect(grid, 18, 10, 19, 21, TILES.PATH);
  fillRect(grid, 18, 20, 30, 21, TILES.PATH);

  // Central Avenue: Town Hall (35,10) -> Fountain Plaza -> Southern Beach Pier (35,47)
  fillRect(grid, 34, 26, 36, 47, TILES.PATH);

  // Market Row & East Connector: Plaza -> Blacksmith (48,20) -> Ranch Road
  fillRect(grid, 40, 20, 52, 21, TILES.PATH);
  fillRect(grid, 51, 10, 52, 21, TILES.PATH);

  // Southern Cultural & Woods Avenue: Herbal Clinic (15,30) -> Bakery Cafe (29,31) -> Wood Library (46,31)
  fillRect(grid, 14, 31, 48, 32, TILES.PATH);
  fillRect(grid, 15, 30, 16, 31, TILES.PATH);

  // Woods Trail from Homestead & Clinic to River Fishing Spot (23,38)
  fillRect(grid, 15, 32, 16, 38, TILES.PATH);
  fillRect(grid, 15, 37, 22, 38, TILES.PATH);

  // Beach Walk connecting Central Avenue to Fisher Shack (40,46)
  fillRect(grid, 34, 46, 41, 47, TILES.PATH);

  // 9. Wooden Bridges across the Forest River & Southern Pier into Ocean
  fillRect(grid, 21, 31, 24, 32, TILES.WOOD_BRIDGE);
  fillRect(grid, 23, 45, 24, 46, TILES.WOOD_BRIDGE);
  fillRect(grid, 34, 48, 36, 52, TILES.PIER_WOOD);

  // 10. Populate 130+ Rich Decorative Props (ensuring doors, roads, bridges, and farm plots stay 100% clear)
  const props = [];
  const propLookup = new Map();

  const buildingOccupied = new Set();
  const doorProtected = new Set();
  for (const b of BUILDINGS) {
    for (let by = b.tileY; by < b.tileY + b.heightTiles; by++) {
      for (let bx = b.tileX; bx < b.tileX + b.widthTiles; bx++) {
        buildingOccupied.add(`${bx},${by}`);
      }
    }
    for (let dy = b.doorY - 1; dy <= b.doorY + 2; dy++) {
      for (let dx = b.doorX - 1; dx <= b.doorX + 1; dx++) {
        doorProtected.add(`${dx},${dy}`);
      }
    }
  }

  const isFarmTile = (tx, ty) =>
    tx >= FARM_PLOT_BOUNDS.startX - 1 &&
    tx <= FARM_PLOT_BOUNDS.startX + FARM_PLOT_BOUNDS.cols &&
    ty >= FARM_PLOT_BOUNDS.startY - 1 &&
    ty <= FARM_PLOT_BOUNDS.startY + FARM_PLOT_BOUNDS.rows;

  const isFountainTile = (tx, ty) =>
    tx >= FOUNTAIN_POS.tileX &&
    tx < FOUNTAIN_POS.tileX + FOUNTAIN_POS.width &&
    ty >= FOUNTAIN_POS.tileY &&
    ty < FOUNTAIN_POS.tileY + FOUNTAIN_POS.height;

  const addProp = (type, tileX, tileY, extra = {}) => {
    if (tileX < 0 || tileX >= MAP_COLS || tileY < 0 || tileY >= MAP_ROWS) return false;
    const key = `${tileX},${tileY}`;
    if (propLookup.has(key)) return false;

    if (!extra.force) {
      if (buildingOccupied.has(key) || doorProtected.has(key)) return false;
      if (isFarmTile(tileX, tileY) || isFountainTile(tileX, tileY)) return false;
      const t = grid[tileY][tileX];
      if (t === TILES.PATH || t === TILES.WOOD_BRIDGE || t === TILES.PIER_WOOD) return false;
      if (t === TILES.WATER && type !== 'boat') return false;
    }

    const item = {
      type,
      tileX,
      tileY,
      solid: extra.solid !== undefined ? extra.solid : type !== 'flower_bed',
      ...extra
    };
    props.push(item);
    propLookup.set(key, item);
    return true;
  };

  // Essential Interactive Landmarks
  addProp('shipping_bin', SHIPPING_BIN.tileX, SHIPPING_BIN.tileY, {
    id: 'shipping_bin',
    name: SHIPPING_BIN.name,
    force: true
  });
  addProp('well', WELL_POS.tileX, WELL_POS.tileY, {
    id: 'well',
    name: WELL_POS.name,
    force: true
  });
  addProp('quest_board', QUEST_BOARD_POS.tileX, QUEST_BOARD_POS.tileY, {
    id: 'quest_board',
    name: QUEST_BOARD_POS.name,
    force: true
  });
  addProp('fountain', FOUNTAIN_POS.tileX, FOUNTAIN_POS.tileY, {
    id: 'fountain',
    name: FOUNTAIN_POS.name,
    width: FOUNTAIN_POS.width,
    height: FOUNTAIN_POS.height,
    force: true
  });

  // Blacksmith Anvil, Barrels & Crates
  addProp('anvil', 45, 20, { id: 'blacksmith_anvil', name: 'Paron Tempa Garrick', force: true });
  addProp('barrel', 51, 18);
  addProp('crate', 51, 19);

  // Ranch Windmill & Fenced Pasture
  addProp('windmill', 63, 7, { id: 'ranch_windmill', name: 'Kincir Angin Padang Hijau', force: true });
  for (let fx = 53; fx <= 65; fx++) {
    if (fx !== 58 && fx !== 59) addProp('fence_h', fx, 12);
    addProp('fence_h', fx, 21);
  }
  for (let fy = 13; fy <= 20; fy++) {
    addProp('fence_v', 53, fy);
    addProp('fence_v', 65, fy);
  }

  // Homestead Wooden Fences framing the farm
  for (let fx = 6; fx <= 16; fx++) {
    addProp('fence_h', fx, 4);
    if (fx !== 10 && fx !== 11) addProp('fence_h', fx, 19);
  }
  for (let fy = 5; fy <= 18; fy++) {
    addProp('fence_v', 6, fy);
  }

  // Town Square Benches, Street Lamps & Cherry Blossom Trees
  addProp('bench', 34, 18, { name: 'Bangku Taman Alun-Alun', force: true });
  addProp('bench', 36, 18, { name: 'Bangku Taman Alun-Alun', force: true });
  addProp('bench', 34, 24, { name: 'Bangku Taman Alun-Alun', force: true });
  addProp('bench', 36, 24, { name: 'Bangku Taman Alun-Alun', force: true });

  addProp('cherry_tree', 30, 13, { force: true });
  addProp('cherry_tree', 40, 13, { force: true });
  addProp('cherry_tree', 30, 25, { force: true });
  addProp('cherry_tree', 40, 25, { force: true });

  // Warm Street Lamps lighting village roads & plaza
  const lampCoords = [
    [12, 9], [17, 9], [25, 9], [31, 9], [39, 9], [46, 9], [54, 9],
    [29, 19], [41, 19], [33, 28], [37, 28], [26, 30], [43, 30],
    [17, 30], [33, 38], [37, 38], [33, 45], [37, 45]
  ];
  for (const [lx, ly] of lampCoords) {
    addProp('street_lamp', lx, ly);
  }

  // Flower Beds adorning cottages and shops
  const flowerBedCoords = [
    [8, 9], [12, 9], [32, 10], [37, 10], [20, 20], [24, 20],
    [27, 31], [31, 31], [44, 31], [48, 31], [13, 30], [17, 30],
    [55, 10], [60, 10]
  ];
  for (const [bx, by] of flowerBedCoords) {
    addProp('flower_bed', bx, by, { solid: false, force: true });
  }

  // Whispering Woods Trees, Rocks & Bushes
  const woodsPlacements = [
    ['pine_tree', 5, 25], ['oak_tree', 8, 25], ['pine_tree', 11, 25], ['oak_tree', 19, 25],
    ['pine_tree', 4, 28], ['oak_tree', 7, 29], ['bush', 10, 28], ['pine_tree', 19, 28],
    ['oak_tree', 5, 33], ['pine_tree', 9, 34], ['rock', 12, 34], ['bush', 18, 34],
    ['pine_tree', 4, 37], ['oak_tree', 8, 38], ['pine_tree', 11, 39], ['rock', 14, 40],
    ['oak_tree', 6, 41], ['bush', 10, 41], ['pine_tree', 18, 40], ['oak_tree', 25, 35],
    ['pine_tree', 26, 38], ['rock', 20, 35], ['bush', 19, 39]
  ];
  for (const [type, wx, wy] of woodsPlacements) {
    addProp(type, wx, wy);
  }

  // Sunny Beach Palm Trees, Crates, Barrels & Moored Boats
  const palmCoords = [
    [6, 44], [11, 45], [16, 44], [21, 44], [28, 45], [31, 44],
    [44, 44], [49, 45], [54, 44], [60, 45], [65, 44]
  ];
  for (const [px, py] of palmCoords) {
    addProp('palm_tree', px, py);
  }
  addProp('boat', 32, 50, { name: 'Perahu Nelayan Lembah', force: true });
  addProp('boat', 38, 50, { name: 'Perahu Layar Kapten Tio', force: true });
  addProp('barrel', 37, 45);
  addProp('crate', 42, 45);

  // Perimeter Forest Belt around North, West, and East Valley Borders
  for (let x = 1; x < MAP_COLS - 1; x += 2) {
    addProp(x % 4 === 0 ? 'oak_tree' : 'pine_tree', x, 1);
    if (x < 30 || x > 42) {
      addProp(x % 6 === 0 ? 'bush' : 'oak_tree', x, 2);
    }
  }
  for (let y = 3; y < 42; y += 2) {
    addProp(y % 4 === 0 ? 'pine_tree' : 'oak_tree', 1, y);
    addProp(y % 6 === 0 ? 'bush' : 'pine_tree', 2, y);
    addProp(y % 4 === 0 ? 'oak_tree' : 'pine_tree', MAP_COLS - 2, y);
    addProp(y % 6 === 0 ? 'bush' : 'oak_tree', MAP_COLS - 3, y);
  }

  // Additional Scenic Village Trees & Rocks between zones
  const scenicCoords = [
    ['oak_tree', 26, 6], ['cherry_tree', 28, 7], ['oak_tree', 43, 6], ['pine_tree', 49, 6],
    ['oak_tree', 67, 8], ['pine_tree', 67, 14], ['oak_tree', 58, 25], ['pine_tree', 62, 27],
    ['oak_tree', 56, 32], ['bush', 54, 28], ['rock', 61, 31], ['cherry_tree', 27, 15],
    ['oak_tree', 43, 14], ['bush', 26, 22], ['oak_tree', 52, 35], ['pine_tree', 58, 37]
  ];
  for (const [type, sx, sy] of scenicCoords) {
    addProp(type, sx, sy);
  }

  function isWalkable(tx, ty) {
    if (tx < 1 || tx >= MAP_COLS - 1 || ty < 1 || ty >= MAP_ROWS - 1) return false;
    const tile = grid[ty]?.[tx];
    if (tile === undefined || tile === TILES.WATER) return false;

    // Building footprints are solid (doors sit at tileY + heightTiles and remain walkable)
    if (buildingOccupied.has(`${tx},${ty}`)) return false;

    // 3x3 Town Square Fountain footprint
    if (isFountainTile(tx, ty)) return false;

    const prop = propLookup.get(`${tx},${ty}`);
    if (prop && prop.solid !== false) return false;

    return true;
  }

  function getZoneAt(tx, ty) {
    for (const z of ZONE_LIST) {
      if (tx >= z.x1 && tx <= z.x2 && ty >= z.y1 && ty <= z.y2) {
        return z;
      }
    }
    return {
      id: 'palevest_valley',
      name: 'Lembah Palevest',
      label: 'Lembah Palevest',
      x1: 0,
      y1: 0,
      x2: MAP_COLS - 1,
      y2: MAP_ROWS - 1
    };
  }

  function getInteractableAt(tx, ty) {
    if (tx < 0 || tx >= MAP_COLS || ty < 0 || ty >= MAP_ROWS) return null;

    // 1. Building Doors & Front Facades
    for (const b of BUILDINGS) {
      const isDoor =
        (tx === b.doorX && (ty === b.doorY || ty === b.doorY - 1)) ||
        (tx >= b.tileX && tx < b.tileX + b.widthTiles && ty >= b.tileY && ty < b.tileY + b.heightTiles);
      if (isDoor) {
        return {
          type: 'building',
          id: b.id,
          buildingId: b.id,
          building: b,
          name: b.name,
          roleLabel: b.roleLabel,
          actionType: b.actionType,
          npcId: b.npcId,
          description: b.description,
          tileX: b.doorX,
          tileY: b.doorY
        };
      }
    }

    // 2. Shipping Bin
    if (tx === SHIPPING_BIN.tileX && ty === SHIPPING_BIN.tileY) {
      return {
        type: 'shipping_bin',
        id: 'shipping_bin',
        name: SHIPPING_BIN.name,
        tileX: SHIPPING_BIN.tileX,
        tileY: SHIPPING_BIN.tileY,
        description: 'Kirim hasil panen, produk ternak, dan ikan untuk mendapatkan Gold.'
      };
    }

    // 3. Water Well
    if (tx === WELL_POS.tileX && ty === WELL_POS.tileY) {
      return {
        type: 'well',
        id: 'well',
        name: WELL_POS.name,
        tileX: WELL_POS.tileX,
        tileY: WELL_POS.tileY,
        description: 'Isi ulang gembor air untuk menyiram tanaman di kebun.'
      };
    }

    // 4. Quest Board
    if (tx === QUEST_BOARD_POS.tileX && ty === QUEST_BOARD_POS.tileY) {
      return {
        type: 'quest_board',
        id: 'quest_board',
        name: QUEST_BOARD_POS.name,
        tileX: QUEST_BOARD_POS.tileX,
        tileY: QUEST_BOARD_POS.tileY,
        description: 'Lihat permintaan warga dan misi harian Desa Palevest.'
      };
    }

    // 5. Town Square Fountain
    if (isFountainTile(tx, ty)) {
      return {
        type: 'fountain',
        id: 'fountain',
        name: FOUNTAIN_POS.name,
        tileX: FOUNTAIN_POS.tileX + 1,
        tileY: FOUNTAIN_POS.tileY + 1,
        description: 'Air mancur batu di jantung Alun-Alun Palevest.'
      };
    }

    // 6. Fishing Spots
    for (const spot of FISHING_SPOTS) {
      if (Math.abs(tx - spot.tileX) <= 1 && Math.abs(ty - spot.tileY) <= 1) {
        return {
          type: 'fishing_spot',
          id: 'fishing_spot',
          name: spot.name,
          tileX: spot.tileX,
          tileY: spot.tileY,
          description: 'Gunakan pancingan di tepi air untuk menangkap ikan segar.'
        };
      }
    }

    // 7. Homestead Farm Plots (8x5 grid)
    if (
      tx >= FARM_PLOT_BOUNDS.startX &&
      tx < FARM_PLOT_BOUNDS.startX + FARM_PLOT_BOUNDS.cols &&
      ty >= FARM_PLOT_BOUNDS.startY &&
      ty < FARM_PLOT_BOUNDS.startY + FARM_PLOT_BOUNDS.rows
    ) {
      return {
        type: 'farm_plot',
        id: `plot_${tx}_${ty}`,
        name: 'Petak Kebun Subur',
        tileX: tx,
        tileY: ty,
        col: tx - FARM_PLOT_BOUNDS.startX,
        row: ty - FARM_PLOT_BOUNDS.startY,
        plotIndex: (ty - FARM_PLOT_BOUNDS.startY) * FARM_PLOT_BOUNDS.cols + (tx - FARM_PLOT_BOUNDS.startX)
      };
    }

    // 8. Named Interactive Props (Anvil, Windmill, Benches, Boats)
    const prop = propLookup.get(`${tx},${ty}`);
    if (prop && prop.name) {
      return {
        type: prop.type,
        id: prop.id || prop.type,
        name: prop.name,
        tileX: tx,
        tileY: ty,
        prop
      };
    }

    return null;
  }

  return {
    grid,
    props,
    buildings: BUILDINGS,
    zones: ZONES,
    isWalkable,
    getZoneAt,
    getInteractableAt
  };
}
