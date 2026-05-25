import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'silver-tabby',
  name: '银条 · 银虎斑',
  personality: '反应敏捷，条纹利落，像会发光的小闪电',
  scale: 4,
  pattern: 'silver-tabby',
  chestPatch: 'white',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#C9D0D6',
    dark: '#5A626A',
    light: '#EEF2F5',
    stripe: '#6F7780',
    accent: '#AAB3BC',
    eye: '#5C8A2D',
    eyeShine: '#B8E07A',
    nose: '#C98E95',
    whisker: '#A0A8AE',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
