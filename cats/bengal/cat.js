import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'bengal',
  name: '豹豹 · 孟加拉豹猫',
  personality: '野性十足，精力旺盛，喜欢探险',
  scale: 4,
  pattern: 'spots',
  chestPatch: 'white',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#D4A030',
    dark: '#8B6914',
    light: '#F0C860',
    stripe: '#6B5010',
    accent: '#A07818',
    eye: '#1B5E20',
    eyeShine: '#66BB6A',
    nose: '#C07050',
    whisker: '#B89030',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
