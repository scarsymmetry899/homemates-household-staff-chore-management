import { CalendarCheck, CheckCircle2, Circle, Clock, CreditCard, IndianRupee, MessageSquareWarning, ReceiptText } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAppState } from "@/context/AppContext";
import StaffAvatar from "@/components/StaffAvatar";
import { PageTransition, StaggerContainer, StaggerItem, PressableCard } from "@/components/animations/MotionComponents";

export default function StaffWorkspace() {
  const { staff, activeStaffId, setActiveStaffId, toggleTask } = useAppState();
  const activeStaff = staff.find((member) => member.id === activeStaffId) || staff[0];

  if (!activeStaff) {
    return (
      <PageTransition className="px-5 py-10">
        <div className="glass-card rounded-3xl p-6 text-center space-y-2">
          <p className="headline-sm text-foreground">No staff profile selected</p>
          <p className="text-sm text-muted-foreground">Ask the owner to create or assign a staff profile first.</p>
        </div>
      </PageTransition>
    );
  }

  const completedTasks = activeStaff.assignments.filter((task) => task.done).length;
  const attendanceEntry = activeStaff.attendance[0];

  return (
    <PageTransition className="px-5 space-y-6">
      <section className="glass-card rounded-3xl p-5 space-y-4">
        <div className="flex items-center gap-4">
          <StaffAvatar name={activeStaff.name} src={activeStaff.photo} className="w-16 h-16 rounded-2xl shrink-0" textClassName="text-lg" />
          <div className="min-w-0 flex-1">
            <p className="label-sm text-muted-foreground">Staff Mode</p>
            <h1 className="font-display text-2xl text-foreground leading-tight">{activeStaff.name}</h1>
            <p className="text-sm text-muted-foreground truncate">{activeStaff.role}</p>
          </div>
        </div>

        {staff.length > 1 && (
          <select
            value={activeStaff.id}
            onChange={(event) => setActiveStaffId(event.target.value)}
            className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30"
          >
            {staff.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} - {member.role}
              </option>
            ))}
          </select>
        )}
      </section>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-2xl p-4">
          <p className="label-sm text-status-on-time">Tasks Done</p>
          <p className="font-display text-2xl text-card-foreground mt-1">
            {completedTasks}/{activeStaff.assignments.length}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <p className="label-sm text-secondary">Today Status</p>
          <p className="font-display text-xl text-card-foreground mt-1 capitalize">{activeStaff.status.replace("-", " ")}</p>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="headline-sm text-foreground">My Tasks Today</h2>
          <span className="label-sm text-muted-foreground">{activeStaff.assignments.length} total</span>
        </div>
        <StaggerContainer className="space-y-3">
          {activeStaff.assignments.length === 0 ? (
            <div className="glass-card rounded-2xl p-5 text-sm text-muted-foreground">No tasks assigned for today.</div>
          ) : (
            activeStaff.assignments.map((task, index) => (
              <StaggerItem key={`${activeStaff.id}-${index}-${task.task}`}>
                <PressableCard>
                  <button
                    type="button"
                    onClick={() => toggleTask(activeStaff.id, index)}
                    className="glass-card rounded-2xl p-4 w-full text-left flex items-start gap-3"
                  >
                    <motion.span whileTap={{ scale: 0.9 }} className="pt-0.5">
                      {task.done ? <CheckCircle2 size={20} className="text-status-on-time" /> : <Circle size={20} className="text-surface-container" />}
                    </motion.span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm font-medium ${task.done ? "line-through text-muted-foreground" : "text-card-foreground"}`}>
                        {task.task}
                      </span>
                      {task.dueDate && (
                        <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock size={12} /> Due {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      )}
                    </span>
                  </button>
                </PressableCard>
              </StaggerItem>
            ))
          )}
        </StaggerContainer>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => toast.info("Cash request workflow is next", { description: "This will create owner-approved grocery/fuel/supply requests." })}
          className="glass-card rounded-2xl p-4 text-left space-y-2"
        >
          <ReceiptText size={18} className="text-secondary" />
          <p className="label-sm text-foreground">Request Cash</p>
          <p className="text-xs text-muted-foreground">Groceries, fuel, supplies</p>
        </button>
        <button
          type="button"
          onClick={() => toast.info("Attendance correction workflow is next", { description: "Staff will request owner approval for disputed attendance." })}
          className="glass-card rounded-2xl p-4 text-left space-y-2"
        >
          <MessageSquareWarning size={18} className="text-status-late" />
          <p className="label-sm text-foreground">Report Issue</p>
          <p className="text-xs text-muted-foreground">Attendance discrepancy</p>
        </button>
      </section>

      <section className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="label-sm text-muted-foreground">Current Month</p>
            <h2 className="headline-sm text-foreground">Payment Summary</h2>
          </div>
          <CreditCard size={18} className="text-secondary" />
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Base</p>
            <p className="text-sm font-semibold text-card-foreground">₹{activeStaff.payroll.baseSalary.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Deducted</p>
            <p className="text-sm font-semibold text-destructive">₹{activeStaff.payroll.deductions.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Net</p>
            <p className="text-sm font-semibold text-status-on-time">₹{activeStaff.payroll.netPay.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <CalendarCheck size={18} className="text-secondary" />
          <h2 className="headline-sm text-foreground">Attendance</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {attendanceEntry ? `${attendanceEntry.date}: ${attendanceEntry.detail}` : "No attendance record for today yet."}
        </p>
        <p className="text-xs text-muted-foreground">Attendance is read-only in staff mode. Corrections require owner approval.</p>
      </section>

      <div className="pb-4" />
    </PageTransition>
  );
}
