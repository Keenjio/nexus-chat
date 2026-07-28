const NVIDIA_NIM_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const DEFAULT_OPENROUTER_URL = 'https://api.openrouter.ai/v1/chat/completions';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-NVIDIA-Key, Authorization, X-OPENROUTER-Key',
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
  const { request, env } = context;

  // Accept either an explicit NVIDIA key header or an Authorization/X-OPENROUTER-Key
  const clientNvidiaKey = (request.headers.get('X-NVIDIA-Key') || '').trim();
  const clientAuthHeader = (request.headers.get('Authorization') || '').trim();
  const clientOpenKey = (request.headers.get('X-OPENROUTER-Key') || '').trim();

  const envNvidia = (env.NVIDIA_API_KEY || '').trim();
  const envOpen = (env.OPENROUTER_API_KEY || '').trim();
  const openUrl = (env.OPENROUTER_URL || DEFAULT_OPENROUTER_URL).trim();

  let bodyText;
  try {
    bodyText = await request.text();
    if (!bodyText || bodyText.length > 2_000_000) {
      return json({ error: { message: 'Invalid or oversized request body' } }, 400);
    }
  } catch {
    return json({ error: { message: 'Invalid request body' } }, 400);
  }

  let parsed = null;
  try { parsed = JSON.parse(bodyText); } catch (e) { /* not JSON — still forward as-is */ }

  const looksLikeOpenRouterModel = (m) => typeof m === 'string' && (m.includes(':free') || m.startsWith('openrouter/') || m.startsWith('openai/gpt-3.5') || m === 'google/gemini-flash-1.5');

  // Decide provider: prefer explicit client headers, then model hint, then server env fallbacks
  let provider = 'nvidia';
  if (clientNvidiaKey) provider = 'nvidia';
  else if (clientAuthHeader || clientOpenKey) provider = 'openrouter';
  else if (parsed && looksLikeOpenRouterModel(parsed.model)) provider = 'openrouter';
  else if (envOpen) provider = 'openrouter';
  else if (envNvidia) provider = 'nvidia';

  let upstreamUrl = provider === 'openrouter' ? (openUrl || DEFAULT_OPENROUTER_URL) : NVIDIA_NIM_URL;
  const headers = { 'Content-Type': 'application/json' };

  if (provider === 'nvidia') {
    const apiKey = clientNvidiaKey || envNvidia;
    if (!apiKey) return json({ error: { message: 'Missing NVIDIA API key' } }, 400);
    // NVIDIA uses a Bearer-like Authorization scheme for its public API keys
    headers['Authorization'] = `Bearer ${apiKey}`;
  } else {
    // openrouter/openai-style
    if (clientAuthHeader) {
      headers['Authorization'] = clientAuthHeader;
    } else if (clientOpenKey) {
      headers['Authorization'] = `Bearer ${clientOpenKey}`;
    } else if (envOpen) {
      headers['Authorization'] = `Bearer ${envOpen}`;
    } else {
      return json({ error: { message: 'Missing OpenRouter / OpenAI API key' } }, 400);
    }
  }

  let upstream;
  try {
    upstream = await fetch(upstreamUrl, {
      method: 'POST',
      headers,
      body: bodyText
    });
  } catch (err) {
    return json({ error: { message: `Unable to reach ${provider} backend` } }, 502);
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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-NVIDIA-Key',
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
  const { request, env } = context;
  // The client sends the NVIDIA NIM API key (starts with "nvapi-") in this
  // custom header rather than a standard Authorization header, so it never
  // collides with any auth the hosting platform itself might apply.
  //
  // If the client didn't send one (Settings → API key left blank), fall back
  // to a key configured server-side via environment variable — set this in
  // your hosting platform's dashboard (e.g. Cloudflare Pages → Settings →
  // Environment Variables → NVIDIA_API_KEY), NOT in this file. This keeps
  // the key out of the deployed HTML/JS entirely, so visitors viewing page
  // source or dev tools never see it — only requests that pass through this
  // server-side function use it.
  const clientKey = (request.headers.get('X-NVIDIA-Key') || '').trim();
  const apiKey = clientKey || (env.NVIDIA_API_KEY || '').trim();
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
    upstream = await fetch(NVIDIA_NIM_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
        // NVIDIA NIM's endpoint doesn't use OpenRouter-specific headers like
        // HTTP-Referer / X-Title, so those are intentionally dropped here.
      },
      body
    });
  } catch {
    return json({ error: { message: 'Unable to reach NVIDIA NIM' } }, 502);
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
