import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Users, Calendar, ChevronDown } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { PageTransition, StaggerContainer, StaggerItem, AnimatedCard, PressableCard, PullToRefresh } from "@/components/animations/MotionComponents";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";

type ViewMode = "daily" | "weekly" | "monthly";

const InsightsPage = () => {
  const { staff } = useAppState();
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");
  const onDuty = staff.filter((s) => s.status === "on-duty").length;

  // Generate last 12 months
  const monthOptions = useMemo(() => {
    const months: { label: string; value: number }[] = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }), value: i });
    }
    return months;
  }, []);

  // Generate last 12 weeks
  const weekOptions = useMemo(() => {
    const weeks: { label: string; value: number }[] = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const start = new Date(now);
      start.setDate(start.getDate() - (i * 7) - start.getDay() + 1);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      const label = i === 0 ? "This Week" : i === 1 ? "Last Week" :
        `${start.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ${end.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
      weeks.push({ label, value: i });
    }
    return weeks;
  }, []);

  // Generate last 30 days for daily view
  const dayOptions = useMemo(() => {
    const days: { label: string; value: number }[] = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const label = i === 0 ? "Today" : i === 1 ? "Yesterday" :
        d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
      days.push({ label, value: i });
    }
    return days;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const currentSelection = viewMode === "monthly" ? selectedMonth : viewMode === "weekly" ? selectedWeek : selectedDay;
  const currentOptions = viewMode === "monthly" ? monthOptions : viewMode === "weekly" ? weekOptions : dayOptions;
  const currentLabel = currentOptions.find((o) => o.value === currentSelection)?.label || "";

  // Column headers based on view mode
  const columnHeaders = useMemo(() => {
    if (viewMode === "daily") return ["Status"];
    if (viewMode === "weekly") return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const now = new Date();
    const monthDate = new Date(now.getFullYear(), now.getMonth() - selectedMonth, 1);
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
  }, [viewMode, selectedMonth]);

  const attendanceGridMinWidth = useMemo(() => {
    const firstColumnWidth = 170;
    const dayColumnWidth = viewMode === "daily" ? 90 : 36;
    return firstColumnWidth + columnHeaders.length * dayColumnWidth;
  }, [columnHeaders.length, viewMode]);

  // Generate attendance data for all homemakers
  const attendanceData = useMemo(
    () =>
      staff.map((s, si) => ({
        name: s.name,
        photo: s.photo,
        role: s.role,
        days: Array.from({ length: columnHeaders.length }, (_, di) => {
          const offset = viewMode === "monthly" ? selectedMonth : viewMode === "weekly" ? selectedWeek : selectedDay;
          const seed = ((si * 31 + di + offset * 7) * 17 + 3) % 10;
          if (seed < 6) return "present";
          if (seed < 8) return "late";
          return "absent";
        }),
      })),
    [staff, viewMode, columnHeaders.length, selectedMonth, selectedWeek, selectedDay]
  );

  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const getCellStatus = (staffName: string, dayIndex: number, originalStatus: string) => {
    const key = `${viewMode}-${currentSelection}-${staffName}-${dayIndex}`;
    return overrides[key] || originalStatus;
  };

  const handleLongPress = (staffName: string, dayIndex: number, currentStatus: string) => {
    const nextStatus = currentStatus === "present" ? "late" : currentStatus === "late" ? "absent" : "present";
    const key = `${viewMode}-${currentSelection}-${staffName}-${dayIndex}`;
    setOverrides((prev) => ({ ...prev, [key]: nextStatus }));
    toast.success(`Attendance updated to ${nextStatus}`, { description: `${staffName} — ${columnHeaders[dayIndex]}` });
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
            Track your homemakers' attendance, punctuality & reliability at a glance.
          </p>
        </section>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          {(["daily", "weekly", "monthly"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setViewMode(mode);
                setShowDropdown(false);
              }}
              className={`label-sm px-5 py-2.5 rounded-xl capitalize ${viewMode === mode ? "btn-estate text-primary-foreground" : "glass-btn text-muted-foreground"}`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Period Dropdown Selector */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full glass-card rounded-xl px-4 py-3 flex items-center justify-between text-sm text-card-foreground"
          >
            <span className="flex items-center gap-2">
              <Calendar size={14} className="text-secondary" />
              {currentLabel}
            </span>
            <ChevronDown size={16} className={`text-muted-foreground transition-transform ${showDropdown ? "rotate-180" : ""}`} />
          </button>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-20 top-full mt-1 w-full glass-card rounded-xl max-h-48 overflow-y-auto shadow-lg border border-border/30"
            >
              {currentOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    if (viewMode === "monthly") setSelectedMonth(opt.value);
                    else if (viewMode === "weekly") setSelectedWeek(opt.value);
                    else setSelectedDay(opt.value);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    currentSelection === opt.value ? "bg-secondary/10 text-secondary font-semibold" : "text-card-foreground hover:bg-surface-container"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}
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

        {/* Scrollable Attendance Grid */}
        <AnimatedCard delay={0.1} className="glass-card rounded-2xl overflow-hidden">
          <div
            className="touch-pan-x"
            onPointerDownCapture={(e) => e.stopPropagation()}
            onTouchStartCapture={(e) => e.stopPropagation()}
          >
            <ScrollArea className="w-full">
              <div className="p-4">
                <div
                  className="grid gap-1.5 items-center"
                  style={{
                    gridTemplateColumns: `minmax(170px, 170px) repeat(${columnHeaders.length}, ${viewMode === "daily" ? "5rem" : "1.75rem"})`,
                    minWidth: `${attendanceGridMinWidth}px`,
                  }}
                >
                  <span className="label-sm text-muted-foreground sticky left-0 z-10 bg-card/95 backdrop-blur-sm px-2 py-1 rounded-md">Homemakers</span>
                  {columnHeaders.map((d, i) => (
                    <span key={i} className="label-sm text-muted-foreground text-center text-[10px]">
                      {d}
                    </span>
                  ))}

                  {attendanceData.map((s) => (
                    <div key={s.name} className="contents">
                      <div className="flex items-center gap-2 py-2 sticky left-0 z-10 bg-card/95 backdrop-blur-sm px-2 rounded-md">
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
                            transition={{ delay: 0.1 + i * 0.01 }}
                            className={`w-6 h-6 rounded-lg ${cellColor[status]} cursor-pointer mx-auto`}
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
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
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
              <p className="font-display text-3xl text-card-foreground mt-2">
                {staff.length > 0 ? (staff.reduce((a, s) => a + s.punctualityScore, 0) / staff.length).toFixed(1) : "0"}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Average across all homemakers.</p>
            </PressableCard>
          </StaggerItem>
          <StaggerItem>
            <PressableCard className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <p className="label-sm text-status-late">Late Check-ins</p>
                <Clock size={16} className="text-status-late" />
              </div>
              <p className="font-display text-3xl text-card-foreground mt-2">
                {staff.filter((s) => s.status === "late").length} <span className="text-base text-muted-foreground font-sans">today</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Keep an eye on recurring patterns.</p>
            </PressableCard>
          </StaggerItem>
          <StaggerItem>
            <PressableCard className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <p className="label-sm text-secondary">Active Homemakers</p>
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
