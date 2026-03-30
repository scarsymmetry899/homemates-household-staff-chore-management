import { useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppContext";
import { PageTransition, StaggerContainer, StaggerItem, AnimatedCard, PressableCard, PullToRefresh } from "@/components/animations/MotionComponents";
import { toast } from "sonner";

const statusLabel: Record<string, string> = {
  "on-duty": "Clocked In",
  late: "Delayed",
  absent: "No-Show",
  "en-route": "Inbound",
  "off-duty": "Off-Grid",
};

const Index = () => {
  const navigate = useNavigate();
  const { staff, alerts } = useAppState();
  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const activeAlerts = alerts.filter((a) => !a.dismissed);
  const totalTasks = staff.reduce((a, s) => a + s.assignments.length, 0);
  const doneTasks = staff.reduce((a, s) => a + s.assignments.filter((t) => t.done).length, 0);
  const taskPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const handleRefresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Dashboard synced", { description: "All modules refreshed." });
  }, []);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <PageTransition className="px-5 space-y-7">
        {/* Greeting */}
        <section className="space-y-2">
          <p className="label-sm text-muted-foreground">{dateStr}</p>
          <h1 className="display-sm text-foreground">
            {greeting},
            <br />
            <span className="italic">Boss</span> ✨
          </h1>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/tasks")}
            className="mt-4 btn-estate text-primary-foreground label-sm px-6 py-3 rounded-2xl"
          >
            Dispatch a Task
          </motion.button>
        </section>

        {/* Active Alerts Banner */}
        {activeAlerts.length > 0 && (
          <AnimatedCard delay={0.05}>
            <PressableCard>
              <div
                onClick={() => navigate("/alerts")}
                className="glass-card rounded-2xl p-4 flex items-center gap-4 cursor-pointer border-l-4 border-l-status-absent"
              >
                <div className="w-10 h-10 rounded-xl bg-status-absent/10 flex items-center justify-center shrink-0">
                  <Bell size={18} className="text-status-absent" />
                </div>
                <div className="flex-1">
                  <p className="label-sm text-status-absent">{activeAlerts.length} Flagged Incidents</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activeAlerts[0].title}</p>
                </div>
                <ArrowRight size={16} className="text-muted-foreground" />
              </div>
            </PressableCard>
          </AnimatedCard>
        )}

        {/* Crew On Duty */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="headline-sm text-foreground">Active Crew</h3>
            <button onClick={() => navigate("/staff")} className="label-sm text-secondary glass-btn px-3 py-1.5 rounded-xl">
              Full Roster
            </button>
          </div>
          <StaggerContainer className="space-y-3">
            {staff.slice(0, 3).map((s) => (
              <StaggerItem key={s.id}>
                <PressableCard>
                  <div
                    onClick={() => navigate(`/staff/${s.id}`)}
                    className="glass-card rounded-2xl p-4 flex items-center gap-4 cursor-pointer"
                  >
                    <img src={s.photo} alt={s.name} className="w-12 h-12 rounded-xl object-cover shadow-card" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <p className="label-sm text-muted-foreground">{s.role}</p>
                      <p className="font-display text-base text-card-foreground font-medium">{s.name}</p>
                      {s.arrivalTime && (
                        <p className="text-xs text-muted-foreground mt-0.5">Checked in at {s.arrivalTime}</p>
                      )}
                    </div>
                    <span
                      className={`label-sm px-2.5 py-1 rounded-xl ${
                        s.status === "on-duty"
                          ? "bg-status-on-time/10 text-status-on-time"
                          : s.status === "late"
                          ? "bg-secondary-container text-secondary-container-foreground"
                          : s.status === "en-route"
                          ? "bg-secondary-container text-secondary-container-foreground"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {statusLabel[s.status]}
                    </span>
                  </div>
                </PressableCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Task Throughput */}
        <AnimatedCard delay={0.2} className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="headline-sm text-card-foreground">Today's Progress</h3>
            <button onClick={() => navigate("/tasks")} className="label-sm text-secondary glass-btn px-3 py-1.5 rounded-xl">
              All Tasks
            </button>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--surface-container))" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 251" }}
                  animate={{ strokeDasharray: `${taskPct * 2.51} 251` }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl text-foreground">{taskPct}%</span>
                <span className="label-sm text-muted-foreground">Done</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completion Rate</span>
            <span className="text-card-foreground font-semibold">{doneTasks} / {totalTasks}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {totalTasks - doneTasks} tasks left for the day
          </p>
        </AnimatedCard>

        {/* Monthly Burn */}
        <AnimatedCard delay={0.25} className="btn-estate rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-primary-foreground/60">This Month</p>
              <h3 className="headline-sm text-primary-foreground mt-1">Household Spending</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-primary-foreground/10 flex items-center justify-center backdrop-blur-sm">
              <TrendingUp size={16} className="text-primary-foreground" />
            </div>
          </div>
          <p className="label-sm text-primary-foreground/60">Total Outflow</p>
          <p className="font-display text-3xl text-primary-foreground">
            ₹24,850 <span className="text-sm text-primary-foreground/50">INR</span>
          </p>
          <div className="flex gap-8">
            <div>
              <p className="label-sm text-primary-foreground/50">Payroll</p>
              <p className="text-primary-foreground font-semibold">₹18.2k</p>
            </div>
            <div>
              <p className="label-sm text-primary-foreground/50">Ops & Misc</p>
              <p className="text-primary-foreground font-semibold">₹4.1k</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/expenses")}
            className="w-full bg-primary-foreground/10 text-primary-foreground label-sm py-3 rounded-xl mt-2 backdrop-blur-sm border border-primary-foreground/10"
          >
            View Full Ledger
          </motion.button>
        </AnimatedCard>

        <div className="pb-4" />
      </PageTransition>
    </PullToRefresh>
  );
};

export default Index;
