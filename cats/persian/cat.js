import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'persian',
  name: '波斯 · 波斯猫',
  personality: '高贵慵懒，慢条斯理，享受当下',
  scale: 4,
  pattern: 'none',
  chestPatch: 'white',
  earStyle: 'normal',
  fluffy: true,
  colors: {
    base: '#F5F0E8',
    dark: '#C8B8A8',
    light: '#FFFDF8',
    stripe: '#D8C8B8',
    accent: '#E8D8C8',
    eye: '#FF7043',
    eyeShine: '#FFAB91',
    nose: '#F0A0A0',
    whisker: '#D0C0B0',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
