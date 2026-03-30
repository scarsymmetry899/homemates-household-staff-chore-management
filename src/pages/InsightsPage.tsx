import { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Users } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { PageTransition, StaggerContainer, StaggerItem, AnimatedCard, PressableCard, PullToRefresh } from "@/components/animations/MotionComponents";
import { toast } from "sonner";

const InsightsPage = () => {
  const { staff } = useAppState();
  const onDuty = staff.filter((s) => s.status === "on-duty").length;

  const heatmapStaff = useMemo(() =>
    staff.slice(0, 4).map((s, si) => ({
      name: s.name,
      photo: s.photo,
      role: s.role,
      days: Array.from({ length: 7 }, (_, di) => {
        const v = ((si * 7 + di) * 17 + 3) % 10;
        if (v < 6) return "present";
        if (v < 8) return "late";
        return "absent";
      }),
    })), [staff]);

  const cellColor: Record<string, string> = {
    present: "bg-primary",
    late: "bg-status-late",
    absent: "bg-status-absent",
    "off-duty": "bg-surface-container",
  };

  const today = new Date();
  const monthStr = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handleRefresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Insights refreshed");
  }, []);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <PageTransition className="px-5 space-y-6">
        <section className="space-y-2">
          <h1 className="display-sm text-foreground">
            Attendance
            <br />
            <span className="font-display italic text-secondary">Overview</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Track staff attendance patterns and reliability.
          </p>
        </section>

        <div className="flex gap-2">
          <button className="btn-estate text-primary-foreground label-sm px-5 py-2.5 rounded-xl">Monthly</button>
          <button className="glass-btn text-muted-foreground label-sm px-5 py-2.5 rounded-xl">Weekly</button>
        </div>

        <div className="flex flex-wrap gap-4">
          {[
            { color: "bg-primary", label: "Present" },
            { color: "bg-status-late", label: "Late" },
            { color: "bg-status-absent", label: "Absent" },
            { color: "bg-surface-container", label: "Off-Duty" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-md ${color}`} />
              <span className="label-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="glass-btn text-foreground label-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
            <Clock size={14} /> {monthStr}
          </button>
          <motion.button whileTap={{ scale: 0.95 }} className="btn-estate text-primary-foreground label-sm px-4 py-2.5 rounded-xl flex items-center gap-2"
            onClick={() => toast.success("Export started", { description: "Attendance report will be ready shortly." })}
          >
            ↓ Export
          </motion.button>
        </div>

        {/* Heatmap */}
        <AnimatedCard delay={0.1} className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 overflow-x-auto no-scrollbar">
            <div className="grid grid-cols-[1fr_repeat(7,1.75rem)] gap-1.5 items-center min-w-[340px]">
              <span className="label-sm text-muted-foreground">Staff</span>
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={i} className="label-sm text-muted-foreground text-center">{d}</span>
              ))}
              {heatmapStaff.map((s) => (
                <div key={s.name} className="contents">
                  <div className="flex items-center gap-2 py-2">
                    <img src={s.photo} alt={s.name} className="w-7 h-7 rounded-lg object-cover shrink-0" loading="lazy" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-card-foreground truncate">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{s.role}</p>
                    </div>
                  </div>
                  {s.days.map((day, i) => (
                    <motion.div
                      key={`${s.name}-${i}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.03 }}
                      className={`w-6 h-6 rounded-lg ${cellColor[day]}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </AnimatedCard>

        {/* Stats */}
        <StaggerContainer className="space-y-3 pb-4">
          <StaggerItem>
            <PressableCard className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <p className="label-sm text-status-on-time">Attendance Rate</p>
                <TrendingUp size={16} className="text-status-on-time" />
              </div>
              <p className="font-display text-3xl text-card-foreground mt-2">94.2%</p>
              <p className="text-xs text-muted-foreground mt-1">Consistent across all staff.</p>
            </PressableCard>
          </StaggerItem>
          <StaggerItem>
            <PressableCard className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <p className="label-sm text-status-late">Late Arrivals</p>
                <Clock size={16} className="text-status-late" />
              </div>
              <p className="font-display text-3xl text-card-foreground mt-2">
                12 <span className="text-base text-muted-foreground font-sans">this month</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Improving trend from last month.</p>
            </PressableCard>
          </StaggerItem>
          <StaggerItem>
            <PressableCard className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <p className="label-sm text-secondary">Currently On Duty</p>
                <Users size={16} className="text-secondary" />
              </div>
              <p className="font-display text-3xl text-card-foreground mt-2">
                {onDuty} / {staff.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Active staff right now.</p>
            </PressableCard>
          </StaggerItem>
        </StaggerContainer>
      </PageTransition>
    </PullToRefresh>
  );
};

export default InsightsPage;
