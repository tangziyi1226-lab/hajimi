import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'tuxedo',
  name: '礼礼 · 燕尾服猫',
  personality: '一本正经又爱耍帅，像穿着小礼服出门',
  scale: 4,
  pattern: 'tuxedo',
  chestPatch: 'white',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#2E3035',
    dark: '#17181C',
    light: '#F7F2E8',
    stripe: '#24262B',
    accent: '#4A4D55',
    eye: '#8BC34A',
    eyeShine: '#C5E1A5',
    nose: '#E18B9A',
    whisker: '#6D7078',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
