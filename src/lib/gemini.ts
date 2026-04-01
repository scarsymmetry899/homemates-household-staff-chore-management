import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

export const isGeminiConfigured = !!API_KEY;

let _model: ReturnType<InstanceType<typeof GoogleGenerativeAI>["getGenerativeModel"]> | null = null;

function getModel() {
  if (!API_KEY) return null;
  if (!_model) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    _model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }
  return _model;
}

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
  const model = getModel();
  if (!model) return "";

  const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const systemPrompt = `You are a smart household staff management assistant built into the "Homemaker" app.
You help the home owner manage their domestic staff, tasks, attendance, and expenses.

Current date & time (IST): ${now}

STAFF DATA:
${staffContext
  .map(
    (s) =>
      `• ${s.name} (${s.role}) — Status: ${s.status}, Shift: ${s.shiftStart}–${s.shiftEnd}
   Tasks: ${s.assignments.map((t) => `${t.done ? "✅" : "⏳"} ${t.task}`).join(", ") || "none"}`
  )
  .join("\n")}

RECENT EXPENSES:
${expenseContext
  .slice(0, 8)
  .map((e) => `• ₹${e.amount} — ${e.category}: ${e.description} (${e.date})`)
  .join("\n")}

GUIDELINES:
- Be concise and helpful. Use ₹ for currency, not $. Use Indian number formatting.
- When asked to DO something (add task, change status, mark attendance), output a JSON action block at the END of your response in this exact format:
  <action>{"type":"add_task","staffName":"Elena Moretti","task":"Polish silverware"}</action>
  <action>{"type":"update_status","staffName":"Marcus Thorne","status":"late"}</action>
  <action>{"type":"add_expense","category":"Fuel","amount":500,"description":"Weekend fuel"}</action>
- For pure queries (who is on duty, show expenses, staff status), just answer in plain text.
- Keep responses under 120 words unless listing data.
- Do not make up information not in the context above.`;

  try {
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood! I'm ready to help manage your household staff." }] },
        ...chatHistory.map((h) => ({
          role: h.role,
          parts: [{ text: h.parts }],
        })),
      ],
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (e) {
    console.error("Gemini error:", e);
    return "";
  }
}

// Parse action blocks from Gemini response
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
      const action = JSON.parse(match[1].trim()) as GeminiAction;
      actions.push(action);
    } catch {
      // ignore malformed action blocks
    }
  }
  return actions;
}

// Strip action tags from display text
export function stripActionTags(text: string): string {
  return text.replace(/<action>[\s\S]*?<\/action>/g, "").trim();
}

// ─────────────────────────────────────────────────────────────
// Receipt scanning via Gemini Vision
// ─────────────────────────────────────────────────────────────

export interface ReceiptItem {
  description: string;
  amount: number;
  category: "Fuel" | "Groceries" | "Repairs" | "Advances" | "Household";
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix (data:image/...;base64,)
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function scanReceiptWithGemini(file: File): Promise<ReceiptItem[]> {
  if (!API_KEY) return [];
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const base64 = await fileToBase64(file);
    const mimeType = file.type as "image/jpeg" | "image/png" | "image/webp" | "image/heic";

    const prompt = `You are analyzing a receipt or bill image for a household management app.
Extract ALL line items from this receipt and categorize each one.

Categories available:
- Groceries: food, vegetables, dairy, beverages, pantry items
- Fuel: petrol, diesel, CNG, gas station
- Repairs: plumbing, electrical, maintenance, hardware, tools
- Advances: salary advance, cash advance, loan
- Household: cleaning supplies, home decor, kitchenware, garden, misc household

Return ONLY a valid JSON array (no markdown, no explanation) in this exact format:
[
  {"description": "item description", "amount": 250, "category": "Groceries"},
  {"description": "another item", "amount": 1200, "category": "Fuel"}
]

Rules:
- Amounts must be numbers (no ₹ symbol)
- If you see a total line, include it as a single entry only if there are no individual items
- Round amounts to nearest integer
- If the image is not a receipt, return []
- Maximum 10 items`;

    const result = await visionModel.generateContent([
      prompt,
      { inlineData: { data: base64, mimeType } },
    ]);

    const text = result.response.text().trim();
    // Extract JSON array from response (handle if model wraps it)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    const parsed = JSON.parse(jsonMatch[0]) as ReceiptItem[];
    return parsed.filter(
      (item) =>
        item.description &&
        typeof item.amount === "number" &&
        item.amount > 0 &&
        ["Fuel", "Groceries", "Repairs", "Advances", "Household"].includes(item.category)
    );
  } catch (e) {
    console.error("Receipt scan error:", e);
    return [];
  }
}
