import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'siamese',
  name: '暹暹 · 暹罗猫',
  personality: '优雅话痨，粘人精，喜欢表达',
  scale: 4,
  pattern: 'none',
  chestPatch: 'siamese',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#F5E6D3',
    dark: '#3D2314',
    light: '#FFF8F0',
    stripe: '#5C3A28',
    accent: '#4A3020',
    eye: '#1565C0',
    eyeShine: '#64B5F6',
    nose: '#8D6E63',
    whisker: '#C4A882',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
