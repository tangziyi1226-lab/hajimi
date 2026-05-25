import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'toyger',
  name: '虎虎 · 玩具虎猫',
  personality: '精神饱满，虎纹醒目，是迷你版的小老虎',
  scale: 4,
  pattern: 'marble',
  chestPatch: 'white',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#D9852F',
    dark: '#6B3516',
    light: '#F3B36A',
    stripe: '#3B2416',
    accent: '#A85A22',
    eye: '#5F8A2B',
    eyeShine: '#B7D96B',
    nose: '#B56455',
    whisker: '#AD6A35',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
