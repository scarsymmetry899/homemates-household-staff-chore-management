import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Users } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { PageTransition, StaggerContainer, StaggerItem, AnimatedCard, PressableCard } from "@/components/animations/MotionComponents";

const InsightsPage = () => {
  const { staff } = useAppState();
  const onDuty = staff.filter((s) => s.status === "on-duty").length;

  // Deterministic heatmap data using staff index as seed
  const heatmapStaff = useMemo(() =>
    staff.slice(0, 4).map((s, si) => ({
      name: s.name,
      photo: s.photo,
      initials: s.name.split(" ").map((n) => n[0]).join(""),
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

  return (
    <PageTransition className="px-6 space-y-6">
      <section className="space-y-2">
        <h1 className="display-sm text-foreground">
          Attendance
          <br />
          <span className="font-display italic text-secondary">Heatmap</span>
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          A comprehensive overview of the estate's operational rhythm for October 2023.
          Monitor staff consistency and ensure seamless service delivery.
        </p>
      </section>

      <div className="flex gap-2">
        <button className="estate-gradient text-primary-foreground label-sm px-5 py-2 rounded-md">Monthly</button>
        <button className="bg-surface-low text-muted-foreground label-sm px-5 py-2 rounded-md">Weekly</button>
      </div>

      <div className="flex flex-wrap gap-4">
        {[
          { color: "bg-primary", label: "Present" },
          { color: "bg-status-late", label: "Late Arrival" },
          { color: "bg-status-absent", label: "Absent" },
          { color: "bg-surface-container", label: "Off-Duty" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="label-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button className="bg-surface-low text-foreground label-sm px-4 py-2 rounded-md flex items-center gap-2">
          <Clock size={14} /> October 2023
        </button>
        <motion.button whileTap={{ scale: 0.95 }} className="estate-gradient text-primary-foreground label-sm px-4 py-2 rounded-md flex items-center gap-2">
          ↓ Export Report
        </motion.button>
      </div>

      {/* Heatmap */}
      <AnimatedCard delay={0.1} className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="p-4 overflow-x-auto no-scrollbar">
          <div className="grid grid-cols-[1fr_repeat(7,1.75rem)] gap-1.5 items-center min-w-[340px]">
            <span className="label-sm text-muted-foreground">Staff Member</span>
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <span key={d} className="label-sm text-muted-foreground text-center">{d}</span>
            ))}
            {heatmapStaff.map((s) => (
              <div key={s.name} className="contents">
                <div className="flex items-center gap-2 py-2">
                  <img src={s.photo} alt={s.name} className="w-7 h-7 rounded-full object-cover shrink-0" loading="lazy" />
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
                    className={`w-6 h-6 rounded-md ${cellColor[day]}`}
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
          <PressableCard className="bg-card rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="label-sm text-status-on-time">Attendance Rate</p>
              <TrendingUp size={16} className="text-status-on-time" />
            </div>
            <p className="font-display text-3xl text-card-foreground mt-2">94.2%</p>
            <p className="text-xs text-muted-foreground mt-1">Consistent across all departments this month.</p>
          </PressableCard>
        </StaggerItem>
        <StaggerItem>
          <PressableCard className="bg-card rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="label-sm text-status-late">Late Arrivals</p>
              <Clock size={16} className="text-status-late" />
            </div>
            <p className="font-display text-3xl text-card-foreground mt-2">
              12 <span className="text-base text-muted-foreground font-sans">incidents</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">-4% compared to September 2023.</p>
          </PressableCard>
        </StaggerItem>
        <StaggerItem>
          <PressableCard className="bg-card rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="label-sm text-secondary">Staff On Duty</p>
              <Users size={16} className="text-secondary" />
            </div>
            <p className="font-display text-3xl text-card-foreground mt-2">
              {onDuty} / {staff.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Current active rotation for today's shift.</p>
          </PressableCard>
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
};

export default InsightsPage;
