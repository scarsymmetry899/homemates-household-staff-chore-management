import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, Shield, Receipt, Bell, X } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/animations/MotionComponents";
import { toast } from "sonner";

const typeConfig = {
  attendance: { icon: Clock, color: "text-status-late", bgColor: "bg-status-late/10", label: "Attendance" },
  task: { icon: AlertTriangle, color: "text-secondary", bgColor: "bg-secondary/10", label: "Task" },
  security: { icon: Shield, color: "text-status-absent", bgColor: "bg-status-absent/10", label: "Security" },
  expense: { icon: Receipt, color: "text-status-on-time", bgColor: "bg-status-on-time/10", label: "Expense" },
};

const severityBorder = {
  high: "border-l-4 border-l-status-absent",
  medium: "border-l-4 border-l-status-late",
  low: "border-l-4 border-l-surface-container",
};

const AlertsPage = () => {
  const { alerts, dismissAlert } = useAppState();
  const activeAlerts = alerts.filter((a) => !a.dismissed);
  const dismissedAlerts = alerts.filter((a) => a.dismissed);

  const handleAction = (alertId: string, action: string) => {
    dismissAlert(alertId);
    toast.success(`Action taken: ${action}`, {
      description: "Alert has been resolved and archived.",
    });
  };

  return (
    <PageTransition className="px-6 space-y-6">
      <section className="space-y-2">
        <p className="label-sm text-muted-foreground">Monitoring & Response</p>
        <h1 className="display-sm text-foreground">
          Active
          <br />
          <span className="font-display italic text-secondary">Alerts</span>
        </h1>
      </section>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-4 shadow-card"
        >
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-status-absent" />
            <p className="label-sm text-status-absent">Active</p>
          </div>
          <p className="font-display text-2xl text-card-foreground mt-1">{activeAlerts.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-xl p-4 shadow-card"
        >
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-status-on-time" />
            <p className="label-sm text-status-on-time">Resolved</p>
          </div>
          <p className="font-display text-2xl text-card-foreground mt-1">{dismissedAlerts.length}</p>
        </motion.div>
      </div>

      {/* Active Alerts */}
      <AnimatePresence mode="popLayout">
        <StaggerContainer className="space-y-3">
          {activeAlerts.map((alert) => {
            const cfg = typeConfig[alert.type];
            const Icon = cfg.icon;
            return (
              <StaggerItem key={alert.id}>
                <motion.div
                  layout
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                  className={`bg-card rounded-xl shadow-card overflow-hidden ${severityBorder[alert.severity]}`}
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${cfg.bgColor} flex items-center justify-center`}>
                          <Icon size={16} className={cfg.color} />
                        </div>
                        <div>
                          <span className={`label-sm ${cfg.color}`}>{cfg.label}</span>
                          <p className="text-xs text-muted-foreground">{alert.time}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="w-7 h-7 rounded-full bg-surface-low flex items-center justify-center"
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
                          onClick={() => handleAction(alert.id, action)}
                          className="label-sm px-3 py-1.5 rounded-md bg-surface-low text-foreground hover:bg-surface-container transition-colors"
                        >
                          {action}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </AnimatePresence>

      {activeAlerts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card rounded-xl p-8 shadow-card text-center space-y-2"
        >
          <div className="w-12 h-12 rounded-full bg-status-on-time/10 flex items-center justify-center mx-auto">
            <Shield size={20} className="text-status-on-time" />
          </div>
          <h3 className="headline-sm text-card-foreground">All Clear</h3>
          <p className="text-sm text-muted-foreground">No active alerts. Estate operations are running smoothly.</p>
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
              <div key={alert.id} className="bg-surface-low rounded-xl p-4 opacity-60">
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
  );
};

export default AlertsPage;
