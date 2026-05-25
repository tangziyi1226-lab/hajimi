import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'orange-tabby',
  name: '小橘 · 橘猫',
  personality: '活泼开朗，好奇心旺盛，总是第一个冲上前',
  scale: 4,
  pattern: 'tabby',
  chestPatch: 'white',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#E8943A',
    dark: '#B8651A',
    light: '#F5C078',
    stripe: '#C47028',
    accent: '#FFAA55',
    eye: '#2D5016',
    eyeShine: '#7CB342',
    nose: '#E88888',
    whisker: '#D4A060',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
