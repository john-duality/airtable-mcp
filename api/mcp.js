export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.AIRTABLE_API_KEY || '';
  const baseId = process.env.AIRTABLE_BASE_ID || '';
  const upstream = 'https://airtable-mcp-4aw4.onrender.com/mcp'; // your Render URL

  try {
    const upstreamRes = await fetch(upstream, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-airtable-api-key': apiKey,
        'x-airtable-base-id': baseId
      },
      body: JSON.stringify(req.body ?? {})
    });

    const text = await upstreamRes.text();
    res.status(upstreamRes.status).send(text);
  } catch (e) {
    res.status(502).json({ error: 'Upstream error', details: String(e) });
  }
}
