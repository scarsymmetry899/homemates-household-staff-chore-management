import { Download, TrendingUp } from "lucide-react";
import { staffMembers } from "@/data/staff";

const PayrollPage = () => {
  const totalPayroll = staffMembers.reduce((a, s) => a + s.payroll.netPay, 0);
  const totalBonuses = staffMembers.reduce((a, s) => a + s.payroll.bonus, 0);
  const totalDeductions = staffMembers.reduce((a, s) => a + s.payroll.deductions, 0);

  return (
    <div className="px-6 space-y-6 animate-fade-in">
      <section className="space-y-2">
        <p className="label-sm text-muted-foreground">Financial Oversight</p>
        <h1 className="display-sm text-foreground">
          Payroll
          <br />
          <span className="font-display italic text-secondary">Ledger</span>
        </h1>
      </section>

      {/* Total Payroll Card */}
      <section className="estate-gradient rounded-xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <p className="label-sm text-primary-foreground/60">October 2023</p>
          <TrendingUp size={16} className="text-primary-foreground/60" />
        </div>
        <p className="label-sm text-primary-foreground/50">Total Payroll</p>
        <p className="font-display text-3xl text-primary-foreground">
          ₹{totalPayroll.toLocaleString("en-IN")}
        </p>
        <div className="flex gap-6 pt-2">
          <div>
            <p className="label-sm text-primary-foreground/50">Bonuses</p>
            <p className="text-primary-foreground font-semibold text-sm">
              +₹{totalBonuses.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="label-sm text-primary-foreground/50">Deductions</p>
            <p className="text-status-absent font-semibold text-sm">
              -₹{totalDeductions.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </section>

      {/* Individual Breakdown */}
      <section className="space-y-3 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="headline-sm text-foreground">Staff Breakdown</h3>
          <button className="label-sm text-secondary flex items-center gap-1">
            <Download size={12} /> Export
          </button>
        </div>
        {staffMembers.map((staff) => (
          <div key={staff.id} className="bg-card rounded-xl p-5 shadow-card space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={staff.photo}
                alt={staff.name}
                className="w-10 h-10 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <p className="text-sm font-semibold text-card-foreground">{staff.name}</p>
                <p className="label-sm text-muted-foreground">{staff.role}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="label-sm text-muted-foreground">Base</p>
                <p className="text-sm font-semibold text-card-foreground">
                  ₹{staff.payroll.baseSalary.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="label-sm text-status-on-time">Bonus</p>
                <p className="text-sm font-semibold text-status-on-time">
                  +₹{staff.payroll.bonus.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="label-sm text-status-absent">Deductions</p>
                <p className="text-sm font-semibold text-status-absent">
                  -₹{staff.payroll.deductions.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-surface-container flex items-center justify-between">
              <span className="label-sm text-muted-foreground">Net Pay</span>
              <span className="font-display text-lg text-card-foreground">
                ₹{staff.payroll.netPay.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default PayrollPage;
