import { getCurrentAuthIdToken, getFirebaseFunctions } from "@/lib/firebase";

const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string | undefined;
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export interface TgUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: { id: number; first_name: string; username?: string };
    chat: { id: number; type: string };
    date: number;
    text?: string;
  };
}

export interface TgBotInfo {
  id: number;
  first_name: string;
  username: string;
}

export async function getBotInfo(): Promise<TgBotInfo | null> {
  if (!BOT_TOKEN) return null;
  try {
    const res = await fetch(`${BASE_URL}/getMe`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.ok) return null;
    return data.result as TgBotInfo;
  } catch {
    return null;
  }
}

export async function sendMessage(chatId: number | string, text: string): Promise<boolean> {
  const idToken = await getCurrentAuthIdToken();
  if (idToken) {
    try {
      const res = await fetch("/api/send-telegram-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ chatId, text }),
      });
      if (res.ok) return true;
    } catch (err) {
      console.warn("Telegram Vercel API failed; trying Firebase callable fallback.", err);
    }
  }

  const functions = await getFirebaseFunctions();
  if (functions) {
    try {
      const { httpsCallable } = await import("firebase/functions");
      const sendTelegramMessage = httpsCallable(functions, "sendTelegramMessage");
      await sendTelegramMessage({ chatId, text });
      return true;
    } catch (err) {
      console.warn("Telegram callable failed; trying local demo token fallback.", err);
    }
  }

  if (!BOT_TOKEN) return false;
  try {
    const res = await fetch(`${BASE_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.ok === true;
  } catch {
    return false;
  }
}

export interface TgBotCommand {
  command: string;
  description: string;
}

export async function setMyCommands(commands: TgBotCommand[]): Promise<boolean> {
  if (!BOT_TOKEN) return false;
  try {
    const res = await fetch(`${BASE_URL}/setMyCommands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commands }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.ok === true;
  } catch {
    return false;
  }
}

export async function getUpdates(offset?: number): Promise<TgUpdate[]> {
  if (!BOT_TOKEN) return [];
  try {
    const params = new URLSearchParams({ timeout: "0", limit: "30" });
    if (offset !== undefined) params.set("offset", String(offset));
    const res = await fetch(`${BASE_URL}/getUpdates?${params.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.ok) return [];
    return data.result as TgUpdate[];
  } catch {
    return [];
  }
}
