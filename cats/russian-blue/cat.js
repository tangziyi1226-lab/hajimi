import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'russian-blue',
  name: '霜霜 · 俄罗斯蓝猫',
  personality: '冷静疏离，观察力强，外冷内热',
  scale: 4,
  pattern: 'none',
  chestPatch: 'none',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#6B8CAE',
    dark: '#3D5A78',
    light: '#9CB4CC',
    stripe: '#4A6888',
    accent: '#7898B8',
    eye: '#00838F',
    eyeShine: '#4DD0E1',
    nose: '#8090A0',
    whisker: '#708898',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
