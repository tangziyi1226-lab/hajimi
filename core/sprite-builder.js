/**
 * 20x20 模板像素猫构建器。
 * 参考用户给出的 Stardew 小猫形象：大头、短身、清晰描边、固定像素模板。
 */

const W = 22;
const H = 24;
const OFFSET_X = 1;
const OFFSET_Y = 1;

const HEAD_ROWS = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const BODY_ROWS = new Set([11, 12, 13, 14, 15, 16]);

const BASE_SPRITE = [

  '......OO...OO......',
  
  '.....OEEO.OEEO.....',
  
  '....OFFFFOFFFO.....',
  
  '...OFFFFFFFFFFO....',
  
  '..OFFFFFFFFFFFFO...',
  
  '..OFFEOFFFFOEFEO...',
  
  '..OFFFFFFFFFFFFO...',
  
  '..OFFFFFNNFFFFFO...',
  
  '...OFFFFFFFFFFO....',
  
  '....OFFFFFFFFO.....',
  
  '....OFFFFFFFFO.....',
  
  '....OFFFFFFFFO.....',
  
  '...OFFFFFFFFFFO....',
  
  '...OFFFFFFFFFFO....',
  
  '...OFFFFFFFFFFO....',
  
  '....OFFFFFFFFO.....',
  
  '.....OO....OO......',
  
  '....................',
  
  '....................',
  
  '....................',
  
  ];

function emptyGrid() {
  return Array.from({ length: H }, () => Array(W).fill(null));
}

function colorSet(colors) {
  return {
    O: colors.outline ?? colors.dark ?? '#5b3927',
    F: colors.base,
    L: colors.light,
    D: colors.dark,
    S: colors.stripe ?? colors.dark,
    A: colors.accent ?? colors.dark,
    E: colors.eye,
    H: colors.eyeShine ?? '#ffffff',
    P: colors.blush ?? '#f49ac2',
    N: colors.nose ?? '#ff6b9a',
    W: colors.whisker ?? colors.light,
  };
}

function set(grid, x, y, color) {
  const sx = x + OFFSET_X;
  const sy = y + OFFSET_Y;
  if (sy >= 0 && sy < H && sx >= 0 && sx < W) grid[sy][sx] = color;
}

function paint(grid, x, y, code, colors) {
  if (!code || code === '.') return;
  set(grid, x, y, colors[code] ?? colors.F);
}

function readBaseCell(x, y) {
  return BASE_SPRITE[y]?.[x] ?? '.';
}

function transformPoint(x, y, pose) {
  let nx = x;
  let ny = y;

  if (HEAD_ROWS.has(y)) {
    nx += pose.headX ?? 0;
    ny += pose.headY ?? 0;

    if (pose.headTilt === 'left') {
      if (y <= 4) nx -= 1;
      if (y >= 8) nx += 1;
    }
    if (pose.headTilt === 'right') {
      if (y <= 4) nx += 1;
      if (y >= 8) nx -= 1;
    }
  }

  if (BODY_ROWS.has(y)) {
    nx += pose.bodyX ?? 0;
    ny += pose.bodyY ?? 0;
    if (pose.sit && y >= 13) ny += 1;
    if (pose.lean === 'left' && y <= 13) nx -= 1;
    if (pose.lean === 'right' && y <= 13) nx += 1;
  }

  ny += pose.bob ?? 0;
  return [nx, ny];
}

function drawBase(grid, breed, pose, colors) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const code = readBaseCell(x, y);
      const [nx, ny] = transformPoint(x, y, pose);
      paint(grid, nx, ny, code, colors);
    }
  }
}

function drawNeckBridge(grid, pose, colors) {
  const bob = pose.bob ?? 0;
  const headX = pose.headX ?? 0;
  const bodyX = pose.bodyX ?? 0;
  const bodyY = pose.bodyY ?? 0;
  const headBottom = 10 + (pose.headY ?? 0) + bob;
  const bodyTop = 11 + bodyY + bob;
  const fromY = Math.min(headBottom, bodyTop);
  const toY = Math.max(headBottom, bodyTop);

  for (let y = fromY; y <= toY; y++) {
    const t = toY === fromY ? 0 : (y - fromY) / (toY - fromY);
    const center = Math.round(9 + headX * (1 - t) + bodyX * t);
    set(grid, center - 3, y, colors.O);
    set(grid, center - 2, y, colors.F);
    set(grid, center - 1, y, colors.F);
    set(grid, center, y, colors.F);
    set(grid, center + 1, y, colors.F);
    set(grid, center + 2, y, colors.F);
    set(grid, center + 3, y, colors.O);
  }
}

function drawBodyBridge(grid, pose, colors) {
  const bob = pose.bob ?? 0;
  const bodyY = pose.bodyY ?? 0;
  const top = 12 + bodyY + bob;
  const widen = pose.sit ? 1 : 0;
  const left = 4 - widen;
  const right = 14 + widen;

  // 坐姿核心：一整团肚子，后腿只通过轮廓暗示。
  for (let y = top; y <= top + 2; y++) {
    for (let x = left; x <= right; x++) {
      const isEdge = x === left || x === right;
      set(grid, x, y, isEdge ? colors.O : colors.F);
    }
    set(grid, left - 1, y, null);
  }

  for (let x = 7; x <= 11; x++) set(grid, x, top, colors.L);
  for (let x = 6; x <= 12; x++) set(grid, x, top + 1, colors.L);
}

function drawPawForeground(grid, pose, colors) {
  const bob = pose.bob ?? 0;
  const bodyY = pose.bodyY ?? 0;
  const groundY = 17 + bodyY + bob;

  // 前爪从肚子前方垂到脚底基线，避免看起来悬空。
  const paws = [
    [5, groundY - 2, colors.O],
    [6, groundY - 2, colors.F],
    [12, groundY - 2, colors.F],
    [13, groundY - 2, colors.O],
    [5, groundY - 1, colors.O],
    [6, groundY - 1, colors.F],
    [12, groundY - 1, colors.F],
    [13, groundY - 1, colors.O],
    [5, groundY, colors.D],
    [6, groundY, colors.D],
    [11, groundY, colors.O],
    [12, groundY, colors.D],
    [13, groundY, colors.D],
  ];

  paws.forEach(([x, py, color]) => set(grid, x, py, color));
}

function drawChair(grid, pose) {
  if (!pose.chair) return;
  const leg = '#5d3a24';
  const seat = '#9b6434';
  const light = '#c08244';

  // 椅子永远在猫背后，猫身体会覆盖椅面中心。
  set(grid, 2, 10, leg);
  set(grid, 17, 10, leg);
  set(grid, 2, 11, leg);
  set(grid, 17, 11, leg);
  set(grid, 2, 12, leg);
  set(grid, 17, 12, leg);
  for (let x = 2; x <= 17; x++) set(grid, x, 14, seat);
  for (let x = 3; x <= 16; x++) set(grid, x, 13, light);
  set(grid, 2, 13, leg);
  set(grid, 17, 13, leg);
  set(grid, 3, 15, leg);
  set(grid, 16, 15, leg);
  set(grid, 3, 16, leg);
  set(grid, 16, 16, leg);
  set(grid, 3, 17, leg);
  set(grid, 16, 17, leg);
}

function zoomGrid(grid, scale = 1.15) {
  const next = emptyGrid();
  const cx = (W - 1) / 2;
  const cy = (H - 1) / 2;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const sx = Math.round(cx + (x - cx) / scale);
      const sy = Math.round(cy + (y - cy) / scale);
      if (sy >= 0 && sy < H && sx >= 0 && sx < W) next[y][x] = grid[sy][sx];
    }
  }

  return next;
}

function drawWhiskers(grid, pose, colors) {
  const hx = 0 + (pose.headX ?? 0);
  const hy = 0 + (pose.headY ?? 0) + (pose.bob ?? 0);
  set(grid, 3 + hx, 6 + hy, colors.W);
  set(grid, 4 + hx, 7 + hy, colors.W);
  set(grid, 16 + hx, 6 + hy, colors.W);
  set(grid, 15 + hx, 7 + hy, colors.W);
}

function drawEyes(grid, pose, colors) {
  const hx = pose.headX ?? 0;
  const hy = (pose.headY ?? 0) + (pose.bob ?? 0);
  const style = pose.eyeStyle ?? 'normal';

  // 先盖掉模板眼睛位置，动作眼睛再单独画。
  [[6, 5], [7, 5], [12, 5], [13, 5]].forEach(([x, y]) => set(grid, x + hx, y + hy, colors.F));

  if (style === 'closed') {
    set(grid, 6 + hx, 5 + hy, colors.O);
    set(grid, 7 + hx, 5 + hy, colors.O);
    set(grid, 12 + hx, 5 + hy, colors.O);
    set(grid, 13 + hx, 5 + hy, colors.O);
    return;
  }

  if (style === 'happy') {
    set(grid, 6 + hx, 5 + hy, colors.O);
    set(grid, 7 + hx, 4 + hy, colors.O);
    set(grid, 12 + hx, 4 + hy, colors.O);
    set(grid, 13 + hx, 5 + hy, colors.O);
    return;
  }

  if (style === 'tired') {
    set(grid, 6 + hx, 5 + hy, colors.O);
    set(grid, 7 + hx, 5 + hy, colors.O);
    set(grid, 12 + hx, 5 + hy, colors.O);
    set(grid, 13 + hx, 5 + hy, colors.O);
    set(grid, 7 + hx, 6 + hy, colors.D);
    set(grid, 12 + hx, 6 + hy, colors.D);
    return;
  }

  set(grid, 6 + hx, 5 + hy, colors.E);
  set(grid, 7 + hx, 5 + hy, colors.H);
  set(grid, 12 + hx, 5 + hy, colors.E);
  set(grid, 13 + hx, 5 + hy, colors.H);

  if (style === 'wide') {
    set(grid, 6 + hx, 4 + hy, colors.E);
    set(grid, 13 + hx, 4 + hy, colors.E);
  }
}

function drawPattern(grid, breed, colors, pose) {
  const hx = pose.headX ?? 0;
  const hy = (pose.headY ?? 0) + (pose.bob ?? 0);
  const by = (pose.bodyY ?? 0) + (pose.bob ?? 0);

  if (breed.pattern === 'tabby') {
    set(grid, 9 + hx, 2 + hy, colors.S);
    set(grid, 8 + hx, 3 + hy, colors.S);
    set(grid, 10 + hx, 3 + hy, colors.S);
    set(grid, 5 + hx, 4 + hy, colors.S);
    set(grid, 14 + hx, 4 + hy, colors.S);
    set(grid, 7, 11 + by, colors.S);
    set(grid, 12, 11 + by, colors.S);
    set(grid, 6, 13 + by, colors.S);
    set(grid, 13, 13 + by, colors.S);
  }

  if (breed.pattern === 'spots') {
    set(grid, 5 + hx, 3 + hy, colors.S);
    set(grid, 13 + hx, 4 + hy, colors.S);
    set(grid, 7, 11 + by, colors.S);
    set(grid, 12, 12 + by, colors.S);
    set(grid, 9, 14 + by, colors.S);
  }

  if (breed.pattern === 'calico') {
    [[4, 2], [5, 2], [4, 3], [5, 3], [6, 3]].forEach(([x, y]) => set(grid, x + hx, y + hy, colors.S));
    [[13, 2], [14, 2], [13, 3], [14, 3], [12, 4]].forEach(([x, y]) => set(grid, x + hx, y + hy, colors.A));
    [[6, 11], [7, 11], [12, 12], [13, 12]].forEach(([x, y]) => set(grid, x, y + by, colors.S));
  }

  if (breed.pattern === 'tuxedo') {
    [[8, 6], [9, 6], [10, 6], [9, 7], [10, 7], [8, 8], [9, 8], [10, 8], [11, 8]].forEach(([x, y]) => {
      set(grid, x + hx, y + hy, colors.L);
    });
    [[6, 15], [7, 15], [12, 15], [13, 15], [6, 16], [13, 16]].forEach(([x, y]) => {
      set(grid, x, y + by, colors.L);
    });
  }

  if (breed.pattern === 'cow') {
    [[4, 3], [5, 3], [4, 4], [5, 4], [6, 4], [14, 5], [15, 5], [14, 6], [15, 6]].forEach(([x, y]) => {
      set(grid, x + hx, y + hy, colors.S);
    });
    [[5, 12], [6, 12], [5, 13], [12, 13], [13, 13], [12, 14], [13, 14]].forEach(([x, y]) => {
      set(grid, x, y + by, colors.S);
    });
  }

  if (breed.pattern === 'tortie') {
    [[5, 2], [6, 3], [7, 4], [12, 3], [13, 4], [14, 5], [8, 6], [11, 7]].forEach(([x, y], i) => {
      set(grid, x + hx, y + hy, i % 2 ? colors.A : colors.S);
    });
    [[6, 11], [7, 12], [12, 12], [13, 13], [8, 14], [11, 15]].forEach(([x, y], i) => {
      set(grid, x, y + by, i % 2 ? colors.A : colors.S);
    });
  }

  if (breed.pattern === 'silver-tabby') {
    [[8, 2], [9, 2], [10, 2], [7, 3], [11, 3], [5, 5], [14, 5], [6, 7], [13, 7]].forEach(([x, y]) => {
      set(grid, x + hx, y + hy, colors.S);
    });
    [[7, 11], [12, 11], [6, 13], [13, 13], [8, 15], [11, 15]].forEach(([x, y]) => set(grid, x, y + by, colors.S));
  }

  if (breed.pattern === 'ticked') {
    [[6, 4], [9, 4], [12, 4], [5, 7], [8, 7], [11, 7], [14, 7]].forEach(([x, y], i) => {
      set(grid, x + hx, y + hy, i % 2 ? colors.A : colors.S);
    });
    [[7, 11], [10, 12], [13, 13], [6, 14], [11, 15]].forEach(([x, y], i) => {
      set(grid, x, y + by, i % 2 ? colors.A : colors.S);
    });
  }

  if (breed.pattern === 'marble') {
    [[7, 3], [8, 3], [11, 3], [12, 3], [6, 5], [7, 6], [12, 6], [13, 5]].forEach(([x, y]) => {
      set(grid, x + hx, y + hy, colors.S);
    });
    [[6, 11], [7, 11], [8, 12], [12, 12], [13, 13], [6, 14], [7, 15], [12, 15]].forEach(([x, y]) => {
      set(grid, x, y + by, colors.S);
    });
  }

  if (breed.pattern === 'van') {
    [[5, 2], [6, 2], [5, 3], [13, 2], [14, 2], [14, 3], [15, 4]].forEach(([x, y], i) => {
      set(grid, x + hx, y + hy, i < 3 ? colors.S : colors.A);
    });
    [[13, 13], [14, 13], [13, 14], [14, 14]].forEach(([x, y]) => set(grid, x, y + by, colors.S));
  }

  if (breed.pattern === 'point') {
    [[5, 1], [6, 1], [13, 1], [14, 1], [7, 5], [8, 5], [11, 5], [12, 5], [8, 6], [11, 6]].forEach(([x, y]) => {
      set(grid, x + hx, y + hy, colors.A);
    });
    [[5, 16], [6, 16], [12, 16], [13, 16], [6, 17], [13, 17]].forEach(([x, y]) => set(grid, x, y + by, colors.A));
  }

  if (breed.pattern === 'smoke') {
    [[8, 4], [9, 5], [10, 5], [11, 4], [7, 8], [12, 8]].forEach(([x, y]) => {
      set(grid, x + hx, y + hy, colors.L);
    });
    [[7, 12], [8, 12], [11, 12], [12, 12], [6, 15], [13, 15]].forEach(([x, y]) => set(grid, x, y + by, colors.L));
  }
}

function drawSiameseMask(grid, breed, colors, pose) {
  if (breed.chestPatch !== 'siamese') return;
  const hx = pose.headX ?? 0;
  const hy = (pose.headY ?? 0) + (pose.bob ?? 0);
  [[8, 4], [9, 4], [10, 4], [11, 4], [7, 5], [8, 5], [11, 5], [12, 5], [8, 6], [9, 6], [10, 6], [11, 6]].forEach(([x, y]) => {
    set(grid, x + hx, y + hy, colors.A);
  });
}

function drawFoldEars(grid, breed, colors, pose) {
  if (breed.earStyle !== 'fold') return;
  const hx = pose.headX ?? 0;
  const hy = (pose.headY ?? 0) + (pose.bob ?? 0);
  [[6, 0], [7, 0], [12, 0], [13, 0]].forEach(([x, y]) => set(grid, x + hx, y + hy, null));
  set(grid, 5 + hx, 1 + hy, colors.O);
  set(grid, 6 + hx, 1 + hy, colors.F);
  set(grid, 13 + hx, 1 + hy, colors.F);
  set(grid, 14 + hx, 1 + hy, colors.O);
}

function drawTuftEars(grid, breed, colors, pose) {
  if (breed.earStyle !== 'tuft') return;
  const hx = pose.headX ?? 0;
  const hy = (pose.headY ?? 0) + (pose.bob ?? 0);
  set(grid, 6 + hx, -1 + hy, colors.A);
  set(grid, 13 + hx, -1 + hy, colors.A);
}

function drawFluff(grid, breed, colors, pose) {
  if (!breed.fluffy) return;
  const by = (pose.bodyY ?? 0) + (pose.bob ?? 0);
  set(grid, 3, 12 + by, colors.L);
  set(grid, 16, 12 + by, colors.L);
  set(grid, 4, 15 + by, colors.L);
  set(grid, 15, 15 + by, colors.L);
}

function drawTail(grid, pose, colors) {
  const bob = pose.bob ?? 0;
  const wag = pose.tailWag ?? 0;
  const lift = pose.tailLift ?? 0;
  const droop = pose.tailDroop ?? 0;
  const tail = droop
    ? [[16, 11], [17, 12], [18 + wag, 13], [18 + wag, 14]]
    : [[15, 11], [16, 10], [17 + wag, 9 - lift], [18 + wag, 8 - lift], [18 + wag, 7 - lift]];

  tail.forEach(([x, y], i) => {
    set(grid, x, y + bob, colors.O);
    set(grid, x, y + 1 + bob, i % 2 ? colors.D : colors.F);
  });
}

function drawActionAccents(grid, pose, colors) {
  if (pose.pawLift) {
    set(grid, 5, 13 + (pose.bob ?? 0), null);
    set(grid, 5, 12 + (pose.bob ?? 0), colors.O);
    set(grid, 6, 12 + (pose.bob ?? 0), colors.F);
  }

  if (pose.shoulderUneven) {
    set(grid, 4, 12 + (pose.bob ?? 0), colors.O);
    set(grid, 15, 13 + (pose.bob ?? 0), colors.O);
  }

  if (pose.sleepyZ) {
    const z = [
      [15, 0],
      [16, 0],
      [16, 1],
      [15, 2],
      [16, 2],
      [18, 3],
      [19, 3],
      [19, 4],
      [18, 5],
      [19, 5],
    ];
    z.forEach(([x, y]) => set(grid, x, y, colors.O));
  }
}

/**
 * @param {object} breed 品种配置
 * @param {object} pose 姿态参数
 */
export function buildFrame(breed, pose = {}) {
  const grid = emptyGrid();
  const colors = colorSet(breed.colors);

  drawChair(grid, pose);
  drawTail(grid, pose, colors);
  drawBase(grid, breed, pose, colors);
  drawNeckBridge(grid, pose, colors);
  drawBodyBridge(grid, pose, colors);
  drawSiameseMask(grid, breed, colors, pose);
  drawPattern(grid, breed, colors, pose);
  drawFoldEars(grid, breed, colors, pose);
  drawTuftEars(grid, breed, colors, pose);
  drawFluff(grid, breed, colors, pose);
  drawPawForeground(grid, pose, colors);
  drawEyes(grid, pose, colors);
  drawWhiskers(grid, pose, colors);
  drawActionAccents(grid, pose, colors);

  return pose.zoom ? zoomGrid(grid) : grid;
}

/** 为每个状态生成帧序列 */
export function buildStateFrames(breed, stateKey, frameCount) {
  const frames = [];

  for (let i = 0; i < frameCount; i++) {
    const wave = i % 2;
    const swing = wave ? 1 : -1;
    let pose = {};

    switch (stateKey) {
      case 'healthy':
        pose = { bob: wave ? -1 : 0, tailWag: swing, eyeStyle: i === 2 ? 'closed' : 'normal' };
        break;
      case 'forward':
        pose = { zoom: true, tailWag: 1, eyeStyle: 'wide' };
        break;
      case 'explore':
        pose = { headX: 2 + wave, headY: -1, tailLift: 1, tailWag: 1, eyeStyle: 'wide', pawLift: wave };
        break;
      case 'hunched':
        pose = { bodyY: 1, headY: 2 + wave, sit: true, eyeStyle: 'closed', tailDroop: 1 };
        break;
      case 'headLeft':
        pose = { headX: -2 - wave, tailWag: -1 };
        break;
      case 'headRight':
        pose = { headX: 2 + wave, tailWag: 1 };
        break;
      case 'tiltLeft':
        pose = { headTilt: 'left', headX: -1, bob: wave ? -1 : 0, eyeStyle: wave ? 'happy' : 'normal' };
        break;
      case 'tiltRight':
        pose = { headTilt: 'right', headX: 1, bob: wave ? -1 : 0, eyeStyle: wave ? 'happy' : 'normal' };
        break;
      case 'unevenShoulders':
        pose = { lean: swing > 0 ? 'right' : 'left', shoulderUneven: true, tailWag: swing };
        break;
      case 'longSit':
        pose = { bodyY: 1, headY: 1 + wave, sit: true, chair: true, eyeStyle: i > 1 ? 'tired' : 'normal', tailDroop: 1 };
        break;
      case 'happy':
        pose = { bob: wave ? -1 : 0, tailLift: 1, tailWag: swing, eyeStyle: 'happy', pawLift: wave };
        break;
      case 'tired':
        pose = { bodyY: 1, headY: 2 + wave, sit: true, eyeStyle: 'tired', tailDroop: 1, sleepyZ: true };
        break;
      default:
        pose = {};
    }

    frames.push(buildFrame(breed, pose));
  }

  return frames;
}

export const SPRITE_SIZE = { w: W, h: H };
