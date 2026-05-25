import { CAT_REGISTRY, loadAllCats } from './index.js';

const STORAGE_KEYS = {
  unlocked: 'hajimi-unlocked-cats',
  stats: 'hajimi-local-match-stats',
};

const form = document.getElementById('match-form');
const submitButton = document.getElementById('submit-button');
const statusText = document.getElementById('status-text');
const resultPanel = document.getElementById('result-panel');
const resultSprite = document.getElementById('result-sprite');
const resultName = document.getElementById('result-name');
const resultDescription = document.getElementById('result-description');
const traitList = document.getElementById('trait-list');
const atlasJump = document.getElementById('atlas-jump');
const atlasPanel = document.getElementById('atlas-panel');
const atlasStats = document.getElementById('atlas-stats');
const gallery = document.getElementById('gallery');

const cats = await loadAllCats();
const catsById = new Map(cats.map((cat) => [cat.id, cat]));
const catProfiles = cats.map((cat) => ({
  id: cat.id,
  name: cat.name,
  personality: cat.personality,
  pattern: cat.breed.pattern,
  fluffy: cat.breed.fluffy,
  colors: cat.breed.colors,
}));

let unlocked = new Set(readJson(STORAGE_KEYS.unlocked, []));
let stats = readJson(STORAGE_KEYS.stats, {});
let activeResultCat = null;

await refreshStats();
renderAtlas();

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setLoading(true, '正在召唤 DeepSeek 匹配你的哈脊米...');

  const payload = collectPayload();
  let match = null;

  try {
    match = await requestMatch(payload);
  } catch (error) {
    console.warn('[HajimiMatch] API 匹配失败，使用本地兜底。', error);
    match = buildLocalMatch(payload);
  }

  if (!catsById.has(match.catId)) {
    match = buildLocalMatch(payload);
  }

  unlocked.add(match.catId);
  writeJson(STORAGE_KEYS.unlocked, [...unlocked]);

  if (match.stats) {
    stats = match.stats;
    writeJson(STORAGE_KEYS.stats, stats);
  } else {
    incrementLocalStat(match.catId);
  }

  await renderResult(match);
  renderAtlas();
  setLoading(false, match.source === 'deepseek' ? '匹配完成，已解锁一只哈脊米。' : '已使用本地规则完成匹配，后端启动后会自动调用 DeepSeek。');
});

atlasJump.addEventListener('click', () => {
  atlasPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

async function requestMatch(payload) {
  const response = await fetch('/api/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`匹配接口返回 ${response.status}`);
  }

  return response.json();
}

function collectPayload() {
  const data = new FormData(form);
  return {
    profile: {
      mbti: data.get('mbti'),
      gender: data.get('gender'),
    },
    answers: [
      { question: '用三句话描述一下你最近的精神状态', answer: data.get('q1') },
      { question: '你希望你的哈脊米怎么陪你？', answer: data.get('q2') },
      { question: '朋友眼里的你通常是什么样？', answer: data.get('q3') },
    ],
    cats: catProfiles,
  };
}

async function renderResult(match) {
  const baseCat = catsById.get(match.catId);
  const displayCat = await createCatById(match.catId);

  if (activeResultCat) activeResultCat.destroy();
  activeResultCat = displayCat;

  resultSprite.innerHTML = '';
  displayCat.mount(resultSprite);
  displayCat.play('happy');

  resultName.textContent = match.name || baseCat.name;
  resultDescription.textContent = match.description || `你和 ${baseCat.name} 的频率很接近：${baseCat.personality}`;
  traitList.innerHTML = '';

  const traits = Array.isArray(match.traits) && match.traits.length > 0
    ? match.traits
    : buildLocalTraits(collectPayload());

  traits.slice(0, 5).forEach((trait) => {
    const badge = document.createElement('span');
    badge.textContent = trait;
    traitList.appendChild(badge);
  });

  resultPanel.classList.remove('is-hidden');
  resultPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function renderAtlas() {
  gallery.innerHTML = '';

  const totalMatches = Object.values(stats).reduce((sum, count) => sum + Number(count || 0), 0);
  const claimedCount = cats.filter((cat) => isClaimed(cat.id)).length;
  atlasStats.innerHTML = `
    <span>全站已认领 ${claimedCount}/${cats.length}</span>
    <span>累计匹配 ${totalMatches} 人次</span>
  `;

  cats.forEach((cat) => {
    const isUnlocked = isClaimed(cat.id);
    const card = document.createElement('article');
    card.className = `cat-card ${isUnlocked ? 'is-unlocked' : 'is-locked'}`;

    const spriteWrap = document.createElement('div');
    spriteWrap.className = 'sprite-wrap';

    if (isUnlocked) {
      cat.mount(spriteWrap);
      cat.play('healthy');
      spriteWrap.addEventListener('click', () => {
        cat.play('happy');
        window.setTimeout(() => cat.play('healthy'), 1400);
      });
    } else {
      const unknown = document.createElement('span');
      unknown.className = 'unknown-mark';
      unknown.textContent = '?';
      spriteWrap.appendChild(unknown);
    }

    const title = document.createElement('h3');
    title.textContent = isUnlocked ? cat.name : '未解锁哈脊米';

    const personality = document.createElement('p');
    personality.className = 'personality';
    personality.textContent = isUnlocked ? cat.personality : '还没有人认领过它，等第一个有缘人出现。';

    const count = document.createElement('span');
    count.className = 'state-label';
    count.textContent = `${Number(stats[cat.id] || 0)} 人匹配过`;

    card.append(spriteWrap, title, personality, count);
    gallery.appendChild(card);
  });
}

async function refreshStats() {
  try {
    const response = await fetch('/api/stats');
    if (!response.ok) return;
    const nextStats = await response.json();
    stats = nextStats;
    writeJson(STORAGE_KEYS.stats, stats);
  } catch {
    // 静态打开页面时没有服务端统计，继续使用本地缓存。
  }
}

async function createCatById(catId) {
  const entry = CAT_REGISTRY.find((item) => item.id === catId);
  const mod = await entry.import();
  return mod.createCat();
}

function buildLocalMatch(payload) {
  const seed = [
    payload.profile.mbti,
    payload.profile.gender,
    ...payload.answers.map((item) => item.answer),
  ].join('|');
  const index = Math.abs(hashString(seed)) % catProfiles.length;
  const cat = catProfiles[index];
  const traits = buildLocalTraits(payload);

  return {
    catId: cat.id,
    name: cat.name,
    description: `你匹配到 ${cat.name}。它${cat.personality}，和你身上“${traits.slice(0, 2).join('、')}”的气质很合拍。`,
    traits,
    source: 'local',
  };
}

function buildLocalTraits(payload) {
  const mbti = String(payload.profile.mbti || '').toUpperCase();
  const answerText = payload.answers.map((item) => item.answer || '').join(' ');
  const companionTrait = /贴|陪|抱|安慰|emo|情绪/.test(answerText)
    ? '需要温柔贴贴'
    : /冲|疯|玩|热闹|朋友/.test(answerText)
      ? '快乐外放'
      : '安静陪伴型';

  const traits = [
    mbti.startsWith('I') ? '安静蓄电' : '外放发光',
    mbti.includes('N') ? '脑洞巡游' : '细节雷达',
    mbti.includes('T') ? '理性拆解' : '共情敏锐',
    mbti.endsWith('J') ? '计划感强' : '随机应变',
    companionTrait,
  ];

  return traits.filter(Boolean);
}

function incrementLocalStat(catId) {
  stats = { ...stats, [catId]: Number(stats[catId] || 0) + 1 };
  writeJson(STORAGE_KEYS.stats, stats);
}

function isClaimed(catId) {
  return unlocked.has(catId) || Number(stats[catId] || 0) > 0;
}

function setLoading(isLoading, message) {
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? '匹配中...' : '召唤我的哈脊米';
  statusText.textContent = message;
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

window.hajimiMatch = { cats, catProfiles };
