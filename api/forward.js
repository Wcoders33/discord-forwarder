export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  let body = req.body;

  // If body is undefined, try to parse it manually
  if (!body || typeof body !== "object") {
    try {
      body = JSON.parse(req.body);
    } catch {
      return res.status(400).json({ success: false, error: "Invalid JSON body" });
    }
  }

  const { embed, webhook_url } = body;

  if (!embed || !webhook_url) {
    return res.status(400).json({ success: false, error: "Missing embed or webhook_url" });
  }

  try {
    const response = await fetch(webhook_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (response.status >= 200 && response.status < 300) {
      return res.status(200).json({ success: true });
    } else {
      const text = await response.text();
      return res.status(response.status).json({ success: false, status: response.status, response: text });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
