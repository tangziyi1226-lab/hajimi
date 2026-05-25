import { STATES, STATE_KEYS } from './states.js';
import { buildStateFrames, SPRITE_SIZE } from './sprite-builder.js';
import { PixelRenderer } from './pixel-renderer.js';

/**
 * 哈脊米统一桌宠 API
 *
 * @example
 * const cat = createHajimiCat(breedConfig);
 * cat.forward();           // 播放前倾
 * cat.play('happy');       // 播放开心
 * cat.healthy();           // 等同 cat.play('healthy')
 * cat.mount('#el');        // 挂载到 DOM
 */
export class HajimiCat {
  constructor(breed) {
    this.breed = breed;
    this.id = breed.id;
    this.name = breed.name;
    this.personality = breed.personality;
    this.currentState = 'healthy';
    this.frameIndex = 0;
    this.playing = true;
    this.fps = 6;
    this._timer = null;
    this._frameCache = {};
    this.renderer = new PixelRenderer(SPRITE_SIZE.w, SPRITE_SIZE.h, breed.scale ?? 4);

    // 为每个状态预生成帧
    for (const key of STATE_KEYS) {
      const { frames } = STATES[key];
      this._frameCache[key] = buildStateFrames(breed, key, frames);
    }

    // 动态挂载 play 方法 + 英文别名（cat.forward() 等）
    for (const key of STATE_KEYS) {
      this[key] = () => this.play(key);
    }
  }

  /** 获取所有可用状态 */
  getStates() {
    return STATE_KEYS.map((k) => ({ key: k, label: STATES[k].label, frames: STATES[k].frames }));
  }

  /** 播放指定状态，loop 默认 true */
  play(stateKey, { loop = true } = {}) {
    if (!STATES[stateKey]) {
      console.warn(`[HajimiCat] 未知状态: ${stateKey}`);
      return this;
    }
    this.currentState = stateKey;
    this.frameIndex = 0;
    this.loop = loop;
    this.playing = true;
    this._renderFrame();
    this._startAnimation();
    return this;
  }

  stop() {
    this.playing = false;
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
    return this;
  }

  pause() {
    this.playing = false;
    return this;
  }

  resume() {
    if (!this.playing) {
      this.playing = true;
      this._startAnimation();
    }
    return this;
  }

  mount(parent) {
    this.renderer.mount(parent);
    this._renderFrame();
    return this;
  }

  getCanvas() {
    return this.renderer.canvas;
  }

  _startAnimation() {
    if (this._timer) clearInterval(this._timer);
    this._timer = setInterval(() => {
      if (!this.playing) return;
      const frames = this._frameCache[this.currentState];
      this.frameIndex++;
      if (this.frameIndex >= frames.length) {
        if (this.loop) this.frameIndex = 0;
        else {
          this.frameIndex = frames.length - 1;
          this.stop();
        }
      }
      this._renderFrame();
    }, 1000 / this.fps);
  }

  _renderFrame() {
    const frames = this._frameCache[this.currentState];
    this.renderer.drawGrid(frames[this.frameIndex]);
  }

  destroy() {
    this.stop();
  }
}

export function createHajimiCat(breed) {
  return new HajimiCat(breed);
}
