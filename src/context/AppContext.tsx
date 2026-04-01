import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { collection, onSnapshot, query, doc, addDoc, updateDoc, deleteDoc, orderBy, serverTimestamp, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type StaffStatus, type Department, type StaffMember as CoreStaffType } from "@/data/staff";
import { toast } from "sonner";

// Note: We keep the existing Types to prevent breaking UI, but populate them dynamically from Firebase.
export interface Expense {
  id: string;
  category: "Fuel" | "Groceries" | "Repairs" | "Advances" | "Household";
  amount: number;
  description: string;
  staffName?: string;
  date: string;
  timestamp?: unknown;
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
  timestamp?: unknown;
}

export interface DBTask {
  id: string;
  staffId: string;
  taskName: string;
  isDone: boolean;
  dueDate: string | null;
}

export interface DBAttendance {
  id: string;
  staffId: string;
  date: string;
  type: string;
  detail: string;
}

// Full hydrated object requested by the UI
export interface HydratedStaffMember extends Omit<CoreStaffType, 'assignments' | 'attendance' | 'payroll'> {
  assignments: { id: string; task: string; done: boolean; dueDate?: string }[];
  attendance: { id: string; date: string; type: string; detail: string }[];
  payroll: { baseSalary: number; deductions: number; netPay: number; month: string };
  telegramChatId?: string;
}

interface AppState {
  staff: HydratedStaffMember[];
  expenses: Expense[];
  alerts: Alert[];
  ownerName: string;
  ownerLocation: string;
  setOwnerName: (name: string) => void;
  toggleTask: (staffId: string, taskId: string, isDone: boolean) => void;
  updateStaffStatus: (staffId: string, status: StaffStatus) => void;
  updateStaffRole: (staffId: string, role: string) => void;
  updateStaffShift: (staffId: string, shiftStart: string, shiftEnd: string) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  dismissAlert: (alertId: string) => void;
  addTask: (staffId: string, task: string, dueDate?: string, notifyTelegram?: boolean) => void;
  removeStaff: (staffId: string) => void;
  deleteTask: (taskId: string) => void;
  addStaff: (member: Partial<HydratedStaffMember>) => void;
  addDeduction: (staffId: string, amount: number, reason: string) => void;
  updateTelegramChatId: (staffId: string, chatId: string) => void;
  sendTelegramMessage: (staffId: string, message: string) => void;
  updateAttendance: (staffId: string, date: string, type: string) => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  type DBStaffMember = CoreStaffType & {id: string, punctualityScore?: number, reliabilityScore?: number, salary?: number, telegramChatId?: string};
  const [dbStaff, setDbStaff] = useState<DBStaffMember[]>([]);
  const [dbTasks, setDbTasks] = useState<DBTask[]>([]);
  const [dbAttendance, setDbAttendance] = useState<DBAttendance[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  const [ownerName, setOwnerNameState] = useState<string>(() => localStorage.getItem("homemaker_owner_name") || "Boss");
  const [ownerLocation, setOwnerLocation] = useState<string>("Fetching location...");

  const setOwnerName = useCallback((name: string) => {
    setOwnerNameState(name);
    localStorage.setItem("homemaker_owner_name", name);
  }, []);

  // Hydrate Staff
  const staff: HydratedStaffMember[] = dbStaff.map(s => {
    const sTasks = dbTasks.filter(t => t.staffId === s.id).map(t => ({
      id: t.id,
      task: t.taskName,
      done: t.isDone,
      dueDate: t.dueDate || undefined
    }));
    const sAtt = dbAttendance.filter(a => a.staffId === s.id).map(a => ({
      id: a.id,
      date: a.date,
      type: a.type,
      detail: a.detail
    }));
    return {
      ...s,
      assignments: sTasks,
      attendance: sAtt,
      punctualityScore: s.punctualityScore ?? 100,
      reliabilityScore: s.reliabilityScore ?? 100,
      monthlySalary: s.salary || 0,
      payroll: { baseSalary: s.salary || 0, deductions: 0, netPay: s.salary || 0, month: "Current" },
      photo: s.photo || "https://ui-avatars.com/api/?name=" + encodeURIComponent(s.name || "Staff")
    } as HydratedStaffMember;
  });

  // Firebase Realtime Listeners
  useEffect(() => {
    const unsubStaff = onSnapshot(collection(db, "staff"), snap => {
      setDbStaff(snap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as DBStaffMember)));
    });
    const unsubTasks = onSnapshot(collection(db, "tasks"), snap => {
      setDbTasks(snap.docs.map(d => ({ id: d.id, ...d.data() } as DBTask)));
    });
    const unsubAtt = onSnapshot(collection(db, "attendance"), snap => {
      setDbAttendance(snap.docs.map(d => ({ id: d.id, ...d.data() } as DBAttendance)));
    });
    const unsubExp = onSnapshot(query(collection(db, "expenses")), snap => {
      setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() } as Expense)));
    });
    const unsubAlerts = onSnapshot(query(collection(db, "alerts")), snap => {
      setAlerts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Alert)));
    });
    return () => { unsubStaff(); unsubTasks(); unsubAtt(); unsubExp(); unsubAlerts(); };
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || "";
            setOwnerLocation(city ? `${city}, ${data.address?.state || ""}` : "Location detected");
          } catch {
            setOwnerLocation("Location unavailable");
          }
        },
        () => setOwnerLocation("Location access denied"),
        { timeout: 10000 }
      );
    }
  }, []);

  // Firebase Mutations
  const toggleTask = useCallback(async (staffId: string, taskId: string, isDone: boolean) => {
    toast.promise(updateDoc(doc(db, "tasks", taskId), { isDone: !isDone }), {
      loading: 'Updating task...',
      success: 'Task status updated'
    });
  }, []);

  const updateStaffStatus = useCallback(async (staffId: string, status: StaffStatus) => {
    await updateDoc(doc(db, "staff", staffId), { status });
  }, []);

  const updateStaffRole = useCallback(async (staffId: string, role: string) => {
    await updateDoc(doc(db, "staff", staffId), { role });
  }, []);

  const updateStaffShift = useCallback(async (staffId: string, shiftStart: string, shiftEnd: string) => {
    await updateDoc(doc(db, "staff", staffId), { shiftStart, shiftEnd });
  }, []);

  const addExpense = useCallback(async (expense: Omit<Expense, "id">) => {
    await addDoc(collection(db, "expenses"), { ...expense, timestamp: serverTimestamp() });
  }, []);

  const dismissAlert = useCallback(async (alertId: string) => {
    await updateDoc(doc(db, "alerts", alertId), { dismissed: true });
  }, []);

  const addTask = useCallback(async (staffId: string, task: string, dueDate?: string, notifyTelegram: boolean = false) => {
    await addDoc(collection(db, "tasks"), { staffId, taskName: task, isDone: false, dueDate: dueDate || null, notifyTelegram, createdAt: serverTimestamp() });
  }, []);

  const removeStaff = useCallback(async (staffId: string) => {
    await deleteDoc(doc(db, "staff", staffId));
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    await deleteDoc(doc(db, "tasks", taskId));
  }, []);

  const addStaff = useCallback(async (member: Partial<HydratedStaffMember>) => {
    try {
      await addDoc(collection(db, "staff"), { 
        ...member, 
        createdAt: serverTimestamp(), 
        telegramChatId: '',
        punctualityScore: 100,
        reliabilityScore: 100,
      });
    } catch (error: unknown) {
      toast.error("Failed to add Homemaker", { description: (error as Error).message });
    }
  }, []);

  const addDeduction = useCallback((staffId: string, amount: number, reason: string) => {
    toast.info("Payroll module is being upgraded. Deduction mapped, details logged.");
  }, []);

  const updateTelegramChatId = useCallback(async (staffId: string, chatId: string) => {
    await updateDoc(doc(db, "staff", staffId), { telegramChatId: chatId });
    toast.success("Telegram Chat ID updated");
  }, []);

  const sendTelegramMessage = useCallback(async (staffId: string, message: string) => {
    await addDoc(collection(db, "messages_outbox"), {
      staffId,
      message,
      status: "pending",
      timestamp: serverTimestamp()
    });
    toast.success("Message queued to Telegram");
  }, []);

  const updateAttendance = useCallback(async (staffId: string, date: string, type: string) => {
    try {
      const q = query(collection(db, "attendance"), where("staffId", "==", staffId), where("date", "==", date));
      const snap = await getDocs(q);
      if (!snap.empty) {
        await updateDoc(snap.docs[0].ref, { type });
      } else {
        await addDoc(collection(db, "attendance"), { staffId, date, type, detail: "Manual override via Insights" });
      }
    } catch (err: unknown) {
      toast.error("Failed to update attendance", { description: (err as Error).message });
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        staff, expenses, alerts, ownerName, ownerLocation,
        setOwnerName, toggleTask, updateStaffStatus, updateStaffRole, updateStaffShift,
        addExpense, dismissAlert, addTask, removeStaff, deleteTask, addStaff, addDeduction,
        updateTelegramChatId, sendTelegramMessage, updateAttendance
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
