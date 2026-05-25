import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'norwegian-forest',
  name: '森林 · 挪威森林猫',
  personality: '稳重勇敢，毛量蓬松，像从松林里走出来',
  scale: 5,
  pattern: 'silver-tabby',
  chestPatch: 'white',
  earStyle: 'tuft',
  fluffy: true,
  colors: {
    base: '#9BA8A0',
    dark: '#4E5A54',
    light: '#D8E0D8',
    stripe: '#68756E',
    accent: '#B7C2BA',
    eye: '#7CB342',
    eyeShine: '#C5E1A5',
    nose: '#C09088',
    whisker: '#849088',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
