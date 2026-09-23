const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
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

export async function onRequestGet() {
  const results = { openrouter: [], nvidia: [] };

  await Promise.allSettled([
    fetch('https://openrouter.ai/api/v1/models', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        (data.data || []).forEach(m => {
          const id = m.id || '';
          const free =
            id.endsWith(':free') ||
            (m.pricing &&
              Number(m.pricing.prompt) === 0 &&
              Number(m.pricing.completion) === 0);
          if (id && free) results.openrouter.push(id);
        });
      }),
    fetch('https://integrate.api.nvidia.com/v1/models', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        (data.data || []).forEach(m => {
          if (m.id) results.nvidia.push(m.id);
        });
      })
  ]);

  results.openrouter.sort();
  results.nvidia.sort();
  return json(results);
}
