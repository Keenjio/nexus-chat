const NVIDIA_NIM_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
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
  const { request } = context;
  // The client sends the NVIDIA NIM API key (starts with "nvapi-") in this
  // custom header rather than a standard Authorization header, so it never
  // collides with any auth the hosting platform itself might apply.
  const apiKey = (request.headers.get('X-NVIDIA-Key') || '').trim();
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
