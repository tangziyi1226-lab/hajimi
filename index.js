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
  { id: 'cow-cat', path: './cats/cow-cat/cat.js', import: () => import('./cats/cow-cat/cat.js') },
  { id: 'black-cat', path: './cats/black-cat/cat.js', import: () => import('./cats/black-cat/cat.js') },
  { id: 'white-cat', path: './cats/white-cat/cat.js', import: () => import('./cats/white-cat/cat.js') },
  { id: 'tuxedo', path: './cats/tuxedo/cat.js', import: () => import('./cats/tuxedo/cat.js') },
  { id: 'tortoiseshell', path: './cats/tortoiseshell/cat.js', import: () => import('./cats/tortoiseshell/cat.js') },
  { id: 'silver-tabby', path: './cats/silver-tabby/cat.js', import: () => import('./cats/silver-tabby/cat.js') },
  { id: 'golden-shaded', path: './cats/golden-shaded/cat.js', import: () => import('./cats/golden-shaded/cat.js') },
  { id: 'abyssinian', path: './cats/abyssinian/cat.js', import: () => import('./cats/abyssinian/cat.js') },
  { id: 'norwegian-forest', path: './cats/norwegian-forest/cat.js', import: () => import('./cats/norwegian-forest/cat.js') },
  { id: 'sphynx', path: './cats/sphynx/cat.js', import: () => import('./cats/sphynx/cat.js') },
  { id: 'munchkin', path: './cats/munchkin/cat.js', import: () => import('./cats/munchkin/cat.js') },
  { id: 'devon-rex', path: './cats/devon-rex/cat.js', import: () => import('./cats/devon-rex/cat.js') },
  { id: 'american-shorthair', path: './cats/american-shorthair/cat.js', import: () => import('./cats/american-shorthair/cat.js') },
  { id: 'himalayan', path: './cats/himalayan/cat.js', import: () => import('./cats/himalayan/cat.js') },
  { id: 'bombay', path: './cats/bombay/cat.js', import: () => import('./cats/bombay/cat.js') },
  { id: 'korat', path: './cats/korat/cat.js', import: () => import('./cats/korat/cat.js') },
  { id: 'chartreux', path: './cats/chartreux/cat.js', import: () => import('./cats/chartreux/cat.js') },
  { id: 'turkish-van', path: './cats/turkish-van/cat.js', import: () => import('./cats/turkish-van/cat.js') },
  { id: 'manx', path: './cats/manx/cat.js', import: () => import('./cats/manx/cat.js') },
  { id: 'toyger', path: './cats/toyger/cat.js', import: () => import('./cats/toyger/cat.js') },
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
