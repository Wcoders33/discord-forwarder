export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  let body = req.body;

  // If body is a string, parse it
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, error: "Invalid JSON" });
    }
  }

  const { webhook_url, embed } = body;

  if (!webhook_url || !embed) {
    return res.status(400).json({ success: false, error: "Missing webhook_url or embed" });
  }

  try {
    const discordRes = await fetch(webhook_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] })
    });

    if (discordRes.status >= 200 && discordRes.status < 300) {
      return res.status(200).json({ success: true });
    } else {
      const text = await discordRes.text();
      return res.status(discordRes.status).json({ success: false, response: text });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
