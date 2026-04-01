"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyNewTask = exports.sendOutboxMessage = exports.telegramWebhook = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const genai_1 = require("@google/genai");
admin.initializeApp();
const db = admin.firestore();
// Initialize Gemini
// Assumes you have set the API key in Firebase secrets or environment variables:
// firebase functions:secrets:set GEMINI_API_KEY
// firebase functions:secrets:set TELEGRAM_BOT_TOKEN
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "YOUR_GEMINI_KEY" });
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "YOUR_TELEGRAM_TOKEN";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
async function sendTelegramMessage(chatId, text) {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!response.ok) {
        console.error("Failed to send Telegram message:", await response.text());
    }
}
exports.telegramWebhook = functions.https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }
    try {
        const update = req.body;
        if (!update.message || !update.message.text) {
            res.status(200).send("OK. No message text.");
            return;
        }
        const chatId = update.message.chat.id.toString();
        const text = update.message.text;
        // 1. Find Staff by Chat ID
        const staffQuery = await db.collection("staff").where("telegramChatId", "==", chatId).get();
        if (staffQuery.empty) {
            await sendTelegramMessage(chatId, "Hi! I don't recognize this Chat ID. Please ask the administrator to register your Telegram Chat ID in the Homemaker Dashboard.");
            res.status(200).send("OK");
            return;
        }
        const staffDoc = staffQuery.docs[0];
        const staffData = staffDoc.data();
        const staffId = staffDoc.id;
        // 2. Process via Gemini 2.5 Flash
        const prompt = `
      You are an AI assistant managing household staff for the 'Homemaker' app.
      A staff member named ${staffData.name} (Role: ${staffData.role}) sent this message:
      "${text}"

      Determine if this message is one of the following commands:
      1. CHECK_IN: Checking in for duty.
      2. CHECK_OUT: Leaving for the day.
      3. TASK_COMPLETE: They finished a task. (Extract the task name or description if possible)
      4. GENERAL: A general question or chat.

      Respond ONLY with a valid JSON in exactly this format:
      {
        "intent": "CHECK_IN" | "CHECK_OUT" | "TASK_COMPLETE" | "GENERAL",
        "extractedTask": "Task description if applicable or null",
        "replyMessage": "A friendly, polite, and brief message to send back to the staff member acknowledging them."
      }
    `;
        const aiRes = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        const aiText = aiRes.text;
        if (!aiText) {
            throw new Error("Gemini returned empty response.");
        }
        const result = JSON.parse(aiText);
        // 3. Execute Actions
        const batch = db.batch();
        if (result.intent === "CHECK_IN") {
            batch.update(db.collection("staff").doc(staffId), { status: "on-duty" });
            batch.set(db.collection("attendance").doc(), {
                staffId,
                date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                type: "check-in",
                detail: `Checked In: Telegram Bot`,
                logMethod: "telegram",
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        else if (result.intent === "CHECK_OUT") {
            batch.update(db.collection("staff").doc(staffId), { status: "off-duty" });
            batch.set(db.collection("attendance").doc(), {
                staffId,
                date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                type: "check-out",
                detail: `Checked Out: Telegram Bot`,
                logMethod: "telegram",
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        else if (result.intent === "TASK_COMPLETE" && result.extractedTask) {
            // Find matching task and mark done
            const tasksQuery = await db.collection("tasks")
                .where("staffId", "==", staffId)
                .where("isDone", "==", false)
                .get();
            const matchedDoc = tasksQuery.docs.find((t) => t.data().taskName.toLowerCase().includes(result.extractedTask.toLowerCase())) || tasksQuery.docs[0]; // Naive fallback to the first open task
            if (matchedDoc) {
                batch.update(matchedDoc.ref, { isDone: true });
                result.replyMessage += ` (Marked task '${matchedDoc.data().taskName}' as done!)`;
            }
        }
        await batch.commit();
        // 4. Send the personalized reply back to Telegram
        await sendTelegramMessage(chatId, result.replyMessage);
        res.status(200).send("Message processed successfully.");
    }
    catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).send("Internal Server Error");
    }
});
// Trigger: Send Outbox Messages
exports.sendOutboxMessage = functions.firestore
    .document("messages_outbox/{messageId}")
    .onCreate(async (snap, context) => {
    var _a;
    const data = snap.data();
    if (data.status !== "pending")
        return;
    try {
        const staffDoc = await db.collection("staff").doc(data.staffId).get();
        const telegramChatId = (_a = staffDoc.data()) === null || _a === void 0 ? void 0 : _a.telegramChatId;
        if (!telegramChatId) {
            console.warn(`Attempted to send message to staff ${data.staffId} but no telegramChatId found.`);
            await snap.ref.update({ status: "failed", error: "No Telegram Chat ID" });
            return;
        }
        await sendTelegramMessage(telegramChatId, data.message);
        await snap.ref.update({ status: "sent", sentAt: admin.firestore.FieldValue.serverTimestamp() });
    }
    catch (err) {
        console.error("Failed to send outbox message:", err);
        await snap.ref.update({ status: "failed", error: err.message });
    }
});
// Trigger: Notify new tasks
exports.notifyNewTask = functions.firestore
    .document("tasks/{taskId}")
    .onCreate(async (snap, context) => {
    var _a;
    const data = snap.data();
    if (data.notifyTelegram !== true)
        return;
    try {
        const staffDoc = await db.collection("staff").doc(data.staffId).get();
        const telegramChatId = (_a = staffDoc.data()) === null || _a === void 0 ? void 0 : _a.telegramChatId;
        if (!telegramChatId)
            return;
        const message = `🔔 *New Task Assignment*\n\n${data.taskName}\nDue: ${data.dueDate || 'No due date'}`;
        await sendTelegramMessage(telegramChatId, message);
    }
    catch (err) {
        console.error("Failed to notify new task:", err);
    }
});
//# sourceMappingURL=index.js.map