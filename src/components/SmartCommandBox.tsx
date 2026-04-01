import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Check, X, Sparkles, Loader2, Zap } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import type { StaffMember, StaffStatus } from "@/data/staff";
import type { Expense } from "@/context/AppContext";
import { toast } from "sonner";
import {
  askGemini,
  parseGeminiActions,
  stripActionTags,
  isGeminiConfigured,
  type GeminiAction,
} from "@/lib/gemini";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  action?: ParsedAction | null;
  isQuery?: boolean;
  thinking?: boolean;
}

interface ParsedAction {
  type: string;
  description: string;
  execute: () => void;
}

// ─────────────────────────────────────────────────────────────
// Regex-based fallback (used when Gemini is not configured)
// ─────────────────────────────────────────────────────────────

function stripPossessive(text: string): string {
  return text.replace(/'s$/i, "").replace(/s$/i, "");
}

function findStaffInText(text: string, staff: StaffMember[]): StaffMember | undefined {
  const lower = text.toLowerCase();
  const exact = staff.find(
    (s) =>
      lower.includes(s.name.toLowerCase()) ||
      lower.includes(s.name.split(" ")[0].toLowerCase())
  );
  if (exact) return exact;
  const words = lower.split(/\s+/);
  for (const word of words) {
    const stripped = stripPossessive(word);
    const found = staff.find(
      (s) =>
        s.name.toLowerCase().startsWith(stripped) ||
        s.name.split(" ")[0].toLowerCase() === stripped
    );
    if (found) return found;
  }
  return undefined;
}

const SmartCommandBox = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  // Chat history for Gemini multi-turn
  const geminiHistoryRef = useRef<{ role: "user" | "model"; parts: string }[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    staff, expenses,
    addTask, addExpense, deleteTask,
    updateStaffStatus, removeStaff, markAttendance,
  } = useAppState();

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 80);
  }, []);

  const pushMessage = useCallback((msgs: ChatMessage[]) => {
    setMessages((prev) => [...prev, ...msgs]);
    scrollToBottom();
  }, [scrollToBottom]);

  // ── Execute actions that Gemini requested ─────────────────
  const executeGeminiAction = useCallback(
    (action: GeminiAction): string => {
      const member = action.staffName
        ? staff.find((s) => s.name.toLowerCase().includes(action.staffName!.toLowerCase().split(" ")[0]))
        : undefined;

      switch (action.type) {
        case "add_task":
          if (member && action.task) {
            addTask(member.id, action.task);
            return `✅ Task added for ${member.name}: "${action.task}"`;
          }
          return "⚠️ Couldn't find that staff member to add a task.";

        case "update_status":
          if (member && action.status) {
            updateStaffStatus(member.id, action.status as StaffStatus);
            if (action.status === "late") markAttendance(member.id, "late", "Marked late via AI assistant");
            if (action.status === "absent") markAttendance(member.id, "leave", "Marked absent via AI assistant");
            return `✅ ${member.name} is now marked as ${action.status}`;
          }
          return "⚠️ Couldn't update status — staff member not found.";

        case "add_expense":
          if (action.category && action.amount) {
            const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            const category = (action.category.charAt(0).toUpperCase() + action.category.slice(1)) as Expense["category"];
            addExpense({
              category,
              amount: action.amount,
              description: action.description || `${category} expense`,
              staffName: member?.name,
              date: today,
            });
            return `✅ Expense recorded: ₹${action.amount} ${category}`;
          }
          return "⚠️ Couldn't parse the expense details.";

        case "mark_attendance":
          if (member) {
            markAttendance(member.id, "check-in", "Checked in via AI assistant");
            updateStaffStatus(member.id, "on-duty");
            return `✅ ${member.name} checked in`;
          }
          return "⚠️ Staff member not found.";

        default:
          return "";
      }
    },
    [staff, addTask, addExpense, updateStaffStatus, markAttendance]
  );

  // ── Gemini send path ──────────────────────────────────────
  const handleGeminiSend = useCallback(
    async (trimmed: string) => {
      setIsThinking(true);

      const staffCtx = staff.map((s) => ({
        name: s.name,
        role: s.role,
        status: s.status,
        assignments: s.assignments,
        shiftStart: s.shiftStart,
        shiftEnd: s.shiftEnd,
      }));

      const expCtx = expenses.map((e) => ({
        category: e.category,
        amount: e.amount,
        description: e.description,
        date: e.date,
      }));

      let rawResponse = "";
      try {
        rawResponse = await askGemini(trimmed, staffCtx, expCtx, geminiHistoryRef.current);
      } catch {
        rawResponse = "";
      }

      setIsThinking(false);

      if (!rawResponse) {
        // Gemini failed — use regex fallback
        handleRegexSend(trimmed);
        return;
      }

      // Parse any action blocks
      const actions = parseGeminiActions(rawResponse);
      const displayText = stripActionTags(rawResponse);

      // Execute actions immediately and collect result lines
      const resultLines: string[] = [];
      for (const action of actions) {
        const result = executeGeminiAction(action);
        if (result) resultLines.push(result);
      }

      const finalText =
        displayText + (resultLines.length > 0 ? "\n\n" + resultLines.join("\n") : "");

      // Update Gemini history for multi-turn
      geminiHistoryRef.current = [
        ...geminiHistoryRef.current,
        { role: "user", parts: trimmed },
        { role: "model", parts: rawResponse },
      ].slice(-20); // keep last 10 turns

      pushMessage([
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: finalText || "Done!",
          isQuery: actions.length === 0,
        },
      ]);
    },
    [staff, expenses, executeGeminiAction, pushMessage]
  );

  // ── Regex fallback path ───────────────────────────────────
  const handleRegexQuery = useCallback(
    (text: string): string | null => {
      const lower = text.toLowerCase().trim();

      if (/who\s+is\s+on.?duty/.test(lower) || /on.?duty\s+staff/.test(lower)) {
        const onDuty = staff.filter((s) => s.status === "on-duty");
        if (onDuty.length === 0) return "No staff are currently on duty.";
        return `On duty right now:\n${onDuty.map((s) => `• ${s.name} (${s.role})`).join("\n")}`;
      }
      if (/who\s+is\s+late/.test(lower)) {
        const late = staff.filter((s) => s.status === "late");
        if (late.length === 0) return "No staff are currently late.";
        return `Late today:\n${late.map((s) => `• ${s.name} (${s.role})`).join("\n")}`;
      }
      if (/who\s+is\s+absent/.test(lower)) {
        const absent = staff.filter((s) => s.status === "absent");
        if (absent.length === 0) return "No staff are absent today.";
        return `Absent today:\n${absent.map((s) => `• ${s.name} (${s.role})`).join("\n")}`;
      }
      if (/how\s+many\s+staff/.test(lower) || /headcount/.test(lower)) {
        return `Total staff: ${staff.length}\n• On duty: ${staff.filter((s) => s.status === "on-duty").length}\n• Late: ${staff.filter((s) => s.status === "late").length}\n• Absent: ${staff.filter((s) => s.status === "absent").length}`;
      }
      if (/pending\s+tasks/.test(lower)) {
        const all = staff.flatMap((s) => s.assignments.filter((t) => !t.done).map((t) => ({ ...t, staffName: s.name })));
        if (all.length === 0) return "No pending tasks! Everything is done ✅";
        return `Pending (${all.length}):\n${all.slice(0, 8).map((t) => `⏳ ${t.task} (${t.staffName})`).join("\n")}`;
      }
      if (/show\s+expenses/.test(lower) || /total\s+expenses/.test(lower)) {
        const total = expenses.reduce((a, e) => a + e.amount, 0);
        const byCategory = expenses.reduce<Record<string, number>>((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {});
        return `Total: ₹${total.toLocaleString("en-IN")}\n${Object.entries(byCategory).map(([c, a]) => `  ${c}: ₹${a.toLocaleString("en-IN")}`).join("\n")}`;
      }

      const member = findStaffInText(text, staff);
      if (member) {
        if (/tasks?/.test(lower)) {
          const tasks = member.assignments;
          if (tasks.length === 0) return `${member.name} has no tasks assigned.`;
          return `${member.name}'s tasks:\n${tasks.map((t, i) => `${t.done ? "✅" : "⏳"} ${i + 1}. ${t.task}`).join("\n")}`;
        }
        if (/status/.test(lower) || /^check\s/.test(lower)) {
          return `${member.name} (${member.role})\nStatus: ${member.status}\nShift: ${member.shiftStart} — ${member.shiftEnd}`;
        }
      }
      return null;
    },
    [staff, expenses]
  );

  const handleRegexCommand = useCallback(
    (text: string): ParsedAction | null => {
      const lower = text.toLowerCase().trim();
      const member = findStaffInText(text, staff);

      const addTaskMatch = lower.match(/add\s+task\s+(.+?)\s+(?:for|to)\s+(.+)/i) ||
                           lower.match(/dispatch\s+task\s+(.+?)\s+(?:for|to)\s+(.+)/i);
      if (addTaskMatch && member) {
        const taskName = addTaskMatch[1].trim();
        return {
          type: "add_task",
          description: `Add task "${taskName}" for ${member.name}`,
          execute: () => { addTask(member.id, taskName.charAt(0).toUpperCase() + taskName.slice(1)); toast.success(`Task added for ${member.name}`); },
        };
      }

      const expenseMatch = lower.match(/add\s+expense\s+(\d+)\s+(fuel|groceries|repairs|advances|household)(?:\s+(?:for|to)\s+(.+))?/i);
      if (expenseMatch) {
        const amount = parseInt(expenseMatch[1]);
        const category = (expenseMatch[2].charAt(0).toUpperCase() + expenseMatch[2].slice(1)) as Expense["category"];
        const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        return {
          type: "add_expense",
          description: `Add ₹${amount} ${category} expense${member ? ` for ${member.name}` : ""}`,
          execute: () => { addExpense({ category, amount, description: `${category} expense`, staffName: member?.name, date: today }); toast.success(`₹${amount} expense recorded`); },
        };
      }

      const markMatch = lower.match(/mark\s+(.+?)\s+(on-duty|on\s+duty|late|absent|off-duty|off\s+duty|en-route)/i);
      if (markMatch && member) {
        const rawStatus = markMatch[2].replace(/\s+/, "-") as StaffStatus;
        return {
          type: "update_status",
          description: `Mark ${member.name} as "${rawStatus}"`,
          execute: () => { updateStaffStatus(member.id, rawStatus); toast.success(`${member.name} is now ${rawStatus}`); },
        };
      }

      const removeTaskMatch = lower.match(/(?:remove|delete)\s+task\s+(\d+)\s+(?:from|for)\s+(.+)/i);
      if (removeTaskMatch && member) {
        const idx = parseInt(removeTaskMatch[1]) - 1;
        const task = member.assignments[idx];
        if (task) return {
          type: "delete_task",
          description: `Delete "${task.task}" from ${member.name}`,
          execute: () => { deleteTask(member.id, idx); toast.success(`Task removed`); },
        };
      }

      if (/remove\s+(?:staff\s+)?/.test(lower) && member) {
        return {
          type: "remove_staff",
          description: `Remove ${member.name} from staff`,
          execute: () => { removeStaff(member.id); toast.success(`${member.name} removed`); },
        };
      }

      return null;
    },
    [staff, addTask, addExpense, updateStaffStatus, deleteTask, removeStaff]
  );

  const handleRegexSend = useCallback(
    (trimmed: string) => {
      const queryResult = handleRegexQuery(trimmed);
      if (queryResult) {
        pushMessage([{ id: `a-${Date.now()}`, role: "assistant", content: queryResult, isQuery: true }]);
        return;
      }

      const action = handleRegexCommand(trimmed);
      pushMessage([
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: action
            ? `I understood: **${action.description}**\nShould I go ahead?`
            : "I couldn't understand that. Try:\n• \"Who is on duty?\"\n• \"Add task X for Elena\"\n• \"Mark Marcus late\"\n• \"Show expenses\"",
          action,
        },
      ]);
    },
    [handleRegexQuery, handleRegexCommand, pushMessage]
  );

  // ── Main send handler ─────────────────────────────────────
  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    scrollToBottom();

    if (isGeminiConfigured) {
      await handleGeminiSend(trimmed);
    } else {
      handleRegexSend(trimmed);
    }
  }, [input, isThinking, handleGeminiSend, handleRegexSend, scrollToBottom]);

  const handleConfirm = useCallback((msgId: string, confirmed: boolean) => {
    const msg = messages.find((m) => m.id === msgId);
    if (confirmed && msg?.action) msg.action.execute();
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        if (confirmed && m.action) return { ...m, content: `✅ Done! ${m.action.description}`, action: undefined };
        return { ...m, content: "❌ Cancelled. Type another command.", action: undefined };
      })
    );
  }, [messages]);

  return (
    <>
      {/* Floating trigger */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 300);
          }}
          className="fixed bottom-28 right-5 z-50 w-14 h-14 rounded-2xl btn-estate shadow-btn-hover flex items-center justify-center"
        >
          <Sparkles size={22} className="text-primary-foreground" />
        </motion.button>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-28 right-4 left-4 z-50 max-w-md mx-auto glass-card rounded-2xl shadow-card-hover overflow-hidden border border-border/50 flex flex-col"
            style={{ maxHeight: "55vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-primary/5">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <span className="label-sm text-foreground font-semibold">AI Home Assistant</span>
                {isGeminiConfigured && (
                  <span className="flex items-center gap-1 text-[10px] text-status-on-time bg-status-on-time/10 px-2 py-0.5 rounded-full font-semibold">
                    <Zap size={9} /> Gemini
                  </span>
                )}
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground p-1">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {/* Welcome chip grid — shown only when no messages yet */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    {isGeminiConfigured ? "Powered by Gemini AI — ask anything or tap a quick action" : "Tap a quick action or type a command"}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Who's on duty?", icon: "👥", query: "Who is on duty?" },
                      { label: "Pending tasks", icon: "📋", query: "Show all pending tasks" },
                      { label: "Show expenses", icon: "💰", query: "Show expenses" },
                      { label: "Staff status", icon: "📊", query: "Show all staff status" },
                      { label: "Add a task →", icon: "➕", prefill: "Add task " },
                      { label: "Mark late →", icon: "⏰", prefill: "Mark " },
                    ].map((chip) => (
                      <motion.button
                        key={chip.label}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (chip.query) {
                            const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: chip.query };
                            setMessages([userMsg]);
                            scrollToBottom();
                            if (isGeminiConfigured) {
                              handleGeminiSend(chip.query);
                            } else {
                              handleRegexSend(chip.query);
                            }
                          } else if (chip.prefill) {
                            setInput(chip.prefill);
                            setTimeout(() => inputRef.current?.focus(), 50);
                          }
                        }}
                        className="flex items-center gap-2 bg-muted/50 hover:bg-muted rounded-xl px-3 py-2.5 text-left transition-colors"
                      >
                        <span className="text-base leading-none">{chip.icon}</span>
                        <span className="text-xs text-foreground font-medium leading-tight">{chip.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={14} className="text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted/50 text-foreground rounded-bl-md"
                    }`}
                  >
                    {m.content}
                    {m.action && !m.isQuery && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleConfirm(m.id, true)}
                          className="flex items-center gap-1 bg-status-on-time/20 text-status-on-time label-sm px-3 py-1.5 rounded-xl"
                        >
                          <Check size={12} /> Yes
                        </button>
                        <button
                          onClick={() => handleConfirm(m.id, false)}
                          className="flex items-center gap-1 bg-destructive/10 text-destructive label-sm px-3 py-1.5 rounded-xl"
                        >
                          <X size={12} /> No
                        </button>
                      </div>
                    )}
                  </div>
                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <User size={14} className="text-secondary" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Thinking indicator */}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 justify-start"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-primary" />
                  </div>
                  <div className="bg-muted/50 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                    <Loader2 size={14} className="text-primary animate-spin" />
                    <span className="text-xs text-muted-foreground">Thinking…</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="px-3 py-2 border-t border-border/30 flex gap-2 items-center">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder={isGeminiConfigured ? "Ask anything about your staff…" : "Type a command…"}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none px-2 py-2"
                disabled={isThinking}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                className="w-9 h-9 rounded-xl btn-estate flex items-center justify-center disabled:opacity-40"
              >
                {isThinking ? <Loader2 size={14} className="text-primary-foreground animate-spin" /> : <Send size={14} className="text-primary-foreground" />}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SmartCommandBox;
