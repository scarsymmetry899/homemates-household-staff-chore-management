import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Check, X, Sparkles } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import type { StaffMember, StaffStatus } from "@/data/staff";
import type { Expense } from "@/context/AppContext";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  action?: ParsedAction | null;
  isQuery?: boolean;
}

interface ParsedAction {
  type: string;
  description: string;
  execute: () => void;
}

const SmartCommandBox = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your home assistant. Try commands like:\n• \"Check Elena's tasks\"\n• \"Who is on duty?\"\n• \"Add task clean kitchen for Elena\"\n• \"Mark Marcus late\"\n• \"Show expenses\"",
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { staff, expenses, addTask, addExpense, deleteTask, updateStaffStatus, removeStaff } = useAppState();

  // Strip possessive 's or trailing s from a name-like string
  const stripPossessive = (text: string): string => {
    return text.replace(/'s$/i, "").replace(/s$/i, "");
  };

  const findStaff = useCallback(
    (text: string): StaffMember | undefined => {
      const lower = text.toLowerCase();
      // Try exact match first
      const exactMatch = staff.find(
        (s) =>
          lower.includes(s.name.toLowerCase()) ||
          lower.includes(s.name.split(" ")[0].toLowerCase())
      );
      if (exactMatch) return exactMatch;

      // Try stripping possessive 's
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
    },
    [staff]
  );

  // Query handler: returns a string response (no confirm/cancel)
  const handleQuery = useCallback(
    (text: string): string | null => {
      const lower = text.toLowerCase().trim();

      // "who is on duty" / "who is on-duty"
      if (/who\s+is\s+on.?duty/.test(lower) || /on.?duty\s+staff/.test(lower)) {
        const onDuty = staff.filter((s) => s.status === "on-duty");
        if (onDuty.length === 0) return "No staff are currently on duty.";
        return `On duty right now:\n${onDuty.map((s) => `• ${s.name} (${s.role})`).join("\n")}`;
      }

      // "who is late"
      if (/who\s+is\s+late/.test(lower)) {
        const late = staff.filter((s) => s.status === "late");
        if (late.length === 0) return "No staff are currently late.";
        return `Late today:\n${late.map((s) => `• ${s.name} (${s.role})`).join("\n")}`;
      }

      // "who is absent"
      if (/who\s+is\s+absent/.test(lower)) {
        const absent = staff.filter((s) => s.status === "absent");
        if (absent.length === 0) return "No staff are absent today.";
        return `Absent today:\n${absent.map((s) => `• ${s.name} (${s.role})`).join("\n")}`;
      }

      // "how many staff" / "headcount" / "staff count"
      if (/how\s+many\s+staff/.test(lower) || /headcount/.test(lower) || /staff\s+count/.test(lower)) {
        return `Total staff: ${staff.length}\n• On duty: ${staff.filter((s) => s.status === "on-duty").length}\n• Late: ${staff.filter((s) => s.status === "late").length}\n• Absent: ${staff.filter((s) => s.status === "absent").length}`;
      }

      // "pending tasks" / "show all pending" / "what tasks are pending"
      if (/pending\s+tasks/.test(lower) || /show\s+all\s+pending/.test(lower) || /what\s+tasks\s+are\s+pending/.test(lower)) {
        const allPending: { staffName: string; task: string }[] = [];
        staff.forEach((s) => {
          s.assignments
            .filter((t) => !t.done)
            .forEach((t) => allPending.push({ staffName: s.name, task: t.task }));
        });
        if (allPending.length === 0) return "No pending tasks! Everything is done ✅";
        const shown = allPending.slice(0, 8);
        const lines = shown.map((t) => `⏳ ${t.task} (${t.staffName})`);
        if (allPending.length > 8) lines.push(`...and ${allPending.length - 8} more`);
        return `Pending tasks:\n${lines.join("\n")}`;
      }

      // "show expenses" / "expenses this month" / "total expenses"
      if (/show\s+expenses/.test(lower) || /expenses\s+this\s+month/.test(lower) || /total\s+expenses/.test(lower)) {
        const total = expenses.reduce((a, e) => a + e.amount, 0);
        const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
          acc[e.category] = (acc[e.category] || 0) + e.amount;
          return acc;
        }, {});
        const catLines = Object.entries(byCategory)
          .map(([cat, amt]) => `  ${cat}: ₹${amt.toLocaleString("en-IN")}`)
          .join("\n");
        return `Total expenses: ₹${total.toLocaleString("en-IN")}\n\nBreakdown:\n${catLines}`;
      }

      // Staff-specific queries
      const member = findStaff(text);

      // "[X]'s tasks" / "check/list/show [X] tasks" / "what tasks does [X] have"
      const tasksPatterns = [
        /(?:check|list|show|view|get)\s+(?:me\s+)?(.+?)(?:'s)?\s+tasks?/i,
        /what\s+tasks?\s+does\s+(.+?)\s+have/i,
        /(.+?)'s\s+tasks?/i,
      ];
      for (const pattern of tasksPatterns) {
        if (pattern.test(lower) && member) {
          const tasks = member.assignments;
          if (tasks.length === 0) return `${member.name} has no tasks assigned.`;
          const lines = tasks.map((t, i) => `${t.done ? "✅" : "⏳"} ${i + 1}. ${t.task}${t.dueDate ? ` (due ${t.dueDate})` : ""}`);
          const done = tasks.filter((t) => t.done).length;
          return `${member.name}'s tasks (${done}/${tasks.length} done):\n${lines.join("\n")}`;
        }
      }

      // "[X] status" / "check [X]" / "what is [X]'s status"
      const statusPatterns = [
        /what\s+is\s+(.+?)(?:'s)?\s+status/i,
        /(.+?)\s+status$/i,
        /^check\s+(.+)$/i,
      ];
      for (const pattern of statusPatterns) {
        if (pattern.test(lower) && member) {
          return `${member.name} (${member.role})\nStatus: ${member.status}\nShift: ${member.shiftStart} — ${member.shiftEnd}\nLocation: ${member.location}`;
        }
      }

      return null;
    },
    [staff, expenses, findStaff]
  );

  const parseCommand = useCallback(
    (text: string): ParsedAction | null => {
      const lower = text.toLowerCase().trim();
      const member = findStaff(text);

      // DISPATCH TASK: "dispatch task [name] to/for [staff]"
      const dispatchMatch = lower.match(/dispatch\s+task\s+(.+?)\s+(?:for|to)\s+(.+)/i);
      if (dispatchMatch && member) {
        const taskName = dispatchMatch[1].trim();
        return {
          type: "add_task",
          description: `Dispatch task "${taskName}" to ${member.name}`,
          execute: () => {
            addTask(member.id, taskName.charAt(0).toUpperCase() + taskName.slice(1));
            toast.success(`Task dispatched to ${member.name}`);
          },
        };
      }

      // ADD TASK with dash/colon separator: "add task to/for [staff] - [description]" or "add task to/for [staff]: [description]"
      const addTaskSeparatorMatch = lower.match(/add\s+task\s+(?:for|to)\s+(.+?)\s*[-:]\s*(.+)/i);
      if (addTaskSeparatorMatch && member) {
        const taskName = addTaskSeparatorMatch[2].trim();
        return {
          type: "add_task",
          description: `Add task "${taskName}" for ${member.name}`,
          execute: () => {
            addTask(member.id, taskName.charAt(0).toUpperCase() + taskName.slice(1));
            toast.success(`Task added for ${member.name}`);
          },
        };
      }

      // ADD TASK: "add task <task> for/to <staff>"
      const addTaskMatch = lower.match(/add\s+task\s+(.+?)\s+(?:for|to)\s+(.+)/i);
      if (addTaskMatch && member) {
        const taskName = addTaskMatch[1].trim();
        return {
          type: "add_task",
          description: `Add task "${taskName}" for ${member.name}`,
          execute: () => {
            addTask(member.id, taskName.charAt(0).toUpperCase() + taskName.slice(1));
            toast.success(`Task added for ${member.name}`);
          },
        };
      }

      // ADD EXPENSE: "add expense <amount> <category> for <staff>"
      const expenseMatch = lower.match(
        /add\s+expense\s+(\d+)\s+(fuel|groceries|repairs|advances|household)(?:\s+(?:for|to)\s+(.+))?/i
      );
      if (expenseMatch) {
        const amount = parseInt(expenseMatch[1]);
        const rawCat = expenseMatch[2];
        const category = (rawCat.charAt(0).toUpperCase() + rawCat.slice(1)) as Expense["category"];
        const staffName = member?.name;
        const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        return {
          type: "add_expense",
          description: `Add ₹${amount} ${category} expense${staffName ? ` for ${staffName}` : ""}`,
          execute: () => {
            addExpense({ category, amount, description: `${category} expense`, staffName, date: today });
            toast.success(`₹${amount} expense recorded`);
          },
        };
      }

      // MARK STATUS: "mark [staff] on-duty/late/absent/off-duty/en-route"
      const markMatch = lower.match(/mark\s+(.+?)\s+(on-duty|late|absent|off-duty|en-route)/i);
      if (markMatch && member) {
        const status = markMatch[2] as StaffStatus;
        return {
          type: "update_status",
          description: `Mark ${member.name} as "${status}"`,
          execute: () => {
            updateStaffStatus(member.id, status);
            toast.success(`${member.name} is now ${status}`);
          },
        };
      }

      // SET STATUS: "set <staff> status <status>"
      const statusMatch = lower.match(
        /set\s+(.+?)\s+(?:status|as)\s+(on-duty|late|absent|en-route|off-duty)/i
      );
      if (statusMatch && member) {
        const status = statusMatch[2] as StaffStatus;
        return {
          type: "update_status",
          description: `Set ${member.name}'s status to "${status}"`,
          execute: () => {
            updateStaffStatus(member.id, status);
            toast.success(`${member.name} is now ${status}`);
          },
        };
      }

      // REMOVE TASK: "remove task <index> from <staff>"
      const removeTaskMatch = lower.match(/(?:remove|delete)\s+task\s+(\d+)\s+(?:from|for)\s+(.+)/i);
      if (removeTaskMatch && member) {
        const taskIdx = parseInt(removeTaskMatch[1]) - 1;
        const task = member.assignments[taskIdx];
        if (task) {
          return {
            type: "delete_task",
            description: `Delete task "${task.task}" from ${member.name}`,
            execute: () => {
              deleteTask(member.id, taskIdx);
              toast.success(`Task removed from ${member.name}`);
            },
          };
        }
      }

      // REMOVE STAFF: "remove staff <name>"
      const removeStaffMatch = lower.match(/remove\s+(?:staff\s+)?(.+)/i);
      if (removeStaffMatch && member && lower.includes("remove")) {
        return {
          type: "remove_staff",
          description: `Remove ${member.name} from the staff directory`,
          execute: () => {
            removeStaff(member.id);
            toast.success(`${member.name} has been removed`);
          },
        };
      }

      return null;
    },
    [findStaff, addTask, addExpense, updateStaffStatus, deleteTask, removeStaff]
  );

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: trimmed };

    // First try query handler
    const queryResult = handleQuery(trimmed);
    if (queryResult) {
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: queryResult,
        isQuery: true,
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 100);
      return;
    }

    // Then try action command
    const action = parseCommand(trimmed);

    const assistantMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      content: action
        ? `I understood: **${action.description}**\nShould I go ahead?`
        : "I couldn't understand that command. Try:\n• \"Check Elena's tasks\"\n• \"Who is on duty?\"\n• \"Add task mop floors for Elena\"\n• \"Mark Marcus late\"\n• \"Show expenses\"",
      action,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 100);
  }, [input, parseCommand, handleQuery]);

  const handleConfirm = useCallback((msgId: string, confirmed: boolean) => {
    const msg = messages.find((m) => m.id === msgId);
    if (confirmed && msg?.action) {
      msg.action.execute();
    }
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        if (confirmed && m.action) {
          return { ...m, content: `✅ Done! ${m.action.description}`, action: undefined };
        }
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
                <span className="label-sm text-foreground font-semibold">Smart Command</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground p-1">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
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
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
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
            </div>

            {/* Input */}
            <div className="px-3 py-2 border-t border-border/30 flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a command..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none px-2 py-2"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-xl btn-estate flex items-center justify-center disabled:opacity-40"
              >
                <Send size={14} className="text-primary-foreground" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SmartCommandBox;
