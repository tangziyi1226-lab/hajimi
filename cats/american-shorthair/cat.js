import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'american-shorthair',
  name: '美美 · 美短',
  personality: '亲切可靠，圆脸壮实，经典虎斑很有精神',
  scale: 4,
  pattern: 'marble',
  chestPatch: 'white',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#B8C0C8',
    dark: '#4F5964',
    light: '#E3E8EC',
    stripe: '#6D7782',
    accent: '#9DA8B2',
    eye: '#C69C1E',
    eyeShine: '#FFE082',
    nose: '#C78B8D',
    whisker: '#929AA3',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
