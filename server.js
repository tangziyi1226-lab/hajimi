import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(ROOT, 'data');
const STATS_FILE = path.join(DATA_DIR, 'matches.json');

await loadLocalEnv();

const PORT = Number(process.env.PORT || 5173);
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET' && url.pathname === '/api/stats') {
      return sendJson(res, await readStats());
    }

    if (req.method === 'POST' && url.pathname === '/api/match') {
      const payload = await readBody(req);
      const match = await matchHajimi(payload);
      const stats = await recordMatch(match.catId);
      return sendJson(res, { ...match, stats });
    }

    if (req.method !== 'GET') {
      return sendJson(res, { error: 'Method not allowed' }, 405);
    }

    return serveStatic(url.pathname, res);
  } catch (error) {
    console.error('[hajimi-server]', error);
    return sendJson(res, { error: 'Server error' }, 500);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  const urls = getLanUrls(PORT);
  console.log(`哈脊米匹配页已启动: http://localhost:${PORT}`);
  urls.forEach((url) => console.log(`手机同网访问: ${url}`));
});

async function matchHajimi(payload) {
  if (!DEEPSEEK_API_KEY) {
    return buildLocalMatch(payload);
  }

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        temperature: 0.78,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: [
              '你是哈脊米人格匹配师。根据用户 MBTI、性别、生日和 5 道题答案，从候选资产库里选择一只最匹配的哈脊米。',
              '只能选择候选 cats 里已有的 id，不要杜撰新猫。',
              '只输出 JSON，不要 Markdown，不要解释。',
              'JSON 结构必须是：{"catId":"候选 id","name":"候选 name","description":"60到90字中文性格描述","traits":["人格特征1","人格特征2","人格特征3","人格特征4"]}',
            ].join('\n'),
          },
          {
            role: 'user',
            content: JSON.stringify({
              profile: payload.profile,
              answers: payload.answers,
              cats: payload.cats,
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(stripJsonFence(content));
    return normalizeAiMatch(parsed, payload);
  } catch (error) {
    console.warn('[hajimi-server] DeepSeek 匹配失败，使用本地兜底。', error.message);
    return buildLocalMatch(payload);
  }
}

function normalizeAiMatch(match, payload) {
  const candidate = payload.cats?.find((cat) => cat.id === match.catId);
  if (!candidate) return buildLocalMatch(payload);

  return {
    catId: candidate.id,
    name: candidate.name,
    description: String(match.description || `你匹配到 ${candidate.name}。${candidate.personality}`).slice(0, 140),
    traits: Array.isArray(match.traits) ? match.traits.map(String).slice(0, 5) : buildLocalTraits(payload),
    source: 'deepseek',
  };
}

function buildLocalMatch(payload) {
  const cats = Array.isArray(payload.cats) ? payload.cats : [];
  const seed = [
    payload.profile?.mbti,
    payload.profile?.gender,
    payload.profile?.birthday,
    ...(payload.answers || []).map((item) => item.answer),
  ].join('|');
  const index = cats.length ? Math.abs(hashString(seed)) % cats.length : 0;
  const cat = cats[index] || { id: 'orange-tabby', name: '小橘 · 橘猫', personality: '活泼开朗' };
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
  const mbti = String(payload.profile?.mbti || '').toUpperCase();
  const month = Number(String(payload.profile?.birthday || '').slice(5, 7));
  const season = month >= 3 && month <= 5
    ? '春日好奇心'
    : month >= 6 && month <= 8
      ? '夏日行动力'
      : month >= 9 && month <= 11
        ? '秋日观察力'
        : '冬日蓄能感';

  return [
    mbti.startsWith('I') ? '安静蓄电' : '外放发光',
    mbti.includes('N') ? '脑洞巡游' : '细节雷达',
    mbti.includes('T') ? '理性拆解' : '共情敏锐',
    mbti.endsWith('J') ? '计划感强' : '随机应变',
    season,
  ];
}

async function readBody(req) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1024 * 1024) throw new Error('Body too large');
    chunks.push(chunk);
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

async function serveStatic(requestPath, res) {
  const pathname = decodeURIComponent(requestPath);
  const target = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.normalize(path.join(ROOT, target));

  if (!filePath.startsWith(ROOT)) {
    return sendText(res, 'Forbidden', 403);
  }

  try {
    const file = await fs.readFile(filePath);
    const type = MIME_TYPES[path.extname(filePath)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(file);
  } catch {
    sendText(res, 'Not found', 404);
  }
}

async function readStats() {
  try {
    return JSON.parse(await fs.readFile(STATS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

async function recordMatch(catId) {
  const stats = await readStats();
  stats[catId] = Number(stats[catId] || 0) + 1;
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2));
  return stats;
}

function sendJson(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function sendText(res, text, status = 200) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(text);
}

function stripJsonFence(value) {
  return String(value).replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function getLanUrls(port) {
  try {
    return Object.values(os.networkInterfaces())
      .flat()
      .filter((item) => item && item.family === 'IPv4' && !item.internal)
      .map((item) => `http://${item.address}:${port}`);
  } catch {
    return [];
  }
}

async function loadLocalEnv() {
  try {
    const content = await fs.readFile(path.join(ROOT, '.env'), 'utf8');
    content.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const index = trimmed.indexOf('=');
      if (index === -1) return;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key && process.env[key] === undefined) process.env[key] = value;
    });
  } catch {
    // .env 是可选的，也可以直接通过命令行环境变量传入。
  }
}
