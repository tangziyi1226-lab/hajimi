/**
 * 星露谷参考风格的像素猫精灵构建器。
 * 目标：大头短腿、深色描边、正面全身、动作小幅但可读。
 */

const W = 30;
const H = 34;

function emptyGrid() {
  return Array.from({ length: H }, () => Array(W).fill(null));
}

function colorSet(colors) {
  return {
    outline: colors.outline ?? '#2b1a14',
    base: colors.base,
    dark: colors.dark,
    light: colors.light,
    stripe: colors.stripe,
    accent: colors.accent,
    eye: colors.eye,
    eyeShine: colors.eyeShine,
    nose: colors.nose,
    whisker: colors.whisker,
    blush: colors.blush ?? '#f0a0a0',
  };
}

function set(grid, x, y, color) {
  if (y >= 0 && y < H && x >= 0 && x < W && color) grid[y][x] = color;
}

function hline(grid, x0, x1, y, color) {
  for (let x = x0; x <= x1; x++) set(grid, x, y, color);
}

function fillRect(grid, x0, y0, w, h, color) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) set(grid, x, y, color);
  }
}

function drawBlobRows(grid, cx, cy, rows, fill, outline, shift = () => 0) {
  rows.forEach(([dy, half]) => {
    const sx = shift(dy);
    const y = cy + dy;
    for (let x = cx + sx - half; x <= cx + sx + half; x++) {
      const edge = x === cx + sx - half || x === cx + sx + half;
      set(grid, x, y, edge ? outline : fill);
    }
  });
}

function stampThickPixel(grid, x, y, fill, outline) {
  set(grid, x, y - 1, outline);
  set(grid, x - 1, y, outline);
  set(grid, x + 1, y, outline);
  set(grid, x, y + 1, outline);
  set(grid, x, y, fill);
}

function drawEar(grid, hx, hy, side, breed, pose, c) {
  const dir = side === 'left' ? -1 : 1;
  const lift = pose.earPerk ?? 0;
  const baseX = hx + dir * 6;
  const baseY = hy - 7 - lift;

  if (breed.earStyle === 'fold') {
    hline(grid, baseX - dir * 2, baseX, baseY + 1, c.outline);
    hline(grid, baseX - dir * 2, baseX, baseY + 2, c.base);
    set(grid, baseX - dir, baseY + 2, c.dark);
    return;
  }

  set(grid, baseX, baseY - 2, c.outline);
  hline(grid, baseX - dir, baseX, baseY - 1, c.outline);
  hline(grid, baseX - dir * 2, baseX, baseY, c.outline);
  hline(grid, baseX - dir * 3, baseX + dir, baseY + 1, c.outline);
  hline(grid, baseX - dir * 2, baseX, baseY, c.base);
  set(grid, baseX - dir, baseY, c.light);
  set(grid, baseX - dir, baseY + 1, c.light);

  if (breed.earStyle === 'tuft') {
    set(grid, baseX, baseY - 3, c.accent);
    set(grid, baseX + dir, baseY - 2, c.accent);
  }
}

function drawTail(grid, bx, by, pose, c) {
  const lift = pose.tailLift ?? 0;
  const wag = pose.tailWag ?? 0;
  const droop = pose.tailDroop ?? 0;
  const path = droop
    ? [
        [7, 6],
        [8, 7],
        [9 + wag, 8],
        [10 + wag, 9],
        [10 + wag, 10],
      ]
    : [
        [7, 5],
        [8, 4],
        [9 + wag, 3 - lift],
        [10 + wag, 2 - lift],
        [10 + wag, 1 - lift],
        [9 + wag, 0 - lift],
        [8 + wag, 0 - lift],
      ];

  path.forEach(([dx, dy], i) => {
    stampThickPixel(grid, bx + dx, by + dy, i % 2 ? c.dark : c.base, c.outline);
  });
}

function drawBodyPattern(grid, bx, by, breed, c) {
  if (breed.pattern === 'tabby') {
    hline(grid, bx - 2, bx, by + 2, c.stripe);
    hline(grid, bx + 2, bx + 4, by + 3, c.stripe);
    hline(grid, bx - 3, bx - 1, by + 6, c.stripe);
    hline(grid, bx + 3, bx + 5, by + 6, c.stripe);
  }

  if (breed.pattern === 'spots') {
    fillRect(grid, bx - 4, by + 2, 2, 2, c.stripe);
    fillRect(grid, bx + 2, by + 4, 2, 2, c.stripe);
    set(grid, bx - 1, by + 7, c.stripe);
  }

  if (breed.pattern === 'calico') {
    fillRect(grid, bx - 5, by + 1, 3, 3, c.stripe);
    fillRect(grid, bx + 2, by + 3, 3, 3, c.accent);
    hline(grid, bx - 1, bx + 1, by + 7, c.stripe);
  }
}

function drawBody(grid, bx, by, breed, pose, c) {
  const squat = pose.squat ?? 0;
  const lean = pose.bodyLean ?? 0;
  const leftShoulder = pose.leftShoulder ?? 0;
  const rightShoulder = pose.rightShoulder ?? 0;
  const bodyRows = [
    [-1, 4],
    [0, 5],
    [1, 6],
    [2, 7],
    [3, 7],
    [4, 7],
    [5, 6],
    [6, 6],
    [7, 5],
    [8, 4],
  ];

  drawTail(grid, bx, by, pose, c);
  drawBlobRows(grid, bx, by + squat, bodyRows, c.base, c.outline, (dy) =>
    dy < 2 ? lean : 0
  );

  hline(grid, bx - 3 + lean, bx + 3 + lean, by + 1 + squat, c.light);
  hline(grid, bx - 4 + lean, bx + 4 + lean, by + 2 + squat, c.light);
  hline(grid, bx - 3, bx + 3, by + 3 + squat, c.light);
  hline(grid, bx - 2, bx + 2, by + 4 + squat, c.light);

  if (breed.chestPatch === 'siamese') {
    hline(grid, bx - 3, bx + 3, by + 1 + squat, c.accent);
    hline(grid, bx - 2, bx + 2, by + 2 + squat, c.accent);
  }

  drawBodyPattern(grid, bx, by + squat, breed, c);

  // 短腿和圆脚，参考图里这部分要清楚，动作只做 1px 差异。
  const pawLift = pose.pawLift ?? 0;
  fillRect(grid, bx - 5, by + 7 + squat + leftShoulder, 3, 5 - pawLift, c.outline);
  fillRect(grid, bx + 2, by + 7 + squat + rightShoulder, 3, 5, c.outline);
  fillRect(grid, bx - 4, by + 7 + squat + leftShoulder, 1, 4 - pawLift, c.base);
  fillRect(grid, bx + 3, by + 7 + squat + rightShoulder, 1, 4, c.base);
  hline(grid, bx - 6, bx - 2, by + 12 + squat, c.outline);
  hline(grid, bx + 2, bx + 6, by + 12 + squat, c.outline);
  hline(grid, bx - 5, bx - 3, by + 11 + squat, c.dark);
  hline(grid, bx + 3, bx + 5, by + 11 + squat, c.dark);

  if (breed.fluffy) {
    set(grid, bx - 8, by + 3 + squat, c.light);
    set(grid, bx + 8, by + 3 + squat, c.light);
    set(grid, bx - 6, by + 8 + squat, c.light);
    set(grid, bx + 6, by + 8 + squat, c.light);
  }
}

function drawHeadPattern(grid, hx, hy, breed, c) {
  if (breed.pattern === 'tabby') {
    set(grid, hx, hy - 4, c.stripe);
    set(grid, hx - 1, hy - 3, c.stripe);
    set(grid, hx + 1, hy - 3, c.stripe);
    set(grid, hx - 5, hy - 1, c.stripe);
    set(grid, hx + 5, hy - 1, c.stripe);
  }

  if (breed.pattern === 'spots') {
    fillRect(grid, hx - 6, hy - 3, 2, 2, c.stripe);
    set(grid, hx + 5, hy - 2, c.stripe);
    set(grid, hx + 4, hy + 1, c.stripe);
  }

  if (breed.pattern === 'calico') {
    fillRect(grid, hx - 7, hy - 4, 4, 5, c.stripe);
    fillRect(grid, hx + 3, hy - 4, 4, 4, c.accent);
  }
}

function drawEyes(grid, cx, cy, style, c) {
  if (style === 'happy') {
    hline(grid, cx - 5, cx - 3, cy, c.eye);
    hline(grid, cx + 3, cx + 5, cy, c.eye);
    set(grid, cx - 6, cy - 1, c.eye);
    set(grid, cx + 6, cy - 1, c.eye);
    return;
  }

  if (style === 'closed') {
    hline(grid, cx - 6, cx - 3, cy, c.eye);
    hline(grid, cx + 3, cx + 6, cy, c.eye);
    return;
  }

  if (style === 'tired') {
    hline(grid, cx - 6, cx - 3, cy - 1, c.outline);
    hline(grid, cx + 3, cx + 6, cy - 1, c.outline);
    hline(grid, cx - 5, cx - 3, cy, c.eye);
    hline(grid, cx + 3, cx + 5, cy, c.eye);
    return;
  }

  const tall = style === 'wide' ? 3 : 2;
  fillRect(grid, cx - 6, cy - 1, 3, tall, c.outline);
  fillRect(grid, cx + 4, cy - 1, 3, tall, c.outline);
  set(grid, cx - 5, cy - 1, c.eyeShine);
  set(grid, cx + 5, cy - 1, c.eyeShine);
  set(grid, cx - 4, cy, c.eye);
  set(grid, cx + 6, cy, c.eye);
}

function drawFace(grid, hx, hy, pose, c) {
  drawEyes(grid, hx, hy - 1, pose.eyeStyle ?? 'normal', c);
  set(grid, hx - 7, hy + 2, c.blush);
  set(grid, hx + 7, hy + 2, c.blush);
  set(grid, hx, hy + 2, c.nose);
  set(grid, hx - 1, hy + 3, c.outline);
  set(grid, hx + 1, hy + 3, c.outline);
  hline(grid, hx - 9, hx - 7, hy + 1, c.whisker);
  hline(grid, hx - 8, hx - 6, hy + 3, c.whisker);
  hline(grid, hx + 7, hx + 9, hy + 1, c.whisker);
  hline(grid, hx + 6, hx + 8, hy + 3, c.whisker);
}

function drawHead(grid, hx, hy, breed, pose, c) {
  const squash = pose.headSquash ?? 0;
  const skew = pose.headSkew ?? 0;
  const headRows = [
    [-6, 5],
    [-5, 7],
    [-4, 8],
    [-3, 9],
    [-2, 10],
    [-1, 10],
    [0, 10],
    [1, 9],
    [2, 9],
    [3, 8],
    [4, 7],
    [5, 5],
  ].filter(([dy]) => dy <= 5 - squash);

  drawEar(grid, hx, hy, 'left', breed, pose, c);
  drawEar(grid, hx, hy, 'right', breed, pose, c);
  drawBlobRows(grid, hx, hy, headRows, c.base, c.outline, (dy) => {
    if (!skew) return 0;
    if (dy <= -3) return skew;
    if (dy >= 3) return -Math.sign(skew);
    return 0;
  });

  if (breed.chestPatch === 'siamese') {
    hline(grid, hx - 6, hx + 6, hy - 2, c.accent);
    hline(grid, hx - 7, hx + 7, hy - 1, c.accent);
    hline(grid, hx - 6, hx + 6, hy, c.accent);
  }

  hline(grid, hx - 5, hx + 5, hy + 1, c.light);
  hline(grid, hx - 6, hx + 6, hy + 2, c.light);
  hline(grid, hx - 4, hx + 4, hy + 3, c.light);
  drawHeadPattern(grid, hx, hy, breed, c);
  drawFace(grid, hx, hy, pose, c);
}

/**
 * @param {object} breed 品种配置
 * @param {object} pose 姿态参数
 */
export function buildFrame(breed, pose) {
  const grid = emptyGrid();
  const c = colorSet(breed.colors);
  const p = {
    bodyX: 0,
    bodyY: 0,
    headX: 0,
    headY: 0,
    bob: 0,
    ...pose,
  };

  const bx = 15 + p.bodyX;
  const by = 18 + p.bodyY + p.bob;
  const hx = 15 + p.bodyX + p.headX;
  const hy = 10 + p.bodyY + p.headY + p.bob;

  drawBody(grid, bx, by, breed, p, c);
  drawHead(grid, hx, hy, breed, p, c);
  return grid;
}

/** 为每个状态生成帧序列 */
export function buildStateFrames(breed, stateKey, frameCount) {
  const frames = [];

  for (let i = 0; i < frameCount; i++) {
    const wave = i % 2;
    const swing = i % 2 ? 1 : -1;
    let pose = {};

    switch (stateKey) {
      case 'healthy':
        pose = {
          bob: wave ? -1 : 0,
          tailWag: swing,
          eyeStyle: i === 2 ? 'closed' : 'normal',
        };
        break;
      case 'forward':
        pose = {
          bodyLean: 1,
          headX: 1 + wave,
          headY: 1,
          tailWag: 1,
          eyeStyle: 'normal',
        };
        break;
      case 'explore':
        pose = {
          bodyLean: 1,
          headX: 2 + wave,
          headY: -1,
          tailLift: 1,
          tailWag: 1,
          eyeStyle: 'wide',
          pawLift: wave,
        };
        break;
      case 'hunched':
        pose = {
          bodyY: 1,
          headY: 2 + wave,
          headSquash: 1,
          squat: 1,
          eyeStyle: 'closed',
          tailDroop: 1,
        };
        break;
      case 'headLeft':
        pose = { headX: -2 - wave, tailWag: -1, eyeStyle: 'normal' };
        break;
      case 'headRight':
        pose = { headX: 2 + wave, tailWag: 1, eyeStyle: 'normal' };
        break;
      case 'tiltLeft':
        pose = {
          headX: -1,
          headSkew: -1,
          bob: wave ? -1 : 0,
          eyeStyle: wave ? 'happy' : 'normal',
        };
        break;
      case 'tiltRight':
        pose = {
          headX: 1,
          headSkew: 1,
          bob: wave ? -1 : 0,
          eyeStyle: wave ? 'happy' : 'normal',
        };
        break;
      case 'unevenShoulders':
        pose = {
          bodyLean: swing,
          headSkew: -swing,
          leftShoulder: wave,
          rightShoulder: wave ? 0 : 1,
          tailWag: swing,
        };
        break;
      case 'longSit':
        pose = {
          bodyY: 1,
          squat: 2,
          headY: 1 + wave,
          eyeStyle: i > 1 ? 'tired' : 'normal',
          tailDroop: 1,
        };
        break;
      case 'happy':
        pose = {
          bob: wave ? -2 : -1,
          headY: -1,
          earPerk: 1,
          tailLift: 2,
          tailWag: swing,
          eyeStyle: 'happy',
          pawLift: wave,
        };
        break;
      case 'tired':
        pose = {
          bodyY: 1,
          headY: 2 + wave,
          headSquash: 1,
          squat: 1,
          eyeStyle: 'tired',
          tailDroop: 1,
        };
        break;
      default:
        pose = {};
    }

    frames.push(buildFrame(breed, pose));
  }

  return frames;
}

export const SPRITE_SIZE = { w: W, h: H };
