import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'korat',
  name: '银心 · 科拉特',
  personality: '专注聪明，银蓝色毛发，心形脸看起来很认真',
  scale: 4,
  pattern: 'smoke',
  chestPatch: 'none',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#7E95A5',
    dark: '#465C69',
    light: '#AFC1CC',
    stripe: '#5D7380',
    accent: '#93A9B5',
    eye: '#76A82A',
    eyeShine: '#C8E66A',
    nose: '#7F8790',
    whisker: '#8FA0AA',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
