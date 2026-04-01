import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Settings } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import logoImg from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";

const severityColor: Record<string, string> = {
  high: "border-l-destructive",
  medium: "border-l-status-late",
  low: "border-l-secondary",
};

const AppHeader = () => {
  const { alerts, staff } = useAppState();
  const navigate = useNavigate();
  const activeAlerts = alerts.filter((a) => !a.dismissed);
  const [showPanel, setShowPanel] = useState(false);

  const allTasks = staff.flatMap((s) =>
    s.assignments.map((t) => ({ ...t, staffName: s.name }))
  );
  const pendingTasks = allTasks.filter((t) => !t.done);

  const onDutyCount = staff.filter((s) => s.status === "on-duty").length;
  const lateCount = staff.filter((s) => s.status === "late").length;
  const absentCount = staff.filter((s) => s.status === "absent").length;

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="flex items-center gap-3"
      >
        <img src={logoImg} alt="Homemaker" className="w-14 h-14 object-contain" />
      </motion.button>
      <div className="flex items-center gap-2 relative">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/settings")}
          className="w-10 h-10 flex items-center justify-center rounded-xl glass-btn text-foreground"
        >
          <Settings size={18} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowPanel((p) => !p)}
          className="w-10 h-10 flex items-center justify-center rounded-xl glass-btn text-foreground relative"
        >
          <Bell size={18} />
          {activeAlerts.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-status-absent text-[10px] text-primary-foreground flex items-center justify-center font-bold shadow-btn"
            >
              {activeAlerts.length}
            </motion.span>
          )}
        </motion.button>

        {/* Backdrop */}
        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowPanel(false)}
            />
          )}
        </AnimatePresence>

        {/* Panel */}
        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-full right-0 mt-2 w-80 z-50 glass-card rounded-2xl shadow-lg border border-border/30 overflow-hidden"
            >
              {/* Active Alerts */}
              <div className="px-4 pt-4 pb-2">
                <p className="label-sm text-muted-foreground mb-2">Active Alerts</p>
                {activeAlerts.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">No active alerts</p>
                ) : (
                  <div className="space-y-2">
                    {activeAlerts.slice(0, 3).map((alert) => (
                      <div
                        key={alert.id}
                        className={`glass rounded-xl px-3 py-2 border-l-4 ${severityColor[alert.severity]}`}
                      >
                        <p className="text-xs font-semibold text-card-foreground leading-tight">{alert.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{alert.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-border/20 mx-4" />

              {/* Pending Tasks */}
              <div className="px-4 py-2">
                <p className="label-sm text-muted-foreground mb-2">
                  Pending Tasks
                  <span className="ml-2 text-foreground font-semibold">{pendingTasks.length}</span>
                </p>
                {pendingTasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-1">All tasks completed!</p>
                ) : (
                  <div className="space-y-1.5">
                    {pendingTasks.slice(0, 3).map((task, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-card-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-late shrink-0" />
                        <span className="flex-1 truncate">{task.task}</span>
                        <span className="text-muted-foreground shrink-0">{task.staffName.split(" ")[0]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-border/20 mx-4" />

              {/* Staff Status */}
              <div className="px-4 py-2">
                <p className="label-sm text-muted-foreground mb-2">Staff Status</p>
                <div className="flex gap-3 text-xs">
                  <span className="text-status-on-time font-semibold">{onDutyCount} On Duty</span>
                  <span className="text-status-late font-semibold">{lateCount} Late</span>
                  <span className="text-destructive font-semibold">{absentCount} Absent</span>
                </div>
              </div>

              <div className="border-t border-border/20 mx-4" />

              {/* Footer */}
              <div className="px-4 py-3">
                <button
                  onClick={() => {
                    setShowPanel(false);
                    navigate("/alerts");
                  }}
                  className="w-full btn-estate text-primary-foreground label-sm py-2.5 rounded-xl"
                >
                  View All Alerts →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default AppHeader;
