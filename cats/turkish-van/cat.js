import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'turkish-van',
  name: '梵梵 · 土耳其梵猫',
  personality: '清爽活泼，头尾有色块，像刚从水边跑回来',
  scale: 4,
  pattern: 'van',
  chestPatch: 'white',
  earStyle: 'normal',
  fluffy: true,
  colors: {
    base: '#F7F3EA',
    dark: '#B66A2C',
    light: '#FFFFFF',
    stripe: '#D88435',
    accent: '#8A4A25',
    eye: '#3FA7D6',
    eyeShine: '#B3E5FC',
    nose: '#E89AA0',
    whisker: '#D3C8B8',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
