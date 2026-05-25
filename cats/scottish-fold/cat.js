import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'scottish-fold',
  name: '折折 · 苏格兰折耳',
  personality: '憨厚可爱，圆滚滚，让人想捏',
  scale: 4,
  pattern: 'none',
  chestPatch: 'white',
  earStyle: 'fold',
  fluffy: false,
  colors: {
    base: '#C8C0B8',
    dark: '#908880',
    light: '#E8E0D8',
    stripe: '#A09890',
    accent: '#B0A8A0',
    eye: '#FFB300',
    eyeShine: '#FFE082',
    nose: '#D0A0A0',
    whisker: '#B0A898',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
