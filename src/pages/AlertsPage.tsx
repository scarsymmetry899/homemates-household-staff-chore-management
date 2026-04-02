import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, Shield, Receipt, Bell, X, Users } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { PageTransition, StaggerContainer, StaggerItem, PullToRefresh, SwipeableCard } from "@/components/animations/MotionComponents";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { Alert } from "@/context/AppContext";

const typeConfig = {
  attendance: { icon: Clock, color: "text-status-late", bgColor: "bg-status-late/10", label: "Attendance" },
  task: { icon: AlertTriangle, color: "text-secondary", bgColor: "bg-secondary/10", label: "Task" },
  security: { icon: Shield, color: "text-status-absent", bgColor: "bg-status-absent/10", label: "Security" },
  expense: { icon: Receipt, color: "text-status-on-time", bgColor: "bg-status-on-time/10", label: "Expense" },
};

const severityBorder = {
  high: "border-l-4 border-l-status-absent",
  medium: "border-l-4 border-l-status-late",
  low: "border-l-4 border-l-border",
};

const AlertsPage = () => {
  const navigate = useNavigate();
  const {
    staff, alerts, dismissAlert,
    updateStaffStatus, addDeduction, markAttendance,
    reassignTask, extendTaskDeadlineByName,
  } = useAppState();

  const activeAlerts = alerts.filter((a) => !a.dismissed);
  const dismissedAlerts = alerts.filter((a) => a.dismissed);

  // For reassign picker
  const [reassignAlert, setReassignAlert] = useState<Alert | null>(null);

  const handleAction = useCallback((alert: Alert, action: string) => {
    // Find the relevant staff member
    const member = alert.staffId
      ? staff.find((s) => s.id === alert.staffId)
      : alert.staffName
      ? staff.find((s) => s.name === alert.staffName)
      : undefined;

    switch (action) {
      // ── Attendance actions ──────────────────────────────────────
      case "Mark Leave":
        if (member) {
          updateStaffStatus(member.id, "absent");
          markAttendance(member.id, "leave", "Approved absence — marked via Live Flags");
          toast.success(`${member.name} marked on leave`);
        }
        break;

      case "Mark Late":
        if (member) {
          updateStaffStatus(member.id, "late");
          markAttendance(member.id, "late", "Late arrival — acknowledged via Live Flags");
          toast.success(`${member.name} marked late`);
        }
        break;

      case "Ignore":
        toast.success("Alert ignored");
        break;

      // ── Chauffeur late actions ──────────────────────────────────
      case "Apply Late Penalty":
        if (member) {
          addDeduction(member.id, 500, "Late arrival penalty");
          markAttendance(member.id, "late", "Late penalty applied — ₹500 deducted");
          toast.success(`₹500 penalty applied to ${member.name}`);
        }
        break;

      case "Waive":
        toast.success("Late penalty waived");
        break;

      case "Note":
        if (member) markAttendance(member.id, "note", "Lateness noted by owner");
        toast.success("Lateness noted in attendance record");
        break;

      // ── Task actions ────────────────────────────────────────────
      case "Reassign": {
        // Open staff picker
        setReassignAlert(alert);
        return; // Don't dismiss yet
      }

      case "Extend Deadline":
        if (member && alert.taskName) {
          extendTaskDeadlineByName(member.id, alert.taskName, 7);
          toast.success(`Deadline extended by 7 days`, { description: alert.taskName });
        } else {
          toast.success("Deadline extended");
        }
        break;

      // ── Expense actions ─────────────────────────────────────────
      case "Review Details":
        navigate("/expenses");
        return; // Don't dismiss

      case "Acknowledge":
        toast.success("Expense alert acknowledged");
        break;

      // ── Security actions ────────────────────────────────────────
      case "Investigate":
        toast.success("Investigation logged", { description: "Security team notified." });
        break;

      case "Mark Safe":
        toast.success("Zone marked clear", { description: "No threat detected." });
        break;

      // ── Generic ─────────────────────────────────────────────────
      case "Dismiss":
      default:
        toast.success("Alert dismissed");
        break;
    }

    dismissAlert(alert.id);
  }, [staff, updateStaffStatus, addDeduction, markAttendance, reassignTask, extendTaskDeadlineByName, dismissAlert, navigate]);

  const handleReassignTo = (toStaffId: string) => {
    if (!reassignAlert) return;
    const fromMember = reassignAlert.staffId
      ? staff.find((s) => s.id === reassignAlert.staffId)
      : reassignAlert.staffName
      ? staff.find((s) => s.name === reassignAlert.staffName)
      : undefined;
    const toMember = staff.find((s) => s.id === toStaffId);

    if (fromMember && toMember && reassignAlert.taskName) {
      const taskIndex = fromMember.assignments.findIndex(
        (t) => t.task === reassignAlert.taskName
      );
      if (taskIndex >= 0) {
        reassignTask(fromMember.id, taskIndex, toStaffId);
        toast.success(`Task reassigned to ${toMember.name}`, { description: reassignAlert.taskName });
      }
    } else {
      toast.success("Task reassigned");
    }
    dismissAlert(reassignAlert.id);
    setReassignAlert(null);
  };

  const handleRefresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Alerts refreshed");
  }, []);

  // Available on-duty staff for reassignment (excluding the source)
  const reassignCandidates = reassignAlert
    ? staff.filter(
        (s) => s.id !== reassignAlert.staffId && s.name !== reassignAlert.staffName
      )
    : [];

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <PageTransition className="px-5 space-y-6">
        <section className="space-y-2">
          <p className="label-sm text-muted-foreground">Incident Response Hub</p>
          <h1 className="display-sm text-foreground">
            Live
            <br />
            <span className="font-display italic text-secondary">Flags</span>
          </h1>
        </section>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-status-absent" />
              <p className="label-sm text-status-absent">Active</p>
            </div>
            <p className="font-display text-2xl text-card-foreground mt-1">{activeAlerts.length}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-status-on-time" />
              <p className="label-sm text-status-on-time">Resolved</p>
            </div>
            <p className="font-display text-2xl text-card-foreground mt-1">{dismissedAlerts.length}</p>
          </motion.div>
        </div>

        {/* Staff quick-status in header area */}
        <div className="flex gap-4 text-xs">
          <span className="text-status-on-time font-semibold">
            {staff.filter((s) => s.status === "on-duty").length} On Duty
          </span>
          <span className="text-status-late font-semibold">
            {staff.filter((s) => s.status === "late").length} Late
          </span>
          <span className="text-destructive font-semibold">
            {staff.filter((s) => s.status === "absent").length} Absent
          </span>
          <span className="text-muted-foreground font-semibold">
            {staff.reduce((a, s) => a + s.assignments.filter((t) => !t.done).length, 0)} Tasks Pending
          </span>
        </div>

        {/* Reassign Staff Picker */}
        <AnimatePresence>
          {reassignAlert && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="glass-card rounded-2xl p-4 space-y-3 border border-secondary/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-secondary" />
                  <p className="label-sm text-secondary">Reassign Task To</p>
                </div>
                <button onClick={() => setReassignAlert(null)} className="w-7 h-7 glass-btn rounded-lg flex items-center justify-center">
                  <X size={13} className="text-muted-foreground" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">"{reassignAlert.taskName}"</p>
              <div className="space-y-2">
                {reassignCandidates.map((s) => (
                  <motion.button
                    key={s.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleReassignTo(s.id)}
                    className="w-full flex items-center gap-3 glass rounded-xl px-3 py-2.5 text-left"
                  >
                    <img src={s.photo} alt={s.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-card-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.role}</p>
                    </div>
                    <span className={`ml-auto label-sm px-2 py-1 rounded-lg ${s.status === "on-duty" ? "bg-status-on-time/10 text-status-on-time" : "bg-muted text-muted-foreground"}`}>
                      {s.status}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Alerts */}
        <AnimatePresence mode="popLayout">
          <StaggerContainer className="space-y-3">
            {activeAlerts.map((alert) => {
              const cfg = typeConfig[alert.type];
              const Icon = cfg.icon;
              return (
                <StaggerItem key={alert.id}>
                  <SwipeableCard
                    onSwipeLeft={() => handleAction(alert, "Dismiss")}
                    leftLabel="Dismiss"
                    rightLabel="Resolve"
                    onSwipeRight={() => handleAction(alert, alert.actions[0])}
                  >
                    <motion.div
                      layout
                      exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                      className={`glass-card rounded-2xl overflow-hidden ${severityBorder[alert.severity]}`}
                    >
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-9 h-9 rounded-xl ${cfg.bgColor} flex items-center justify-center`}>
                              <Icon size={16} className={cfg.color} />
                            </div>
                            <div>
                              <span className={`label-sm ${cfg.color}`}>{cfg.label}</span>
                              <p className="text-xs text-muted-foreground">{alert.time}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => dismissAlert(alert.id)}
                            className="w-8 h-8 rounded-xl glass-btn flex items-center justify-center"
                          >
                            <X size={14} className="text-muted-foreground" />
                          </button>
                        </div>
                        <h3 className="text-sm font-semibold text-card-foreground">{alert.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{alert.description}</p>
                        <div className="flex gap-2 flex-wrap">
                          {alert.actions.map((action) => (
                            <motion.button
                              key={action}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => handleAction(alert, action)}
                              className="label-sm px-3.5 py-2 rounded-xl glass-btn text-foreground"
                            >
                              {action}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </SwipeableCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </AnimatePresence>

        {activeAlerts.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-status-on-time/10 flex items-center justify-center mx-auto">
              <Shield size={20} className="text-status-on-time" />
            </div>
            <h3 className="headline-sm text-card-foreground">All Clear</h3>
            <p className="text-sm text-muted-foreground">Zero incidents. Your household is running like clockwork.</p>
          </motion.div>
        )}

        {/* Resolved */}
        {dismissedAlerts.length > 0 && (
          <section className="space-y-3 pb-4">
            <h3 className="headline-sm text-foreground">Resolved</h3>
            {dismissedAlerts.map((alert) => {
              const cfg = typeConfig[alert.type];
              const Icon = cfg.icon;
              return (
                <div key={alert.id} className="bg-surface-low rounded-2xl p-4 opacity-50">
                  <div className="flex items-center gap-3">
                    <Icon size={14} className={cfg.color} />
                    <p className="text-sm text-muted-foreground line-through">{alert.title}</p>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </PageTransition>
    </PullToRefresh>
  );
};

export default AlertsPage;
