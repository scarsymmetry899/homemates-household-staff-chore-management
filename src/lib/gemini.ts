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
