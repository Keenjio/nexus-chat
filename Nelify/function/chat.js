// Netlify Function: proxies chat completion requests to OpenRouter server-side.
//
// Why this exists: some corporate networks / security proxies (e.g. Zscaler) block
// or interfere with direct browser fetch() calls to third-party API domains like
// openrouter.ai, which the browser then reports as a CORS failure. Routing the
// request through a Netlify Function means the browser only ever talks to your own
// *.netlify.app domain (already trusted, since that's how the page loaded), and the
// actual call to OpenRouter happens server-to-server from Netlify's infrastructure,
// invisible to any client-side network interception.
//
// The user's API key is sent from the browser in a request header on each call and
// forwarded here — it is never stored or logged by this function.

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
  } catch (e) {
    return new Response(JSON.stringify({ error: { message: 'Invalid request body' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let upstream;
  try {
    upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: { message: `Upstream fetch failed: ${e.message}` } }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
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

export const config = {
  path: '/api/chat'
};
