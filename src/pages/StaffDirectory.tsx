import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Phone, Eye, Sparkles } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { departments } from "@/data/staff";
import { PageTransition, StaggerContainer, StaggerItem, PressableCard, PullToRefresh, SwipeableCard } from "@/components/animations/MotionComponents";
import { toast } from "sonner";

const statusLabel: Record<string, string> = {
  "on-duty": "Clocked In",
  late: "Running Late",
  absent: "No-Show",
  "en-route": "Inbound",
  "off-duty": "Off-Grid",
};

const statusStyle: Record<string, string> = {
  "on-duty": "bg-status-on-time/10 text-status-on-time",
  late: "bg-secondary-container text-secondary-container-foreground",
  absent: "bg-destructive/10 text-destructive",
  "en-route": "bg-secondary-container text-secondary-container-foreground",
  "off-duty": "bg-surface-container text-muted-foreground",
};

const StaffDirectory = () => {
  const navigate = useNavigate();
  const { staff, removeStaff } = useAppState();
  const [activeDept, setActiveDept] = useState<string>("All");

  const filtered = activeDept === "All"
    ? staff
    : staff.filter((s) => s.department === activeDept);

  const onDuty = staff.filter((s) => s.status === "on-duty").length;
  const lateCount = staff.filter((s) => s.status === "late").length;

  const handleRefresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Staff directory refreshed");
  }, []);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <PageTransition className="px-5 space-y-6">
        <section className="space-y-2">
          <p className="label-sm text-muted-foreground">Workforce Command Center</p>
          <h1 className="display-sm text-foreground">
            Crew
            <br />
            <span className="font-display italic text-secondary">Roster</span>
          </h1>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="mt-3 btn-estate text-primary-foreground label-sm px-6 py-3 rounded-2xl inline-flex items-center gap-2"
          >
            <Sparkles size={14} /> Deploy Help
          </motion.button>
          <p className="text-xs text-muted-foreground mt-2">
            Last synced: {new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-2xl p-4">
            <p className="label-sm text-muted-foreground">Headcount</p>
            <p className="font-display text-2xl text-card-foreground mt-1">{staff.length}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-4">
            <p className="label-sm text-status-on-time">On-Duty</p>
            <p className="font-display text-2xl text-card-foreground mt-1">{onDuty}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-4">
            <p className="label-sm text-status-late">Late</p>
            <p className="font-display text-2xl text-status-late mt-1">{lateCount}</p>
          </motion.div>
        </div>

        {/* Department Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          {["All", ...departments].map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`label-sm whitespace-nowrap px-4 py-2.5 rounded-xl transition-all ${
                activeDept === dept
                  ? "btn-estate text-primary-foreground"
                  : "glass-btn text-muted-foreground"
              }`}
            >
              {dept === "All" ? "All Depts" : dept}
            </button>
          ))}
        </div>

        {/* Staff List */}
        <StaggerContainer className="space-y-4 pb-4">
          {filtered.map((s) => (
            <StaggerItem key={s.id}>
              <SwipeableCard
                onSwipeRight={() => {
                  toast.success(`Calling ${s.name}...`);
                }}
                onSwipeLeft={() => {
                  removeStaff(s.id);
                  toast.success(`${s.name} removed from staff`);
                }}
                rightLabel="Call"
                leftLabel="Remove"
              >
                <PressableCard className="glass-card rounded-2xl overflow-hidden">
                  <div className="flex gap-4 p-5">
                    <img src={s.photo} alt={s.name} className="w-20 h-20 rounded-2xl object-cover shadow-card" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <span className={`label-sm px-2.5 py-1 rounded-xl ${statusStyle[s.status]}`}>
                        {statusLabel[s.status]}
                      </span>
                      <h3 className="font-display text-xl text-card-foreground mt-2 leading-tight">
                        {s.name.split(" ")[0]}
                        <br />
                        {s.name.split(" ").slice(1).join(" ")}
                      </h3>
                      <p className="label-sm text-muted-foreground mt-1">{s.role}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <p className="label-sm text-muted-foreground">Reliability</p>
                        <p className="text-sm font-bold text-card-foreground ml-auto">{s.reliabilityScore}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex border-t border-border/40">
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-foreground transition-colors">
                      <Phone size={14} />
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-foreground transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </button>
                    <button
                      onClick={() => navigate(`/staff/${s.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 label-sm text-secondary hover:text-foreground transition-colors"
                    >
                      <Eye size={14} /> Profile
                    </button>
                  </div>
                </PressableCard>
              </SwipeableCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </PageTransition>
    </PullToRefresh>
  );
};

export default StaffDirectory;
