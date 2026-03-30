import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Phone, Eye, Sparkles } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { departments } from "@/data/staff";
import { PageTransition, StaggerContainer, StaggerItem, PressableCard } from "@/components/animations/MotionComponents";

const statusLabel: Record<string, string> = {
  "on-duty": "On-Duty",
  late: "Late (20m)",
  absent: "Absent",
  "en-route": "En-Route",
  "off-duty": "Off-Duty",
};

const statusStyle: Record<string, string> = {
  "on-duty": "bg-surface-low text-status-on-time",
  late: "bg-secondary-container text-secondary-container-foreground",
  absent: "bg-destructive/10 text-destructive",
  "en-route": "bg-secondary-container text-secondary-container-foreground",
  "off-duty": "bg-surface-container text-muted-foreground",
};

const StaffDirectory = () => {
  const navigate = useNavigate();
  const { staff } = useAppState();
  const [activeDept, setActiveDept] = useState<string>("All");

  const filtered = activeDept === "All"
    ? staff
    : staff.filter((s) => s.department === activeDept);

  const onDuty = staff.filter((s) => s.status === "on-duty").length;
  const lateCount = staff.filter((s) => s.status === "late").length;

  return (
    <PageTransition className="px-6 space-y-6">
      <section className="space-y-2">
        <p className="label-sm text-muted-foreground">Registry & Oversight</p>
        <h1 className="display-sm text-foreground">
          Estate Staffing
          <br />
          <span className="font-display italic text-secondary">Directory</span>
        </h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="mt-3 estate-gradient text-primary-foreground label-sm px-5 py-2.5 rounded-md inline-flex items-center gap-2"
        >
          <Sparkles size={14} /> Request Service
        </motion.button>
        <p className="text-xs text-muted-foreground mt-2">
          Updated: {new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card rounded-xl p-5 shadow-card">
          <p className="label-sm text-muted-foreground">Total Personnel</p>
          <p className="font-display text-3xl text-card-foreground mt-1">
            {staff.length} <span className="text-base text-muted-foreground">Active</span>
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl p-5 shadow-card">
          <p className="label-sm text-muted-foreground">Attendance Rate</p>
          <p className="font-display text-3xl text-card-foreground mt-1">
            98.2% <TrendIcon />
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl p-5 shadow-card">
          <p className="label-sm text-muted-foreground">Current Status</p>
          <div className="flex gap-6 mt-2">
            <div>
              <p className="font-display text-2xl text-foreground">{onDuty}</p>
              <p className="label-sm text-status-on-time">On-Duty</p>
            </div>
            <div>
              <p className="font-display text-2xl text-status-late">{lateCount}</p>
              <p className="label-sm text-status-late">Late</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Department Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {["All", ...departments].map((dept) => (
          <button
            key={dept}
            onClick={() => setActiveDept(dept)}
            className={`label-sm whitespace-nowrap px-4 py-2 rounded-md transition-colors ${
              activeDept === dept
                ? "estate-gradient text-primary-foreground"
                : "bg-surface-low text-muted-foreground"
            }`}
          >
            {dept === "All" ? "All Departments" : dept}
          </button>
        ))}
      </div>

      {/* Staff List */}
      <StaggerContainer className="space-y-4 pb-4">
        {filtered.map((s) => (
          <StaggerItem key={s.id}>
            <PressableCard className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="flex gap-4 p-5">
                <img src={s.photo} alt={s.name} className="w-20 h-20 rounded-xl object-cover" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <span className={`label-sm px-2 py-0.5 rounded ${statusStyle[s.status]}`}>
                    {statusLabel[s.status]}
                  </span>
                  <h3 className="font-display text-xl text-card-foreground mt-2 leading-tight">
                    {s.name.split(" ")[0]}
                    <br />
                    {s.name.split(" ").slice(1).join(" ")}
                  </h3>
                  <p className="label-sm text-muted-foreground mt-1">{s.role}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <p className="label-sm text-muted-foreground">Reliability Score</p>
                    <p className="text-sm font-bold text-card-foreground ml-auto">{s.reliabilityScore}</p>
                  </div>
                </div>
              </div>
              <div className="flex border-t border-surface-container">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Phone size={14} />
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-foreground transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </button>
                <button
                  onClick={() => navigate(`/staff/${s.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 label-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Eye size={14} /> View Profile
                </button>
              </div>
            </PressableCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </PageTransition>
  );
};

const TrendIcon = () => (
  <svg className="inline ml-2 -mt-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--status-on-time))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

export default StaffDirectory;
