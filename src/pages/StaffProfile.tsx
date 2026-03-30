import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Send, CalendarDays, Shield, Pencil, Download } from "lucide-react";
import { staffMembers } from "@/data/staff";

const StaffProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const staff = staffMembers.find((s) => s.id === id);

  if (!staff) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Staff member not found.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-56 bg-secondary-container overflow-hidden">
          <img
            src={staff.photo}
            alt={staff.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-4">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full glass flex items-center justify-center"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full glass flex items-center justify-center">
                <Bell size={16} />
              </button>
              <button className="w-9 h-9 rounded-full estate-gradient flex items-center justify-center text-primary-foreground">
                <Shield size={16} />
              </button>
            </div>
          </div>
          {/* Reliability Badge */}
          <div className="absolute bottom-4 left-4 glass px-3 py-1.5 rounded-full">
            <span className="label-sm text-status-on-time">{staff.reliabilityScore}% Reliability</span>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6 -mt-2">
        {/* Name & Meta */}
        <section className="space-y-3 pt-4">
          <p className="label-sm text-muted-foreground">Primary Household Staff</p>
          <h1 className="font-display text-3xl text-foreground tracking-tight leading-tight">
            {staff.name}
          </h1>
          <div className="flex gap-8">
            <div>
              <p className="label-sm text-muted-foreground">Position</p>
              <p className="text-sm text-card-foreground font-medium">{staff.role}</p>
            </div>
            <div>
              <p className="label-sm text-muted-foreground">Tenure</p>
              <p className="text-sm text-card-foreground font-medium">{staff.tenure}</p>
            </div>
          </div>
          <div>
            <p className="label-sm text-muted-foreground">Location</p>
            <p className="text-sm text-card-foreground font-medium">{staff.location}</p>
          </div>
          <div className="flex gap-3">
            <button className="estate-gradient text-primary-foreground label-sm px-5 py-2.5 rounded-md flex items-center gap-2">
              <Send size={14} /> Send Instruction
            </button>
            <button className="bg-surface-low text-foreground label-sm px-5 py-2.5 rounded-md flex items-center gap-2">
              <CalendarDays size={14} /> View Schedule
            </button>
          </div>
        </section>

        {/* Assignments */}
        <section className="bg-card rounded-xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="headline-sm text-card-foreground">Assignments</h3>
            <span className="label-sm text-muted-foreground">Today</span>
          </div>
          <div className="space-y-3">
            {staff.assignments.map((task, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                    task.done
                      ? "estate-gradient"
                      : "bg-surface-container"
                  }`}
                >
                  {task.done && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    task.done
                      ? "text-muted-foreground line-through"
                      : "text-card-foreground"
                  }`}
                >
                  {task.task}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Internal Notes */}
        {staff.notes && (
          <section className="bg-surface-low rounded-xl p-5 space-y-3">
            <h3 className="headline-sm text-foreground">Internal Notes</h3>
            <blockquote className="font-display italic text-sm text-muted-foreground leading-relaxed border-l-2 border-secondary pl-4">
              "{staff.notes}"
            </blockquote>
            <button className="flex items-center gap-2 label-sm text-secondary">
              <Pencil size={12} /> Edit Notes
            </button>
          </section>
        )}

        {/* Attendance Timeline */}
        <section className="space-y-4">
          <h3 className="headline-sm text-foreground">Attendance</h3>
          <div className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-surface-container" />
            {staff.attendance.map((entry, i) => (
              <div key={i} className="relative mb-5 last:mb-0">
                <div
                  className={`absolute left-[-18px] top-1.5 w-3 h-3 rounded-full ${
                    entry.type === "check-in" || entry.type === "on-site"
                      ? "bg-status-on-time"
                      : entry.type === "late"
                      ? "bg-status-late"
                      : entry.type === "leave"
                      ? "bg-secondary"
                      : "bg-status-absent"
                  }`}
                />
                <p className="label-sm text-muted-foreground">{entry.date}</p>
                <p className="text-sm text-card-foreground font-medium mt-0.5 whitespace-pre-line">
                  {entry.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Payroll */}
        <section className="estate-gradient rounded-xl p-6 space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <p className="label-sm text-primary-foreground/60">Monthly Payroll</p>
            <div className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center">
              <Download size={14} className="text-primary-foreground" />
            </div>
          </div>
          <h3 className="font-display text-xl text-primary-foreground">{staff.payroll.month}</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-primary-foreground/70 text-sm">Base Salary</span>
              <span className="text-primary-foreground font-semibold">
                ₹{staff.payroll.baseSalary.toLocaleString("en-IN")}.00
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-foreground/70 text-sm font-display italic">Performance Bonus</span>
              <span className="text-status-grace-late font-semibold">
                +₹{staff.payroll.bonus.toLocaleString("en-IN")}.00
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-foreground/70 text-sm font-display italic">Deductions</span>
              <span className="text-status-absent font-semibold">
                -₹{staff.payroll.deductions.toLocaleString("en-IN")}.00
              </span>
            </div>
          </div>
          <div className="pt-3 border-t border-primary-foreground/10">
            <p className="label-sm text-primary-foreground/50">Total Net Pay</p>
            <p className="font-display text-3xl text-primary-foreground mt-1">
              ₹{staff.payroll.netPay.toLocaleString("en-IN")}.00
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StaffProfile;
