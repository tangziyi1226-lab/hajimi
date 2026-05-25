import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'cow-cat',
  name: '哞哞 · 奶牛猫',
  personality: '外向捣蛋，黑白分明，像小奶牛一样醒目',
  scale: 4,
  pattern: 'cow',
  chestPatch: 'white',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#F4F0E8',
    dark: '#2A2A2A',
    light: '#FFFFFF',
    stripe: '#1F1F1F',
    accent: '#3A3A3A',
    eye: '#6B8E23',
    eyeShine: '#A5D66D',
    nose: '#E58E9D',
    whisker: '#C8C0B8',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
