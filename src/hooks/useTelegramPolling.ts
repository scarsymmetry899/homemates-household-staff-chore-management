import { useEffect, useRef, useCallback } from "react";
import { getUpdates, sendMessage, setMyCommands } from "@/lib/telegram";
import { useAppState } from "@/context/AppContext";
import type { StaffMember, StaffStatus } from "@/data/staff";
import { toast } from "sonner";

const POLL_INTERVAL_MS = 12000;

const BOT_COMMANDS = [
  { command: "status", description: "Show all staff status" },
  { command: "tasks", description: "List pending tasks (optionally: /tasks Name)" },
  { command: "staff", description: "List all staff members" },
  { command: "expenses", description: "Show expense summary" },
  { command: "checkin", description: "Check in a staff member: /checkin Name" },
  { command: "mark_late", description: "Mark staff late: /mark_late Name" },
  { command: "mark_absent", description: "Mark staff absent: /mark_absent Name" },
  { command: "mark_present", description: "Mark staff present/on-duty: /mark_present Name" },
  { command: "on_duty", description: "Mark staff on duty: /on_duty Name" },
  { command: "add_task", description: "Add task: /add_task Name | task description" },
  { command: "help", description: "Show all available commands" },
];

function stripPossessive(text: string): string {
  return text.replace(/'s$/i, "").replace(/s$/i, "");
}

export function useTelegramPolling(enabled: boolean) {
  const offsetRef = useRef<number>(0);
  const commandsRegisteredRef = useRef(false);
  const { staff, expenses, updateStaffStatus, addTask, markAttendance, addAlert } = useAppState();

  const findStaff = useCallback(
    (word: string): StaffMember | undefined => {
      const lower = word.toLowerCase();
      const stripped = stripPossessive(lower);
      return staff.find(
        (s) =>
          s.name.toLowerCase().startsWith(stripped) ||
          s.name.split(" ")[0].toLowerCase() === stripped ||
          s.name.toLowerCase().startsWith(lower) ||
          s.name.split(" ")[0].toLowerCase() === lower
      );
    },
    [staff]
  );

  // ── Slash command handler ─────────────────────────────────
  const handleSlashCommand = useCallback(
    (text: string): string | null => {
      const parts = text.trim().split(/\s+/);
      // Extract command (strip @botname suffix if present)
      const rawCmd = parts[0].toLowerCase().replace(/@\S+$/, "");
      const args = parts.slice(1);
      const argStr = args.join(" ").trim();

      switch (rawCmd) {
        case "/help": {
          return (
            "📱 <b>Homemaker Bot Commands</b>\n\n" +
            BOT_COMMANDS.map((c) => `/${c.command} — ${c.description}`).join("\n")
          );
        }

        case "/status": {
          if (staff.length === 0) return "No staff members found.";
          const statusEmoji: Record<string, string> = {
            "on-duty": "🟢",
            late: "🟡",
            absent: "🔴",
            "off-duty": "⚫",
            "en-route": "🔵",
          };
          const lines = staff.map(
            (s) => `${statusEmoji[s.status] ?? "⚪"} ${s.name} (${s.role}) — ${s.status}`
          );
          return `👥 <b>Staff Status</b>\n\n${lines.join("\n")}`;
        }

        case "/staff": {
          if (staff.length === 0) return "No staff members found.";
          const lines = staff.map(
            (s) => `• ${s.name} — ${s.role} | Shift: ${s.shiftStart}–${s.shiftEnd}`
          );
          return `👥 <b>All Staff</b>\n\n${lines.join("\n")}`;
        }

        case "/tasks": {
          let filtered = staff;
          if (argStr) {
            const member = findStaff(argStr);
            if (!member) return `⚠️ Staff member "${argStr}" not found.`;
            filtered = [member];
          }
          const pending = filtered.flatMap((s) =>
            s.assignments
              .filter((t) => !t.done)
              .map((t) => `• ${t.task} <i>(${s.name})</i>`)
          );
          if (pending.length === 0) return "✅ No pending tasks — everything is done!";
          return `📋 <b>Pending Tasks</b>\n\n${pending.join("\n")}`;
        }

        case "/expenses": {
          if (expenses.length === 0) return "No expenses recorded yet.";
          const total = expenses.reduce((a, e) => a + e.amount, 0);
          const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
            acc[e.category] = (acc[e.category] || 0) + e.amount;
            return acc;
          }, {});
          const breakdown = Object.entries(byCategory)
            .map(([cat, amt]) => `  • ${cat}: ₹${amt.toLocaleString("en-IN")}`)
            .join("\n");
          return `💰 <b>Expense Summary</b>\n\nTotal: ₹${total.toLocaleString("en-IN")}\n\n${breakdown}`;
        }

        case "/checkin": {
          if (!argStr) return "Usage: /checkin Name";
          const member = findStaff(argStr);
          if (!member) return `⚠️ Staff member "${argStr}" not found.`;
          updateStaffStatus(member.id, "on-duty");
          markAttendance(member.id, "check-in", "Check-in via Telegram command");
          toast.success(`[Telegram] ${member.name} checked in`);
          return `✅ ${member.name} checked in successfully.`;
        }

        case "/mark_late": {
          if (!argStr) return "Usage: /mark_late Name";
          const member = findStaff(argStr);
          if (!member) return `⚠️ Staff member "${argStr}" not found.`;
          updateStaffStatus(member.id, "late");
          markAttendance(member.id, "late", "Marked late via Telegram command");
          toast.success(`[Telegram] ${member.name} → late`);
          return `🟡 ${member.name} marked as <b>late</b>.`;
        }

        case "/mark_absent": {
          if (!argStr) return "Usage: /mark_absent Name";
          const member = findStaff(argStr);
          if (!member) return `⚠️ Staff member "${argStr}" not found.`;
          updateStaffStatus(member.id, "absent");
          markAttendance(member.id, "leave", "Marked absent via Telegram command");
          toast.success(`[Telegram] ${member.name} → absent`);
          return `🔴 ${member.name} marked as <b>absent</b>.`;
        }

        case "/mark_present": {
          if (!argStr) return "Usage: /mark_present Name";
          const member = findStaff(argStr);
          if (!member) return `⚠️ Staff member "${argStr}" not found.`;
          updateStaffStatus(member.id, "on-duty");
          markAttendance(member.id, "check-in", "Marked present via Telegram command");
          toast.success(`[Telegram] ${member.name} → on-duty`);
          return `🟢 ${member.name} marked as <b>present / on-duty</b>.`;
        }

        case "/on_duty": {
          if (!argStr) return "Usage: /on_duty Name";
          const member = findStaff(argStr);
          if (!member) return `⚠️ Staff member "${argStr}" not found.`;
          updateStaffStatus(member.id, "on-duty");
          markAttendance(member.id, "check-in", "Marked on-duty via Telegram command");
          toast.success(`[Telegram] ${member.name} → on-duty`);
          return `🟢 ${member.name} marked as <b>on-duty</b>.`;
        }

        case "/add_task": {
          // Format: /add_task Name | task description
          const pipeIdx = argStr.indexOf("|");
          if (pipeIdx === -1) return "Usage: /add_task Name | task description";
          const namePart = argStr.slice(0, pipeIdx).trim();
          const taskPart = argStr.slice(pipeIdx + 1).trim();
          if (!namePart || !taskPart) return "Usage: /add_task Name | task description";
          const member = findStaff(namePart);
          if (!member) return `⚠️ Staff member "${namePart}" not found.`;
          addTask(member.id, taskPart.charAt(0).toUpperCase() + taskPart.slice(1));
          toast.success(`[Telegram] Task added for ${member.name}`);
          return `✅ Task added for ${member.name}: "${taskPart}"`;
        }

        default:
          return null;
      }
    },
    [staff, expenses, findStaff, updateStaffStatus, addTask, markAttendance]
  );

  // ── Natural language handler (existing logic) ─────────────
  const processText = useCallback(
    (text: string): string | null => {
      const lower = text.toLowerCase().trim();

      // "mark [name] late/absent/on duty/on-duty/off duty" or "mark STATUS NAME"
      // Try "mark NAME STATUS" first, then "mark STATUS NAME"
      const statusMatch =
        lower.match(/\bmark\s+(\w+)\s+(late|absent|present|on[\s-]duty|off[\s-]duty)\b/i) ||
        lower.match(/\bmark\s+(late|absent|present|on[\s-]duty|off[\s-]duty)\s+(\w+)\b/i);

      if (statusMatch) {
        // Determine which group is name and which is status based on match pattern
        const isNameFirst = /\bmark\s+\w+\s+(late|absent|present|on[\s-]duty|off[\s-]duty)\b/i.test(lower);
        const nameWord = isNameFirst ? statusMatch[1] : statusMatch[2];
        const rawStatusWord = isNameFirst ? statusMatch[2] : statusMatch[1];
        const member = findStaff(nameWord);
        if (member) {
          const rawStatus = rawStatusWord.toLowerCase().replace(/\s+/, "-");
          const statusMap: Record<string, StaffStatus> = {
            late: "late",
            absent: "absent",
            present: "on-duty",
            "on-duty": "on-duty",
            "off-duty": "off-duty",
          };
          const status: StaffStatus = statusMap[rawStatus] ?? "on-duty";
          updateStaffStatus(member.id, status);
          if (status === "late") markAttendance(member.id, "late", "Marked late via Telegram command");
          if (status === "absent") markAttendance(member.id, "leave", "Marked absent via Telegram command");
          if (status === "on-duty") markAttendance(member.id, "check-in", "Marked present via Telegram command");
          toast.success(`[Telegram] ${member.name} → ${status}`);
          return `✅ ${member.name} marked as ${status === "on-duty" ? "present/on-duty" : status}`;
        }
      }

      // "add task [task text] for [name]" / "assign task [task text] to [name]"
      const taskMatch = lower.match(
        /\b(?:add|assign)\s+task\s+(.+?)\s+(?:for|to)\s+(\w+)\b/i
      );
      if (taskMatch) {
        const member = findStaff(taskMatch[2]);
        if (member) {
          const taskText = taskMatch[1].trim();
          addTask(member.id, taskText);
          toast.success(`[Telegram] Task added for ${member.name}`);
          return `✅ Task added for ${member.name}: "${taskText}"`;
        }
      }

      // "check in [name]" / "[name] checked in"
      const checkinMatch = lower.match(
        /\b(?:check.?in\s+(\w+)|(\w+)\s+checked.?in)\b/i
      );
      if (checkinMatch) {
        const nameWord = checkinMatch[1] || checkinMatch[2];
        const member = findStaff(nameWord);
        if (member) {
          updateStaffStatus(member.id, "on-duty");
          markAttendance(member.id, "check-in", "Check-in recorded via Telegram");
          toast.success(`[Telegram] ${member.name} checked in`);
          return `✅ ${member.name} checked in`;
        }
      }

      return null;
    },
    [findStaff, updateStaffStatus, addTask, markAttendance]
  );

  useEffect(() => {
    if (!enabled) return;
    let active = true;

    // Register bot commands on first run
    if (!commandsRegisteredRef.current) {
      commandsRegisteredRef.current = true;
      setMyCommands(BOT_COMMANDS).catch(() => {/* silently ignore */});
    }

    const poll = async () => {
      if (!active) return;
      try {
        const updates = await getUpdates(offsetRef.current);
        for (const update of updates) {
          offsetRef.current = update.update_id + 1;
          const text = update.message?.text;
          const chatId = update.message?.chat.id;
          if (!text || !chatId) continue;

          // Try slash command first, then natural language
          let reply: string | null = null;
          if (text.startsWith("/")) {
            reply = handleSlashCommand(text);
          } else {
            reply = processText(text);
          }

          if (reply) {
            sendMessage(chatId, reply).catch(() => {/* silently ignore */});
          }
        }
      } catch {
        // Silently fail — bot token may not be configured
      }
    };

    poll(); // immediate first run
    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [enabled, handleSlashCommand, processText]);
}
