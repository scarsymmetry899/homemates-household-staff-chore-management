import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Phone, MessageCircle, Eye, Plus, X, Camera, UserPlus } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { departments, type Department } from "@/data/staff";
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
  const { staff, removeStaff, addStaff } = useAppState();
  const [activeDept, setActiveDept] = useState<string>("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [customDeptName, setCustomDeptName] = useState("");
  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "",
    phone: "",
    department: "Hospitality" as Department,
    salary: "",
    location: "",
    tenure: "",
    shiftStart: "08:00 AM",
    shiftEnd: "05:00 PM",
  });

  const filtered = activeDept === "All"
    ? staff
    : staff.filter((s) => {
        if (activeDept === "Other") return s.department === "Other";
        return s.department === activeDept;
      });

  const onDuty = staff.filter((s) => s.status === "on-duty").length;
  const lateCount = staff.filter((s) => s.status === "late").length;

  const handleRefresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Directory refreshed");
  }, []);

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.role || !newStaff.phone) {
      toast.error("Please fill in name, role, and phone number");
      return;
    }
    if (newStaff.department === "Other" && !customDeptName.trim()) {
      toast.error("Please enter a custom category name");
      return;
    }
    addStaff({
      name: newStaff.name,
      role: newStaff.role,
      phone: newStaff.phone,
      department: newStaff.department,
      ...(newStaff.department === "Other" ? { customDepartment: customDeptName.trim() } : {}),
      salary: Number(newStaff.salary) || 0,
      status: "off-duty",
      tenure: newStaff.tenure || "New",
      location: newStaff.location || "Not assigned",
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(newStaff.name)}&background=567C8D&color=fff&size=200`,
      shiftStart: newStaff.shiftStart,
      shiftEnd: newStaff.shiftEnd,
    });
    toast.success(`${newStaff.name} added to the team!`);
    setNewStaff({ name: "", role: "", phone: "", department: "Hospitality", salary: "", location: "", tenure: "", shiftStart: "08:00 AM", shiftEnd: "05:00 PM" });
    setCustomDeptName("");
    setShowAddForm(false);
  };

  const handleMessage = (phone: string, name: string) => {
    window.open(`https://t.me/${phone.replace(/[\s+]/g, "")}`, "_blank");
    toast.success(`Opening Telegram for ${name}...`);
  };

  const getDeptLabel = (dept: Department, custom?: string) => {
    if (dept === "Other" && custom) return custom;
    return dept;
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <PageTransition className="px-5 space-y-6">
        <section className="space-y-2">
          <p className="label-sm text-muted-foreground">Your Household Heroes</p>
          <h1 className="display-sm text-foreground">
            Home
            <br />
            <span className="font-display italic text-secondary">Champions</span>
          </h1>
          <div className="flex gap-3 mt-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="btn-estate text-primary-foreground label-sm px-5 py-3 rounded-2xl inline-flex items-center gap-2"
            >
              <UserPlus size={14} /> Add Homemaker
            </motion.button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Last synced: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </section>

        {/* Add Staff Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="headline-sm text-card-foreground">New Homemaker</h3>
                  <button onClick={() => setShowAddForm(false)} className="glass-btn w-8 h-8 rounded-xl flex items-center justify-center">
                    <X size={16} className="text-muted-foreground" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-muted-foreground">
                    <Camera size={20} />
                  </div>
                  <p className="text-xs text-muted-foreground">Photo (optional)</p>
                </div>
                <input placeholder="Full Name *" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30" />
                <input placeholder="Role (e.g. Cook, Nanny, Gardener) *" value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30" />
                <input placeholder="Phone Number *" value={newStaff.phone} onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30" />
                <select value={newStaff.department} onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value as Department })}
                  className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30">
                  {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                {newStaff.department === "Other" && (
                  <input
                    placeholder="Custom category name (e.g. Pet Care, Tutor)"
                    value={customDeptName}
                    onChange={(e) => setCustomDeptName(e.target.value)}
                    className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30"
                  />
                )}
                <input type="number" placeholder="Monthly Salary (₹)" value={newStaff.salary} onChange={(e) => setNewStaff({ ...newStaff, salary: e.target.value })}
                  className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30" />
                <input placeholder="Location / Area" value={newStaff.location} onChange={(e) => setNewStaff({ ...newStaff, location: e.target.value })}
                  className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30" />
                <div className="flex gap-2">
                  <input placeholder="Shift Start (e.g. 08:00 AM)" value={newStaff.shiftStart} onChange={(e) => setNewStaff({ ...newStaff, shiftStart: e.target.value })}
                    className="flex-1 bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30" />
                  <input placeholder="Shift End (e.g. 05:00 PM)" value={newStaff.shiftEnd} onChange={(e) => setNewStaff({ ...newStaff, shiftEnd: e.target.value })}
                    className="flex-1 bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30" />
                </div>
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleAddStaff}
                  className="w-full btn-estate text-primary-foreground label-sm py-3.5 rounded-xl">
                  Add to Team
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-2xl p-4">
            <p className="label-sm text-muted-foreground">Headcount</p>
            <p className="font-display text-2xl text-card-foreground mt-1">{staff.length}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-4">
            <p className="label-sm text-status-on-time">Active</p>
            <p className="font-display text-2xl text-card-foreground mt-1">{onDuty}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-4">
            <p className="label-sm text-status-late">Flagged</p>
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
                activeDept === dept ? "btn-estate text-primary-foreground" : "glass-btn text-muted-foreground"
              }`}
            >
              {dept === "All" ? "All Roles" : dept}
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
                      <p className="label-sm text-muted-foreground mt-1">
                        {s.role} · {getDeptLabel(s.department, s.customDepartment)}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <p className="text-[10px] text-muted-foreground">Reliability</p>
                          <p className="text-xs font-bold text-card-foreground">{s.reliabilityScore}%</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <p className="text-[10px] text-muted-foreground">Punctuality</p>
                          <p className={`text-xs font-bold ${s.punctualityScore >= 90 ? "text-status-on-time" : s.punctualityScore >= 75 ? "text-status-late" : "text-destructive"}`}>
                            {s.punctualityScore}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex border-t border-border/40">
                    <button
                      onClick={() => toast.success(`Calling ${s.name}...`)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Phone size={14} />
                    </button>
                    <button
                      onClick={() => handleMessage(s.phone, s.name)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MessageCircle size={14} />
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
