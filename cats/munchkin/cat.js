import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'munchkin',
  name: '短短 · 曼基康',
  personality: '小短腿大能量，跑起来像滚动的小面包',
  scale: 4,
  pattern: 'tabby',
  chestPatch: 'white',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#D18A45',
    dark: '#8A4F22',
    light: '#F0B66A',
    stripe: '#A7642E',
    accent: '#E09A52',
    eye: '#6D8F2A',
    eyeShine: '#B8D66B',
    nose: '#D58A82',
    whisker: '#B57A42',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
