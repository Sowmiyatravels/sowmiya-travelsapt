// Vercel Serverless Function — /api/send-whatsapp
// Sends booking confirmation WhatsApp messages
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone, message } = req.body || {};
  if (!phone || !message) return res.status(400).json({ error: 'phone and message required' });

  const FONNTE_TOKEN = process.env.FONNTE_TOKEN;
  if (!FONNTE_TOKEN) return res.status(500).json({ error: 'FONNTE_TOKEN not configured' });

  try {
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': FONNTE_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ target: phone, message, countryCode: '91' })
    });
    const data = await response.json();
    return res.status(200).json({ success: data.status === true });
  } catch (err) {
    return res.status(200).json({ success: false, reason: err.message });
  }
}
