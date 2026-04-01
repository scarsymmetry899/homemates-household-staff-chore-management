import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Send, CalendarDays, Shield, Pencil, Download, Trash2, Clock, MessageCircle } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { PageTransition, StaggerContainer, StaggerItem, AnimatedCard } from "@/components/animations/MotionComponents";
import { toast } from "sonner";

const StaffProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { staff, toggleTask, removeStaff, deleteTask, updateStaffRole, updateStaffShift, addDeduction, updateTelegramChatId, sendTelegramMessage } = useAppState();
  const s = staff.find((s) => s.id === id);

  const [editingRole, setEditingRole] = useState(false);
  const [roleInput, setRoleInput] = useState("");
  const [editingShift, setEditingShift] = useState(false);
  const [shiftStartInput, setShiftStartInput] = useState("");
  const [shiftEndInput, setShiftEndInput] = useState("");
  const [showDeductionForm, setShowDeductionForm] = useState(false);
  const [deductionAmount, setDeductionAmount] = useState("");
  const [deductionReason, setDeductionReason] = useState("");
  const [editingTelegram, setEditingTelegram] = useState(false);
  const [telegramInput, setTelegramInput] = useState("");
  const [showTelegramCompose, setShowTelegramCompose] = useState(false);
  const [telegramMessage, setTelegramMessage] = useState("");

  if (!s) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Staff member not found.</p>
      </div>
    );
  }

  const handleToggle = (taskId: string, isDone: boolean, taskName: string) => {
    toggleTask(s.id, taskId, isDone);
    if (!isDone) {
      toast.success("Task completed", { description: taskName });
    }
  };

  const handleSaveRole = () => {
    if (roleInput.trim()) {
      updateStaffRole(s.id, roleInput.trim());
      toast.success("Role updated", { description: roleInput.trim() });
    }
    setEditingRole(false);
  };

  const handleSaveShift = () => {
    if (shiftStartInput && shiftEndInput) {
      updateStaffShift(s.id, shiftStartInput, shiftEndInput);
      toast.success("Shift timings updated");
    }
    setEditingShift(false);
  };

  const handleAddDeduction = () => {
    if (!deductionAmount || !deductionReason) return;
    addDeduction(s.id, Number(deductionAmount), deductionReason);
    toast.success("Deduction added", { description: `₹${deductionAmount} — ${deductionReason}` });
    setDeductionAmount("");
    setDeductionReason("");
    setShowDeductionForm(false);
  };

  const handleMessage = () => {
    if (!s.telegramChatId) {
      toast.error("Please add a Telegram Chat ID first to use the bot.");
      setEditingTelegram(true);
      return;
    }
    setShowTelegramCompose(true);
  };

  const handleSendTelegram = () => {
    if (!telegramMessage.trim()) return;
    sendTelegramMessage(s.id, telegramMessage);
    setTelegramMessage("");
    setShowTelegramCompose(false);
  };

  const handleSaveTelegram = () => {
    updateTelegramChatId(s.id, telegramInput.trim());
    setEditingTelegram(false);
  };

  return (
    <PageTransition>
      {/* Profile Header */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-56 bg-secondary-container overflow-hidden"
        >
          <img src={s.photo} alt={s.name} className="w-full h-full object-cover" />
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl glass flex items-center justify-center shadow-btn"
            >
              <ArrowLeft size={18} />
            </motion.button>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-xl glass flex items-center justify-center shadow-btn">
                <Bell size={16} />
              </button>
              <button className="w-10 h-10 rounded-xl btn-estate flex items-center justify-center text-primary-foreground">
                <Shield size={16} />
              </button>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-4 left-4 flex gap-2"
          >
            <span className="glass px-3 py-1.5 rounded-xl shadow-btn label-sm text-status-on-time">{s.reliabilityScore}% Reliable</span>
            <span className={`glass px-3 py-1.5 rounded-xl shadow-btn label-sm ${s.punctualityScore >= 90 ? "text-status-on-time" : s.punctualityScore >= 75 ? "text-status-late" : "text-destructive"}`}>{s.punctualityScore}% Punctual</span>
          </motion.div>
        </motion.div>
      </div>

      <div className="px-5 space-y-6 -mt-2">
        <section className="space-y-3 pt-4">
          <p className="label-sm text-muted-foreground">Homemaker Profile</p>
          <h1 className="font-display text-3xl text-foreground tracking-tight leading-tight">{s.name}</h1>
          <div className="flex gap-8">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="label-sm text-muted-foreground">Position</p>
                <button onClick={() => { setEditingRole(true); setRoleInput(s.role); }} className="text-secondary">
                  <Pencil size={10} />
                </button>
              </div>
              {editingRole ? (
                <div className="flex gap-1 mt-1">
                  <input
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    className="bg-surface-low rounded-lg px-2 py-1 text-sm text-card-foreground border border-border/30 w-28"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSaveRole()}
                  />
                  <button onClick={handleSaveRole} className="label-sm text-secondary px-2">Save</button>
                </div>
              ) : (
                <p className="text-sm text-card-foreground font-medium">{s.role}</p>
              )}
            </div>
            <div>
              <p className="label-sm text-muted-foreground">Tenure</p>
              <p className="text-sm text-card-foreground font-medium">{s.tenure}</p>
            </div>
          </div>

          {/* Shift Timings */}
          <div>
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-muted-foreground" />
              <p className="label-sm text-muted-foreground">Shift Timings</p>
              <button onClick={() => { setEditingShift(true); setShiftStartInput(s.shiftStart); setShiftEndInput(s.shiftEnd); }} className="text-secondary">
                <Pencil size={10} />
              </button>
            </div>
            {editingShift ? (
              <div className="flex gap-2 mt-1 items-center">
                <input
                  value={shiftStartInput}
                  onChange={(e) => setShiftStartInput(e.target.value)}
                  placeholder="e.g. 08:00 AM"
                  className="bg-surface-low rounded-lg px-2 py-1 text-sm text-card-foreground border border-border/30 w-24"
                />
                <span className="text-muted-foreground text-xs">to</span>
                <input
                  value={shiftEndInput}
                  onChange={(e) => setShiftEndInput(e.target.value)}
                  placeholder="e.g. 05:00 PM"
                  className="bg-surface-low rounded-lg px-2 py-1 text-sm text-card-foreground border border-border/30 w-24"
                />
                <button onClick={handleSaveShift} className="label-sm text-secondary px-2">Save</button>
              </div>
            ) : (
              <p className="text-sm text-card-foreground font-medium">{s.shiftStart} — {s.shiftEnd}</p>
            )}
          </div>

          <div className="flex gap-8">
            <div>
              <p className="label-sm text-muted-foreground">Location</p>
              <p className="text-sm text-card-foreground font-medium">{s.location}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="label-sm text-muted-foreground">Telegram Chat ID</p>
                <button onClick={() => { setEditingTelegram(true); setTelegramInput(s.telegramChatId || ""); }} className="text-secondary">
                  <Pencil size={10} />
                </button>
              </div>
              {editingTelegram ? (
                <div className="flex gap-1 mt-1">
                  <input
                    value={telegramInput}
                    onChange={(e) => setTelegramInput(e.target.value)}
                    placeholder="e.g. 123456789"
                    className="bg-surface-low rounded-lg px-2 py-1 text-sm text-card-foreground border border-border/30 w-28"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSaveTelegram()}
                  />
                  <button onClick={handleSaveTelegram} className="label-sm text-secondary px-2">Save</button>
                </div>
              ) : (
                <p className="text-sm text-card-foreground font-medium">{s.telegramChatId || <span className="text-muted-foreground text-xs italic">Not Set</span>}</p>
              )}
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleMessage} className="btn-estate text-primary-foreground label-sm px-5 py-3 rounded-2xl flex items-center gap-2">
              <MessageCircle size={14} /> Send Telegram
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} className="glass-btn text-foreground label-sm px-5 py-3 rounded-2xl flex items-center gap-2">
              <CalendarDays size={14} /> Schedule
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                removeStaff(s.id);
                toast.success(`${s.name} removed from staff`);
                navigate("/staff");
              }}
              className="glass-btn text-destructive label-sm px-4 py-3 rounded-2xl flex items-center gap-2"
            >
              <Trash2 size={14} />
            </motion.button>
          </div>
          
          <AnimatePresence>
            {showTelegramCompose && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-4"
              >
                <div className="glass-card rounded-2xl p-4 bg-[#0088cc]/10 border border-[#0088cc]/20">
                  <h3 className="label-sm text-[#0088cc] mb-2 flex items-center gap-2">
                    <Send size={14} /> New Bot Message
                  </h3>
                  <textarea
                    value={telegramMessage}
                    onChange={(e) => setTelegramMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full bg-surface-low rounded-xl px-3 py-2 text-sm text-card-foreground outline-none border border-border/30 min-h-[80px]"
                  />
                  <div className="flex gap-2 mt-2 justify-end">
                    <button onClick={() => setShowTelegramCompose(false)} className="label-sm text-muted-foreground px-3 py-1.5">Cancel</button>
                    <button onClick={handleSendTelegram} className="label-sm bg-[#0088cc] text-white px-4 py-1.5 rounded-lg flex items-center gap-1.5 hover:opacity-90 transition-opacity">
                      Send <Send size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Assignments */}
        <AnimatedCard delay={0.15} className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="headline-sm text-card-foreground">Assignments</h3>
            <span className="label-sm text-muted-foreground glass-btn px-2.5 py-1 rounded-lg">Today</span>
          </div>
          <div className="space-y-3">
            {s.assignments.map((task) => (
              <div key={task.id} className="flex items-center gap-3">
                <motion.label
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 cursor-pointer select-none flex-1"
                  onClick={() => handleToggle(task.id, task.done, task.task)}
                >
                  <motion.div
                    animate={{ scale: task.done ? [1, 1.3, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-card ${
                      task.done ? "btn-estate" : "glass-btn"
                    }`}
                  >
                    {task.done && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </motion.div>
                  <span className={`text-sm transition-all ${task.done ? "text-muted-foreground line-through" : "text-card-foreground"}`}>
                    {task.task}
                  </span>
                </motion.label>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    deleteTask(task.id);
                    toast.success("Task deleted", { description: task.task });
                  }}
                  className="w-7 h-7 rounded-lg glass-btn flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                  <Trash2 size={13} />
                </motion.button>
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* Internal Notes */}
        {s.notes && (
          <AnimatedCard delay={0.2} className="bg-surface-low/50 rounded-2xl p-5 space-y-3 border border-border/20">
            <h3 className="headline-sm text-foreground">Internal Notes</h3>
            <blockquote className="font-display italic text-sm text-muted-foreground leading-relaxed border-l-2 border-secondary pl-4">
              "{s.notes}"
            </blockquote>
            <button className="flex items-center gap-2 label-sm text-secondary glass-btn px-3 py-1.5 rounded-xl">
              <Pencil size={12} /> Edit Notes
            </button>
          </AnimatedCard>
        )}

        {/* Attendance Timeline */}
        <section className="space-y-4">
          <h3 className="headline-sm text-foreground">Attendance</h3>
          <StaggerContainer className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-border/30" />
            {s.attendance.map((entry, i) => (
              <StaggerItem key={i} className="relative mb-5 last:mb-0">
                <div
                  className={`absolute left-[-18px] top-1.5 w-3 h-3 rounded-full shadow-card ${
                    entry.type === "check-in" || entry.type === "on-site"
                      ? "bg-status-on-time"
                      : entry.type === "late"
                      ? "bg-status-late"
                      : entry.type === "leave"
                      ? "bg-secondary"
                      : "bg-status-absent"
                  }`}
                />
                <p className="label-sm text-muted-foreground">{entry.date}</p>
                <p className="text-sm text-card-foreground font-medium mt-0.5 whitespace-pre-line">{entry.detail}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Payroll */}
        <AnimatedCard delay={0.25} className="btn-estate rounded-2xl p-6 space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <p className="label-sm text-primary-foreground/60">Monthly Payroll</p>
            <div className="w-9 h-9 rounded-xl bg-primary-foreground/10 flex items-center justify-center backdrop-blur-sm">
              <Download size={14} className="text-primary-foreground" />
            </div>
          </div>
          <h3 className="font-display text-xl text-primary-foreground">{s.payroll.month}</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-primary-foreground/70 text-sm">Base Salary</span>
              <span className="text-primary-foreground font-semibold">₹{s.payroll.baseSalary.toLocaleString("en-IN")}.00</span>
            </div>
            {s.payroll.deductions > 0 && (
              <div className="flex justify-between">
                <span className="text-primary-foreground/70 text-sm font-display italic">Deductions</span>
                <span className="text-status-absent font-semibold">-₹{s.payroll.deductions.toLocaleString("en-IN")}.00</span>
              </div>
            )}
          </div>
          <div className="pt-3 border-t border-primary-foreground/10">
            <p className="label-sm text-primary-foreground/50">Total Net Pay</p>
            <p className="font-display text-3xl text-primary-foreground mt-1">₹{s.payroll.netPay.toLocaleString("en-IN")}.00</p>
          </div>

          {/* Manual Deduction */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDeductionForm(!showDeductionForm)}
            className="w-full bg-primary-foreground/10 text-primary-foreground label-sm py-2.5 rounded-xl backdrop-blur-sm border border-primary-foreground/10"
          >
            + Add Deduction
          </motion.button>
        </AnimatedCard>

        <AnimatePresence>
          {showDeductionForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card rounded-2xl p-5 space-y-3 mb-4">
                <h3 className="headline-sm text-card-foreground">Manual Deduction</h3>
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  value={deductionAmount}
                  onChange={(e) => setDeductionAmount(e.target.value)}
                  className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30"
                />
                <input
                  type="text"
                  placeholder="Reason (e.g. Absence, Late penalty)"
                  value={deductionReason}
                  onChange={(e) => setDeductionReason(e.target.value)}
                  className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddDeduction}
                  className="w-full btn-estate text-primary-foreground label-sm py-3 rounded-xl"
                >
                  Apply Deduction
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default StaffProfile;
