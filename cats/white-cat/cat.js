import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'white-cat',
  name: '雪球 · 白猫',
  personality: '干净骄傲，步子轻轻，像刚落下来的雪',
  scale: 4,
  pattern: 'none',
  chestPatch: 'white',
  earStyle: 'normal',
  fluffy: true,
  colors: {
    base: '#F6F3EA',
    dark: '#C9C4B8',
    light: '#FFFFFF',
    stripe: '#DDD8CC',
    accent: '#ECE7DC',
    eye: '#4AA3DF',
    eyeShine: '#BFE8FF',
    nose: '#EBA6B0',
    whisker: '#D4CEC0',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
