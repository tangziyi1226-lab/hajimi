import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'british-shorthair',
  name: '蓝蓝 · 英短',
  personality: '沉稳内敛，表情淡定，遇事不慌',
  scale: 4,
  pattern: 'none',
  chestPatch: 'white',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#7B8FA1',
    dark: '#4A5F72',
    light: '#A8B8C8',
    stripe: '#5A7080',
    accent: '#9AABB8',
    eye: '#D4AF37',
    eyeShine: '#FFE082',
    nose: '#C89898',
    whisker: '#8899AA',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
