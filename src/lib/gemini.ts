import { getCurrentAuthIdToken, isFirebaseConfigured } from "@/lib/firebase";

export const isGeminiConfigured = isFirebaseConfigured;

export interface GeminiStaffContext {
  name: string;
  role: string;
  status: string;
  assignments: { task: string; done: boolean }[];
  shiftStart: string;
  shiftEnd: string;
}

export interface GeminiExpenseContext {
  category: string;
  amount: number;
  description: string;
  date: string;
}

export async function askGemini(
  userMessage: string,
  staffContext: GeminiStaffContext[],
  expenseContext: GeminiExpenseContext[],
  chatHistory: { role: "user" | "model"; parts: string }[]
): Promise<string> {
  const idToken = await getCurrentAuthIdToken();
  if (!idToken) return "";

  try {
    const res = await fetch("/api/ask-home-assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ userMessage, staffContext, expenseContext, chatHistory }),
    });
    if (!res.ok) {
      console.warn(`Gemini server request failed: status=${res.status}`);
      return "";
    }
    const data = (await res.json()) as { text?: string };
    return data.text || "";
  } catch (error) {
    console.warn("Gemini server request failed", error);
    return "";
  }
}

export interface GeminiAction {
  type: "add_task" | "update_status" | "add_expense" | "mark_attendance";
  staffName?: string;
  task?: string;
  status?: string;
  category?: string;
  amount?: number;
  description?: string;
}

export function parseGeminiActions(text: string): GeminiAction[] {
  const actions: GeminiAction[] = [];
  const regex = /<action>([\s\S]*?)<\/action>/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    try {
      actions.push(JSON.parse(match[1].trim()) as GeminiAction);
    } catch {
      // An invalid model action is ignored rather than executed.
    }
  }
  return actions;
}

export function stripActionTags(text: string): string {
  return text.replace(/<action>[\s\S]*?<\/action>/g, "").trim();
}

export interface ReceiptItem {
  description: string;
  amount: number;
  category: "Fuel" | "Groceries" | "Repairs" | "Advances" | "Household";
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function scanReceiptWithGemini(file: File): Promise<ReceiptItem[]> {
  if (file.size > 2_000_000) throw new Error("Choose an image smaller than 2 MB.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Choose a JPG, PNG, or WebP receipt image.");
  }
  const idToken = await getCurrentAuthIdToken();
  if (!idToken) throw new Error("Sign in before scanning a receipt.");

  const res = await fetch("/api/scan-receipt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ imageBase64: await fileToBase64(file), mimeType: file.type }),
  });
  if (!res.ok) throw new Error("Receipt scan is unavailable. Please try again later.");
  const data = (await res.json()) as { items?: ReceiptItem[] };
  return data.items || [];
}
