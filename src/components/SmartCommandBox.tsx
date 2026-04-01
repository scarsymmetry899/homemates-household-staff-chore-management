import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Check, X, Sparkles, Loader2 } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { toast } from "sonner";
import type { Expense } from "@/context/AppContext";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  actionPayloads?: ActionPayload[];
}

interface ActionPayload {
  type: "add_task" | "add_expense" | "update_status" | "delete_task" | "remove_staff";
  description: string;
  staffId?: string;
  taskName?: string;
  amount?: number;
  category?: string;
  status?: string;
  taskId?: string;
}

const SmartCommandBox = () => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm powered by Google Gemini. Try complex commands like:\n• \"Marcus bought 1200 worth of groceries and add a task for Sienna to mop the kitchen\"\n• \"Elena is running late today and mark her first task as done\"",
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { staff, addTask, addExpense, updateStaffStatus, deleteTask, removeStaff } = useAppState();

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 100);

    try {
      // Prepare simplified staff context for the LLM
      const staffContext = staff.map(s => ({
        id: s.id,
        name: s.name,
        role: s.role,
        tasks: s.assignments.map(t => ({ id: t.id, name: t.task, done: t.done }))
      }));

      const systemPrompt = `
        You are a highly capable household management assistant powered by Google Gemini.
        Your job is to parse the user's natural language command, match it against the current staff directory, and return a JSON list of actions to execute.

        CURRENT STAFF DIRECTORY (JSON):
        ${JSON.stringify(staffContext)}

        AVAILABLE ACTIONS:
        1. "add_task": requires "staffId" and "taskName"
        2. "add_expense": requires "amount" (number) and "category" (must be "Fuel", "Groceries", "Repairs", "Advances", or "Household", strict casing) and optional "staffId"
        3. "update_status": requires "staffId" and "status" (must be "on-duty", "late", "absent", "en-route", or "off-duty")
        4. "delete_task": requires "taskId"
        5. "remove_staff": requires "staffId"

        USER COMMAND: "${trimmed}"

        Respond ONLY with a valid JSON object in exactly this format:
        {
          "reply": "A concise, friendly confirmation message summarizing what you are about to do.",
          "actions": [
            {
              "type": "add_task",
              "description": "Add task 'Clean kitchen' for Elena",
              "staffId": "123",
              "taskName": "Clean kitchen"
            }
          ]
        }
        Do not wrap the JSON in markdown code blocks. Just output raw JSON.
      `;

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing VITE_GEMINI_API_KEY in environment variables.");
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch from Gemini API");
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error("Empty response from Gemini");

      const result = JSON.parse(rawText);

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: result.reply,
        actionPayloads: result.actions && result.actions.length > 0 ? result.actions : undefined,
      };

      setMessages((prev) => [...prev, assistantMsg]);

    } catch (error: unknown) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, role: "assistant", content: `Error processing request: ${(error as Error).message || "Unknown error"}` }
      ]);
    } finally {
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 100);
    }
  }, [input, staff]);

  const executeAction = useCallback((action: ActionPayload) => {
    try {
      if (action.type === "add_task" && action.staffId && action.taskName) {
        addTask(action.staffId, action.taskName);
      } else if (action.type === "add_expense" && action.amount && action.category) {
        // Find staff name safely
        const staffName = action.staffId ? staff.find(s => s.id === action.staffId)?.name : undefined;
        addExpense({
          category: action.category as Expense["category"],
          amount: action.amount,
          description: `${action.category} expense`,
          staffName,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        });
      } else if (action.type === "update_status" && action.staffId && action.status) {
        updateStaffStatus(action.staffId, action.status as "on-duty" | "off-duty" | "late" | "absent" | "en-route");
      } else if (action.type === "delete_task" && action.taskId) {
        deleteTask(action.taskId);
      } else if (action.type === "remove_staff" && action.staffId) {
        removeStaff(action.staffId);
      } else {
        throw new Error("Invalid action payload");
      }
    } catch (error: unknown) {
      toast.error(`Action failed: ${action.description}`, { description: (error as Error).message });
      throw error;
    }
  }, [addTask, addExpense, updateStaffStatus, deleteTask, removeStaff, staff]);

  const handleConfirm = useCallback((msgId: string, confirmed: boolean) => {
    const msg = messages.find((m) => m.id === msgId);
    
    if (confirmed && msg?.actionPayloads) {
      let successCount = 0;
      msg.actionPayloads.forEach(action => {
        try {
          executeAction(action);
          successCount++;
        } catch(e) { console.error("Action execution ignored:", e); }
      });
      if (successCount === msg.actionPayloads.length) {
        toast.success(`Executed ${successCount} actions successfully.`);
      } else {
        toast.warning(`Executed ${successCount} out of ${msg.actionPayloads.length} actions.`);
      }
    }

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        if (confirmed) {
          return { ...m, content: `✅ ${m.content}`, actionPayloads: undefined };
        }
        return { ...m, content: `❌ Cancelled. Type another command.`, actionPayloads: undefined };
      })
    );
  }, [messages, executeAction]);

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
            style={{ maxHeight: "60vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-primary/5">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <span className="label-sm text-foreground font-semibold">Gemini Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground p-1 hover:text-foreground">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
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
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-surface-low text-foreground border border-border/50 rounded-bl-md"
                    }`}
                  >
                    {m.content}
                    
                    {/* Render exact actions that will be taken */}
                    {m.actionPayloads && m.actionPayloads.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Proposed Actions:</p>
                        <ul className="space-y-1">
                          {m.actionPayloads.map((act, i) => (
                            <li key={i} className="text-xs text-secondary flex gap-1.5 items-start">
                              <span className="mt-0.5">•</span>
                              <span>{act.description}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleConfirm(m.id, true)}
                            className="flex-1 flex justify-center items-center gap-1.5 bg-status-on-time/20 text-status-on-time label-sm py-2 rounded-xl hover:bg-status-on-time/30 transition-colors"
                          >
                            <Check size={14} /> Execute
                          </button>
                          <button
                            onClick={() => handleConfirm(m.id, false)}
                            className="flex-1 flex justify-center items-center gap-1.5 bg-destructive/10 text-destructive label-sm py-2 rounded-xl hover:bg-destructive/20 transition-colors"
                          >
                            <X size={14} /> Cancel
                          </button>
                        </div>
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

              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={14} className="text-primary" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-surface-low text-foreground border border-border/50 rounded-bl-md flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-border/30 flex gap-2 bg-background/50 backdrop-blur-sm">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isTyping && handleSend()}
                disabled={isTyping}
                placeholder="Ask Gemini to perform actions..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none px-2 py-1 disabled:opacity-50"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-xl btn-estate flex items-center justify-center disabled:opacity-40"
              >
                <Send size={16} className="text-primary-foreground" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SmartCommandBox;
