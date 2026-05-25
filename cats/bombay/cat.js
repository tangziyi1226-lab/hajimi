import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'bombay',
  name: '夜夜 · 孟买猫',
  personality: '亲人又自信，黑亮亮的毛像一小片夜色',
  scale: 4,
  pattern: 'smoke',
  chestPatch: 'none',
  earStyle: 'normal',
  fluffy: false,
  colors: {
    base: '#242428',
    dark: '#101014',
    light: '#3A3A42',
    stripe: '#1B1B20',
    accent: '#303038',
    eye: '#F2B632',
    eyeShine: '#FFE082',
    nose: '#45323A',
    whisker: '#575762',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
