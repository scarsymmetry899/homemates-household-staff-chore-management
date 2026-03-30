import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Users, Calendar } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { PageTransition, StaggerContainer, StaggerItem, AnimatedCard, PressableCard, PullToRefresh } from "@/components/animations/MotionComponents";
import { toast } from "sonner";

type ViewMode = "monthly" | "weekly";

const InsightsPage = () => {
  const { staff } = useAppState();
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week
  const onDuty = staff.filter((s) => s.status === "on-duty").length;

  const weekLabels = ["This Week", "Last Week", "2 Weeks Ago", "3 Weeks Ago"];
  const monthLabels = useMemo(() => {
    const months: string[] = [];
    const now = new Date();
    for (let i = 0; i < 4; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toLocaleDateString("en-US", { month: "long", year: "numeric" }));
    }
    return months;
  }, []);
  const [selectedMonth, setSelectedMonth] = useState(0);

  const dayHeaders = viewMode === "weekly" ? ["M", "T", "W", "T", "F", "S", "S"] : ["W1", "W2", "W3", "W4"];

  const heatmapStaff = useMemo(() =>
    staff.slice(0, 5).map((s, si) => ({
      name: s.name,
      photo: s.photo,
      role: s.role,
      days: Array.from({ length: viewMode === "weekly" ? 7 : 4 }, (_, di) => {
        const seed = ((si * 7 + di + (viewMode === "weekly" ? selectedWeek : selectedMonth) * 3) * 17 + 3) % 10;
        if (seed < 6) return "present";
        if (seed < 8) return "late";
        return "absent";
      }),
    })), [staff, viewMode, selectedWeek, selectedMonth]);

  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const getCellStatus = (staffName: string, dayIndex: number, originalStatus: string) => {
    const key = `${staffName}-${dayIndex}`;
    return overrides[key] || originalStatus;
  };

  const handleLongPress = (staffName: string, dayIndex: number, currentStatus: string) => {
    const nextStatus = currentStatus === "present" ? "late" : currentStatus === "late" ? "absent" : "present";
    const key = `${staffName}-${dayIndex}`;
    setOverrides((prev) => ({ ...prev, [key]: nextStatus }));
    toast.success(`Attendance updated to ${nextStatus}`, { description: `${staffName} — Day ${dayIndex + 1}` });
  };

  const cellColor: Record<string, string> = {
    present: "bg-status-on-time",
    late: "bg-status-late",
    absent: "bg-status-absent",
    "off-duty": "bg-surface-container",
  };

  const handleRefresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Insights refreshed");
  }, []);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <PageTransition className="px-5 space-y-6">
        <section className="space-y-2">
          <h1 className="display-sm text-foreground">
            Household
            <br />
            <span className="font-display italic text-secondary">Analytics</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Track your team's attendance, punctuality & reliability at a glance.
          </p>
        </section>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("monthly")}
            className={`label-sm px-5 py-2.5 rounded-xl ${viewMode === "monthly" ? "btn-estate text-primary-foreground" : "glass-btn text-muted-foreground"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewMode("weekly")}
            className={`label-sm px-5 py-2.5 rounded-xl ${viewMode === "weekly" ? "btn-estate text-primary-foreground" : "glass-btn text-muted-foreground"}`}
          >
            Weekly
          </button>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {(viewMode === "weekly" ? weekLabels : monthLabels).map((label, i) => (
            <button
              key={label}
              onClick={() => viewMode === "weekly" ? setSelectedWeek(i) : setSelectedMonth(i)}
              className={`label-sm whitespace-nowrap px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
                (viewMode === "weekly" ? selectedWeek : selectedMonth) === i
                  ? "btn-estate text-primary-foreground"
                  : "glass-btn text-muted-foreground"
              }`}
            >
              <Calendar size={12} /> {label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          {[
            { color: "bg-status-on-time", label: "Present" },
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

        <p className="text-xs text-muted-foreground italic">💡 Long-press any cell to manually change attendance</p>

        {/* Heatmap */}
        <AnimatedCard delay={0.1} className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 overflow-x-auto no-scrollbar">
            <div className={`grid gap-1.5 items-center min-w-[320px]`} style={{ gridTemplateColumns: `1fr repeat(${dayHeaders.length}, 1.75rem)` }}>
              <span className="label-sm text-muted-foreground">Staff</span>
              {dayHeaders.map((d, i) => (
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
                  {s.days.map((day, i) => {
                    const status = getCellStatus(s.name, i, day);
                    let pressTimer: ReturnType<typeof setTimeout>;
                    return (
                      <motion.div
                        key={`${s.name}-${i}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 + i * 0.03 }}
                        className={`w-6 h-6 rounded-lg ${cellColor[status]} cursor-pointer`}
                        onPointerDown={() => {
                          pressTimer = setTimeout(() => handleLongPress(s.name, i, status), 500);
                        }}
                        onPointerUp={() => clearTimeout(pressTimer)}
                        onPointerLeave={() => clearTimeout(pressTimer)}
                      />
                    );
                  })}
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
               <p className="label-sm text-status-on-time">Punctuality Score</p>
                <TrendingUp size={16} className="text-status-on-time" />
              </div>
              <p className="font-display text-3xl text-card-foreground mt-2">94.2%</p>
              <p className="text-xs text-muted-foreground mt-1">Solid consistency across the team.</p>
            </PressableCard>
          </StaggerItem>
          <StaggerItem>
            <PressableCard className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between">
               <p className="label-sm text-status-late">Late Check-ins</p>
                <Clock size={16} className="text-status-late" />
              </div>
              <p className="font-display text-3xl text-card-foreground mt-2">
                12 <span className="text-base text-muted-foreground font-sans">this cycle</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Trending down — keep the momentum.</p>
            </PressableCard>
          </StaggerItem>
          <StaggerItem>
            <PressableCard className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between">
               <p className="label-sm text-secondary">Active Homemates</p>
                <Users size={16} className="text-secondary" />
              </div>
              <p className="font-display text-3xl text-card-foreground mt-2">
                {onDuty} / {staff.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Currently on duty right now.</p>
            </PressableCard>
          </StaggerItem>
        </StaggerContainer>
      </PageTransition>
    </PullToRefresh>
  );
};

export default InsightsPage;
