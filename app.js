import { loadAllCats, STATES } from './index.js';

const gallery = document.getElementById('gallery');
const globalControls = document.getElementById('global-controls');
const cats = await loadAllCats();

let globalState = 'healthy';

Object.entries(STATES).forEach(([key, { label }]) => {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.dataset.state = key;
  if (key === globalState) btn.classList.add('active');
  btn.addEventListener('click', () => {
    globalState = key;
    globalControls.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    cats.forEach((cat) => {
      cat.play(key);
      updateStateLabel(cat.id, label);
    });
  });
  globalControls.appendChild(btn);
});

cats.forEach((cat) => {
  const card = document.createElement('article');
  card.className = 'cat-card';
  card.dataset.catId = cat.id;

  const spriteWrap = document.createElement('div');
  spriteWrap.className = 'sprite-wrap';
  cat.mount(spriteWrap);
  cat.play(globalState);

  const title = document.createElement('h3');
  title.textContent = cat.name;

  const personality = document.createElement('p');
  personality.className = 'personality';
  personality.textContent = cat.personality;

  const stateLabel = document.createElement('span');
  stateLabel.className = 'state-label';
  stateLabel.id = `state-${cat.id}`;
  stateLabel.textContent = STATES[globalState].label;

  const miniControls = document.createElement('div');
  miniControls.className = 'mini-controls';

  ['healthy', 'happy', 'tired', 'forward'].forEach((key) => {
    const btn = document.createElement('button');
    btn.textContent = STATES[key].label;
    btn.addEventListener('click', () => {
      cat.play(key);
      updateStateLabel(cat.id, STATES[key].label);
    });
    miniControls.appendChild(btn);
  });

  card.append(spriteWrap, title, personality, stateLabel, miniControls);
  gallery.appendChild(card);
});

function updateStateLabel(catId, label) {
  const el = document.getElementById(`state-${catId}`);
  if (el) el.textContent = label;
}

window.hajimi = { cats, STATES };
