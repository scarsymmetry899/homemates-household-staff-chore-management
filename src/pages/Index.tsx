import { ArrowRight, Droplets, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { staffMembers } from "@/data/staff";
import estateHallway from "@/assets/estate-hallway.jpg";

const statusColor: Record<string, string> = {
  "on-duty": "bg-status-on-time",
  late: "bg-status-late",
  absent: "bg-status-absent",
  "en-route": "bg-status-grace-late",
  "off-duty": "bg-status-off-duty",
};

const statusLabel: Record<string, string> = {
  "on-duty": "On-Site",
  late: "Late",
  absent: "Absent",
  "en-route": "En-Route",
  "off-duty": "Off-Duty",
};

const Index = () => {
  const navigate = useNavigate();
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const onDuty = staffMembers.filter((s) => s.status === "on-duty").length;
  const totalTasks = staffMembers.reduce((a, s) => a + s.assignments.length, 0);
  const doneTasks = staffMembers.reduce(
    (a, s) => a + s.assignments.filter((t) => t.done).length,
    0
  );
  const taskPct = Math.round((doneTasks / totalTasks) * 100);

  return (
    <div className="px-6 space-y-8 animate-fade-in">
      {/* Morning Briefing */}
      <section className="space-y-2">
        <p className="label-sm text-muted-foreground">Morning Briefing</p>
        <h1 className="display-sm text-foreground">
          The Estate at
          <br />
          <span className="italic">North Woods</span>
        </h1>
        <p className="font-display text-secondary italic text-sm">{dateStr}</p>
        <button className="mt-4 estate-gradient text-primary-foreground label-sm px-5 py-2.5 rounded-md">
          Request Service
        </button>
      </section>

      {/* Priority Alert */}
      <section className="bg-card rounded-xl p-5 shadow-card space-y-3">
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
        <button className="flex items-center gap-2 label-sm text-foreground mt-2">
          Resolve Issue <ArrowRight size={14} />
        </button>
      </section>

      {/* Estate Status Banner */}
      <section className="relative rounded-xl overflow-hidden h-36">
        <img
          src={estateHallway}
          alt="Estate hallway"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-primary/20 flex flex-col justify-end p-5">
          <p className="label-sm text-primary-foreground/70">Estate Status</p>
          <h3 className="font-display text-xl text-primary-foreground">
            Optimal Atmosphere
          </h3>
        </div>
      </section>

      {/* Personnel Tracking */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="headline-sm text-foreground">Personnel Tracking</h3>
          <button
            onClick={() => navigate("/staff")}
            className="label-sm text-secondary"
          >
            Full Directory
          </button>
        </div>
        <div className="space-y-3">
          {staffMembers.slice(0, 3).map((staff) => (
            <div
              key={staff.id}
              onClick={() => navigate(`/staff/${staff.id}`)}
              className="bg-card rounded-xl p-4 shadow-card flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <img
                src={staff.photo}
                alt={staff.name}
                className="w-12 h-12 rounded-full object-cover"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <p className="label-sm text-muted-foreground">{staff.role}</p>
                <p className="font-display text-base text-card-foreground font-medium">
                  {staff.name}
                </p>
                {staff.arrivalTime && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Arrival {staff.arrivalTime}
                  </p>
                )}
              </div>
              <span
                className={`label-sm px-2.5 py-1 rounded-md ${
                  staff.status === "on-duty"
                    ? "bg-surface-low text-status-on-time"
                    : staff.status === "late"
                    ? "bg-secondary-container text-secondary-container-foreground"
                    : staff.status === "en-route"
                    ? "bg-secondary-container text-secondary-container-foreground"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {statusLabel[staff.status]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Estate Ops */}
      <section className="bg-card rounded-xl p-6 shadow-card space-y-4">
        <h3 className="headline-sm text-card-foreground">Estate Ops</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke="hsl(var(--surface-container))"
                strokeWidth="8"
              />
              <circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${taskPct * 2.51} 251`}
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
      </section>

      {/* Financial Snapshot */}
      <section className="estate-gradient rounded-xl p-6 space-y-4">
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
        <button className="w-full bg-primary-foreground/10 text-primary-foreground label-sm py-2.5 rounded-md mt-2">
          Detailed Ledger
        </button>
      </section>

      {/* Estate Journal */}
      <section className="space-y-4 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="headline-sm text-foreground">Estate Journal</h3>
          <button className="label-sm text-secondary">View All Records</button>
        </div>
        <div className="space-y-4">
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
        </div>
      </section>
    </div>
  );
};

export default Index;
