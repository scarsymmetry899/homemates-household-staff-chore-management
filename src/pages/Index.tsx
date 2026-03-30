import { motion } from "framer-motion";
import { ArrowRight, Droplets, TrendingUp, Clock, Bell, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppContext";
import estateHallway from "@/assets/estate-hallway.jpg";
import { PageTransition, StaggerContainer, StaggerItem, AnimatedCard, PressableCard } from "@/components/animations/MotionComponents";

const statusLabel: Record<string, string> = {
  "on-duty": "On-Site",
  late: "Late",
  absent: "Absent",
  "en-route": "En-Route",
  "off-duty": "Off-Duty",
};

const Index = () => {
  const navigate = useNavigate();
  const { staff, alerts } = useAppState();
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const activeAlerts = alerts.filter((a) => !a.dismissed);
  const totalTasks = staff.reduce((a, s) => a + s.assignments.length, 0);
  const doneTasks = staff.reduce((a, s) => a + s.assignments.filter((t) => t.done).length, 0);
  const taskPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <PageTransition className="px-6 space-y-8">
      {/* Morning Briefing */}
      <section className="space-y-2">
        <p className="label-sm text-muted-foreground">Morning Briefing</p>
        <h1 className="display-sm text-foreground">
          The Estate at
          <br />
          <span className="italic">North Woods</span>
        </h1>
        <p className="font-display text-secondary italic text-sm">{dateStr}</p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="mt-4 estate-gradient text-primary-foreground label-sm px-5 py-2.5 rounded-md"
        >
          Request Service
        </motion.button>
      </section>

      {/* Active Alerts Banner */}
      {activeAlerts.length > 0 && (
        <AnimatedCard delay={0.05}>
          <PressableCard>
            <div
              onClick={() => navigate("/alerts")}
              className="bg-card rounded-xl p-4 shadow-card flex items-center gap-4 cursor-pointer border-l-4 border-l-status-absent"
            >
              <div className="w-10 h-10 rounded-lg bg-status-absent/10 flex items-center justify-center shrink-0">
                <Bell size={18} className="text-status-absent" />
              </div>
              <div className="flex-1">
                <p className="label-sm text-status-absent">{activeAlerts.length} Active Alerts</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeAlerts[0].title}
                </p>
              </div>
              <ArrowRight size={16} className="text-muted-foreground" />
            </div>
          </PressableCard>
        </AnimatedCard>
      )}

      {/* Priority Alert */}
      <AnimatedCard delay={0.1} className="bg-card rounded-xl p-5 shadow-card space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-status-late" />
          <span className="label-sm text-status-late">High Priority</span>
        </div>
        <h3 className="headline-sm text-card-foreground">
          HVAC Maintenance
          <br />Overdue
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The climate control system in the West Wing is reporting filter saturation.
          Immediate replacement recommended to prevent efficiency loss.
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 label-sm text-foreground mt-2"
        >
          Resolve Issue <ArrowRight size={14} />
        </motion.button>
      </AnimatedCard>

      {/* Estate Status Banner */}
      <AnimatedCard delay={0.15} className="relative rounded-xl overflow-hidden h-36">
        <img src={estateHallway} alt="Estate hallway" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-primary/20 flex flex-col justify-end p-5">
          <p className="label-sm text-primary-foreground/70">Estate Status</p>
          <h3 className="font-display text-xl text-primary-foreground">Optimal Atmosphere</h3>
        </div>
      </AnimatedCard>

      {/* Personnel Tracking */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="headline-sm text-foreground">Personnel Tracking</h3>
          <button onClick={() => navigate("/staff")} className="label-sm text-secondary">
            Full Directory
          </button>
        </div>
        <StaggerContainer className="space-y-3">
          {staff.slice(0, 3).map((s) => (
            <StaggerItem key={s.id}>
              <PressableCard>
                <div
                  onClick={() => navigate(`/staff/${s.id}`)}
                  className="bg-card rounded-xl p-4 shadow-card flex items-center gap-4 cursor-pointer"
                >
                  <img src={s.photo} alt={s.name} className="w-12 h-12 rounded-full object-cover" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <p className="label-sm text-muted-foreground">{s.role}</p>
                    <p className="font-display text-base text-card-foreground font-medium">{s.name}</p>
                    {s.arrivalTime && (
                      <p className="text-xs text-muted-foreground mt-0.5">Arrival {s.arrivalTime}</p>
                    )}
                  </div>
                  <span
                    className={`label-sm px-2.5 py-1 rounded-md ${
                      s.status === "on-duty"
                        ? "bg-surface-low text-status-on-time"
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

      {/* Estate Ops */}
      <AnimatedCard delay={0.2} className="bg-card rounded-xl p-6 shadow-card space-y-4">
        <h3 className="headline-sm text-card-foreground">Estate Ops</h3>
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
              <span className="label-sm text-muted-foreground">Complete</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Daily Routine</span>
          <span className="text-card-foreground font-semibold">{doneTasks} / {totalTasks}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {totalTasks - doneTasks} items remaining for evening lockdown
        </p>
      </AnimatedCard>

      {/* Financial Snapshot */}
      <AnimatedCard delay={0.25} className="estate-gradient rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="label-sm text-primary-foreground/60">Fiscal Forecast</p>
            <h3 className="headline-sm text-primary-foreground mt-1">Monthly Snapshot</h3>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center">
            <TrendingUp size={16} className="text-primary-foreground" />
          </div>
        </div>
        <p className="label-sm text-primary-foreground/60">Projected Expenditure</p>
        <p className="font-display text-3xl text-primary-foreground">
          ₹24,850 <span className="text-sm text-primary-foreground/50">INR</span>
        </p>
        <div className="flex gap-8">
          <div>
            <p className="label-sm text-primary-foreground/50">Staffing</p>
            <p className="text-primary-foreground font-semibold">₹18.2k</p>
          </div>
          <div>
            <p className="label-sm text-primary-foreground/50">Utilities</p>
            <p className="text-primary-foreground font-semibold">₹4.1k</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/expenses")}
          className="w-full bg-primary-foreground/10 text-primary-foreground label-sm py-2.5 rounded-md mt-2"
        >
          Detailed Ledger
        </motion.button>
      </AnimatedCard>

      {/* Estate Journal */}
      <StaggerContainer className="space-y-4 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="headline-sm text-foreground">Estate Journal</h3>
          <button className="label-sm text-secondary">View All Records</button>
        </div>
        <StaggerItem>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0 mt-1">
              <Droplets size={14} className="text-secondary-container-foreground" />
            </div>
            <div>
              <p className="font-semibold text-sm text-card-foreground">Provision Delivery Received</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Artisan supplies and pantry restock confirmed by Elena Moretti.
              </p>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-surface-low flex items-center justify-center shrink-0 mt-1">
              <Clock size={14} className="text-foreground" />
            </div>
            <div>
              <p className="font-semibold text-sm text-card-foreground">Shift Change: Security Tier 1</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Perimeter check complete. All access points secured and monitored.
              </p>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
};

export default Index;
