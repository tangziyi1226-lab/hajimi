import { matchHajimi, parseBody, recordMatch, sendJson } from './_shared.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, { error: 'Method not allowed' }, 405);
  }

  try {
    const payload = parseBody(req);
    const match = await matchHajimi(payload);
    const stats = await recordMatch(match.catId);
    return sendJson(res, { ...match, stats });
  } catch (error) {
    console.error('[hajimi-api] match failed', error);
    return sendJson(res, { error: 'Server error' }, 500);
  }
}
