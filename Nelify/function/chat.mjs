// Netlify Function: proxies chat completion requests to OpenRouter server-side.
//
// Why this exists: some corporate networks / security proxies (e.g. Zscaler) block
// or interfere with direct browser fetch() calls to third-party API domains like
// openrouter.ai, which the browser then reports as a CORS failure. Routing the
// request through a Netlify Function means the browser only ever talks to your own
// *.netlify.app domain (already trusted, since that's how the page loaded), and the
// actual call to OpenRouter happens server-to-server from Netlify's infrastructure,
// completely outside any client-side network's visibility. There is no further
// "evade Zscaler" tuning needed on the OpenRouter leg — Zscaler cannot see or
// interfere with a server-to-server call it never sits between.
//
// The user's API key is sent from the browser in a request header on each call and
// forwarded here — it is never stored or logged by this function.

const UPSTREAM_TIMEOUT_MS = 60_000;

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: { message: 'Method not allowed' } }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const apiKey = request.headers.get('x-openrouter-key');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: 'Missing API key' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await request.text();
    // Basic sanity cap: reject absurdly large payloads before forwarding upstream.
    if (body.length > 2_000_000) {
      return new Response(JSON.stringify({ error: { message: 'Request body too large' } }), {
        status: 413,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: { message: 'Invalid request body' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const upstreamController = new AbortController();
  const timeoutId = setTimeout(() => upstreamController.abort(), UPSTREAM_TIMEOUT_MS);

  // If the browser disconnects (user closed tab, hit stop, network dropped),
  // stop the upstream OpenRouter request too instead of letting it run to completion
  // for nothing.
  request.signal?.addEventListener('abort', () => upstreamController.abort());

  let upstream;
  try {
    upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body,
      signal: upstreamController.signal
    });
  } catch (e) {
    const message = e.name === 'AbortError'
      ? 'Request to OpenRouter timed out or was cancelled'
      : `Upstream fetch failed: ${e.message}`;
    return new Response(JSON.stringify({ error: { message } }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    clearTimeout(timeoutId);
  }

  // Stream the upstream response straight through, preserving status and content-type
  // so the existing client-side streaming reader code works unchanged.
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('content-type') || 'application/json'
    }
  });
};


