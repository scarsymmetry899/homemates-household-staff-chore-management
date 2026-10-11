import { getCurrentAuthUser } from "@/lib/firebase";

async function ownerChatStorageKey(): Promise<string | null> {
  const user = await getCurrentAuthUser();
  return user ? `homemaker_owner_telegram_chat_id:${user.uid}` : null;
}

export async function getOwnerTelegramChatId(): Promise<string> {
  const key = await ownerChatStorageKey();
  return key ? localStorage.getItem(key) || "" : "";
}

export async function saveOwnerTelegramChatId(chatId: string): Promise<boolean> {
  const key = await ownerChatStorageKey();
  if (!key) return false;
  if (chatId) localStorage.setItem(key, chatId);
  else localStorage.removeItem(key);
  return true;
}
