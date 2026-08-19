import { useCallback } from "react";
import { motion } from "framer-motion";
import { Download, TrendingUp } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { useI18n } from "@/lib/i18n";
import { PageTransition, StaggerContainer, StaggerItem, AnimatedCard, PressableCard, PullToRefresh } from "@/components/animations/MotionComponents";
import StaffAvatar from "@/components/StaffAvatar";
import { toast } from "sonner";

const PayrollPage = () => {
  const { staff, appRole, activeStaffId } = useAppState();
  const { t } = useI18n();
  const visibleStaff = appRole === "staff"
    ? staff.filter((member) => member.id === activeStaffId)
    : staff;
  const totalPayroll = visibleStaff.reduce((a, s) => a + s.payroll.netPay, 0);
  const totalDeductions = visibleStaff.reduce((a, s) => a + s.payroll.deductions, 0);

  const handleRefresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success(t("payroll.refreshed"));
  }, [t]);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <PageTransition className="px-5 space-y-6">
        <section className="space-y-2">
          <p className="label-sm text-muted-foreground">
            {appRole === "staff" ? t("payroll.myCompensation") : t("payroll.compensationHub")}
          </p>
          <h1 className="display-sm text-foreground">
            {t("nav.payroll")}
            <br />
            <span className="font-display italic text-secondary">{t("payroll.overview")}</span>
          </h1>
        </section>

        <AnimatedCard delay={0.1} className="btn-estate rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <p className="label-sm text-primary-foreground/60">{t("payroll.thisMonth")}</p>
            <TrendingUp size={16} className="text-primary-foreground/60" />
          </div>
          <p className="label-sm text-primary-foreground/50">{t("payroll.netDisbursement")}</p>
          <p className="font-display text-3xl text-primary-foreground">
            ₹{totalPayroll.toLocaleString("en-IN")}
          </p>
          <div className="flex gap-6 pt-2">
            <div>
              <p className="label-sm text-primary-foreground/50">{t("payroll.totalBase")}</p>
              <p className="text-primary-foreground font-semibold text-sm">₹{visibleStaff.reduce((a, s) => a + s.payroll.baseSalary, 0).toLocaleString("en-IN")}</p>
            </div>
            {totalDeductions > 0 && (
              <div>
                <p className="label-sm text-primary-foreground/50">{t("payroll.deductions")}</p>
                <p className="text-status-absent font-semibold text-sm">-₹{totalDeductions.toLocaleString("en-IN")}</p>
              </div>
            )}
          </div>
        </AnimatedCard>

        <StaggerContainer className="space-y-3 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="headline-sm text-foreground">
              {appRole === "staff" ? t("payroll.myPay") : t("payroll.homemakerCompensation")}
            </h3>
            {appRole === "owner" && (
              <button
                onClick={() => toast.success(t("payroll.exportStarted"), { description: t("payroll.exportDescription") })}
                className="label-sm text-secondary glass-btn px-3 py-1.5 rounded-xl flex items-center gap-1"
              >
                <Download size={12} /> {t("payroll.export")}
              </button>
            )}
          </div>
          {visibleStaff.map((s) => (
            <StaggerItem key={s.id}>
              <PressableCard className="glass-card rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <StaffAvatar name={s.name} src={s.photo} className="w-10 h-10 shrink-0" textClassName="text-xs" />
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{s.name}</p>
                    <p className="label-sm text-muted-foreground">{s.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="label-sm text-muted-foreground">{t("payroll.baseSalary")}</p>
                    <p className="text-sm font-semibold text-card-foreground">₹{s.payroll.baseSalary.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="label-sm text-status-absent">{t("payroll.deductions")}</p>
                    <p className="text-sm font-semibold text-status-absent">-₹{s.payroll.deductions.toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-border/30 flex items-center justify-between">
                  <span className="label-sm text-muted-foreground">{t("payroll.netPay")}</span>
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
