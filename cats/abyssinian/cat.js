import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'abyssinian',
  name: '阿比 · 阿比西尼亚',
  personality: '好奇灵巧，停不下来，永远想钻进新角落',
  scale: 4,
  pattern: 'ticked',
  chestPatch: 'none',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#B86F32',
    dark: '#6A3E1F',
    light: '#E0A15E',
    stripe: '#7F4D24',
    accent: '#D18A45',
    eye: '#2E7D32',
    eyeShine: '#81C784',
    nose: '#A75B55',
    whisker: '#A46C3A',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
