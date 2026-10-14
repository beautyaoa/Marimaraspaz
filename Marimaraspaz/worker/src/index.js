/**
 * Marimaras Paz — Publish Worker
 * Receives catalog from admin panel, verifies password, signed-uploads to Cloudinary.
 *
 * Secrets (wrangler secret put):
 *   ADMIN_PASSWORD
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/health' || url.pathname === '/') {
      return json({ ok: true, service: 'marimaraspaz-publish' }, 200);
    }

    if (url.pathname === '/publish' && request.method === 'POST') {
      return handlePublish(request, env);
    }

    return json({ error: 'Not found' }, 404);
  },
};

async function handlePublish(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const password = body.password || '';
  if (!env.ADMIN_PASSWORD || password !== env.ADMIN_PASSWORD) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const catalog = body.catalog;
  if (!catalog || typeof catalog !== 'object') {
    return json({ error: 'Missing catalog' }, 400);
  }

  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return json({ error: 'Server misconfigured' }, 500);
  }

  const folder = 'marimaraspaz';
  const publicId = `${folder}/catalog`;
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = {
    ...catalog,
    updatedAt: new Date().toISOString(),
  };
  const fileContent = JSON.stringify(payload, null, 2);

  // Signature: params sorted alphabetically + secret
  // For raw upload: public_id, timestamp, (optional folder is in public_id)
  const toSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = await sha1(toSign);

  const form = new FormData();
  form.append('file', new Blob([fileContent], { type: 'application/json' }), 'catalog.json');
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('public_id', publicId);
  form.append('signature', signature);
  form.append('resource_type', 'raw');
  form.append('overwrite', 'true');
  form.append('invalidate', 'true');

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;
  let res;
  try {
    res = await fetch(uploadUrl, { method: 'POST', body: form });
  } catch (e) {
    return json({ error: 'Upload failed', detail: String(e) }, 502);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return json({ error: 'Cloudinary error', detail: data }, 502);
  }

  return json({
    ok: true,
    url: data.secure_url || `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}.json`,
    updatedAt: payload.updatedAt,
  }, 200);
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

async function sha1(message) {
  const data = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest('SHA-1', data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}
