import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'ragdoll',
  name: '布布 · 布偶猫',
  personality: '温柔治愈，任人摆布，软萌天使',
  scale: 4,
  pattern: 'none',
  chestPatch: 'white',
  earStyle: 'normal',
  fluffy: true,
  colors: {
    base: '#F0F0F5',
    dark: '#8090B0',
    light: '#FFFFFF',
    stripe: '#A0B0C8',
    accent: '#6888AA',
    eye: '#42A5F5',
    eyeShine: '#BBDEFB',
    nose: '#E0A0B0',
    whisker: '#C8C8D8',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
