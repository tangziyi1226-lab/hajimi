import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'calico',
  name: '花花 · 三花猫',
  personality: '机灵鬼马，随机应变，古灵精怪',
  scale: 4,
  pattern: 'calico',
  chestPatch: 'white',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#F5F0E8',
    dark: '#2D2D2D',
    light: '#FFFFFF',
    stripe: '#E8943A',
    accent: '#2D2D2D',
    eye: '#558B2F',
    eyeShine: '#AED581',
    nose: '#E88888',
    whisker: '#C8C0B8',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
