import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Check, X, Sparkles } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import type { StaffStatus } from "@/data/staff";
import type { Expense } from "@/context/AppContext";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  action?: ParsedAction | null;
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
      content: "Hi! I'm your home assistant. Try commands like:\n• \"Add task clean kitchen for Elena\"\n• \"Add expense 500 fuel for Marcus\"\n• \"Set Elena status on-duty\"\n• \"Remove task 1 from Elena\"",
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { staff, addTask, addExpense, deleteTask, updateStaffStatus, removeStaff } = useAppState();

  const findStaff = useCallback(
    (text: string) => {
      const lower = text.toLowerCase();
      return staff.find(
        (s) =>
          lower.includes(s.name.toLowerCase()) ||
          lower.includes(s.name.split(" ")[0].toLowerCase())
      );
    },
    [staff]
  );

  const parseCommand = useCallback(
    (text: string): ParsedAction | null => {
      const lower = text.toLowerCase().trim();
      const member = findStaff(text);

      // ADD TASK: "add task <task> for <staff>"
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
    const action = parseCommand(trimmed);

    const assistantMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      content: action
        ? `I understood: **${action.description}**\nShould I go ahead?`
        : "I couldn't understand that command. Try something like:\n• \"Add task mop floors for Elena\"\n• \"Add expense 800 fuel for Marcus\"\n• \"Set Elena status late\"",
      action,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 100);
  }, [input, parseCommand]);

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
                    {m.action && (
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
