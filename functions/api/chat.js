
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-OpenRouter-Key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function onRequestPost(context) {
  const { request } = context;
  const apiKey = request.headers.get('X-OpenRouter-Key');
  if (!apiKey) return json({ error: { message: 'Missing API key' } }, 400);

  let body;
  try {
    body = await request.text();
    if (!body || body.length > 2_000_000) {
      return json({ error: { message: 'Invalid or oversized request body' } }, 400);
    }
  } catch {
    return json({ error: { message: 'Invalid request body' } }, 400);
  }

  let upstream;
  try {
    upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': new URL(request.url).origin,
        'X-Title': 'Nexus'
      },
      body
    });
  } catch {
    return json({ error: { message: 'Unable to reach OpenRouter' } }, 502);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      ...corsHeaders,
      'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
      'Cache-Control': 'no-cache, no-transform'
    }
  });
}
