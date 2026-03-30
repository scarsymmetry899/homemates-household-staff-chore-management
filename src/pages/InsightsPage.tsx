import { TrendingUp, Clock, Users } from "lucide-react";
import { staffMembers } from "@/data/staff";

const InsightsPage = () => {
  const onDuty = staffMembers.filter((s) => s.status === "on-duty").length;
  const lateCount = staffMembers.filter((s) => s.status === "late").length;

  // Mock heatmap data
  const heatmapStaff = staffMembers.slice(0, 4).map((s) => ({
    name: s.name,
    initials: s.name.split(" ").map((n) => n[0]).join(""),
    role: s.role,
    days: Array.from({ length: 4 }, () =>
      ["present", "present", "late", "present", "absent"][Math.floor(Math.random() * 5)]
    ),
  }));

  const cellColor: Record<string, string> = {
    present: "bg-primary",
    late: "bg-status-late",
    absent: "bg-status-absent",
    "off-duty": "bg-surface-container",
  };

  return (
    <div className="px-6 space-y-6 animate-fade-in">
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

      {/* View Toggle */}
      <div className="flex gap-2">
        <button className="estate-gradient text-primary-foreground label-sm px-5 py-2 rounded-md">
          Monthly
        </button>
        <button className="bg-surface-low text-muted-foreground label-sm px-5 py-2 rounded-md">
          Weekly
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-primary" />
          <span className="label-sm text-muted-foreground">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-status-late" />
          <span className="label-sm text-muted-foreground">Late Arrival</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-status-absent" />
          <span className="label-sm text-muted-foreground">Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-surface-container" />
          <span className="label-sm text-muted-foreground">Off-Duty</span>
        </div>
      </div>

      {/* Date & Export */}
      <div className="flex items-center gap-3">
        <button className="bg-surface-low text-foreground label-sm px-4 py-2 rounded-md flex items-center gap-2">
          <Clock size={14} /> October 2023
        </button>
        <button className="estate-gradient text-primary-foreground label-sm px-4 py-2 rounded-md flex items-center gap-2">
          ↓ Export Report
        </button>
      </div>

      {/* Heatmap Table */}
      <section className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="grid grid-cols-[1fr_repeat(4,2rem)] gap-2 p-4 items-center">
          <span className="label-sm text-muted-foreground">Staff Member</span>
          {[1, 2, 3, 4].map((d) => (
            <span key={d} className="label-sm text-muted-foreground text-center">{d}</span>
          ))}
          {heatmapStaff.map((s) => (
            <>
              <div key={s.name} className="flex items-center gap-2 py-2">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-secondary-container-foreground">{s.initials}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-card-foreground truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.role}</p>
                </div>
              </div>
              {s.days.map((day, i) => (
                <div key={`${s.name}-${i}`} className={`w-7 h-7 rounded-md ${cellColor[day]}`} />
              ))}
            </>
          ))}
        </div>
      </section>

      {/* Stats Cards */}
      <section className="space-y-3 pb-4">
        <div className="bg-card rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="label-sm text-status-on-time">Attendance Rate</p>
            <TrendingUp size={16} className="text-status-on-time" />
          </div>
          <p className="font-display text-3xl text-card-foreground mt-2">94.2%</p>
          <p className="text-xs text-muted-foreground mt-1">Consistent across all departments this month.</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="label-sm text-status-late">Late Arrivals</p>
            <Clock size={16} className="text-status-late" />
          </div>
          <p className="font-display text-3xl text-card-foreground mt-2">
            12 <span className="text-base text-muted-foreground font-sans">incidents</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">-4% compared to September 2023.</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="label-sm text-secondary">Staff On Duty</p>
            <Users size={16} className="text-secondary" />
          </div>
          <p className="font-display text-3xl text-card-foreground mt-2">
            {onDuty} / {staffMembers.length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Current active rotation for today's shift.</p>
        </div>
      </section>
    </div>
  );
};

export default InsightsPage;
