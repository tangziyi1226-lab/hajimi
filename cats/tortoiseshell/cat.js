import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'tortoiseshell',
  name: '玳玳 · 玳瑁猫',
  personality: '脾气鲜明，花色跳跃，每天都有新主意',
  scale: 4,
  pattern: 'tortie',
  chestPatch: 'none',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#4A2F24',
    dark: '#241713',
    light: '#C77A38',
    stripe: '#D8893C',
    accent: '#1E1A18',
    eye: '#D6A21F',
    eyeShine: '#FFE082',
    nose: '#A66A62',
    whisker: '#8B5A3C',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
