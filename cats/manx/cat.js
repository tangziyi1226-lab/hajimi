import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'manx',
  name: '圆圆 · 马恩岛猫',
  personality: '圆滚滚又稳重，尾巴短短，落地很有分量',
  scale: 4,
  pattern: 'cow',
  chestPatch: 'white',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#D8D0C2',
    dark: '#5A5148',
    light: '#F5EFE5',
    stripe: '#6C6256',
    accent: '#B78C55',
    eye: '#7A9E2F',
    eyeShine: '#C5E16C',
    nose: '#C68686',
    whisker: '#B2A89A',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
