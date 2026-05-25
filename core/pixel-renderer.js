/** Canvas 像素渲染器 — 整数倍缩放，无抗锯齿 */
export class PixelRenderer {
  constructor(width, height, scale = 4) {
    this.gridW = width;
    this.gridH = height;
    this.scale = scale;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width * scale;
    this.canvas.height = height * scale;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /** @param {string[][]} grid 每格为 hex 色或 null（透明） */
  drawGrid(grid) {
    this.clear();
    const { ctx, scale } = this;
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const color = grid[y][x];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
  }

  mount(parent) {
    if (typeof parent === 'string') parent = document.querySelector(parent);
    parent.innerHTML = '';
    parent.appendChild(this.canvas);
    return this;
  }
}
