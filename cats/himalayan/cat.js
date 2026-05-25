import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'himalayan',
  name: '喜马 · 喜马拉雅',
  personality: '温顺黏人，重点色脸蛋，像布偶和波斯的软糯结合',
  scale: 4,
  pattern: 'point',
  chestPatch: 'siamese',
  earStyle: 'normal',
  fluffy: true,
  colors: {
    base: '#EFE1CF',
    dark: '#5A3A2B',
    light: '#FFF4E6',
    stripe: '#7A5140',
    accent: '#6A4637',
    eye: '#2979C9',
    eyeShine: '#90CAF9',
    nose: '#8E6A60',
    whisker: '#C6A98F',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
