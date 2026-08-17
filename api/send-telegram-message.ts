import { allowOnlyPost, ApiRequest, ApiResponse, parseJsonBody, requireFirebaseUser } from "./_auth.js";

interface TelegramRequest {
  chatId?: string | number;
  text?: string;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!allowOnlyPost(req, res)) return;

  try {
    await requireFirebaseUser(req);
  } catch {
    res.status(401).json({ error: "Sign in is required." });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    res.status(503).json({ error: "Telegram bot token not configured." });
    return;
  }

  const { chatId, text } = parseJsonBody<TelegramRequest>(req.body);
  if (!chatId || !text) {
    res.status(400).json({ error: "chatId and text are required." });
    return;
  }

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    const result = await telegramRes.json() as { ok: boolean; description?: string };
    if (!telegramRes.ok || !result.ok) {
      res.status(502).json({ error: result.description || "Telegram request failed." });
      return;
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Telegram API failed:", err);
    res.status(500).json({ error: "Telegram request failed." });
  }
}
