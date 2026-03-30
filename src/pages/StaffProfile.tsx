import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Send, CalendarDays, Shield, Pencil, Download, Trash2 } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { PageTransition, StaggerContainer, StaggerItem, AnimatedCard } from "@/components/animations/MotionComponents";
import { toast } from "sonner";

const StaffProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { staff, toggleTask, removeStaff, deleteTask } = useAppState();
  const s = staff.find((s) => s.id === id);

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
            className="absolute bottom-4 left-4 glass px-3.5 py-2 rounded-xl shadow-btn"
          >
            <span className="label-sm text-status-on-time">{s.reliabilityScore}% Reliability</span>
          </motion.div>
        </motion.div>
      </div>

      <div className="px-5 space-y-6 -mt-2">
        <section className="space-y-3 pt-4">
          <p className="label-sm text-muted-foreground">Primary Household Staff</p>
          <h1 className="font-display text-3xl text-foreground tracking-tight leading-tight">{s.name}</h1>
          <div className="flex gap-8">
            <div>
              <p className="label-sm text-muted-foreground">Position</p>
              <p className="text-sm text-card-foreground font-medium">{s.role}</p>
            </div>
            <div>
              <p className="label-sm text-muted-foreground">Tenure</p>
              <p className="text-sm text-card-foreground font-medium">{s.tenure}</p>
            </div>
          </div>
          <div>
            <p className="label-sm text-muted-foreground">Location</p>
            <p className="text-sm text-card-foreground font-medium">{s.location}</p>
          </div>
          <div className="flex gap-3">
            <motion.button whileTap={{ scale: 0.95 }} className="btn-estate text-primary-foreground label-sm px-5 py-3 rounded-2xl flex items-center gap-2">
              <Send size={14} /> Send Instruction
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} className="glass-btn text-foreground label-sm px-5 py-3 rounded-2xl flex items-center gap-2">
              <CalendarDays size={14} /> Schedule
            </motion.button>
          </div>
        </section>

        {/* Assignments - Interactive */}
        <AnimatedCard delay={0.15} className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="headline-sm text-card-foreground">Assignments</h3>
            <span className="label-sm text-muted-foreground glass-btn px-2.5 py-1 rounded-lg">Today</span>
          </div>
          <div className="space-y-3">
            {s.assignments.map((task, i) => (
              <motion.label
                key={i}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 cursor-pointer select-none"
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
            <div className="flex justify-between">
              <span className="text-primary-foreground/70 text-sm font-display italic">Performance Bonus</span>
              <span className="text-status-grace-late font-semibold">+₹{s.payroll.bonus.toLocaleString("en-IN")}.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-foreground/70 text-sm font-display italic">Deductions</span>
              <span className="text-status-absent font-semibold">-₹{s.payroll.deductions.toLocaleString("en-IN")}.00</span>
            </div>
          </div>
          <div className="pt-3 border-t border-primary-foreground/10">
            <p className="label-sm text-primary-foreground/50">Total Net Pay</p>
            <p className="font-display text-3xl text-primary-foreground mt-1">₹{s.payroll.netPay.toLocaleString("en-IN")}.00</p>
          </div>
        </AnimatedCard>
      </div>
    </PageTransition>
  );
};

export default StaffProfile;
