import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'golden-shaded',
  name: '金豆 · 金渐层',
  personality: '软乎乎又会撒娇，像一颗晒暖的小金豆',
  scale: 4,
  pattern: 'ticked',
  chestPatch: 'white',
  earStyle: 'fold',
  fluffy: true,
  colors: {
    base: '#E6B85A',
    dark: '#9A6A22',
    light: '#FFE3A3',
    stripe: '#B57A26',
    accent: '#F2C96C',
    eye: '#558B2F',
    eyeShine: '#AED581',
    nose: '#D98F86',
    whisker: '#C4933C',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
