import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { staffMembers as initialStaff, type StaffMember, type StaffStatus } from "@/data/staff";

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
  setOwnerName: (name: string) => void;
  setDarkMode: (v: boolean) => void;
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
    staffName: "Sienna Brooks", time: "9:10 AM", dismissed: false,
    actions: ["Mark Leave", "Mark Late", "Ignore"],
  },
  {
    id: "a2", type: "attendance", severity: "medium",
    title: "Chauffeur arrived 25 minutes late",
    description: "Marcus Thorne (Chauffeur) checked in at 08:25 AM. Shift start was 08:00 AM, exceeding the 15-minute grace buffer.",
    staffName: "Marcus Thorne", time: "8:25 AM", dismissed: false,
    actions: ["Apply Late Penalty", "Waive", "Note"],
  },
  {
    id: "a3", type: "task", severity: "medium",
    title: "Task missed: Silver polishing — Elena Moretti",
    description: "Supervise silver polishing was assigned to Elena Moretti (Housekeeper) for morning shift and hasn't been completed.",
    staffName: "Elena Moretti", time: "11:30 AM", dismissed: false,
    actions: ["Reassign", "Extend Deadline", "Dismiss"],
  },
  {
    id: "a4", type: "expense", severity: "low",
    title: "Fuel expenses up 18% this month",
    description: "Chauffeur fuel expenses (Marcus Thorne) have increased from ₹1,800 last month to ₹2,150. Review recommended.",
    staffName: "Marcus Thorne", time: "Weekly Insight", dismissed: false,
    actions: ["Review Details", "Acknowledge"],
  },
  {
    id: "a5", type: "security", severity: "high",
    title: "Perimeter sensor triggered - East Wall",
    description: "Motion sensor at the east boundary wall triggered at 2:45 AM. No staff check-in recorded in that zone.",
    time: "2:45 AM", dismissed: false,
    actions: ["Dispatch Security", "Review CCTV", "False Alarm"],
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [ownerName, setOwnerNameState] = useState<string>(() => {
    return localStorage.getItem("homemaker_owner_name") || "Boss";
  });
  const [ownerLocation, setOwnerLocation] = useState<string>("Fetching location...");
  const [isDarkMode, setIsDarkModeState] = useState<boolean>(() => {
    return localStorage.getItem("homemaker_dark_mode") === "true";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const setOwnerName = useCallback((name: string) => {
    setOwnerNameState(name);
    localStorage.setItem("homemaker_owner_name", name);
  }, []);

  const setDarkMode = useCallback((v: boolean) => {
    setIsDarkModeState(v);
    localStorage.setItem("homemaker_dark_mode", String(v));
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
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? { ...s, assignments: s.assignments.map((t, i) => (i === taskIndex ? { ...t, done: !t.done } : t)) }
          : s
      )
    );
  }, []);

  const updateStaffStatus = useCallback((staffId: string, status: StaffStatus) => {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, status } : s)));
  }, []);

  const updateStaffRole = useCallback((staffId: string, role: string) => {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, role } : s)));
  }, []);

  const updateStaffShift = useCallback((staffId: string, shiftStart: string, shiftEnd: string) => {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, shiftStart, shiftEnd } : s)));
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, "id">) => {
    setExpenses((prev) => [{ ...expense, id: `e${Date.now()}` }, ...prev]);
  }, []);

  const editExpense = useCallback((id: string, updates: Partial<Omit<Expense, "id">>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, dismissed: true } : a)));
  }, []);

  const addTask = useCallback((staffId: string, task: string, dueDate?: string) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId ? { ...s, assignments: [...s.assignments, { task, done: false, dueDate }] } : s
      )
    );
  }, []);

  const removeStaff = useCallback((staffId: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== staffId));
  }, []);

  const deleteTask = useCallback((staffId: string, taskIndex: number) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? { ...s, assignments: s.assignments.filter((_, i) => i !== taskIndex) }
          : s
      )
    );
  }, []);

  const addStaff = useCallback((member: Omit<StaffMember, "id" | "assignments" | "attendance" | "payroll" | "reliabilityScore" | "skills" | "punctualityScore">) => {
    const newMember: StaffMember = {
      ...member,
      id: `s${Date.now()}`,
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
  }, []);

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
  }, []);

  const updateTaskDueDate = useCallback((staffId: string, taskIndex: number, newDueDate: string) => {
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
  }, []);

  const addAlert = useCallback((alert: Omit<Alert, "id" | "dismissed">) => {
    setAlerts((prev) => [{ ...alert, id: `a${Date.now()}`, dismissed: false }, ...prev]);
  }, []);

  const updateStaffTelegramId = useCallback((staffId: string, telegramChatId: string) => {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, telegramChatId } : s)));
  }, []);

  return (
    <AppContext.Provider
      value={{
        staff, expenses, alerts, ownerName, ownerLocation, isDarkMode,
        setOwnerName, setDarkMode, toggleTask, updateStaffStatus, updateStaffRole, updateStaffShift,
        addExpense, editExpense, deleteExpense, dismissAlert, addTask, removeStaff, deleteTask,
        addStaff, addDeduction, updateStaffPhoto, updateTaskDueDate, addAlert, updateStaffTelegramId,
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
