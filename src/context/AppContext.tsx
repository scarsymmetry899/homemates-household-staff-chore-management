import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { staffMembers as initialStaff, type StaffMember, type StaffStatus } from "@/data/staff";
import {
  saveHouseholdState,
  subscribeToHouseholdState,
  type HouseholdStateSnapshot,
} from "@/lib/householdStore";
import { isFirebaseConfigured } from "@/lib/firebase";
import { bootstrapSqlConnectHousehold } from "@/lib/sqlConnectHousehold";
import {
  addExpenseEntry as sqlAddExpenseEntry,
  addStaffMember as sqlAddStaffMember,
  addTaskInstance as sqlAddTaskInstance,
  deleteExpenseEntry as sqlDeleteExpenseEntry,
  deleteTaskInstance as sqlDeleteTaskInstance,
  dismissAlert as sqlDismissAlert,
  recordAttendanceEvent as sqlRecordAttendanceEvent,
  reassignTaskInstance as sqlReassignTaskInstance,
  removeStaffMember as sqlRemoveStaffMember,
  setTaskCompletion as sqlSetTaskCompletion,
  updateExpenseEntry as sqlUpdateExpenseEntry,
  updateStaffPhoto as sqlUpdateStaffPhoto,
  updateStaffRole as sqlUpdateStaffRole,
  updateStaffShift as sqlUpdateStaffShift,
  updateStaffStatus as sqlUpdateStaffStatus,
  updateStaffTelegramId as sqlUpdateStaffTelegramId,
  updateTaskDueDate as sqlUpdateTaskDueDate,
} from "@homemaker/dataconnect";

export interface Expense {
  id: string;
  category: "Fuel" | "Groceries" | "Repairs" | "Advances" | "Household";
  amount: number;
  description: string;
  staffName?: string;
  date: string;
}

export interface Alert {
  id: string;
  type: "attendance" | "task" | "security" | "expense";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  staffName?: string;
  staffId?: string;
  taskName?: string;
  time: string;
  dismissed: boolean;
  actions: string[];
}

interface AppState {
  staff: StaffMember[];
  expenses: Expense[];
  alerts: Alert[];
  ownerName: string;
  ownerLocation: string;
  isDarkMode: boolean;
  nfcEnabled: boolean;
  setOwnerName: (name: string) => void;
  setDarkMode: (v: boolean) => void;
  setNfcEnabled: (v: boolean) => void;
  toggleTask: (staffId: string, taskIndex: number) => void;
  updateStaffStatus: (staffId: string, status: StaffStatus) => void;
  updateStaffRole: (staffId: string, role: string) => void;
  updateStaffShift: (staffId: string, shiftStart: string, shiftEnd: string) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  editExpense: (id: string, updates: Partial<Omit<Expense, "id">>) => void;
  deleteExpense: (id: string) => void;
  dismissAlert: (alertId: string) => void;
  addTask: (staffId: string, task: string, dueDate?: string) => void;
  removeStaff: (staffId: string) => void;
  deleteTask: (staffId: string, taskIndex: number) => void;
  addStaff: (member: Omit<StaffMember, "id" | "assignments" | "attendance" | "payroll" | "reliabilityScore" | "skills" | "punctualityScore">) => void;
  addDeduction: (staffId: string, amount: number, reason: string) => void;
  updateStaffPhoto: (staffId: string, photoUrl: string) => void;
  updateTaskDueDate: (staffId: string, taskIndex: number, newDueDate: string) => void;
  addAlert: (alert: Omit<Alert, "id" | "dismissed">) => void;
  updateStaffTelegramId: (staffId: string, telegramChatId: string) => void;
  markAttendance: (staffId: string, type: string, detail: string) => void;
  reassignTask: (fromStaffId: string, taskIndex: number, toStaffId: string) => void;
  extendTaskDeadlineByName: (staffId: string, taskName: string, days?: number) => void;
  updatePunctualityScore: (staffId: string, delta: number) => void;
  updateReliabilityScore: (staffId: string, delta: number) => void;
}

const AppContext = createContext<AppState | null>(null);

const initialExpenses: Expense[] = [
  { id: "e1", category: "Fuel", amount: 1200, description: "Petrol for weekly commute", staffName: "Marcus Thorne", date: "Oct 25, 2023" },
  { id: "e2", category: "Groceries", amount: 3500, description: "Weekly pantry restock", staffName: "Sienna Brooks", date: "Oct 24, 2023" },
  { id: "e3", category: "Repairs", amount: 800, description: "Bathroom faucet replacement", date: "Oct 23, 2023" },
  { id: "e4", category: "Advances", amount: 2000, description: "Salary advance", staffName: "Elena Moretti", date: "Oct 22, 2023" },
  { id: "e5", category: "Household", amount: 1500, description: "Cleaning supplies restock", date: "Oct 21, 2023" },
  { id: "e6", category: "Fuel", amount: 950, description: "Airport pickup fuel", staffName: "Marcus Thorne", date: "Oct 20, 2023" },
  { id: "e7", category: "Groceries", amount: 2800, description: "Fresh produce & dairy", staffName: "Sienna Brooks", date: "Oct 19, 2023" },
  { id: "e8", category: "Household", amount: 600, description: "Garden fertilizer", date: "Oct 18, 2023" },
];

const initialAlerts: Alert[] = [
  {
    id: "a1", type: "attendance", severity: "high",
    title: "Cook hasn't checked in by 9:10 AM",
    description: "Sienna Brooks (Cook) has not recorded any check-in for today. Shift was scheduled at 07:00 AM.",
    staffName: "Sienna Brooks", staffId: "4", time: "9:10 AM", dismissed: false,
    actions: ["Mark Leave", "Mark Late", "Ignore"],
  },
  {
    id: "a2", type: "attendance", severity: "medium",
    title: "Chauffeur arrived 25 minutes late",
    description: "Marcus Thorne (Chauffeur) checked in at 08:25 AM. Shift start was 08:00 AM, exceeding the 15-minute grace buffer.",
    staffName: "Marcus Thorne", staffId: "2", time: "8:25 AM", dismissed: false,
    actions: ["Apply Late Penalty", "Waive", "Note"],
  },
  {
    id: "a3", type: "task", severity: "medium",
    title: "Task missed: Supervise silver polishing — Elena Moretti",
    description: "Supervise silver polishing was assigned to Elena Moretti (Housekeeper) for morning shift and hasn't been completed.",
    staffName: "Elena Moretti", staffId: "1", taskName: "Supervise silver polishing", time: "11:30 AM", dismissed: false,
    actions: ["Reassign", "Extend Deadline", "Dismiss"],
  },
  {
    id: "a4", type: "expense", severity: "low",
    title: "Fuel expenses up 18% this month",
    description: "Chauffeur fuel expenses (Marcus Thorne) have increased from ₹1,800 last month to ₹2,150. Review recommended.",
    staffName: "Marcus Thorne", staffId: "2", time: "Weekly Insight", dismissed: false,
    actions: ["Review Details", "Acknowledge"],
  },
  {
    id: "a5", type: "security", severity: "high",
    title: "Perimeter sensor triggered - East Wall",
    description: "Motion sensor at the east boundary wall triggered at 2:45 AM. No staff check-in recorded in that zone.",
    time: "2:45 AM", dismissed: false,
    actions: ["Investigate", "Mark Safe", "Dismiss"],
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [sqlHouseholdId, setSqlHouseholdId] = useState<string | null>(null);
  const [hasLoadedRemoteState, setHasLoadedRemoteState] = useState(false);
  const [hasBootstrappedSql, setHasBootstrappedSql] = useState(false);
  const isApplyingRemoteStateRef = useRef(false);
  const lastSavedStateRef = useRef("");
  const [ownerName, setOwnerNameState] = useState<string>(() => {
    return localStorage.getItem("homemaker_owner_name") || "Boss";
  });
  const [ownerLocation, setOwnerLocation] = useState<string>("Fetching location...");
  const [isDarkMode, setIsDarkModeState] = useState<boolean>(() => {
    return localStorage.getItem("homemaker_dark_mode") === "true";
  });
  const [nfcEnabled, setNfcEnabledState] = useState<boolean>(() => {
    return localStorage.getItem("homemaker_nfc_enabled") === "true";
  });

  const currentHouseholdState: HouseholdStateSnapshot = {
    staff,
    expenses,
    alerts,
    ownerName,
    isDarkMode,
    nfcEnabled,
  };
  const currentHouseholdStateJson = JSON.stringify(currentHouseholdState);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    let remoteStateSettled = false;

    const remoteLoadTimeout = setTimeout(() => {
      if (cancelled || remoteStateSettled) return;
      remoteStateSettled = true;
      lastSavedStateRef.current = currentHouseholdStateJson;
      setHasLoadedRemoteState(true);
    }, 8000);

    subscribeToHouseholdState(
      (state) => {
        if (cancelled) return;
        remoteStateSettled = true;
        isApplyingRemoteStateRef.current = true;
        lastSavedStateRef.current = JSON.stringify(state);
        setStaff(state.staff);
        setExpenses(state.expenses);
        setAlerts(state.alerts);
        setOwnerNameState(state.ownerName);
        setIsDarkModeState(state.isDarkMode);
        setNfcEnabledState(state.nfcEnabled);
        localStorage.setItem("homemaker_owner_name", state.ownerName);
        localStorage.setItem("homemaker_dark_mode", String(state.isDarkMode));
        localStorage.setItem("homemaker_nfc_enabled", String(state.nfcEnabled));
        setHasLoadedRemoteState(true);
        queueMicrotask(() => {
          isApplyingRemoteStateRef.current = false;
        });
      },
      () => {
        if (cancelled) return;
        remoteStateSettled = true;
        setHasLoadedRemoteState(true);
        lastSavedStateRef.current = currentHouseholdStateJson;
      },
      (error) => {
        console.warn("Firebase household sync unavailable", error);
        remoteStateSettled = true;
        lastSavedStateRef.current = currentHouseholdStateJson;
        setHasLoadedRemoteState(true);
      }
    ).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      cancelled = true;
      clearTimeout(remoteLoadTimeout);
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedRemoteState || isApplyingRemoteStateRef.current) return;
    if (lastSavedStateRef.current === currentHouseholdStateJson) return;

    const timeout = setTimeout(() => {
      lastSavedStateRef.current = currentHouseholdStateJson;
      saveHouseholdState(currentHouseholdState).catch((error) => {
        console.warn("Unable to save Firebase household state", error);
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [currentHouseholdStateJson, hasLoadedRemoteState]);

  useEffect(() => {
    if (!hasLoadedRemoteState) return;

    let cancelled = false;
    const sqlBootstrapTimeout = setTimeout(() => {
      if (!cancelled) setHasBootstrappedSql(true);
    }, 12000);

    bootstrapSqlConnectHousehold({
      staff,
      expenses,
      alerts,
      ownerName,
    })
      .then((snapshot) => {
        if (cancelled || !snapshot) return;
        isApplyingRemoteStateRef.current = true;
        setStaff(snapshot.staff);
        setExpenses(snapshot.expenses);
        setAlerts(snapshot.alerts);
        setOwnerNameState(snapshot.ownerName);
        setSqlHouseholdId(snapshot.householdId);
        queueMicrotask(() => {
          isApplyingRemoteStateRef.current = false;
        });
      })
      .catch((error) => {
        console.warn("Firebase SQL Connect household bootstrap unavailable", error);
      })
      .finally(() => {
        clearTimeout(sqlBootstrapTimeout);
        if (!cancelled) setHasBootstrappedSql(true);
      });

    return () => {
      cancelled = true;
      clearTimeout(sqlBootstrapTimeout);
    };
  }, [hasLoadedRemoteState]);

  const persistSql = useCallback((operation: () => Promise<unknown>) => {
    if (!sqlHouseholdId) return;
    operation().catch((error) => {
      console.warn("SQL Connect persistence failed", error);
    });
  }, [sqlHouseholdId]);

  const setOwnerName = useCallback((name: string) => {
    setOwnerNameState(name);
    localStorage.setItem("homemaker_owner_name", name);
  }, []);

  const setDarkMode = useCallback((v: boolean) => {
    setIsDarkModeState(v);
    localStorage.setItem("homemaker_dark_mode", String(v));
  }, []);

  const setNfcEnabled = useCallback((v: boolean) => {
    setNfcEnabledState(v);
    localStorage.setItem("homemaker_nfc_enabled", String(v));
  }, []);

  // Fetch GPS location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
            );
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || "";
            const state = data.address?.state || "";
            setOwnerLocation(city ? `${city}, ${state}` : `${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E`);
          } catch {
            setOwnerLocation("Location unavailable");
          }
        },
        () => setOwnerLocation("Location access denied"),
        { timeout: 10000 }
      );
    } else {
      setOwnerLocation("GPS not supported");
    }
  }, []);

  const toggleTask = useCallback((staffId: string, taskIndex: number) => {
    let taskId: string | undefined;
    let nextDone = false;
    setStaff((prev) =>
      prev.map((s) => {
        if (s.id !== staffId) return s;
        return {
          ...s,
          assignments: s.assignments.map((t, i) => {
            if (i !== taskIndex) return t;
            taskId = t.id;
            nextDone = !t.done;
            return { ...t, done: nextDone };
          }),
        };
      })
    );
    if (taskId) {
      persistSql(() => sqlSetTaskCompletion({
        taskId,
        status: nextDone ? "completed" : "pending",
        completedAt: nextDone ? new Date().toISOString() : null,
        source: "app",
      }));
    }
  }, [persistSql]);

  const updateStaffStatus = useCallback((staffId: string, status: StaffStatus) => {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, status } : s)));
    persistSql(() => sqlUpdateStaffStatus({ staffId, status }));
  }, [persistSql]);

  const updateStaffRole = useCallback((staffId: string, role: string) => {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, role } : s)));
    persistSql(() => sqlUpdateStaffRole({ staffId, role }));
  }, [persistSql]);

  const updateStaffShift = useCallback((staffId: string, shiftStart: string, shiftEnd: string) => {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, shiftStart, shiftEnd } : s)));
    persistSql(() => sqlUpdateStaffShift({ staffId, shiftStart, shiftEnd }));
  }, [persistSql]);

  const addExpense = useCallback((expense: Omit<Expense, "id">) => {
    const tempId = `e${Date.now()}`;
    setExpenses((prev) => [{ ...expense, id: tempId }, ...prev]);
    persistSql(async () => {
      const staffId = expense.staffName ? staff.find((s) => s.name === expense.staffName)?.id : null;
      const result = await sqlAddExpenseEntry({
        householdId: sqlHouseholdId!,
        staffId,
        category: expense.category,
        amount: expense.amount,
        description: expense.description,
        receiptUrl: null,
      });
      setExpenses((prev) => prev.map((e) => (
        e.id === tempId ? { ...e, id: result.data.expenseEntry_insert.id } : e
      )));
    });
  }, [persistSql, sqlHouseholdId, staff]);

  const editExpense = useCallback((id: string, updates: Partial<Omit<Expense, "id">>) => {
    const current = expenses.find((e) => e.id === id);
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    if (current) {
      persistSql(() => sqlUpdateExpenseEntry({
        expenseId: id,
        category: updates.category || current.category,
        amount: updates.amount ?? current.amount,
        description: updates.description || current.description,
      }));
    }
  }, [expenses, persistSql]);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    persistSql(() => sqlDeleteExpenseEntry({ expenseId: id }));
  }, [persistSql]);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, dismissed: true } : a)));
    persistSql(() => sqlDismissAlert({ alertId }));
  }, [persistSql]);

  const addTask = useCallback((staffId: string, task: string, dueDate?: string) => {
    const tempId = `t${Date.now()}`;
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId ? { ...s, assignments: [...s.assignments, { id: tempId, task, done: false, dueDate }] } : s
      )
    );
    persistSql(async () => {
      const result = await sqlAddTaskInstance({
        householdId: sqlHouseholdId!,
        assignedStaffId: staffId,
        title: task,
        dueAt: dueDate ? `${dueDate}T00:00:00.000Z` : null,
      });
      setStaff((prev) => prev.map((s) => (
        s.id === staffId
          ? {
              ...s,
              assignments: s.assignments.map((assignment) => (
                assignment.id === tempId ? { ...assignment, id: result.data.taskInstance_insert.id } : assignment
              )),
            }
          : s
      )));
    });
  }, [persistSql, sqlHouseholdId]);

  const removeStaff = useCallback((staffId: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== staffId));
    persistSql(() => sqlRemoveStaffMember({ staffId }));
  }, [persistSql]);

  const deleteTask = useCallback((staffId: string, taskIndex: number) => {
    const taskId = staff.find((s) => s.id === staffId)?.assignments[taskIndex]?.id;
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? { ...s, assignments: s.assignments.filter((_, i) => i !== taskIndex) }
          : s
      )
    );
    if (taskId) persistSql(() => sqlDeleteTaskInstance({ taskId }));
  }, [persistSql, staff]);

  const addStaff = useCallback((member: Omit<StaffMember, "id" | "assignments" | "attendance" | "payroll" | "reliabilityScore" | "skills" | "punctualityScore">) => {
    const tempId = `s${Date.now()}`;
    const newMember: StaffMember = {
      ...member,
      id: tempId,
      reliabilityScore: 100,
      punctualityScore: 100,
      skills: [],
      assignments: [],
      attendance: [],
      payroll: {
        baseSalary: member.salary,
        deductions: 0,
        netPay: member.salary,
        month: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      },
    };
    setStaff((prev) => [...prev, newMember]);
    persistSql(async () => {
      const result = await sqlAddStaffMember({
        householdId: sqlHouseholdId!,
        name: member.name,
        role: member.role,
        department: member.department,
        phone: member.phone || null,
        salary: member.salary,
        shiftStart: member.shiftStart,
        shiftEnd: member.shiftEnd,
      });
      setStaff((prev) => prev.map((s) => (
        s.id === tempId ? { ...s, id: result.data.staffMember_insert.id } : s
      )));
    });
  }, [persistSql, sqlHouseholdId]);

  const addDeduction = useCallback((staffId: string, amount: number, _reason: string) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? {
              ...s,
              payroll: {
                ...s.payroll,
                deductions: s.payroll.deductions + amount,
                netPay: s.payroll.baseSalary - (s.payroll.deductions + amount),
              },
            }
          : s
      )
    );
  }, []);

  const updateStaffPhoto = useCallback((staffId: string, photoUrl: string) => {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, photo: photoUrl } : s)));
    persistSql(() => sqlUpdateStaffPhoto({ staffId, photoUrl }));
  }, [persistSql]);

  const updateTaskDueDate = useCallback((staffId: string, taskIndex: number, newDueDate: string) => {
    const taskId = staff.find((s) => s.id === staffId)?.assignments[taskIndex]?.id;
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? {
              ...s,
              assignments: s.assignments.map((t, i) =>
                i === taskIndex ? { ...t, dueDate: newDueDate } : t
              ),
            }
          : s
      )
    );
    if (taskId) {
      persistSql(() => sqlUpdateTaskDueDate({
        taskId,
        dueAt: `${newDueDate}T00:00:00.000Z`,
      }));
    }
  }, [persistSql, staff]);

  const addAlert = useCallback((alert: Omit<Alert, "id" | "dismissed">) => {
    setAlerts((prev) => [{ ...alert, id: `a${Date.now()}`, dismissed: false }, ...prev]);
  }, []);

  const updateStaffTelegramId = useCallback((staffId: string, telegramChatId: string) => {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, telegramChatId } : s)));
    persistSql(() => sqlUpdateStaffTelegramId({ staffId, telegramChatId }));
  }, [persistSql]);

  const markAttendance = useCallback((staffId: string, type: string, detail: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
    const dateStr = `Today, ${timeStr}`;
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? { ...s, attendance: [{ date: dateStr, type, detail }, ...s.attendance] }
          : s
      )
    );
    persistSql(() => sqlRecordAttendanceEvent({
      householdId: sqlHouseholdId!,
      staffId,
      eventType: type,
      source: "app",
      detail,
    }));
  }, [persistSql, sqlHouseholdId]);

  const reassignTask = useCallback((fromStaffId: string, taskIndex: number, toStaffId: string) => {
    const taskId = staff.find((s) => s.id === fromStaffId)?.assignments[taskIndex]?.id;
    setStaff((prev) => {
      const fromStaff = prev.find((s) => s.id === fromStaffId);
      if (!fromStaff) return prev;
      const task = fromStaff.assignments[taskIndex];
      if (!task) return prev;
      return prev.map((s) => {
        if (s.id === fromStaffId) {
          return { ...s, assignments: s.assignments.filter((_, i) => i !== taskIndex) };
        }
        if (s.id === toStaffId) {
          return { ...s, assignments: [...s.assignments, { ...task, done: false }] };
        }
        return s;
      });
    });
    if (taskId) persistSql(() => sqlReassignTaskInstance({ taskId, assignedStaffId: toStaffId }));
  }, [persistSql, staff]);

  const extendTaskDeadlineByName = useCallback((staffId: string, taskName: string, days = 7) => {
    setStaff((prev) =>
      prev.map((s) => {
        if (s.id !== staffId) return s;
        return {
          ...s,
          assignments: s.assignments.map((t) => {
            if (t.task === taskName) {
              const base = t.dueDate ? new Date(t.dueDate) : new Date();
              base.setDate(base.getDate() + days);
              return { ...t, dueDate: base.toISOString().split("T")[0] };
            }
            return t;
          }),
        };
      })
    );
  }, []);

  const updatePunctualityScore = useCallback((staffId: string, delta: number) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? {
              ...s,
              punctualityScore: Math.max(0, Math.min(100, +(s.punctualityScore + delta).toFixed(1))),
            }
          : s
      )
    );
  }, []);

  const updateReliabilityScore = useCallback((staffId: string, delta: number) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? {
              ...s,
              reliabilityScore: Math.max(0, Math.min(100, +(s.reliabilityScore + delta).toFixed(1))),
            }
          : s
      )
    );
  }, []);

  // Midnight sweep: auto-checkout anyone still on duty + raise a Live Flag.
  // Uses a ref to read the latest staff snapshot without restarting the timer.
  const staffRef = useRef(staff);
  useEffect(() => {
    staffRef.current = staff;
  }, [staff]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const sweep = () => {
      const stillOnDuty = staffRef.current.filter(
        (s) => s.status === "on-duty" || s.status === "late"
      );
      if (stillOnDuty.length === 0) return;

      setStaff((prev) =>
        prev.map((s) =>
          s.status === "on-duty" || s.status === "late"
            ? {
                ...s,
                status: "off-duty" as StaffStatus,
                attendance: [
                  {
                    date: "End of day, 11:59 PM",
                    type: "auto-checkout",
                    detail: "Auto-checkout: did not tap out before end of day",
                  },
                  ...s.attendance,
                ],
              }
            : s
        )
      );

      setAlerts((prev) => [
        ...stillOnDuty.map((s, idx) => ({
          id: `auto-${Date.now()}-${idx}`,
          type: "attendance" as const,
          severity: "medium" as const,
          title: `${s.name} forgot to check out`,
          description: `${s.name} (${s.role}) was still on duty at midnight and has been auto-checked out for the day.`,
          staffName: s.name,
          staffId: s.id,
          time: "12:00 AM",
          dismissed: false,
          actions: ["Acknowledge", "Investigate"],
        })),
        ...prev,
      ]);
    };

    const schedule = () => {
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 0, 0);
      timeoutId = setTimeout(() => {
        sweep();
        schedule();
      }, nextMidnight.getTime() - now.getTime());
    };

    schedule();
    return () => clearTimeout(timeoutId);
  }, []);

  if (isFirebaseConfigured && (!hasLoadedRemoteState || !hasBootstrappedSql)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="glass-card rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-card">
          <div className="mx-auto h-12 w-12 rounded-2xl border border-border/40 bg-surface-low flex items-center justify-center">
            <div className="h-5 w-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
          <div className="space-y-1">
            <p className="headline-sm text-foreground">Syncing your household</p>
            <p className="text-sm text-muted-foreground">
              We are loading your saved staff, tasks, expenses, and alerts before opening the dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        staff, expenses, alerts, ownerName, ownerLocation, isDarkMode, nfcEnabled,
        setOwnerName, setDarkMode, setNfcEnabled, toggleTask, updateStaffStatus, updateStaffRole, updateStaffShift,
        addExpense, editExpense, deleteExpense, dismissAlert, addTask, removeStaff, deleteTask,
        addStaff, addDeduction, updateStaffPhoto, updateTaskDueDate, addAlert, updateStaffTelegramId,
        markAttendance, reassignTask, extendTaskDeadlineByName,
        updatePunctualityScore, updateReliabilityScore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
};
