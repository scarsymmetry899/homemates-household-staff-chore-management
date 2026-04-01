import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require("node-fetch") as typeof import("node-fetch").default;

admin.initializeApp();

const getBotToken = (): string => {
  return functions.config().telegram?.token || process.env.TELEGRAM_BOT_TOKEN || "";
};

// ────────────────────────────────────────────────────────────
// Callable: Send a Telegram message (secure server-side proxy)
// ────────────────────────────────────────────────────────────
export const sendTelegramMessage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Must be signed in to send messages.");
  }

  const { chatId, text } = data as { chatId: string | number; text: string };
  if (!chatId || !text) {
    throw new functions.https.HttpsError("invalid-argument", "chatId and text are required.");
  }

  const token = getBotToken();
  if (!token) {
    throw new functions.https.HttpsError("failed-precondition", "Telegram bot token not configured.");
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });

  const result = (await res.json()) as { ok: boolean; description?: string };
  if (!result.ok) {
    throw new functions.https.HttpsError("internal", `Telegram error: ${result.description}`);
  }

  return { success: true };
});

// ────────────────────────────────────────────────────────────
// HTTP: Telegram webhook endpoint (set this as your bot webhook URL)
// POST https://us-central1-<project>.cloudfunctions.net/telegramWebhook
// ────────────────────────────────────────────────────────────
export const telegramWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const update = req.body as {
    update_id: number;
    message?: {
      message_id: number;
      from: { id: number; first_name: string; username?: string };
      chat: { id: number };
      date: number;
      text?: string;
    };
  };

  if (update.message) {
    const db = admin.firestore();
    await db.collection("telegram_updates").add({
      ...update,
      receivedAt: admin.firestore.FieldValue.serverTimestamp(),
      processed: false,
    });

    // If owner sent a command, echo an ack
    const token = getBotToken();
    if (update.message.text && token) {
      const lower = update.message.text.toLowerCase();
      let ack = "";
      if (lower.startsWith("/status")) {
        ack = "📊 I'll check the status and update the dashboard.";
      } else if (lower.includes("mark") || lower.includes("add task") || lower.includes("check in")) {
        ack = "✅ Command received. Updating the dashboard now…";
      }
      if (ack) {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: update.message.chat.id, text: ack }),
        });
      }
    }
  }

  res.json({ ok: true });
});

// ────────────────────────────────────────────────────────────
// Callable: Log NFC attendance event to Firestore
// ────────────────────────────────────────────────────────────
export const logNfcAttendance = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Must be signed in.");
  }

  const { staffId, staffName, staffRole, eventType, timestamp, logMethod } = data as {
    staffId: string;
    staffName: string;
    staffRole: string;
    eventType: "check-in" | "check-out" | "nfc-tap";
    timestamp: string;
    logMethod: "nfc" | "manual" | "telegram";
  };

  const db = admin.firestore();
  await db.collection("attendance_logs").add({
    staffId,
    staffName,
    staffRole,
    eventType,
    timestamp,
    logMethod,
    userId: context.auth.uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true };
});

// ────────────────────────────────────────────────────────────
// Scheduled: Daily attendance summary (runs at 9 PM IST every day)
// ────────────────────────────────────────────────────────────
export const dailyAttendanceSummary = functions.pubsub
  .schedule("0 15 * * *") // 9 PM IST = 3:30 PM UTC ≈ 15:00 UTC
  .timeZone("Asia/Kolkata")
  .onRun(async () => {
    const db = admin.firestore();
    const today = new Date().toISOString().split("T")[0];

    const logsSnap = await db
      .collection("attendance_logs")
      .where("timestamp", ">=", `${today}T00:00:00.000Z`)
      .get();

    const checkins = logsSnap.docs.filter((d) => d.data().eventType === "check-in").length;
    const checkouts = logsSnap.docs.filter((d) => d.data().eventType === "check-out").length;

    functions.logger.info(`Daily summary: ${checkins} check-ins, ${checkouts} check-outs on ${today}`);
  });
