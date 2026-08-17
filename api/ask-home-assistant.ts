import { GoogleGenerativeAI } from "@google/generative-ai";
import { allowOnlyPost, ApiRequest, ApiResponse, parseJsonBody, requireFirebaseUser } from "./_auth.js";

interface GeminiStaffContext {
  name: string;
  role: string;
  status: string;
  assignments: { task: string; done: boolean }[];
  shiftStart: string;
  shiftEnd: string;
}

interface GeminiExpenseContext {
  category: string;
  amount: number;
  description: string;
  date: string;
}

interface GeminiChatHistory {
  role: "user" | "model";
  parts: string;
}

interface AssistantRequest {
  userMessage?: string;
  staffContext?: GeminiStaffContext[];
  expenseContext?: GeminiExpenseContext[];
  chatHistory?: GeminiChatHistory[];
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!allowOnlyPost(req, res)) return;

  try {
    await requireFirebaseUser(req);
  } catch {
    res.status(401).json({ error: "Sign in is required." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "Gemini API key not configured." });
    return;
  }

  const {
    userMessage,
    staffContext = [],
    expenseContext = [],
    chatHistory = [],
  } = parseJsonBody<AssistantRequest>(req.body);

  if (!userMessage || typeof userMessage !== "string") {
    res.status(400).json({ error: "userMessage is required." });
    return;
  }

  const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = `You are the production assistant for the Homemaker household management app.
Answer only from the app context provided in this request. If the answer is not available in the context, say that it is not available yet instead of guessing.

Current date and time (IST): ${now}

STAFF DATA:
${staffContext
  .map(
    (s) =>
      `- ${s.name} (${s.role}) - Status: ${s.status}, Shift: ${s.shiftStart}-${s.shiftEnd}
   Tasks: ${s.assignments.map((t) => `${t.done ? "Done" : "Pending"}: ${t.task}`).join(", ") || "none"}`
  )
  .join("\n")}

RECENT EXPENSES:
${expenseContext
  .slice(0, 8)
  .map((e) => `- INR ${e.amount} - ${e.category}: ${e.description} (${e.date})`)
  .join("\n")}

GUIDELINES:
- Be concise and helpful. Use INR or Rs for currency.
- For action requests, put JSON action blocks at the END of the response in this format:
  <action>{"type":"add_task","staffName":"Elena Moretti","task":"Polish silverware"}</action>
  <action>{"type":"update_status","staffName":"Marcus Thorne","status":"late"}</action>
  <action>{"type":"add_expense","category":"Fuel","amount":500,"description":"Weekend fuel"}</action>
- For pure queries, answer in plain text.
- Keep responses under 120 words unless listing data.
- Do not invent staff, tasks, expenses, payroll, NFC events, or household facts that are not in the supplied context.`;

  try {
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood. I will stay grounded in the supplied Homemaker app context." }] },
        ...chatHistory.slice(-12).map((h) => ({
          role: h.role,
          parts: [{ text: h.parts }],
        })),
      ],
    });

    const result = await chat.sendMessage(userMessage);
    res.status(200).json({ text: result.response.text() });
  } catch (err) {
    console.error("Gemini API failed:", err);
    res.status(500).json({ error: "Gemini request failed." });
  }
}
