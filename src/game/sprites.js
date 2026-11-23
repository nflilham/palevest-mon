// src/game/sprites.js
// True 16x16 per-pixel bitmap sprite engine (upscaled 3x to 48x48) for Palevest Mon

export const TILE_SIZE = 48;
const P = 3; // 16x16 native pixel grid -> 48x48 screen pixels

const CHARACTER_CONFIGS = {
  player: {
    skin: '#f6c9a0',
    skinShadow: '#d9a377',
    eyes: '#2b241f',
    hair: '#6b4423',
    hatType: 'straw',
    hatMain: '#e6c265',
    hatBand: '#c94038',
    shirt: '#f2efe9',
    overall: '#3a6ea5',
    scarf: '#c94038',
    pants: '#2c5480',
    shoes: '#593a22',
    bgPrimary: '#e3f0d8',
    bgBorder: '#5a8f49'
  },
  mayor_bram: {
    skin: '#f2c094',
    skinShadow: '#d19b6f',
    eyes: '#241f1c',
    hair: '#b8b5b0',
    mustache: '#e6e3de',
    hatType: 'tophat',
    hatMain: '#2d2b33',
    hatBand: '#d9a74a',
    shirt: '#784c32',
    overall: '#5c3824',
    scarf: '#d9a74a',
    pants: '#3d281c',
    shoes: '#241a14',
    bgPrimary: '#e3e8f5',
    bgBorder: '#3b5998'
  },
  hana: {
    skin: '#f9d2ad',
    skinShadow: '#dba981',
    eyes: '#2d4a28',
    hair: '#8c4b2b',
    hatType: 'flower_crown',
    hatMain: '#63a84f',
    hatBand: '#f28599',
    shirt: '#a8d88e',
    overall: '#4a8f47',
    scarf: '#f5d76e',
    pants: '#3e733b',
    shoes: '#63432b',
    bgPrimary: '#e4f5dc',
    bgBorder: '#4a8f47'
  },
  garrick: {
    skin: '#e0a579',
    skinShadow: '#ba8057',
    eyes: '#241c18',
    hair: '#3b2b23',
    beard: '#3b2b23',
    hatType: 'bandana',
    hatMain: '#b84230',
    hatBand: '#e07a3c',
    shirt: '#8c7e73',
    overall: '#453c35',
    scarf: '#6e5f53',
    pants: '#362f29',
    shoes: '#211c18',
    bgPrimary: '#eae4dc',
    bgBorder: '#5c5346'
  },
  pak_darto: {
    skin: '#e8b384',
    skinShadow: '#c48e60',
    eyes: '#292018',
    hair: '#543c28',
    mustache: '#543c28',
    hatType: 'cowboy',
    hatMain: '#9e6637',
    hatBand: '#593315',
    shirt: '#d15a47',
    overall: '#8f5932',
    scarf: '#e6c265',
    pants: '#4a5d73',
    shoes: '#4f311c',
    bgPrimary: '#f7e5df',
    bgBorder: '#a8383b'
  },
  kapten_tio: {
    skin: '#e6b186',
    skinShadow: '#c28c63',
    eyes: '#1e2f3d',
    hair: '#e8edf2',
    beard: '#e8edf2',
    hatType: 'captain',
    hatMain: '#f2f6fa',
    hatBand: '#23496d',
    shirt: '#2e6f95',
    overall: '#1f4e6b',
    scarf: '#e6b84d',
    pants: '#1a3d54',
    shoes: '#24292e',
    bgPrimary: '#ddeef7',
    bgBorder: '#2e6f95'
  },
  chef_liora: {
    skin: '#f7ceb0',
    skinShadow: '#d6a685',
    eyes: '#38251c',
    hair: '#a64b2a',
    hatType: 'chef',
    hatMain: '#ffffff',
    hatBand: '#e0d6c8',
    shirt: '#fff5e6',
    overall: '#c9594b',
    scarf: '#e88b6b',
    pants: '#6b473b',
    shoes: '#4a2e25',
    bgPrimary: '#fcebe3',
    bgBorder: '#c96a4b'
  },
  dr_elian: {
    skin: '#f5cfb3',
    skinShadow: '#d4a88a',
    eyes: '#1f3b38',
    hair: '#596e6b',
    glasses: '#55b8b0',
    hatType: 'none',
    hatMain: '#596e6b',
    hatBand: '#3d8b85',
    shirt: '#eef7f5',
    overall: '#3d8b85',
    scarf: '#78c2ad',
    pants: '#325956',
    shoes: '#2b3d3b',
    bgPrimary: '#dff2ef',
    bgBorder: '#3d8b85'
  },
  nadia: {
    skin: '#f3c6a5',
    skinShadow: '#cfa07e',
    eyes: '#332038',
    hair: '#42284a',
    glasses: '#d499b9',
    hatType: 'beret',
    hatMain: '#7a5285',
    hatBand: '#54355c',
    shirt: '#ebd8f2',
    overall: '#684373',
    scarf: '#d991ba',
    pants: '#45304d',
    shoes: '#302036',
    bgPrimary: '#efe3f5',
    bgBorder: '#7a5285'
  }
};

function px(ctx, baseX, baseY, gx, gy, gw, gh, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(baseX + gx * P), Math.floor(baseY + gy * P), Math.ceil(gw * P), Math.ceil(gh * P));
}

// Renders a 16x16 ASCII pixel matrix where each character maps to a palette hex color
function drawMatrix16(ctx, baseX, baseY, rows, palette, scale = P) {
  for (let gy = 0; gy < rows.length; gy++) {
    const row = rows[gy];
    for (let gx = 0; gx < row.length; gx++) {
      const ch = row[gx];
      if (ch === '.' || ch === ' ') continue;
      const color = palette[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(Math.floor(baseX + gx * scale), Math.floor(baseY + gy * scale), scale, scale);
    }
  }
}

function shadeColor(hex, percent) {
  const cleaned = hex.replace('#', '');
  const num = parseInt(cleaned, 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent));
  const b = Math.min(255, Math.max(0, (num & 0xff) + percent));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// 16x16 Pixel Art Matrices for detailed village props & crops
const BUSH_16 = [
  '....oooooooo....',
  '..ooGGGGGGGGoo..',
  '.oGGLLLLLLLLGGo.',
  '.oGLLhhhhLLGGGGo',
  'oGGLhhLLhLLrRGGo',
  'oGLLLLLLLLrrGGG.',
  'oGGLLGGGGLLLLGGo',
  'oGGGGrRGGLLhLGGo',
  'oGGGGrrGGGLLLGGo',
  'oDGGGGGGGGGGGGDo',
  'oDDGGGGrrGGGGDDo',
  '.oDDGGGrrGGGDDo.',
  '.ooDDDDDDDDDDoo.',
  '..oooooooooooo..',
  '...ssssssssss...',
  '................'
];

const OAK_TREE_16 = [
  '....oooooooo....',
  '..ooGGGGGGGGoo..',
  '.oGGLLLLLLLLGGo.',
  'oGGLhhhhhLLGGGGo',
  'oGLLhhLLLLLLGGGo',
  'oGLLLLGGGLLLLGGo',
  'oGGLLGGGGGLLGGDo',
  'oDGGGGGGGGGGGDDo',
  '.oDDGGGGGGGGDDo.',
  '..ooDDDDDDDDoo..',
  '....ooTTTTTo....',
  '.....oTttTDo....',
  '.....oTttTDo....',
  '....ooTttTDoo...',
  '...sssoooooosss.',
  '................'
];

const PINE_TREE_16 = [
  '.......oo.......',
  '......oLLo......',
  '.....oGLLGo.....',
  '....oGGLLGGo....',
  '....oDDDDDDo....',
  '...oGGGLLGGGo...',
  '..oGGLLLLLLGGo..',
  '..oDDDDDDDDDDo..',
  '.oGGGGLLLLGGGGo.',
  'oGGGLLLLLLLLGGGo',
  'oDDDDDDDDDDDDDDo',
  '.oooooooooooooo.',
  '......oTTo......',
  '......oTDo......',
  '....sssoosss....',
  '................'
];

const ROCK_16 = [
  '................',
  '................',
  '................',
  '.....ooooooo....',
  '...ooLLLLLLLoo..',
  '..oLLhhhhhLLMMo.',
  '.oLLhhLLLLLMMMDo',
  '.oLLLLMMMMMMMDDo',
  'oLMMMMMMMMMMDDDo',
  'oMMMMDDDDDDDDDDo',
  'oDDDDDDDDDDDDDDo',
  '.oooooooooooooo.',
  '..ssssssssssss..',
  '................',
  '................',
  '................'
];

const CROP_MATRICES = {
  turnip: [
    '.....oo..oo.....',
    '....oLLooLLo....',
    '...oGLLGGLLGo...',
    '...oGGGLLGGGo...',
    '....oooGGooo....',
    '....oPPPPPPo....',
    '...oPPhhhPPPo...',
    '..oPPPhWWWWWPo..',
    '..oWWWWWWWWWVo..',
    '..oWWWWWWWWWVo..',
    '...oWWWWWWWVo...',
    '....oWWWWWVo....',
    '.....oWWWVo.....',
    '......oWVo......',
    '.......oo.......',
    '................'
  ],
  strawberry: [
    '....oooooooo....',
    '..ooGGGGGGGGoo..',
    '.oGGLLLLLLLLGGo.',
    '.oGLLGGGGGGLLGo.',
    'oGGGoRRRRoGGGGGo',
    'oGGoRRhYRRoGGGGo',
    'oGGoRRRRRRoRRGGo',
    'oGGGoRRRRoRhhRGo',
    '.oGGGoRRoRRRRGo.',
    '.oDGGGoovRRRGo..',
    '..oDGGGGvRRGo...',
    '...ooooooooo....',
    '................',
    '................',
    '................',
    '................'
  ],
  corn: [
    '......oooo......',
    '.....oYYYYo.....',
    '....oYYhhYYo....',
    '....oYYhYYDo....',
    '...ooYYhYYDoo...',
    '..oGLYYYYYYLGo..',
    '..oGLLYYYYLLGo..',
    '..oGGLLYYLLGGo..',
    '...oGGLYYLGGo...',
    '...oGGLLLLGGo...',
    '....oGGGGGGGo...',
    '.....oGGGGGo....',
    '......oGGGo.....',
    '......oGGGo.....',
    '.......ooo......',
    '................'
  ],
  pumpkin: [
    '.......oo.......',
    '......oGGo......',
    '.....oGLLGo.....',
    '...oooGGGGooo...',
    '..oOOOOOOOOOOo..',
    '.oOOhLLOOLLOOOo.',
    'oOOOhLOOOLOOODDo',
    'oOOOhLOOOLOOODDo',
    'oOOOLOOOOOLODDDo',
    'oOOOLOOOOOLODDDo',
    'oOOOLOOOOOLODDDo',
    '.oOOOOOOOOOODDo.',
    '..ooOOOOOOOoo...',
    '....oooooooo....',
    '................',
    '................'
  ]
};

export class SpriteAtlas {
  constructor() {
    this.initialized = false;
    this.tileCache = new Map();
    this.portraitCache = new Map();
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
    if (typeof document === 'undefined') return;

    const staticTiles = [0, 1, 2, 3, 4, 6, 7, 8, 9];
    for (const tileType of staticTiles) {
      const canvas = document.createElement('canvas');
      canvas.width = TILE_SIZE;
      canvas.height = TILE_SIZE;
      const tCtx = canvas.getContext('2d');
      tCtx.imageSmoothingEnabled = false;
      this._renderTileDirect(tCtx, tileType, 0, 0, 0);
      this.tileCache.set(tileType, canvas);
    }

    for (const id of Object.keys(CHARACTER_CONFIGS)) {
      this.getPortraitDataURL(id);
    }
  }

  drawTile(ctx, tileType, screenX, screenY, timeTick = 0) {
    if (!this.initialized && typeof document !== 'undefined') {
      this.init();
    }
    ctx.imageSmoothingEnabled = false;

    if (tileType !== 5 && tileType !== 8 && this.tileCache.has(tileType)) {
      ctx.drawImage(this.tileCache.get(tileType), Math.floor(screenX), Math.floor(screenY));
      return;
    }

    this._renderTileDirect(ctx, tileType, screenX, screenY, timeTick);
  }

  _renderTileDirect(ctx, tileType, x, y, timeTick = 0) {
    switch (tileType) {
      case 0: { // GRASS (16x16 detailed pixel meadow texture)
        px(ctx, x, y, 0, 0, 16, 16, '#64ab48');
        // Subtle 1x1 pixel dithering & blade tufts
        const tufts = [
          [1, 2], [2, 1], [3, 2],
          [10, 3], [11, 2], [12, 3],
          [5, 7], [6, 6], [7, 7],
          [12, 10], [13, 9], [14, 10],
          [2, 12], [3, 11], [4, 12],
          [8, 14], [9, 13]
        ];
        for (const [gx, gy] of tufts) {
          px(ctx, x, y, gx, gy, 1, 1, '#77c258');
          px(ctx, x, y, gx, gy + 1, 1, 1, '#509137');
        }
        break;
      }
      case 1: { // FLOWER_GRASS (16x16 grass with 5-pixel petal wildflowers)
        this._renderTileDirect(ctx, 0, x, y, timeTick);
        // Rose blossom (top-left)
        px(ctx, x, y, 4, 4, 1, 2, '#3d7a2b');
        px(ctx, x, y, 4, 2, 1, 1, '#f78fb3');
        px(ctx, x, y, 3, 3, 1, 1, '#f78fb3');
        px(ctx, x, y, 5, 3, 1, 1, '#f78fb3');
        px(ctx, x, y, 4, 4, 1, 1, '#f78fb3');
        px(ctx, x, y, 4, 3, 1, 1, '#fff275');
        // Daisy blossom (bottom-right)
        px(ctx, x, y, 11, 12, 1, 2, '#3d7a2b');
        px(ctx, x, y, 11, 10, 1, 1, '#ffffff');
        px(ctx, x, y, 10, 11, 1, 1, '#ffffff');
        px(ctx, x, y, 12, 11, 1, 1, '#ffffff');
        px(ctx, x, y, 11, 12, 1, 1, '#ffffff');
        px(ctx, x, y, 11, 11, 1, 1, '#f59e0b');
        // Forget-me-not (top-right)
        px(ctx, x, y, 12, 4, 1, 1, '#74b9ff');
        px(ctx, x, y, 13, 4, 1, 1, '#a3d5ff');
        px(ctx, x, y, 12, 5, 1, 1, '#3d7a2b');
        break;
      }
      case 2: { // PATH (16x16 cobblestone & gravel road with rounded mortar joints)
        const roadGrid = [
          'dddddddddddddddd',
          'mmmmmmmmmmmmmmmm',
          'mLLLmBBBBmLLLLmm',
          'mLbbmBccbMBbbbLm',
          'mmmmmmmmmMmmmmmm',
          'mBBBBmLLLLmBBBBm',
          'mBbbbmLccbMBbbbm',
          'mmmmmmmmmmmmmmmm',
          'mLLLLmBBBBmLLLLm',
          'mLccbmBbbbMLccbm',
          'mmmmmmmmmmmmmmmm',
          'mBBBBmLLLLmBBBBm',
          'mBbbbmLbbbmBccbm',
          'mmmmmmmmmmmmmmmm',
          'dddddddddddddddd',
          'DDDDDDDDDDDDDDDD'
        ];
        drawMatrix16(ctx, x, y, roadGrid, {
          d: '#ab8857',
          D: '#8f6e40',
          m: '#b38f5d',
          L: '#dec196',
          B: '#cfa976',
          b: '#c29b67',
          c: '#e8cfa8',
          M: '#a37f4e'
        });
        break;
      }
      case 3: { // STONE_PLAZA (16x16 carved town square stone masonry)
        const plazaGrid = [
          'dddddddddddddddd',
          'dHHHHHHmdhhhhhhd',
          'dHLLLLLmdhBBBBhd',
          'dHLLLLSmdhBBBBSd',
          'dHLLLLSmdhBBBBSd',
          'dHLLLLSmdhBBBBSd',
          'dHSSSSSmdhSSSSSd',
          'dmmmmmmmdmmmmmmmd',
          'dddddddddddddddd',
          'dhhhhhhmdHHHHHHd',
          'dhBBBBhmdHLLLLLd',
          'dhBBBBSmdHLLLLSd',
          'dhBBBBSmdHLLLLSd',
          'dhBBBBSmdHLLLLSd',
          'dhSSSSSmdHSSSSSd',
          'dddddddddddddddd'
        ];
        drawMatrix16(ctx, x, y, plazaGrid, {
          d: '#7f7c74',
          m: '#949189',
          H: '#dedbd3',
          h: '#d1cec6',
          L: '#c7c4bc',
          B: '#bab7af',
          S: '#a6a39b'
        });
        break;
      }
      case 4: { // DIRT_FARM (16x16 rich loamy soil plot border with fine pixel granules)
        px(ctx, x, y, 0, 0, 16, 16, '#8a5638');
        // Rounded inner border & pixel pebbles
        px(ctx, x, y, 0, 0, 16, 1, '#6e4228');
        px(ctx, x, y, 0, 15, 16, 1, '#5e3720');
        px(ctx, x, y, 0, 0, 1, 16, '#6e4228');
        px(ctx, x, y, 15, 0, 1, 16, '#5e3720');
        for (let ry = 2; ry <= 13; ry += 3) {
          px(ctx, x, y, 2, ry, 12, 1, '#75462b');
          px(ctx, x, y, 3, ry + 1, 10, 1, '#9c6544');
        }
        px(ctx, x, y, 4, 4, 1, 1, '#b07856');
        px(ctx, x, y, 11, 7, 1, 1, '#b07856');
        px(ctx, x, y, 6, 11, 1, 1, '#b07856');
        break;
      }
      case 5: { // WATER (16x16 animated pixel waves)
        px(ctx, x, y, 0, 0, 16, 16, '#2f89b8');
        const shift = Math.floor(timeTick / 16) % 4;
        for (let wy = 2; wy < 15; wy += 4) {
          const wx = (wy * 3 + shift) % 12;
          px(ctx, x, y, wx, wy, 3, 1, '#56b2e0');
          px(ctx, x, y, wx + 1, wy, 1, 1, '#a6e3ff');
          px(ctx, x, y, (wx + 7) % 13, wy + 2, 2, 1, '#439ecc');
        }
        break;
      }
      case 6: { // SAND (16x16 fine beach sand ripples)
        px(ctx, x, y, 0, 0, 16, 16, '#efd595');
        const grains = [
          [2, 2], [3, 2], [9, 3], [10, 3], [13, 5],
          [5, 7], [6, 7], [11, 9], [3, 11], [4, 11], [12, 13]
        ];
        for (let i = 0; i < grains.length; i++) {
          const [gx, gy] = grains[i];
          px(ctx, x, y, gx, gy, 1, 1, i % 2 === 0 ? '#dfc078' : '#fbf0cd');
        }
        break;
      }
      case 7: { // WOOD_BRIDGE (16x16 detailed bridge planks & nails)
        px(ctx, x, y, 0, 0, 16, 16, '#8f5a30');
        for (let py = 2; py < 14; py += 3) {
          px(ctx, x, y, 0, py, 16, 1, '#5e3819');
          px(ctx, x, y, 0, py + 1, 16, 1, '#ad7242');
          px(ctx, x, y, 2, py + 1, 1, 1, '#4a2c12');
          px(ctx, x, y, 13, py + 1, 1, 1, '#4a2c12');
        }
        px(ctx, x, y, 0, 0, 16, 2, '#c48a57');
        px(ctx, x, y, 0, 14, 16, 2, '#6e421f');
        break;
      }
      case 8: { // PIER_WOOD
        this._renderTileDirect(ctx, 5, x, y, timeTick);
        px(ctx, x, y, 1, 1, 2, 14, '#4d2e14');
        px(ctx, x, y, 13, 1, 2, 14, '#4d2e14');
        px(ctx, x, y, 0, 1, 16, 13, '#966136');
        for (let gx = 0; gx < 16; gx += 3) {
          px(ctx, x, y, gx, 1, 1, 13, '#633c1b');
          px(ctx, x, y, gx + 1, 2, 1, 11, '#b3794a');
        }
        px(ctx, x, y, 0, 1, 16, 1, '#c78e5e');
        px(ctx, x, y, 0, 13, 16, 1, '#4d2e14');
        break;
      }
      case 9: { // DARK_GRASS (16x16 forest moss & clover floor)
        px(ctx, x, y, 0, 0, 16, 16, '#467d37');
        const moss = [
          [2, 2], [3, 3], [10, 2], [11, 3],
          [6, 7], [7, 8], [13, 11], [4, 12], [9, 13]
        ];
        for (const [gx, gy] of moss) {
          px(ctx, x, y, gx, gy, 1, 1, '#346127');
          px(ctx, x, y, gx + 1, gy, 1, 1, '#5c9c4b');
        }
        break;
      }
      default: {
        px(ctx, x, y, 0, 0, 16, 16, '#64ab48');
      }
    }
  }

  drawProp(ctx, prop, screenX, screenY, timeTick = 0, isNight = false) {
    const type = typeof prop === 'string' ? prop : prop?.type;
    const x = Math.floor(screenX);
    const y = Math.floor(screenY);

    switch (type) {
      case 'oak_tree': {
        drawMatrix16(ctx, x, y, OAK_TREE_16, {
          o: '#22471d',
          G: '#3f8235',
          L: '#58a64b',
          h: '#7ad169',
          D: '#2d6125',
          T: '#78492a',
          t: '#965f3b',
          s: 'rgba(0,0,0,0.22)'
        });
        break;
      }
      case 'pine_tree': {
        drawMatrix16(ctx, x, y, PINE_TREE_16, {
          o: '#193824',
          G: '#28593a',
          L: '#3d7d53',
          D: '#1f472e',
          T: '#633b20',
          s: 'rgba(0,0,0,0.22)'
        });
        break;
      }
      case 'cherry_tree': {
        drawMatrix16(ctx, x, y, OAK_TREE_16, {
          o: '#6e2b47',
          G: '#d66b94',
          L: '#f294b7',
          h: '#ffc2d9',
          D: '#ad4c71',
          T: '#633a2c',
          t: '#82503f',
          s: 'rgba(0,0,0,0.22)'
        });
        break;
      }
      case 'palm_tree': {
        px(ctx, x, y, 4, 14, 8, 1, 'rgba(0,0,0,0.2)');
        for (let ty = 5; ty <= 13; ty++) {
          const offset = ty < 9 ? -1 : 0;
          px(ctx, x, y, 7 + offset, ty, 2, 1, ty % 2 === 0 ? '#9c693e' : '#b57d4e');
          px(ctx, x, y, 6 + offset, ty, 1, 1, '#5e3a1e');
        }
        px(ctx, x, y, 5, 4, 2, 2, '#5e3a1e');
        px(ctx, x, y, 8, 4, 2, 2, '#5e3a1e');
        px(ctx, x, y, 2, 2, 5, 1, '#4c9436');
        px(ctx, x, y, 1, 3, 4, 1, '#3b7828');
        px(ctx, x, y, 8, 2, 6, 1, '#4c9436');
        px(ctx, x, y, 10, 3, 5, 1, '#3b7828');
        px(ctx, x, y, 4, 1, 7, 1, '#70bf56');
        break;
      }
      case 'bush': {
        drawMatrix16(ctx, x, y, BUSH_16, {
          o: '#22471d',
          G: '#3f8236',
          L: '#59a64e',
          h: '#7ed470',
          D: '#2d6125',
          r: '#d93852',
          R: '#ff758c',
          s: 'rgba(0,0,0,0.2)'
        });
        break;
      }
      case 'flower_bed': {
        px(ctx, x, y, 1, 14, 14, 1, 'rgba(0,0,0,0.2)');
        px(ctx, x, y, 1, 8, 14, 6, '#5c381c');
        px(ctx, x, y, 2, 9, 12, 4, '#9c6236');
        px(ctx, x, y, 2, 11, 12, 1, '#784824');
        // Rich 16x16 leaves & individual 1x1 flower petals
        px(ctx, x, y, 2, 6, 12, 3, '#3c7d32');
        px(ctx, x, y, 3, 5, 10, 2, '#56a349');
        const blooms = [
          [3, 5, '#ff6b6b', '#ffd93d'],
          [7, 4, '#ffd93d', '#e67e22'],
          [11, 5, '#a29bfe', '#ffffff']
        ];
        for (const [bx, by, petal, center] of blooms) {
          px(ctx, x, y, bx, by - 1, 1, 1, petal);
          px(ctx, x, y, bx - 1, by, 1, 1, petal);
          px(ctx, x, y, bx + 1, by, 1, 1, petal);
          px(ctx, x, y, bx, by + 1, 1, 1, petal);
          px(ctx, x, y, bx, by, 1, 1, center);
        }
        break;
      }
      case 'rock': {
        drawMatrix16(ctx, x, y, ROCK_16, {
          o: '#2f353b',
          L: '#a0a8b2',
          h: '#c5cdd6',
          M: '#7e8691',
          D: '#586069',
          s: 'rgba(0,0,0,0.2)'
        });
        break;
      }
      case 'fence_h': {
        px(ctx, x, y, 1, 3, 3, 12, '#5c381c');
        px(ctx, x, y, 2, 4, 1, 10, '#ad7244');
        px(ctx, x, y, 12, 3, 3, 12, '#5c381c');
        px(ctx, x, y, 13, 4, 1, 10, '#ad7244');
        px(ctx, x, y, 0, 6, 16, 2, '#784926');
        px(ctx, x, y, 0, 6, 16, 1, '#ba7e4e');
        px(ctx, x, y, 0, 10, 16, 2, '#784926');
        px(ctx, x, y, 0, 10, 16, 1, '#ba7e4e');
        break;
      }
      case 'fence_v': {
        px(ctx, x, y, 6, 0, 4, 16, '#5c381c');
        px(ctx, x, y, 7, 1, 2, 14, '#ad7244');
        px(ctx, x, y, 7, 1, 1, 14, '#c78c5d');
        px(ctx, x, y, 6, 4, 4, 1, '#4a2c15');
        px(ctx, x, y, 6, 11, 4, 1, '#4a2c15');
        break;
      }
      case 'street_lamp': {
        if (isNight) {
          ctx.save();
          const grad = ctx.createRadialGradient(
            x + TILE_SIZE / 2,
            y + 12,
            4,
            x + TILE_SIZE / 2,
            y + 20,
            TILE_SIZE * 1.4
          );
          grad.addColorStop(0, 'rgba(255, 230, 128, 0.5)');
          grad.addColorStop(0.5, 'rgba(255, 195, 85, 0.2)');
          grad.addColorStop(1, 'rgba(255, 180, 60, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x + TILE_SIZE / 2, y + 20, TILE_SIZE * 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        px(ctx, x, y, 5, 14, 6, 1, '#1f2428');
        px(ctx, x, y, 6, 12, 4, 2, '#32383e');
        px(ctx, x, y, 7, 5, 2, 7, '#32383e');
        px(ctx, x, y, 7, 5, 1, 7, '#525b63');
        px(ctx, x, y, 5, 1, 6, 1, '#1f2428');
        px(ctx, x, y, 4, 2, 8, 1, '#32383e');
        px(ctx, x, y, 5, 3, 6, 3, isNight ? '#ffe680' : '#cfe8f0');
        px(ctx, x, y, 6, 3, 4, 2, isNight ? '#fffce0' : '#eef9fc');
        px(ctx, x, y, 5, 6, 6, 1, '#1f2428');
        break;
      }
      case 'bench': {
        px(ctx, x, y, 1, 14, 14, 1, 'rgba(0,0,0,0.22)');
        px(ctx, x, y, 2, 5, 12, 1, '#5e3819');
        px(ctx, x, y, 2, 6, 12, 2, '#bd7e4a');
        px(ctx, x, y, 2, 8, 12, 1, '#784824');
        px(ctx, x, y, 2, 10, 12, 2, '#cf8f5a');
        px(ctx, x, y, 2, 5, 1, 9, '#2e343b');
        px(ctx, x, y, 13, 5, 1, 9, '#2e343b');
        break;
      }
      case 'well': {
        px(ctx, x, y, 2, 14, 12, 1, 'rgba(0,0,0,0.22)');
        // Stone ring with individual bricks
        px(ctx, x, y, 3, 8, 10, 6, '#5c6169');
        px(ctx, x, y, 4, 8, 8, 2, '#2f89b8');
        for (let wy = 10; wy <= 12; wy += 2) {
          for (let wx = 3; wx < 12; wx += 3) {
            px(ctx, x, y, wx + (wy % 4 === 0 ? 1 : 0), wy, 2, 1, '#9fa5ad');
          }
        }
        px(ctx, x, y, 3, 3, 1, 6, '#6e421f');
        px(ctx, x, y, 12, 3, 1, 6, '#6e421f');
        px(ctx, x, y, 2, 2, 12, 2, '#9e3b24');
        px(ctx, x, y, 3, 1, 10, 1, '#b84a32');
        px(ctx, x, y, 5, 0, 6, 1, '#d16147');
        break;
      }
      case 'shipping_bin': {
        px(ctx, x, y, 1, 14, 14, 1, 'rgba(0,0,0,0.25)');
        px(ctx, x, y, 1, 4, 14, 10, '#593418');
        px(ctx, x, y, 2, 4, 12, 2, '#c4834b');
        px(ctx, x, y, 2, 7, 12, 6, '#9e6234');
        px(ctx, x, y, 2, 9, 12, 1, '#784721');
        px(ctx, x, y, 2, 11, 12, 1, '#784721');
        px(ctx, x, y, 3, 4, 1, 9, '#3d434a');
        px(ctx, x, y, 12, 4, 1, 9, '#3d434a');
        px(ctx, x, y, 7, 6, 2, 3, '#fbbf24');
        break;
      }
      case 'quest_board': {
        px(ctx, x, y, 2, 14, 12, 1, 'rgba(0,0,0,0.22)');
        px(ctx, x, y, 3, 9, 2, 6, '#593418');
        px(ctx, x, y, 11, 9, 2, 6, '#593418');
        px(ctx, x, y, 1, 2, 14, 8, '#593418');
        px(ctx, x, y, 2, 3, 12, 6, '#c79763');
        px(ctx, x, y, 1, 1, 14, 1, '#8c562e');
        px(ctx, x, y, 3, 4, 3, 3, '#fff9eb');
        px(ctx, x, y, 4, 4, 1, 1, '#d63031');
        px(ctx, x, y, 7, 5, 2, 3, '#fff9eb');
        px(ctx, x, y, 10, 4, 3, 4, '#fff9eb');
        px(ctx, x, y, 11, 4, 1, 1, '#0984e3');
        break;
      }
      case 'windmill': {
        px(ctx, x, y, 3, 14, 10, 1, 'rgba(0,0,0,0.25)');
        px(ctx, x, y, 4, 4, 8, 10, '#6e5a4f');
        px(ctx, x, y, 5, 4, 6, 10, '#e8dfd1');
        px(ctx, x, y, 4, 2, 8, 2, '#9e3b24');
        px(ctx, x, y, 5, 1, 6, 1, '#c25238');
        px(ctx, x, y, 7, 10, 2, 4, '#593418');
        const cx = x + 8 * P;
        const cy = y + 5 * P;
        const angle = (timeTick * 0.03) % (Math.PI * 2);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        for (let i = 0; i < 4; i++) {
          ctx.rotate(Math.PI / 2);
          ctx.fillStyle = '#593418';
          ctx.fillRect(-2, 0, 4, 24);
          ctx.fillStyle = '#f7efe3';
          ctx.fillRect(2, 6, 8, 16);
        }
        ctx.fillStyle = '#3b2310';
        ctx.fillRect(-4, -4, 8, 8);
        ctx.restore();
        break;
      }
      case 'fountain': {
        const span = prop?.width || 3;
        if (span === 3) {
          const fw = TILE_SIZE * 3;
          const fh = TILE_SIZE * 3;
          ctx.fillStyle = '#5f656e';
          ctx.fillRect(x + 6, y + 6, fw - 12, fh - 12);
          ctx.fillStyle = '#b4b9c2';
          ctx.fillRect(x + 12, y + 12, fw - 24, fh - 24);
          ctx.fillStyle = '#2f89b8';
          ctx.fillRect(x + 21, y + 21, fw - 42, fh - 42);
          const splash = Math.floor(timeTick / 10) % 2;
          ctx.fillStyle = '#7ed6fc';
          ctx.fillRect(x + 32 + splash * 6, y + 34, 18, 6);
          ctx.fillRect(x + fw - 54 - splash * 6, y + fh - 42, 18, 6);
          ctx.fillStyle = '#8d939c';
          ctx.fillRect(x + fw / 2 - 14, y + fh / 2 - 14, 28, 28);
          ctx.fillStyle = '#d2effc';
          ctx.fillRect(x + fw / 2 - 8, y + fh / 2 - 20 - splash * 4, 16, 16);
        } else {
          px(ctx, x, y, 1, 2, 14, 12, '#9fa5ad');
          px(ctx, x, y, 3, 4, 10, 8, '#2f89b8');
          px(ctx, x, y, 6, 5, 4, 5, '#85d3f2');
        }
        break;
      }
      case 'boat': {
        const bob = Math.round(Math.sin(timeTick * 0.08) * 2);
        const by = y + bob;
        px(ctx, x, by, 1, 12, 14, 1, '#99defc');
        px(ctx, x, by, 1, 6, 14, 6, '#593418');
        px(ctx, x, by, 2, 6, 12, 2, '#c98b5b');
        px(ctx, x, by, 2, 8, 12, 3, '#9e6234');
        px(ctx, x, by, 7, 6, 2, 4, '#593418');
        break;
      }
      case 'crate': {
        px(ctx, x, y, 2, 14, 12, 1, 'rgba(0,0,0,0.2)');
        px(ctx, x, y, 3, 4, 10, 10, '#593418');
        px(ctx, x, y, 4, 5, 8, 8, '#c78a54');
        px(ctx, x, y, 4, 7, 8, 1, '#8c5830');
        px(ctx, x, y, 4, 10, 8, 1, '#8c5830');
        break;
      }
      case 'barrel': {
        px(ctx, x, y, 3, 14, 10, 1, 'rgba(0,0,0,0.22)');
        px(ctx, x, y, 4, 3, 8, 11, '#593418');
        px(ctx, x, y, 5, 4, 6, 9, '#a8693a');
        px(ctx, x, y, 4, 5, 8, 1, '#3d434a');
        px(ctx, x, y, 4, 11, 8, 1, '#3d434a');
        break;
      }
      case 'anvil': {
        px(ctx, x, y, 3, 14, 10, 1, 'rgba(0,0,0,0.25)');
        px(ctx, x, y, 4, 9, 8, 5, '#633c1b');
        px(ctx, x, y, 5, 7, 6, 3, '#373d45');
        px(ctx, x, y, 2, 5, 12, 2, '#5c646e');
        px(ctx, x, y, 3, 5, 9, 1, '#9aa3ad');
        break;
      }
      default: {
        px(ctx, x, y, 4, 4, 8, 8, '#55a14a');
      }
    }
  }

  drawBuilding(ctx, building, screenX, screenY, isNight = false) {
    const x = Math.floor(screenX);
    const y = Math.floor(screenY);
    const w = building.widthTiles * TILE_SIZE;
    const h = building.heightTiles * TILE_SIZE;
    const roofH = Math.floor(h * 0.45);
    const wallY = y + roofH;
    const wallH = h - roofH;

    // Ground shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(x + 6, y + h - 3, w - 4, 12);

    // Brick chimney with individual pixel courses
    const chimX = x + w - 42;
    const chimY = y - 9;
    ctx.fillStyle = '#472d25';
    ctx.fillRect(chimX - P, chimY - P, 18 + P * 2, 27 + P);
    ctx.fillStyle = '#8c5243';
    ctx.fillRect(chimX, chimY, 18, 24);
    ctx.fillStyle = '#a86958';
    ctx.fillRect(chimX, chimY, 9, 6);
    ctx.fillRect(chimX + 9, chimY + 9, 9, 6);
    ctx.fillStyle = 'rgba(240, 240, 245, 0.65)';
    ctx.fillRect(chimX + 3, chimY - 9, 9, 6);
    ctx.fillRect(chimX + 9, chimY - 18, 9, 9);

    // Outer pixel outline of cottage walls
    const wallBase = building.wallColor || '#f3e5ab';
    const wallShade = shadeColor(wallBase, -16);
    ctx.fillStyle = '#3b2416';
    ctx.fillRect(x + P, wallY, w - P * 2, wallH);
    ctx.fillStyle = wallBase;
    ctx.fillRect(x + P * 2, wallY + P, w - P * 4, wallH - P * 2);

    // Horizontal siding plank lines (every 3 logical pixels = 9px)
    ctx.fillStyle = wallShade;
    for (let py = wallY + P * 3; py < y + h - P * 4; py += P * 3) {
      ctx.fillRect(x + P * 3, py, w - P * 6, P);
    }

    // Cobblestone foundation courses at bottom
    ctx.fillStyle = '#5c5852';
    ctx.fillRect(x + P * 2, y + h - P * 4, w - P * 4, P * 3);
    for (let sx = x + P * 3; sx < x + w - P * 5; sx += P * 4) {
      ctx.fillStyle = '#8c877e';
      ctx.fillRect(sx, y + h - P * 3, P * 3, P * 2);
    }

    // Timber framing pillars
    ctx.fillStyle = '#5e3b22';
    ctx.fillRect(x + P * 2, wallY, P * 2, wallH - P);
    ctx.fillRect(x + w - P * 4, wallY, P * 2, wallH - P);
    ctx.fillRect(x + P * 2, wallY, w - P * 4, P * 2);

    // Stepped 16x16 style pitched roof with scalloped shingle rows
    const roofBase = building.roofColor || '#b85d3b';
    const roofLight = shadeColor(roofBase, 24);
    const roofDark = shadeColor(roofBase, -28);
    const roofOutline = shadeColor(roofBase, -52);

    // Stepped gable silhouette
    ctx.fillStyle = roofOutline;
    ctx.fillRect(x, y + P * 3, w, roofH - P * 2);
    ctx.fillRect(x + P * 2, y + P, w - P * 4, P * 2);
    ctx.fillRect(x + P * 4, y, w - P * 8, P);

    ctx.fillStyle = roofBase;
    ctx.fillRect(x + P, y + P * 3, w - P * 2, roofH - P * 4);
    ctx.fillStyle = roofLight;
    ctx.fillRect(x + P * 4, y + P, w - P * 8, P * 2);

    // Scalloped roof tile pattern on a 16x16 pixel grid
    for (let ry = y + P * 4; ry < y + roofH - P * 2; ry += P * 3) {
      ctx.fillStyle = roofDark;
      ctx.fillRect(x + P * 2, ry + P * 2, w - P * 4, P);
      const offset = ((ry / P) % 2) * P * 2;
      for (let rx = x + P * 2 + offset; rx < x + w - P * 4; rx += P * 4) {
        ctx.fillStyle = roofDark;
        ctx.fillRect(rx, ry, P, P * 2);
        ctx.fillStyle = roofLight;
        ctx.fillRect(rx + P, ry, P * 2, P);
      }
    }

    // Roof eave shadow on top of wall
    ctx.fillStyle = 'rgba(28, 16, 10, 0.32)';
    ctx.fillRect(x + P * 2, wallY + P, w - P * 4, P * 2);

    // Door aligned to building.doorX
    const doorCol = Math.max(
      1,
      Math.min(building.widthTiles - 2, (building.doorX ?? building.tileX + 2) - building.tileX)
    );
    const doorX = x + doorCol * TILE_SIZE + P * 2;
    const doorY = y + h - P * 14;
    const doorW = P * 11;
    const doorH = P * 13;

    ctx.fillStyle = '#3b2212';
    ctx.fillRect(doorX - P, doorY - P, doorW + P * 2, doorH + P);
    ctx.fillStyle = '#8c5630';
    ctx.fillRect(doorX, doorY, doorW, doorH);
    ctx.fillStyle = '#a86b3e';
    ctx.fillRect(doorX + P, doorY + P, doorW - P * 2, P * 5);
    ctx.fillRect(doorX + P, doorY + P * 7, doorW - P * 2, P * 5);
    ctx.fillStyle = '#5c361b';
    ctx.fillRect(doorX + P * 5, doorY, P, doorH);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(doorX + doorW - P * 3, doorY + P * 6, P, P * 2);

    // Windows with shutters & flower boxes
    for (let col = 0; col < building.widthTiles; col++) {
      if (col === doorCol) continue;
      const wx = x + col * TILE_SIZE + P * 4;
      const wy = wallY + P * 5;
      if (wx < x + P * 5 || wx + P * 8 > x + w - P * 5) continue;

      // Wooden side shutters
      ctx.fillStyle = roofDark;
      ctx.fillRect(wx - P * 2, wy, P * 2, P * 8);
      ctx.fillRect(wx + P * 8, wy, P * 2, P * 8);

      // Window frame & panes
      ctx.fillStyle = '#472c18';
      ctx.fillRect(wx - P, wy - P, P * 10, P * 9);
      ctx.fillStyle = isNight ? '#ffe680' : '#85c7e8';
      ctx.fillRect(wx, wy, P * 8, P * 7);
      ctx.fillStyle = isNight ? '#fff9c4' : '#bce6fa';
      ctx.fillRect(wx + P, wy + P, P * 2, P * 2);
      ctx.fillStyle = '#472c18';
      ctx.fillRect(wx + P * 3, wy, P, P * 7);
      ctx.fillRect(wx, wy + P * 3, P * 8, P);

      // Window planter box
      ctx.fillStyle = '#6e4221';
      ctx.fillRect(wx - P, wy + P * 7, P * 10, P * 2);
      ctx.fillStyle = '#4ca140';
      ctx.fillRect(wx, wy + P * 6, P * 8, P);
      ctx.fillStyle = '#ff7675';
      ctx.fillRect(wx + P, wy + P * 6, P, P);
      ctx.fillStyle = '#ffeaa7';
      ctx.fillRect(wx + P * 5, wy + P * 6, P, P);
    }

    // Shop signboard above door
    const signX = doorX + P;
    const signY = doorY - P * 8;
    ctx.fillStyle = '#3b2212';
    ctx.fillRect(signX - P, signY - P, P * 9, P * 7);
    ctx.fillStyle = '#f7ead0';
    ctx.fillRect(signX, signY, P * 7, P * 5);
    this._drawSignIcon(ctx, building.signIcon, signX + P, signY + P);

    // Building nameplate
    if (building.name) {
      ctx.save();
      ctx.font = 'bold 11px "Nunito", sans-serif';
      const textWidth = ctx.measureText(building.name).width;
      const badgeW = Math.ceil(textWidth + 16);
      const badgeH = 20;
      const badgeX = Math.floor(x + w / 2 - badgeW / 2);
      const badgeY = y - 22;

      ctx.fillStyle = 'rgba(28, 20, 14, 0.88)';
      ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
      ctx.strokeStyle = '#d4a359';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(badgeX + 0.5, badgeY + 0.5, badgeW - 1, badgeH - 1);

      ctx.fillStyle = '#fff7e6';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(building.name, x + w / 2, badgeY + badgeH / 2 + 0.5);
      ctx.restore();
    }
  }

  _drawSignIcon(ctx, signIcon, sx, sy) {
    switch (signIcon) {
      case 'home':
        ctx.fillStyle = '#c94038';
        ctx.fillRect(sx + 2, sy + 1, 11, 4);
        ctx.fillStyle = '#8c5630';
        ctx.fillRect(sx + 3, sy + 5, 9, 5);
        break;
      case 'crown':
        ctx.fillStyle = '#d9a438';
        ctx.fillRect(sx + 2, sy + 2, 11, 7);
        ctx.fillStyle = '#3b5998';
        ctx.fillRect(sx + 4, sy + 5, 7, 3);
        break;
      case 'seed':
        ctx.fillStyle = '#4a8f47';
        ctx.fillRect(sx + 4, sy + 2, 7, 7);
        ctx.fillStyle = '#78c257';
        ctx.fillRect(sx + 6, sy, 3, 4);
        break;
      case 'anvil':
        ctx.fillStyle = '#434a52';
        ctx.fillRect(sx + 2, sy + 3, 11, 3);
        ctx.fillRect(sx + 4, sy + 6, 7, 3);
        break;
      case 'barn':
        ctx.fillStyle = '#a8383b';
        ctx.fillRect(sx + 2, sy + 2, 11, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(sx + 5, sy + 5, 5, 5);
        break;
      case 'bread':
        ctx.fillStyle = '#d98841';
        ctx.fillRect(sx + 2, sy + 3, 11, 6);
        ctx.fillStyle = '#f2b872';
        ctx.fillRect(sx + 4, sy + 4, 7, 3);
        break;
      case 'cross':
        ctx.fillStyle = '#3d8b85';
        ctx.fillRect(sx + 6, sy + 1, 3, 9);
        ctx.fillRect(sx + 3, sy + 4, 9, 3);
        break;
      case 'book':
        ctx.fillStyle = '#7a5285';
        ctx.fillRect(sx + 2, sy + 2, 11, 8);
        ctx.fillStyle = '#fff5e6';
        ctx.fillRect(sx + 4, sy + 4, 7, 4);
        break;
      case 'fish':
        ctx.fillStyle = '#2e6f95';
        ctx.fillRect(sx + 2, sy + 3, 9, 5);
        ctx.fillRect(sx + 11, sy + 2, 3, 7);
        break;
      default:
        ctx.fillStyle = '#8c5630';
        ctx.fillRect(sx + 3, sy + 3, 8, 6);
    }
  }

  drawCharacter(ctx, spriteId, screenX, screenY, dir = 'down', frame = 0, isMoving = false, label = '') {
    const cfg = CHARACTER_CONFIGS[spriteId] || CHARACTER_CONFIGS.player;
    const x = Math.floor(screenX);
    const walkCycle = isMoving ? (frame % 2 === 0 ? -1 : 1) : 0;
    const bounceY = isMoving && frame % 2 === 1 ? -2 : 0;
    const y = Math.floor(screenY + bounceY);

    // Shadow
    px(ctx, x, Math.floor(screenY), 4, 14, 8, 2, 'rgba(0, 0, 0, 0.25)');

    // 1px dark outline around character silhouette
    px(ctx, x, y, 4, 2, 8, 12, '#241811');

    const leftLegY = walkCycle === 1 ? 12 : 13;
    const rightLegY = walkCycle === -1 ? 12 : 13;
    px(ctx, x, y, 5, 11, 2, 3, cfg.pants);
    px(ctx, x, y, 9, 11, 2, 3, cfg.pants);
    px(ctx, x, y, 5, leftLegY + 1, 2, 2, cfg.shoes);
    px(ctx, x, y, 9, rightLegY + 1, 2, 2, cfg.shoes);

    // Torso, overalls & strap details
    px(ctx, x, y, 4, 7, 8, 4, cfg.shirt);
    px(ctx, x, y, 5, 8, 6, 3, cfg.overall);
    px(ctx, x, y, 5, 7, 1, 2, cfg.overall);
    px(ctx, x, y, 10, 7, 1, 2, cfg.overall);
    px(ctx, x, y, 6, 7, 4, 1, cfg.scarf);

    const leftArmY = 7 + (walkCycle === -1 ? 1 : 0);
    const rightArmY = 7 + (walkCycle === 1 ? 1 : 0);
    if (dir !== 'right') {
      px(ctx, x, y, 3, leftArmY, 1, 3, cfg.shirt);
      px(ctx, x, y, 3, leftArmY + 3, 1, 1, cfg.skin);
    }
    if (dir !== 'left') {
      px(ctx, x, y, 12, rightArmY, 1, 3, cfg.shirt);
      px(ctx, x, y, 12, rightArmY + 3, 1, 1, cfg.skin);
    }

    // Head & face shading
    px(ctx, x, y, 4, 3, 8, 4, cfg.skin);
    px(ctx, x, y, 5, 6, 6, 1, cfg.skinShadow);

    if (dir === 'up') {
      px(ctx, x, y, 4, 3, 8, 4, cfg.hair);
    } else if (dir === 'left') {
      px(ctx, x, y, 7, 3, 5, 3, cfg.hair);
      px(ctx, x, y, 5, 4, 1, 2, cfg.eyes);
      if (cfg.glasses) px(ctx, x, y, 4, 4, 3, 1, cfg.glasses);
      if (cfg.beard) px(ctx, x, y, 4, 6, 4, 2, cfg.beard);
      if (cfg.mustache) px(ctx, x, y, 4, 6, 3, 1, cfg.mustache);
    } else if (dir === 'right') {
      px(ctx, x, y, 4, 3, 5, 3, cfg.hair);
      px(ctx, x, y, 10, 4, 1, 2, cfg.eyes);
      if (cfg.glasses) px(ctx, x, y, 9, 4, 3, 1, cfg.glasses);
      if (cfg.beard) px(ctx, x, y, 8, 6, 4, 2, cfg.beard);
      if (cfg.mustache) px(ctx, x, y, 9, 6, 3, 1, cfg.mustache);
    } else {
      px(ctx, x, y, 4, 3, 1, 3, cfg.hair);
      px(ctx, x, y, 11, 3, 1, 3, cfg.hair);
      px(ctx, x, y, 6, 4, 1, 2, cfg.eyes);
      px(ctx, x, y, 9, 4, 1, 2, cfg.eyes);
      if (cfg.glasses) px(ctx, x, y, 5, 4, 6, 1, cfg.glasses);
      if (cfg.beard) {
        px(ctx, x, y, 5, 6, 6, 2, cfg.beard);
      } else if (cfg.mustache) {
        px(ctx, x, y, 6, 6, 4, 1, cfg.mustache);
      }
    }

    this._drawHeadwear(ctx, x, y, cfg);

    if (label) {
      ctx.save();
      ctx.font = 'bold 10px "Nunito", sans-serif';
      const tw = ctx.measureText(label).width;
      const bw = Math.ceil(tw + 10);
      const bh = 15;
      const bx = Math.floor(x + TILE_SIZE / 2 - bw / 2);
      const by = Math.floor(screenY - 14);

      ctx.fillStyle = 'rgba(22, 18, 14, 0.82)';
      ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = '#fff8eb';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x + TILE_SIZE / 2, by + bh / 2 + 0.5);
      ctx.restore();
    }
  }

  _drawHeadwear(ctx, x, y, cfg) {
    switch (cfg.hatType) {
      case 'straw':
        px(ctx, x, y, 2, 2, 12, 1, cfg.hatMain);
        px(ctx, x, y, 4, 0, 8, 2, cfg.hatMain);
        px(ctx, x, y, 4, 1, 8, 1, cfg.hatBand);
        break;
      case 'tophat':
        px(ctx, x, y, 3, 2, 10, 1, cfg.hatMain);
        px(ctx, x, y, 5, -1, 6, 3, cfg.hatMain);
        px(ctx, x, y, 5, 1, 6, 1, cfg.hatBand);
        break;
      case 'flower_crown':
        px(ctx, x, y, 4, 1, 8, 2, cfg.hair);
        px(ctx, x, y, 3, 2, 10, 1, cfg.hatMain);
        px(ctx, x, y, 4, 2, 2, 1, cfg.hatBand);
        px(ctx, x, y, 8, 2, 2, 1, '#fff275');
        px(ctx, x, y, 11, 2, 2, 1, cfg.hatBand);
        break;
      case 'bandana':
        px(ctx, x, y, 4, 1, 8, 2, cfg.hatMain);
        px(ctx, x, y, 4, 2, 8, 1, cfg.hatBand);
        break;
      case 'cowboy':
        px(ctx, x, y, 2, 2, 12, 1, cfg.hatMain);
        px(ctx, x, y, 4, 0, 8, 2, cfg.hatMain);
        px(ctx, x, y, 5, 1, 6, 1, cfg.hatBand);
        break;
      case 'captain':
        px(ctx, x, y, 3, 2, 10, 1, cfg.hatBand);
        px(ctx, x, y, 4, 0, 8, 2, cfg.hatMain);
        px(ctx, x, y, 7, 1, 2, 1, '#f5c542');
        break;
      case 'chef':
        px(ctx, x, y, 4, -1, 8, 3, cfg.hatMain);
        px(ctx, x, y, 4, 2, 8, 1, cfg.hatBand);
        break;
      case 'beret':
        px(ctx, x, y, 4, 0, 9, 2, cfg.hatMain);
        px(ctx, x, y, 4, 2, 8, 1, cfg.hatBand);
        break;
      default:
        px(ctx, x, y, 4, 1, 8, 2, cfg.hair);
    }
  }

  drawCrop(ctx, cropId, stage, isWatered, screenX, screenY, timeTick = 0) {
    const x = Math.floor(screenX);
    const y = Math.floor(screenY);

    // 16x16 tilled soil bed with rounded corners and furrow ridges
    const borderCol = isWatered ? '#2e190c' : '#4f2d18';
    const soilBase = isWatered ? '#52301b' : '#855132';
    const soilRidge = isWatered ? '#3d2212' : '#6b3e23';
    const soilHighlight = isWatered ? '#694026' : '#9c6340';

    px(ctx, x, y, 2, 1, 12, 14, borderCol);
    px(ctx, x, y, 1, 2, 14, 12, borderCol);
    px(ctx, x, y, 2, 2, 12, 12, soilBase);

    for (let ry = 3; ry <= 12; ry += 3) {
      px(ctx, x, y, 3, ry, 10, 1, soilRidge);
      px(ctx, x, y, 3, ry + 1, 10, 1, soilHighlight);
    }

    if (!cropId || stage <= 0) {
      if (cropId) {
        // Stage 0: 1x1 pixel seeds arranged neatly in the furrows
        const seeds = [[5, 5], [10, 5], [7, 8], [5, 11], [10, 11]];
        for (const [sx, sy] of seeds) {
          px(ctx, x, y, sx, sy, 1, 1, '#f3d59b');
          px(ctx, x, y, sx, sy + 1, 1, 1, '#b88b4a');
        }
      }
      return;
    }

    if (stage === 1) {
      // Stage 1: Detailed 16x16 twin cotyledon shoots
      const shoots = [[5, 6], [10, 9]];
      for (const [sx, sy] of shoots) {
        px(ctx, x, y, sx, sy, 1, 3, '#3b7a32');
        px(ctx, x, y, sx - 2, sy - 1, 2, 1, '#68b858');
        px(ctx, x, y, sx + 1, sy - 1, 2, 1, '#85db72');
        px(ctx, x, y, sx - 1, sy, 1, 1, '#4c9440');
        px(ctx, x, y, sx + 1, sy, 1, 1, '#4c9440');
      }
      return;
    }

    if (stage === 2) {
      // Stage 2: 16x16 layered foliage rosette
      const rosette = [
        '.....oooooo.....',
        '...ooGGGGGGoo...',
        '..oGGLLhhLLGGo..',
        '.oGLLhLLLLhLLGo.',
        '.oGLLLLGGLLLLGo.',
        '.oGGLLGGGGLLGGo.',
        '..oDGGGGGGGGDo..',
        '...ooDDDDDDoo...',
        '.....ooTToo.....'
      ];
      drawMatrix16(ctx, x, y + 3 * P, rosette, {
        o: '#22471d',
        G: '#3f8236',
        L: '#59a64e',
        h: '#82d973',
        D: '#2d6125',
        T: '#3b7a32'
      });
      return;
    }

    // Stage 3+: Full 16x16 Ripe Crop Sprite
    const matrix = CROP_MATRICES[cropId] || CROP_MATRICES.turnip;
    drawMatrix16(ctx, x, y, matrix, {
      o: '#231812',
      G: '#3f8236',
      L: '#63b555',
      h: '#ffffff',
      P: '#a855f7',
      W: '#f8fafc',
      V: '#cbd5e1',
      R: '#e11d48',
      Y: '#facc15',
      v: '#9f1239',
      D: '#b45309',
      O: '#f97316'
    });

    // Subtle 1x1 pixel harvest gleam
    if (Math.floor(timeTick / 18) % 2 === 0) {
      px(ctx, x, y, 12, 2, 1, 3, '#fef08a');
      px(ctx, x, y, 11, 3, 3, 1, '#fef08a');
    }
  }

  drawAnimal(ctx, animalType, screenX, screenY, dir = 'down', frame = 0, hasProduce = false) {
    const x = Math.floor(screenX);
    const bounce = frame % 2 === 1 ? -2 : 0;
    const y = Math.floor(screenY + bounce);

    px(ctx, x, Math.floor(screenY), 3, 13, 10, 2, 'rgba(0,0,0,0.22)');

    switch (animalType) {
      case 'cow': {
        px(ctx, x, y, 3, 5, 10, 7, '#241c18');
        px(ctx, x, y, 4, 11, 2, 3, '#3b2b23');
        px(ctx, x, y, 10, 11, 2, 3, '#3b2b23');
        px(ctx, x, y, 4, 6, 8, 5, '#f7f4ed');
        px(ctx, x, y, 5, 7, 3, 2, '#3b2b23');
        px(ctx, x, y, 9, 8, 2, 2, '#3b2b23');
        const hx = dir === 'left' ? 2 : dir === 'right' ? 9 : 5;
        px(ctx, x, y, hx, 4, 6, 5, '#f7f4ed');
        px(ctx, x, y, hx + 1, 7, 4, 2, '#f5b5b0');
        px(ctx, x, y, hx + 1, 5, 1, 1, '#241c18');
        px(ctx, x, y, hx + 4, 5, 1, 1, '#241c18');
        px(ctx, x, y, hx, 3, 1, 1, '#d9c6a3');
        px(ctx, x, y, hx + 5, 3, 1, 1, '#d9c6a3');
        px(ctx, x, y, hx + 2, 9, 2, 1, '#f5c542');
        break;
      }
      case 'sheep': {
        px(ctx, x, y, 5, 11, 2, 3, '#3d352e');
        px(ctx, x, y, 9, 11, 2, 3, '#3d352e');
        px(ctx, x, y, 3, 5, 10, 7, '#d6cfc2');
        px(ctx, x, y, 4, 4, 8, 7, '#fffcf5');
        const hx = dir === 'left' ? 2 : dir === 'right' ? 9 : 5;
        px(ctx, x, y, hx, 5, 5, 4, '#3d352e');
        px(ctx, x, y, hx + 1, 6, 1, 1, '#ffffff');
        px(ctx, x, y, hx + 3, 6, 1, 1, '#ffffff');
        break;
      }
      case 'chicken':
      default: {
        px(ctx, x, y, 6, 12, 1, 2, '#e69d37');
        px(ctx, x, y, 9, 12, 1, 2, '#e69d37');
        px(ctx, x, y, 5, 7, 6, 5, '#d9cbb5');
        px(ctx, x, y, 5, 7, 5, 4, '#fff9eb');
        px(ctx, x, y, 7, 5, 2, 2, '#d94136');
        const bx = dir === 'left' ? 4 : 10;
        px(ctx, x, y, bx, 8, 2, 1, '#f5a623');
        px(ctx, x, y, 7, 7, 1, 1, '#241c18');
        break;
      }
    }

    if (hasProduce) {
      const by = y - 12;
      px(ctx, x, by, 5, 0, 6, 5, '#241811');
      px(ctx, x, by, 6, 1, 4, 3, '#f43f5e');
    }
  }

  drawForageItem(ctx, itemId, screenX, screenY, timeTick = 0) {
    const x = Math.floor(screenX);
    const bob = Math.round(Math.sin(timeTick * 0.08) * 1);
    const y = Math.floor(screenY + bob);

    px(ctx, x, Math.floor(screenY), 4, 13, 8, 1, 'rgba(0,0,0,0.2)');

    switch (itemId) {
      case 'herb':
        px(ctx, x, y, 7, 9, 2, 3, '#2d6125');
        px(ctx, x, y, 4, 6, 3, 3, '#4c9440');
        px(ctx, x, y, 9, 6, 3, 3, '#5eb050');
        px(ctx, x, y, 6, 4, 4, 4, '#7ad169');
        break;
      case 'mushroom':
        px(ctx, x, y, 6, 9, 4, 4, '#f5ebd6');
        px(ctx, x, y, 4, 5, 8, 4, '#d93829');
        px(ctx, x, y, 5, 6, 2, 1, '#ffffff');
        px(ctx, x, y, 9, 6, 2, 1, '#ffffff');
        break;
      case 'seashell':
      default:
        px(ctx, x, y, 4, 6, 8, 5, '#e88ca5');
        px(ctx, x, y, 5, 5, 6, 5, '#ffc2d1');
        px(ctx, x, y, 6, 7, 4, 3, '#fff0f5');
        break;
    }
  }

  getPortraitDataURL(spriteId) {
    const key = CHARACTER_CONFIGS[spriteId] ? spriteId : 'player';
    if (this.portraitCache.has(key)) {
      return this.portraitCache.get(key);
    }

    const cfg = CHARACTER_CONFIGS[key];

    if (typeof document === 'undefined') {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="${cfg.bgPrimary}"/></svg>`;
      return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const pCtx = canvas.getContext('2d');
    pCtx.imageSmoothingEnabled = false;

    const S = 4; // 16x16 portrait scaled 4x = 64x64
    const ppx = (gx, gy, gw, gh, color) => {
      pCtx.fillStyle = color;
      pCtx.fillRect(gx * S, gy * S, gw * S, gh * S);
    };

    ppx(0, 0, 16, 16, cfg.bgBorder);
    ppx(1, 1, 14, 14, cfg.bgPrimary);

    ppx(3, 11, 10, 4, cfg.shirt);
    ppx(4, 12, 8, 3, cfg.overall);
    ppx(5, 11, 6, 1, cfg.scarf);

    ppx(6, 10, 4, 1, cfg.skinShadow);
    ppx(4, 4, 8, 6, cfg.skin);
    ppx(4, 9, 8, 1, cfg.skinShadow);

    ppx(3, 4, 1, 5, cfg.hair);
    ppx(12, 4, 1, 5, cfg.hair);

    ppx(6, 6, 1, 2, cfg.eyes);
    ppx(9, 6, 1, 2, cfg.eyes);
    ppx(7, 8, 2, 1, '#c97a63');

    if (cfg.glasses) ppx(5, 6, 6, 1, cfg.glasses);
    if (cfg.beard) {
      ppx(5, 8, 6, 3, cfg.beard);
    } else if (cfg.mustache) {
      ppx(6, 8, 4, 1, cfg.mustache);
    }

    switch (cfg.hatType) {
      case 'straw':
        ppx(2, 3, 12, 1, cfg.hatMain);
        ppx(4, 1, 8, 2, cfg.hatMain);
        ppx(4, 2, 8, 1, cfg.hatBand);
        break;
      case 'tophat':
        ppx(3, 3, 10, 1, cfg.hatMain);
        ppx(5, 1, 6, 2, cfg.hatMain);
        ppx(5, 2, 6, 1, cfg.hatBand);
        break;
      case 'flower_crown':
        ppx(4, 2, 8, 2, cfg.hair);
        ppx(3, 3, 10, 1, cfg.hatMain);
        ppx(4, 3, 2, 1, cfg.hatBand);
        ppx(7, 3, 2, 1, '#fff275');
        ppx(10, 3, 2, 1, cfg.hatBand);
        break;
      case 'bandana':
        ppx(4, 2, 8, 2, cfg.hatMain);
        ppx(4, 3, 8, 1, cfg.hatBand);
        break;
      case 'cowboy':
        ppx(2, 3, 12, 1, cfg.hatMain);
        ppx(4, 1, 8, 2, cfg.hatMain);
        ppx(5, 2, 6, 1, cfg.hatBand);
        break;
      case 'captain':
        ppx(3, 3, 10, 1, cfg.hatBand);
        ppx(4, 1, 8, 2, cfg.hatMain);
        ppx(7, 2, 2, 1, '#f5c542');
        break;
      case 'chef':
        ppx(4, 1, 8, 2, cfg.hatMain);
        ppx(4, 3, 8, 1, cfg.hatBand);
        break;
      case 'beret':
        ppx(4, 1, 9, 2, cfg.hatMain);
        ppx(4, 3, 8, 1, cfg.hatBand);
        break;
      default:
        ppx(4, 2, 8, 2, cfg.hair);
    }

    const url = canvas.toDataURL('image/png');
    this.portraitCache.set(key, url);
    return url;
  }
}

export const sprites = new SpriteAtlas();
