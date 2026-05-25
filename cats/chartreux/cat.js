import { createHajimiCat } from '../../core/hajimi-cat.js';

export const breed = {
  id: 'chartreux',
  name: '沙特 · 夏特尔',
  personality: '安静可靠，蓝灰厚毛，像守在书桌边的小骑士',
  scale: 4,
  pattern: 'none',
  chestPatch: 'none',
  earStyle: 'normal',
  fluffy: true,
  colors: {
    base: '#667685',
    dark: '#3A4652',
    light: '#94A4B2',
    stripe: '#4E5C68',
    accent: '#7C8B98',
    eye: '#D8911F',
    eyeShine: '#FFD180',
    nose: '#68727D',
    whisker: '#788692',
  },
};

export function createCat() {
  return createHajimiCat(breed);
}

export default createCat;
