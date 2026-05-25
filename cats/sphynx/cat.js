import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'sphynx',
  name: '皮皮 · 斯芬克斯',
  personality: '大胆亲人，表情丰富，是一只热乎乎的小外星猫',
  scale: 4,
  pattern: 'none',
  chestPatch: 'none',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#D9A58F',
    dark: '#9B6A5E',
    light: '#F0C2AE',
    stripe: '#B87F70',
    accent: '#C99080',
    eye: '#5E35B1',
    eyeShine: '#B39DDB',
    nose: '#A86666',
    whisker: '#C28F80',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
