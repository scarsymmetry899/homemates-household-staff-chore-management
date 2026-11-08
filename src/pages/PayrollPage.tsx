import { useCallback, useState } from "react";
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

  const currentPeriod = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const [period, setPeriod] = useState(currentPeriod);
  const periods = Array.from(new Set([currentPeriod, ...visibleStaff.map(person => person.payroll.month)]));
  const rows = visibleStaff.filter(person => person.payroll.month === period);
  const totalPayroll = rows.reduce((sum, person) => sum + person.payroll.netPay, 0);
  const totalDeductions = rows.reduce((sum, person) => sum + person.payroll.deductions, 0);
  async function exportPayroll() {
    const XLSX = await import("xlsx");
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(rows.map(s => ({
      Staff: s.name, Period: period, Base: s.payroll.baseSalary, Deductions: s.payroll.deductions, Net: s.payroll.netPay,
    })));
    XLSX.utils.book_append_sheet(workbook, sheet, "Payroll");
    XLSX.writeFile(workbook, `Payroll ${period}.xlsx`);
  }
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
          <h1 className="display-sm text-foreground">{appRole === "staff" ? t("payroll.myPay") : t("nav.payroll")}</h1>
        </section>

        {appRole === "staff" ? <section className="payslip space-y-3">
          <p className="residence-kicker">Pay statement</p>
          <select aria-label="Payroll period" className="bg-card text-foreground rounded p-2" value={period} onChange={e=>setPeriod(e.target.value)}>{periods.map(p=><option key={p}>{p}</option>)}</select>
          {rows.length ? <dl>
            <div><dt>{t("payroll.baseSalary")}</dt><dd>₹{rows[0].payroll.baseSalary.toLocaleString("en-IN")}</dd></div>
            <div><dt>{t("payroll.deductions")}</dt><dd>₹{totalDeductions.toLocaleString("en-IN")}</dd></div>
            <div><dt>{t("payroll.netPay")}</dt><dd className="font-display text-3xl">₹{totalPayroll.toLocaleString("en-IN")}</dd></div>
          </dl> : <p>No pay statement for this period.</p>}
        </section> : <AnimatedCard delay={0.1} className="btn-estate rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <p className="label-sm text-primary-foreground/60"><select aria-label="Payroll period" className="rounded bg-card p-2 text-card-foreground" value={period} onChange={e => setPeriod(e.target.value)}>{periods.map(p => <option key={p}>{p}</option>)}</select></p>
            <TrendingUp size={16} className="text-primary-foreground/60" />
          </div>
          <p className="label-sm text-primary-foreground/50">{t("payroll.netDisbursement")}</p>
          <p className="font-display text-3xl text-primary-foreground">
            ₹{totalPayroll.toLocaleString("en-IN")}
          </p>
          <div className="flex gap-6 pt-2">
            <div>
              <p className="label-sm text-primary-foreground/50">{t("payroll.totalBase")}</p>
              <p className="text-primary-foreground font-semibold text-sm">₹{rows.reduce((a, s) => a + s.payroll.baseSalary, 0).toLocaleString("en-IN")}</p>
            </div>
            {totalDeductions > 0 && (
              <div>
                <p className="label-sm text-primary-foreground/50">{t("payroll.deductions")}</p>
                <p className="text-status-absent font-semibold text-sm">-₹{totalDeductions.toLocaleString("en-IN")}</p>
              </div>
            )}
          </div>
        </AnimatedCard>}

        {appRole === "owner" && <StaggerContainer className="space-y-3 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="headline-sm text-foreground">
              {t("payroll.homemakerCompensation")}
            </h3>
            {appRole === "owner" && (
              <button
                disabled={!rows.length} onClick={() => exportPayroll().catch(() => toast.error("Export failed. Try again."))}
                className="label-sm text-secondary glass-btn px-3 py-1.5 rounded-xl flex items-center gap-1"
              >
                <Download size={12} /> {t("payroll.export")}
              </button>
            )}
          </div>
          {rows.length === 0 && <p>No payroll records for this period.</p>}
          {rows.map((s) => (
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
        </StaggerContainer>}
      </PageTransition>
    </PullToRefresh>
  );
};

export default PayrollPage;
