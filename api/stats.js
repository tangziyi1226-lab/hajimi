import { readStats, sendJson } from './_shared.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, { error: 'Method not allowed' }, 405);
  }

  try {
    return sendJson(res, await readStats());
  } catch (error) {
    console.error('[hajimi-api] stats failed', error);
    return sendJson(res, { error: 'Server error' }, 500);
  }
}
