import { useCallback } from "react";
import { motion } from "framer-motion";
import { Download, TrendingUp } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { PageTransition, StaggerContainer, StaggerItem, AnimatedCard, PressableCard, PullToRefresh } from "@/components/animations/MotionComponents";
import { toast } from "sonner";

const PayrollPage = () => {
  const { staff } = useAppState();
  const totalPayroll = staff.reduce((a, s) => a + s.payroll.netPay, 0);
  const totalDeductions = staff.reduce((a, s) => a + s.payroll.deductions, 0);

  const handleRefresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Payroll data refreshed");
  }, []);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <PageTransition className="px-5 space-y-6">
        <section className="space-y-2">
          <p className="label-sm text-muted-foreground">Compensation Hub</p>
          <h1 className="display-sm text-foreground">
            Payroll
            <br />
            <span className="font-display italic text-secondary">Overview</span>
          </h1>
        </section>

        <AnimatedCard delay={0.1} className="btn-estate rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <p className="label-sm text-primary-foreground/60">This Month</p>
            <TrendingUp size={16} className="text-primary-foreground/60" />
          </div>
          <p className="label-sm text-primary-foreground/50">Net Disbursement</p>
          <p className="font-display text-3xl text-primary-foreground">
            ₹{totalPayroll.toLocaleString("en-IN")}
          </p>
          <div className="flex gap-6 pt-2">
            <div>
              <p className="label-sm text-primary-foreground/50">Total Base</p>
              <p className="text-primary-foreground font-semibold text-sm">₹{staff.reduce((a, s) => a + s.payroll.baseSalary, 0).toLocaleString("en-IN")}</p>
            </div>
            {totalDeductions > 0 && (
              <div>
                <p className="label-sm text-primary-foreground/50">Deductions</p>
                <p className="text-status-absent font-semibold text-sm">-₹{totalDeductions.toLocaleString("en-IN")}</p>
              </div>
            )}
          </div>
        </AnimatedCard>

        <StaggerContainer className="space-y-3 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="headline-sm text-foreground">Staff Compensation</h3>
            <button
              onClick={() => toast.success("Export started", { description: "Payroll report generating..." })}
              className="label-sm text-secondary glass-btn px-3 py-1.5 rounded-xl flex items-center gap-1"
            >
              <Download size={12} /> Export
            </button>
          </div>
          {staff.map((s) => (
            <StaggerItem key={s.id}>
              <PressableCard className="glass-card rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={s.photo} alt={s.name} className="w-10 h-10 rounded-xl object-cover shadow-card" loading="lazy" />
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{s.name}</p>
                    <p className="label-sm text-muted-foreground">{s.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="label-sm text-muted-foreground">Base Salary</p>
                    <p className="text-sm font-semibold text-card-foreground">₹{s.payroll.baseSalary.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="label-sm text-status-absent">Deductions</p>
                    <p className="text-sm font-semibold text-status-absent">-₹{s.payroll.deductions.toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-border/30 flex items-center justify-between">
                  <span className="label-sm text-muted-foreground">Net Pay</span>
                  <span className="font-display text-lg text-card-foreground">₹{s.payroll.netPay.toLocaleString("en-IN")}</span>
                </div>
              </PressableCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </PageTransition>
    </PullToRefresh>
  );
};

export default PayrollPage;
