import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'devon-rex',
  name: '卷卷 · 德文卷毛',
  personality: '古灵精怪，耳朵大大，像会眨眼的小精灵',
  scale: 4,
  pattern: 'smoke',
  chestPatch: 'none',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#B78F7A',
    dark: '#6E4D43',
    light: '#D9B29E',
    stripe: '#8C6254',
    accent: '#C49A84',
    eye: '#66A83A',
    eyeShine: '#B9E47A',
    nose: '#9E6666',
    whisker: '#A77D70',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
