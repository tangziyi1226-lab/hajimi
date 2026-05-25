import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'black-cat',
  name: '煤球 · 黑猫',
  personality: '神秘安静，眼睛亮亮，行动像一团小影子',
  scale: 4,
  pattern: 'none',
  chestPatch: 'none',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#2B2B32',
    dark: '#151519',
    light: '#4A4A55',
    stripe: '#202026',
    accent: '#353541',
    eye: '#F4D03F',
    eyeShine: '#FFF176',
    nose: '#4D3A44',
    whisker: '#5A5A66',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
