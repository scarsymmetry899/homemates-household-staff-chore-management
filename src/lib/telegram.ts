import { getCurrentAuthIdToken } from "@/lib/firebase";

export async function sendMessage(chatId: number | string, text: string): Promise<boolean> {
  const idToken = await getCurrentAuthIdToken();
  if (!idToken) return false;

  try {
    const res = await fetch("/api/send-telegram-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ chatId, text }),
    });
    return res.ok;
  } catch (error) {
    console.warn("Telegram server request failed", error);
    return false;
  }
}
