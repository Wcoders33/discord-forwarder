export default async function handler(req, res) {
  const { embed, webhook_url } = req.body;

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
