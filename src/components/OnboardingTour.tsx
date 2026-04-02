import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

interface OnboardingTourProps {
  onDone: () => void;
}

const steps = [
  {
    icon: "🏠",
    title: "Welcome to Homemaker",
    description:
      "Your household command centre. Manage staff, track tasks, log expenses, and monitor attendance — all from one place.",
    tip: null,
  },
  {
    icon: "📊",
    title: "Home Dashboard",
    description:
      "The home screen shows live staff status, today's active alerts, task completion and your monthly spend at a glance.",
    tip: "💡 Pull down to refresh live data anytime.",
  },
  {
    icon: "👥",
    title: "Staff Directory",
    description:
      "Add all your household staff with their role, shift timings, salary and start date. Filter by department or status (Active / Late / Absent).",
    tip: "💡 Tap a staff card to open their full profile, edit their role, add tasks, or message them directly.",
  },
  {
    icon: "✅",
    title: "Tasks & Assignments",
    description:
      "Assign tasks to specific staff members with optional due dates. Track completions in real time. Overdue tasks surface automatically as alerts.",
    tip: "💡 Swipe a task card left to delete, or use the +7 Days / Reassign actions when tasks run late.",
  },
  {
    icon: "💰",
    title: "Expense Tracker",
    description:
      "Log household expenses by category — Fuel, Groceries, Repairs, Advances, Household. Tap Scan Receipt to let the AI read a receipt photo and auto-fill the items.",
    tip: "💡 Approve or reject each scanned line item before adding to your records.",
  },
  {
    icon: "🔔",
    title: "Live Flags & Alerts",
    description:
      "Get instant alerts when staff are late, absent, tasks are overdue, or expense thresholds are crossed. Take action directly from the alert card.",
    tip: "💡 Swipe an alert left to dismiss it, or use the action buttons to mark leave, reassign, extend deadlines and more.",
  },
  {
    icon: "✨",
    title: "AI Home Assistant",
    description:
      "Tap the sparkle ✨ button (bottom-right) to open the AI assistant powered by Gemini. Ask anything in plain English or use the quick-action chips.",
    tip: "💡 Try: \"Who is on duty?\", \"Mark Marcus late\", \"Add task mop floors for Elena\", or \"Show expenses\".",
  },
  {
    icon: "📱",
    title: "Telegram Bot",
    description:
      "Your Telegram bot lets you manage your household remotely. Send commands like /status, /tasks, /mark_late Name, or /mark_present Name from anywhere.",
    tip: "💡 Set your Telegram Chat ID in Settings to receive instant notifications for every action.",
  },
  {
    icon: "📈",
    title: "Insights & Reports",
    description:
      "View daily, weekly or monthly attendance grids. Track punctuality and reliability scores. Export a full Excel report with Staff, Tasks and Expense sheets.",
    tip: "💡 Long-press any attendance cell to manually update it. Today's column is always highlighted.",
  },
];

const OnboardingTour = ({ onDone }: OnboardingTourProps) => {
  const [step, setStep] = useState(0);
  const isLast = step === steps.length - 1;

  const next = useCallback(() => {
    if (isLast) {
      onDone();
    } else {
      setStep((s) => s + 1);
    }
  }, [isLast, onDone]);

  const prev = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const current = steps[step];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-end pb-6 px-4"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Skip button */}
      <button
        onClick={onDone}
        className="absolute top-14 right-5 flex items-center gap-1 glass px-3 py-1.5 rounded-xl text-sm text-foreground/80"
      >
        <X size={13} /> Skip
      </button>

      {/* Step counter */}
      <p className="text-white/50 text-xs mb-3">
        {step + 1} of {steps.length}
      </p>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.97 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="w-full max-w-sm bg-card rounded-3xl p-7 space-y-4 shadow-2xl"
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-4xl mx-auto">
            {current.icon}
          </div>

          {/* Title */}
          <h2 className="font-display text-2xl text-card-foreground text-center leading-tight">
            {current.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            {current.description}
          </p>

          {/* Tip */}
          {current.tip && (
            <div className="bg-secondary/8 rounded-xl px-4 py-3">
              <p className="text-xs text-secondary leading-relaxed">{current.tip}</p>
            </div>
          )}

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 pt-1">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`rounded-full transition-all ${
                  i === step
                    ? "w-5 h-2 bg-secondary"
                    : "w-2 h-2 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-1">
            {step > 0 && (
              <button
                onClick={prev}
                className="flex-none glass-btn w-11 h-11 rounded-xl flex items-center justify-center text-muted-foreground"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={next}
              className="flex-1 btn-estate text-primary-foreground font-semibold py-3 rounded-2xl flex items-center justify-center gap-2"
            >
              {isLast ? "Get Started" : (
                <>
                  Next <ChevronRight size={16} />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default OnboardingTour;
