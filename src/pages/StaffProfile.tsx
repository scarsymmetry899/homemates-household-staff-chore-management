import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Send, CalendarDays, Shield, Pencil, Download, Trash2, Clock, MessageCircle, Camera, X } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { PageTransition, StaggerContainer, StaggerItem, AnimatedCard } from "@/components/animations/MotionComponents";
import { toast } from "sonner";

const StaffProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { staff, toggleTask, removeStaff, deleteTask, updateStaffRole, updateStaffShift, addDeduction, updateStaffPhoto } = useAppState();
  const s = staff.find((s) => s.id === id);

  const [editingRole, setEditingRole] = useState(false);
  const [roleInput, setRoleInput] = useState("");
  const [editingShift, setEditingShift] = useState(false);
  const [shiftStartInput, setShiftStartInput] = useState("");
  const [shiftEndInput, setShiftEndInput] = useState("");
  const [showDeductionForm, setShowDeductionForm] = useState(false);
  const [deductionAmount, setDeductionAmount] = useState("");
  const [deductionReason, setDeductionReason] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);

  if (!s) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Staff member not found.</p>
      </div>
    );
  }

  const handleToggle = (i: number) => {
    toggleTask(s.id, i);
    if (!s.assignments[i].done) {
      toast.success("Task completed", { description: s.assignments[i].task });
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
    window.open(`https://t.me/${s.phone.replace(/[\s+]/g, "")}`, "_blank");
    toast.success("Opening Telegram...");
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    updateStaffPhoto(s.id, objectUrl);
    toast.success("Photo updated");
  };

  return (
    <PageTransition>
      {/* Profile Header */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-56 bg-secondary-container overflow-hidden relative"
        >
          <img src={s.photo} alt={s.name} className="w-full h-full object-cover" />

          {/* Camera overlay button */}
          <button
            onClick={() => photoInputRef.current?.click()}
            className="absolute bottom-4 right-4 w-9 h-9 rounded-xl glass flex items-center justify-center shadow-btn z-10"
          >
            <Camera size={16} className="text-foreground" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={photoInputRef}
            className="hidden"
            onChange={handlePhotoChange}
          />

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

          <div>
            <p className="label-sm text-muted-foreground">Location</p>
            <p className="text-sm text-card-foreground font-medium">{s.location}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleMessage} className="btn-estate text-primary-foreground label-sm px-5 py-3 rounded-2xl flex items-center gap-2">
              <MessageCircle size={14} /> Message
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowSchedule(true)} className="glass-btn text-foreground label-sm px-5 py-3 rounded-2xl flex items-center gap-2">
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
        </section>

        {/* Assignments */}
        <AnimatedCard delay={0.15} className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="headline-sm text-card-foreground">Assignments</h3>
            <span className="label-sm text-muted-foreground glass-btn px-2.5 py-1 rounded-lg">Today</span>
          </div>
          <div className="space-y-3">
            {s.assignments.map((task, i) => (
              <div key={i} className="flex items-center gap-3">
                <motion.label
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 cursor-pointer select-none flex-1"
                  onClick={() => handleToggle(i)}
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
                    deleteTask(s.id, i);
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

      {/* Schedule Modal */}
      <AnimatePresence>
        {showSchedule && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowSchedule(false)}
            />
            {/* Bottom sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-t-3xl overflow-hidden"
              style={{ maxHeight: "70vh" }}
            >
              <div className="overflow-y-auto" style={{ maxHeight: "70vh" }}>
                {/* Handle bar */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-border/50" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/20">
                  <h2 className="headline-sm text-card-foreground">Schedule & Timeline</h2>
                  <button
                    onClick={() => setShowSchedule(false)}
                    className="w-8 h-8 rounded-xl glass-btn flex items-center justify-center"
                  >
                    <X size={16} className="text-muted-foreground" />
                  </button>
                </div>

                <div className="px-6 py-5 space-y-6">
                  {/* Section 1: Shift */}
                  <section className="space-y-3">
                    <p className="label-sm text-muted-foreground">Shift</p>
                    <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                        <Clock size={18} className="text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-card-foreground">
                          {s.shiftStart} → {s.shiftEnd}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">Daily shift schedule</p>
                      </div>
                    </div>
                  </section>

                  {/* Section 2: Today's Assignments */}
                  <section className="space-y-3">
                    <p className="label-sm text-muted-foreground">Today's Assignments</p>
                    <div className="space-y-2">
                      {s.assignments.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No assignments today.</p>
                      ) : (
                        s.assignments.map((task, i) => (
                          <div key={i} className="flex items-center gap-3 glass-card rounded-xl p-3">
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                task.done ? "btn-estate" : "glass-btn"
                              }`}
                            >
                              {task.done && (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-sm flex-1 ${task.done ? "text-muted-foreground line-through" : "text-card-foreground"}`}>
                              {task.task}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </section>

                  {/* Section 3: Recent Attendance */}
                  <section className="space-y-3 pb-6">
                    <p className="label-sm text-muted-foreground">Recent Attendance</p>
                    <div className="space-y-2">
                      {s.attendance.slice(0, 3).map((entry, i) => (
                        <div key={i} className="glass-card rounded-xl p-3 flex items-start gap-3">
                          <div
                            className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                              entry.type === "check-in" || entry.type === "on-site"
                                ? "bg-status-on-time"
                                : entry.type === "late"
                                ? "bg-status-late"
                                : entry.type === "leave"
                                ? "bg-secondary"
                                : "bg-status-absent"
                            }`}
                          />
                          <div>
                            <p className="label-sm text-muted-foreground">{entry.date}</p>
                            <p className="text-sm text-card-foreground mt-0.5 whitespace-pre-line">{entry.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default StaffProfile;
