import { useState } from "react";
import { CalendarCheck, CheckCircle2, Circle, Clock, CreditCard, MessageSquareWarning, ReceiptText, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAppState, type AttendanceCorrectionRequest, type Expense } from "@/context/AppContext";
import { useI18n } from "@/lib/i18n";
import StaffAvatar from "@/components/StaffAvatar";
import { PageTransition, StaggerContainer, StaggerItem, PressableCard } from "@/components/animations/MotionComponents";

const statusLabelKey: Record<string, string> = {
  present: "status.onDuty",
  late: "status.late",
  absent: "status.absent",
  "off-duty": "status.offDuty",
  "on-duty": "status.onDuty",
  "en-route": "status.enRoute",
};

export default function StaffWorkspace() {
  const {
    staff,
    activeStaffId,
    setActiveStaffId,
    toggleTask,
    createCashRequest,
    cashRequests,
    attendanceRequests,
    createAttendanceCorrectionRequest,
  } = useAppState();
  const { t, locale } = useI18n();
  const [showCashForm, setShowCashForm] = useState(false);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [cashForm, setCashForm] = useState({
    category: "Groceries" as Expense["category"],
    amountRequested: "",
    reason: "",
    neededBy: "",
    notes: "",
  });
  const [attendanceForm, setAttendanceForm] = useState({
    date: new Date().toISOString().split("T")[0],
    requestedStatus: "present" as AttendanceCorrectionRequest["requestedStatus"],
    reason: "",
  });
  const activeStaff = staff.find((member) => member.id === activeStaffId) || staff[0];

  if (!activeStaff) {
    return (
      <PageTransition className="px-5 py-10">
        <div className="glass-card rounded-3xl p-6 text-center space-y-2">
          <p className="headline-sm text-foreground">{t("staff.noneSelected")}</p>
          <p className="text-sm text-muted-foreground">{t("staff.noneSelectedDescription")}</p>
        </div>
      </PageTransition>
    );
  }

  const completedTasks = activeStaff.assignments.filter((task) => task.done).length;
  const attendanceEntry = activeStaff.attendance[0];
  const myCashRequests = cashRequests.filter((request) => request.staffId === activeStaff.id);
  const myAttendanceRequests = attendanceRequests.filter((request) => request.staffId === activeStaff.id);

  const submitCashRequest = () => {
    if (!cashForm.amountRequested || !cashForm.reason.trim()) {
      toast.error(t("staff.amountReasonRequired"));
      return;
    }
    createCashRequest({
      category: cashForm.category,
      amountRequested: Number(cashForm.amountRequested),
      reason: cashForm.reason.trim(),
      neededBy: cashForm.neededBy || undefined,
      notes: cashForm.notes.trim() || undefined,
      staffId: activeStaff.id,
      staffName: activeStaff.name,
      staffRole: activeStaff.role,
    });
    setCashForm({ category: "Groceries", amountRequested: "", reason: "", neededBy: "", notes: "" });
    setShowCashForm(false);
    toast.success(t("staff.cashRequestSent"), { description: t("staff.cashRequestSentDescription") });
  };

  const submitAttendanceRequest = () => {
    if (!attendanceForm.date || !attendanceForm.reason.trim()) {
      toast.error(t("staff.dateReasonRequired"));
      return;
    }
    createAttendanceCorrectionRequest({
      staffId: activeStaff.id,
      staffName: activeStaff.name,
      staffRole: activeStaff.role,
      date: attendanceForm.date,
      currentStatus: activeStaff.status.replace("-", " "),
      requestedStatus: attendanceForm.requestedStatus,
      reason: attendanceForm.reason.trim(),
    });
    setAttendanceForm({
      date: new Date().toISOString().split("T")[0],
      requestedStatus: "present",
      reason: "",
    });
    setShowAttendanceForm(false);
    toast.success(t("staff.attendanceIssueReported"), { description: t("staff.attendanceIssueReportedDescription") });
  };

  return (
    <PageTransition className="px-5 space-y-6">
      <section className="glass-card rounded-3xl p-5 space-y-4">
        <div className="flex items-center gap-4">
          <StaffAvatar name={activeStaff.name} src={activeStaff.photo} className="w-16 h-16 rounded-2xl shrink-0" textClassName="text-lg" />
          <div className="min-w-0 flex-1">
            <p className="label-sm text-muted-foreground">{t("staff.mode")}</p>
            <h1 className="font-display text-2xl text-foreground leading-tight">{activeStaff.name}</h1>
            <p className="text-sm text-muted-foreground truncate">{activeStaff.role}</p>
          </div>
        </div>

        {staff.length > 1 && (
          <select
            value={activeStaff.id}
            onChange={(event) => setActiveStaffId(event.target.value)}
            className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30"
          >
            {staff.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} - {member.role}
              </option>
            ))}
          </select>
        )}
      </section>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-2xl p-4">
          <p className="label-sm text-status-on-time">{t("staff.tasksDone")}</p>
          <p className="font-display text-2xl text-card-foreground mt-1">
            {completedTasks}/{activeStaff.assignments.length}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <p className="label-sm text-secondary">{t("staff.todayStatus")}</p>
          <p className="font-display text-xl text-card-foreground mt-1">
            {t(statusLabelKey[activeStaff.status] || "status.offDuty")}
          </p>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="headline-sm text-foreground">{t("staff.myTasksToday")}</h2>
          <span className="label-sm text-muted-foreground">{t("staff.total", { count: activeStaff.assignments.length })}</span>
        </div>
        <StaggerContainer className="space-y-3">
          {activeStaff.assignments.length === 0 ? (
            <div className="glass-card rounded-2xl p-5 text-sm text-muted-foreground">{t("staff.noTasksToday")}</div>
          ) : (
            activeStaff.assignments.map((task, index) => (
              <StaggerItem key={`${activeStaff.id}-${index}-${task.task}`}>
                <PressableCard>
                  <button
                    type="button"
                    onClick={() => toggleTask(activeStaff.id, index)}
                    className="glass-card rounded-2xl p-4 w-full text-left flex items-start gap-3"
                  >
                    <motion.span whileTap={{ scale: 0.9 }} className="pt-0.5">
                      {task.done ? <CheckCircle2 size={20} className="text-status-on-time" /> : <Circle size={20} className="text-surface-container" />}
                    </motion.span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm font-medium ${task.done ? "line-through text-muted-foreground" : "text-card-foreground"}`}>
                        {task.task}
                      </span>
                      {task.dueDate && (
                        <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock size={12} /> {t("staff.due", { date: new Date(task.dueDate).toLocaleDateString(locale, { day: "numeric", month: "short" }) })}
                        </span>
                      )}
                    </span>
                  </button>
                </PressableCard>
              </StaggerItem>
            ))
          )}
        </StaggerContainer>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setShowCashForm((value) => !value)}
          className="glass-card rounded-2xl p-4 text-left space-y-2"
        >
          <ReceiptText size={18} className="text-secondary" />
          <p className="label-sm text-foreground">{t("staff.requestCash")}</p>
          <p className="text-xs text-muted-foreground">{t("staff.requestCashHelp")}</p>
        </button>
        <button
          type="button"
          onClick={() => setShowAttendanceForm((value) => !value)}
          className="glass-card rounded-2xl p-4 text-left space-y-2"
        >
          <MessageSquareWarning size={18} className="text-status-late" />
          <p className="label-sm text-foreground">{t("staff.reportIssue")}</p>
          <p className="text-xs text-muted-foreground">{t("staff.reportIssueHelp")}</p>
        </button>
      </section>

      {showAttendanceForm && (
        <section className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-muted-foreground">{t("staff.ownerReview")}</p>
              <h2 className="headline-sm text-foreground">{t("staff.reportAttendanceIssue")}</h2>
            </div>
            <button type="button" onClick={() => setShowAttendanceForm(false)} className="glass-btn w-8 h-8 rounded-xl flex items-center justify-center">
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>
          <input
            type="date"
            value={attendanceForm.date}
            onChange={(event) => setAttendanceForm((form) => ({ ...form, date: event.target.value }))}
            className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground border border-border/30"
          />
          <div className="grid grid-cols-2 gap-2">
            {(["present", "late", "absent", "off-duty"] as AttendanceCorrectionRequest["requestedStatus"][]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setAttendanceForm((form) => ({ ...form, requestedStatus: status }))}
                className={`label-sm px-3 py-2 rounded-xl capitalize transition-all ${
                  attendanceForm.requestedStatus === status ? "btn-estate text-primary-foreground" : "glass-btn text-muted-foreground"
                }`}
              >
                {t(statusLabelKey[status] || "status.offDuty")}
              </button>
            ))}
          </div>
          <textarea
            placeholder={t("staff.attendanceReasonPlaceholder")}
            value={attendanceForm.reason}
            onChange={(event) => setAttendanceForm((form) => ({ ...form, reason: event.target.value }))}
            className="w-full min-h-24 bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground border border-border/30"
          />
          <button type="button" onClick={submitAttendanceRequest} className="w-full btn-estate text-primary-foreground label-sm py-3.5 rounded-xl">
            {t("staff.sendForOwnerReview")}
          </button>
        </section>
      )}

      {showCashForm && (
        <section className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-muted-foreground">{t("staff.ownerApproval")}</p>
              <h2 className="headline-sm text-foreground">{t("staff.requestCash")}</h2>
            </div>
            <button type="button" onClick={() => setShowCashForm(false)} className="glass-btn w-8 h-8 rounded-xl flex items-center justify-center">
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["Groceries", "Fuel", "Household", "Repairs", "Advances"] as Expense["category"][]).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setCashForm((form) => ({ ...form, category }))}
                className={`label-sm px-3 py-2 rounded-xl transition-all ${
                  cashForm.category === category ? "btn-estate text-primary-foreground" : "glass-btn text-muted-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder={t("staff.amountNeeded")}
            value={cashForm.amountRequested}
            onChange={(event) => setCashForm((form) => ({ ...form, amountRequested: event.target.value }))}
            className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground border border-border/30"
          />
          <input
            type="text"
            placeholder={t("staff.cashReasonPlaceholder")}
            value={cashForm.reason}
            onChange={(event) => setCashForm((form) => ({ ...form, reason: event.target.value }))}
            className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground border border-border/30"
          />
          <input
            type="date"
            value={cashForm.neededBy}
            onChange={(event) => setCashForm((form) => ({ ...form, neededBy: event.target.value }))}
            className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground border border-border/30"
          />
          <textarea
            placeholder={t("staff.notesForOwner")}
            value={cashForm.notes}
            onChange={(event) => setCashForm((form) => ({ ...form, notes: event.target.value }))}
            className="w-full min-h-20 bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground border border-border/30"
          />
          <button type="button" onClick={submitCashRequest} className="w-full btn-estate text-primary-foreground label-sm py-3.5 rounded-xl">
            {t("staff.sendRequest")}
          </button>
        </section>
      )}

      {myCashRequests.length > 0 && (
        <section className="glass-card rounded-2xl p-5 space-y-3">
          <div>
            <p className="label-sm text-muted-foreground">{t("staff.cashRequests")}</p>
            <h2 className="headline-sm text-foreground">{t("staff.myRequests")}</h2>
          </div>
          {myCashRequests.slice(0, 4).map((request) => (
            <div key={request.id} className="rounded-xl bg-surface-low border border-border/30 p-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-card-foreground truncate">{request.reason}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {request.category} · ₹{request.amountRequested.toLocaleString("en-IN")} · {request.requestedAt}
                </p>
              </div>
              <span className="label-sm rounded-full bg-muted px-2.5 py-1 capitalize text-muted-foreground">
                {request.status}
              </span>
            </div>
          ))}
        </section>
      )}

      {myAttendanceRequests.length > 0 && (
        <section className="glass-card rounded-2xl p-5 space-y-3">
          <div>
            <p className="label-sm text-muted-foreground">{t("staff.attendanceReview")}</p>
            <h2 className="headline-sm text-foreground">{t("staff.myReportedIssues")}</h2>
          </div>
          {myAttendanceRequests.slice(0, 4).map((request) => (
            <div key={request.id} className="rounded-xl bg-surface-low border border-border/30 p-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-card-foreground truncate">{request.reason}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {request.date} · {t("staff.requestedStatus", { status: t(statusLabelKey[request.requestedStatus] || "status.offDuty") })}
                </p>
              </div>
              <span className="label-sm rounded-full bg-muted px-2.5 py-1 capitalize text-muted-foreground">
                {request.status}
              </span>
            </div>
          ))}
        </section>
      )}

      <section className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="label-sm text-muted-foreground">{t("staff.currentMonth")}</p>
            <h2 className="headline-sm text-foreground">{t("staff.paymentSummary")}</h2>
          </div>
          <CreditCard size={18} className="text-secondary" />
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-muted-foreground">{t("staff.base")}</p>
            <p className="text-sm font-semibold text-card-foreground">₹{activeStaff.payroll.baseSalary.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("staff.deducted")}</p>
            <p className="text-sm font-semibold text-destructive">₹{activeStaff.payroll.deductions.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("staff.net")}</p>
            <p className="text-sm font-semibold text-status-on-time">₹{activeStaff.payroll.netPay.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <CalendarCheck size={18} className="text-secondary" />
          <h2 className="headline-sm text-foreground">{t("staff.attendance")}</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {attendanceEntry ? `${attendanceEntry.date}: ${attendanceEntry.detail}` : t("staff.noAttendanceToday")}
        </p>
        <p className="text-xs text-muted-foreground">{t("staff.attendanceReadOnly")}</p>
      </section>

      <div className="pb-4" />
    </PageTransition>
  );
}
