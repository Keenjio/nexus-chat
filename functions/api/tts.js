const VOICES = [
  'af_bella', 'af_nicole', 'af_sarah', 'af_sky', 'af_heart',
  'am_adam', 'am_michael',
  'bf_emma', 'bf_isabella', 'bm_george', 'bm_lewis'
];

const MAX_CHARS_ANON = 500;
const MAX_CHARS_KEYED = 5000;
const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 20000;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function onRequestPost(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const text = String(body.text || '').trim();
  if (!text) return json({ error: 'Empty text' }, 400);

  const apiKey = String(body.key || '').trim();
  const maxChars = apiKey ? MAX_CHARS_KEYED : MAX_CHARS_ANON;
  if (text.length > maxChars) return json({ error: `Text too long (max ${maxChars} chars)` }, 400);

  const voice = VOICES.includes(body.voice) ? body.voice : 'af_bella';

  try {
    const audio = await generateSpeech(text, voice, apiKey);
    return new Response(audio, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/wav',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (err) {
    return json({ error: err.message || 'TTS generation failed' }, 502);
  }
}

async function generateSpeech(text, voice, apiKey) {
  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
  const submitRes = await fetch('https://api.tts.ai/v1/tts/', {
    method: 'POST',
    headers,
    body: JSON.stringify({ text, voice, model: 'kokoro', format: 'wav' })
  });
  if (!submitRes.ok) throw new Error(`TTS submit failed: ${submitRes.status}`);
  const { uuid } = await submitRes.json();
  if (!uuid) throw new Error('TTS submit returned no job id');

  const start = Date.now();
  while (Date.now() - start < POLL_TIMEOUT_MS) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
    const pollRes = await fetch(`https://api.tts.ai/v1/speech/results/?uuid=${uuid}`);
    if (!pollRes.ok) continue;
    const result = await pollRes.json();
    if (result.status === 'completed' && result.result_url) {
      const audioRes = await fetch(result.result_url);
      if (!audioRes.ok) throw new Error('TTS download failed');
      return await audioRes.arrayBuffer();
    }
    if (result.status === 'failed') throw new Error('TTS generation failed');
  }
  throw new Error('TTS generation timed out');
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
