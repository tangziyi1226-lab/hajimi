import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'maine-coon',
  name: '缅缅 · 缅因猫',
  personality: '豪爽大方，体型最大，像个小狮子',
  scale: 5,
  pattern: 'tabby',
  chestPatch: 'white',
  earStyle: 'tuft',
  fluffy: true,
  colors: {
    base: '#8B6914',
    dark: '#5C4510',
    light: '#C8A848',
    stripe: '#6B5010',
    accent: '#A88020',
    eye: '#558B2F',
    eyeShine: '#AED581',
    nose: '#B08060',
    whisker: '#A89040',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
