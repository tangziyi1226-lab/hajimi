const STATS_KEY = 'hajimi:match-stats';

export async function matchHajimi(payload) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return buildLocalMatch(payload);
  }

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
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
              '你是结合姿态检测桌宠项目的哈脊米人格匹配师。根据用户 MBTI、性别和 7 道选择题答案，从候选资产库里选择一只最匹配的哈脊米。',
              '其中有久坐、腰酸背痛、坐姿习惯相关答案，请把姿态健康需求融入结果。',
              '只能选择候选 cats 里已有的 id，不要杜撰新猫。',
              '只输出 JSON，不要 Markdown，不要解释。',
              'JSON 结构必须是：{"catId":"候选 id","name":"候选 name","description":"60到90字中文性格描述","imageProfile":"一句更符合用户的形象画像","postureHelp":"一句以“哈脊米可以帮助你在改善坐姿上”开头的姿态帮助说明","traits":["人格特征1","人格特征2","人格特征3","人格特征4"]}',
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
    console.warn('[hajimi-api] DeepSeek 匹配失败，使用本地兜底。', error.message);
    return buildLocalMatch(payload);
  }
}

export async function readStats() {
  const kv = await getKv();
  if (kv) return (await kv.get(STATS_KEY)) || {};

  globalThis.__HAJIMI_STATS__ ||= {};
  return globalThis.__HAJIMI_STATS__;
}

export async function recordMatch(catId) {
  const stats = { ...(await readStats()) };
  stats[catId] = Number(stats[catId] || 0) + 1;

  const kv = await getKv();
  if (kv) {
    await kv.set(STATS_KEY, stats);
  } else {
    globalThis.__HAJIMI_STATS__ = stats;
  }

  return stats;
}

export function sendJson(res, data, status = 200) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

export function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  return req.body;
}

function normalizeAiMatch(match, payload) {
  const candidate = payload.cats?.find((cat) => cat.id === match.catId);
  if (!candidate) return buildLocalMatch(payload);

  return {
    catId: candidate.id,
    name: candidate.name,
    description: String(match.description || `你匹配到 ${candidate.name}。${candidate.personality}`).slice(0, 140),
    imageProfile: String(match.imageProfile || buildImageProfile(payload)).slice(0, 120),
    postureHelp: ensurePostureHelp(match.postureHelp || buildPostureHelp(payload)),
    traits: Array.isArray(match.traits) ? match.traits.map(String).slice(0, 5) : buildLocalTraits(payload),
    source: 'deepseek',
  };
}

function buildLocalMatch(payload) {
  const cats = Array.isArray(payload.cats) ? payload.cats : [];
  const seed = [
    payload.profile?.mbti,
    payload.profile?.gender,
    ...(payload.answers || []).map((item) => item.answer),
  ].join('|');
  const index = cats.length ? Math.abs(hashString(seed)) % cats.length : 0;
  const cat = cats[index] || { id: 'orange-tabby', name: '小橘 · 橘猫', personality: '活泼开朗' };
  const traits = buildLocalTraits(payload);

  return {
    catId: cat.id,
    name: cat.name,
    description: `你匹配到 ${cat.name}。它${cat.personality}，和你身上“${traits.slice(0, 2).join('、')}”的气质很合拍。`,
    imageProfile: buildImageProfile(payload),
    postureHelp: buildPostureHelp(payload),
    traits,
    source: 'local',
  };
}

function buildLocalTraits(payload) {
  const mbti = String(payload.profile?.mbti || '').toUpperCase();
  const answerText = (payload.answers || []).map((item) => item.answer || '').join(' ');
  const companionTrait = /贴|陪|抱|安慰|emo|情绪/.test(answerText)
    ? '需要温柔贴贴'
    : /冲|疯|玩|热闹|朋友/.test(answerText)
      ? '快乐外放'
      : '安静陪伴型';

  return [
    mbti.startsWith('I') ? '安静蓄电' : '外放发光',
    mbti.includes('N') ? '脑洞巡游' : '细节雷达',
    mbti.includes('T') ? '理性拆解' : '共情敏锐',
    mbti.endsWith('J') ? '计划感强' : '随机应变',
    companionTrait,
  ];
}

function buildImageProfile(payload) {
  const answers = (payload.answers || []).map((item) => item.answer || '');
  const workMode = answers[1] || '有自己的节奏';
  const socialMode = answers[2] || '慢热但真诚';
  const image = workMode.includes('计划')
    ? '会把毛线球排整齐再出发'
    : workMode.includes('灵感')
      ? '灵感一来就竖起耳朵'
      : workMode.includes('讨论')
        ? '边喵喵交流边找到方向'
        : '边试探边调整步伐';

  return `你的形象画像：你像一只${image}的哈脊米，${socialMode}，需要一个既懂你节奏又会提醒你照顾身体的小搭子。`;
}

function buildPostureHelp(payload) {
  const answerText = (payload.answers || []).map((item) => item.answer || '').join(' ');
  const focus = answerText.includes('腰酸') || answerText.includes('塌腰')
    ? '减少塌腰久坐、及时起身放松腰背'
    : answerText.includes('肩颈') || answerText.includes('前伸')
      ? '提醒头颈回正、缓解肩颈紧绷'
      : answerText.includes('歪') || answerText.includes('翘腿')
        ? '发现身体歪斜和翘腿倾向'
        : '建立规律休息和端正坐姿的习惯';

  return `哈脊米可以帮助你在改善坐姿上${focus}，通过姿态检测变换动作，像桌面上的小监督一样陪你坐得更舒服。`;
}

function ensurePostureHelp(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  return text.startsWith('哈脊米可以帮助你在改善坐姿上') ? text.slice(0, 140) : `哈脊米可以帮助你在改善坐姿上${text}`.slice(0, 140);
}

async function getKv() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;

  try {
    const { kv } = await import('@vercel/kv');
    return kv;
  } catch {
    return null;
  }
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
