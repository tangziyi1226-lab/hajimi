/** 所有哈脊米品种注册表 */
export const CAT_REGISTRY = [
  { id: 'orange-tabby', path: './cats/orange-tabby/cat.js', import: () => import('./cats/orange-tabby/cat.js') },
  { id: 'british-shorthair', path: './cats/british-shorthair/cat.js', import: () => import('./cats/british-shorthair/cat.js') },
  { id: 'siamese', path: './cats/siamese/cat.js', import: () => import('./cats/siamese/cat.js') },
  { id: 'ragdoll', path: './cats/ragdoll/cat.js', import: () => import('./cats/ragdoll/cat.js') },
  { id: 'persian', path: './cats/persian/cat.js', import: () => import('./cats/persian/cat.js') },
  { id: 'maine-coon', path: './cats/maine-coon/cat.js', import: () => import('./cats/maine-coon/cat.js') },
  { id: 'scottish-fold', path: './cats/scottish-fold/cat.js', import: () => import('./cats/scottish-fold/cat.js') },
  { id: 'bengal', path: './cats/bengal/cat.js', import: () => import('./cats/bengal/cat.js') },
  { id: 'russian-blue', path: './cats/russian-blue/cat.js', import: () => import('./cats/russian-blue/cat.js') },
  { id: 'calico', path: './cats/calico/cat.js', import: () => import('./cats/calico/cat.js') },
];

export async function loadAllCats() {
  const cats = [];
  for (const entry of CAT_REGISTRY) {
    const mod = await entry.import();
    cats.push(mod.createCat());
  }
  return cats;
}

export { STATES, STATE_KEYS } from './core/states.js';
export { HajimiCat, createHajimiCat } from './core/hajimi-cat.js';
