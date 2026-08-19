import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { staffMembers as initialStaff, type StaffMember, type StaffStatus } from "@/data/staff";
import {
  saveHouseholdState,
  subscribeToHouseholdState,
  type HouseholdStateSnapshot,
} from "@/lib/householdStore";
import { getCurrentAuthUser, isFirebaseConfigured } from "@/lib/firebase";
import { bootstrapSqlConnectHousehold } from "@/lib/sqlConnectHousehold";
import { createConfiguredSqlConnectHousehold } from "@/lib/sqlConnectHousehold";
import {
  addExpenseEntry as sqlAddExpenseEntry,
  addStaffMember as sqlAddStaffMember,
  addTaskInstance as sqlAddTaskInstance,
  createAlert as sqlCreateAlert,
  createAttendanceCorrectionRequest as sqlCreateAttendanceCorrectionRequest,
  createInventoryItem as sqlCreateInventoryItem,
  deleteExpenseEntry as sqlDeleteExpenseEntry,
  deleteTaskInstance as sqlDeleteTaskInstance,
  dismissAlert as sqlDismissAlert,
  recordAttendanceEvent as sqlRecordAttendanceEvent,
  recordNfcTap as sqlRecordNfcTap,
  recordPayrollDeduction as sqlRecordPayrollDeduction,
  reassignTaskInstance as sqlReassignTaskInstance,
  registerNfcTag as sqlRegisterNfcTag,
  removeStaffMember as sqlRemoveStaffMember,
  createStaffCashRequest as sqlCreateStaffCashRequest,
  markStaffCashRequestPurchased as sqlMarkStaffCashRequestPurchased,
  reviewAttendanceCorrectionRequest as sqlReviewAttendanceCorrectionRequest,
  reviewStaffCashRequest as sqlReviewStaffCashRequest,
  setTaskCompletion as sqlSetTaskCompletion,
  updateExpenseEntry as sqlUpdateExpenseEntry,
  updateStaffPhoto as sqlUpdateStaffPhoto,
  updateStaffRole as sqlUpdateStaffRole,
  updateStaffShift as sqlUpdateStaffShift,
  updateStaffStatus as sqlUpdateStaffStatus,
  updateStaffTelegramId as sqlUpdateStaffTelegramId,
  updateTaskDueDate as sqlUpdateTaskDueDate,
} from "@homemaker/dataconnect";

export type AppLanguage = "en" | "hi" | "te" | "kn" | "ml";
export type AppRole = "owner" | "staff";

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

export type StaffCashRequestStatus = "pending" | "approved" | "rejected" | "purchased";

export interface StaffCashRequest {
  id: string;
  category: Expense["category"] | string;
  amountRequested: number;
  amountApproved?: number;
  reason: string;
  status: StaffCashRequestStatus;
  neededBy?: string;
  requestedAt: string;
  approvedAt?: string;
  purchasedAt?: string;
  receiptUrl?: string;
  notes?: string;
  staffId?: string;
  staffName?: string;
  staffRole?: string;
  inventoryItemId?: string;
  inventoryItemName?: string;
  linkedExpenseId?: string;
}

export type AttendanceCorrectionStatus = "pending" | "approved" | "rejected";

export interface AttendanceCorrectionRequest {
  id: string;
  staffId: string;
  staffName: string;
  staffRole?: string;
  date: string;
  currentStatus?: string;
  requestedStatus: "present" | "late" | "absent" | "off-duty";
  reason: string;
  status: AttendanceCorrectionStatus;
  requestedAt: string;
  reviewedAt?: string;
  notes?: string;
}

export interface HouseholdProfile {
  name: string;
  ownerName: string;
  ownerPhone?: string;
  addressLabel?: string;
  timezone: string;
}

export interface HomemateProfile {
  id: string;
  name: string;
  relationLabel: string;
  phone?: string;
  notes?: string;
}

export interface RoomZoneProfile {
  id: string;
  name: string;
  floorLabel?: string;
  notes?: string;
}

export interface InventorySetupItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentQuantity: number;
  minimumQuantity?: number;
  roomId?: string;
}

export interface HouseholdSetupPayload {
  householdName: string;
  ownerName: string;
  ownerPhone?: string;
  addressLabel?: string;
  timezone: string;
  homemates: HomemateProfile[];
  staff: StaffMember[];
  rooms: RoomZoneProfile[];
  inventoryItems: InventorySetupItem[];
  payroll: {
    deductionPolicy?: string;
  };
}

interface AppState {
  staff: StaffMember[];
  expenses: Expense[];
  cashRequests: StaffCashRequest[];
  attendanceRequests: AttendanceCorrectionRequest[];
  alerts: Alert[];
  setupComplete: boolean;
  householdProfile: HouseholdProfile | null;
  homemates: HomemateProfile[];
  rooms: RoomZoneProfile[];
  inventoryItems: InventorySetupItem[];
  ownerName: string;
  ownerLocation: string;
  language: AppLanguage;
  appRole: AppRole;
  activeStaffId: string | null;
  isDarkMode: boolean;
  nfcEnabled: boolean;
  isDemoMode: boolean;
  setOwnerName: (name: string) => void;
  setLanguage: (language: AppLanguage) => void;
  setAppRole: (role: AppRole) => void;
  setActiveStaffId: (staffId: string | null) => void;
  setDarkMode: (v: boolean) => void;
  setNfcEnabled: (v: boolean) => void;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  toggleTask: (staffId: string, taskIndex: number) => void;
  updateStaffStatus: (staffId: string, status: StaffStatus) => void;
  updateStaffRole: (staffId: string, role: string) => void;
  updateStaffShift: (staffId: string, shiftStart: string, shiftEnd: string) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  createCashRequest: (request: Omit<StaffCashRequest, "id" | "status" | "requestedAt">) => void;
  reviewCashRequest: (requestId: string, status: "approved" | "rejected", amountApproved?: number, notes?: string) => void;
  markCashRequestPurchased: (requestId: string, linkedExpenseId?: string, receiptUrl?: string, notes?: string) => void;
  createAttendanceCorrectionRequest: (request: Omit<AttendanceCorrectionRequest, "id" | "status" | "requestedAt">) => void;
  reviewAttendanceCorrectionRequest: (requestId: string, status: "approved" | "rejected", notes?: string) => void;
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
  addInventoryItem: (item: Omit<InventorySetupItem, "id">) => void;
  updateInventoryItem: (itemId: string, updates: Partial<Omit<InventorySetupItem, "id">>) => void;
  deleteInventoryItem: (itemId: string) => void;
  markAttendance: (staffId: string, type: string, detail: string) => void;
  registerStaffNfcTag: (staffId: string, label?: string) => Promise<string | null>;
  recordNfcTap: (staffId: string, actionType: string, deviceLabel?: string) => void;
  reassignTask: (fromStaffId: string, taskIndex: number, toStaffId: string) => void;
  extendTaskDeadlineByName: (staffId: string, taskName: string, days?: number) => void;
  updatePunctualityScore: (staffId: string, delta: number) => void;
  updateReliabilityScore: (staffId: string, delta: number) => void;
  completeHouseholdSetup: (setup: HouseholdSetupPayload) => Promise<void>;
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

const initialCashRequests: StaffCashRequest[] = [
  {
    id: "cr1",
    category: "Groceries",
    amountRequested: 2500,
    reason: "Weekly vegetables, fruits, and dairy restock",
    status: "pending",
    neededBy: "Tomorrow",
    requestedAt: "Today",
    staffId: "4",
    staffName: "Sienna Brooks",
    staffRole: "Cook",
    inventoryItemName: "Vegetables",
  },
  {
    id: "cr2",
    category: "Fuel",
    amountRequested: 1800,
    amountApproved: 1500,
    reason: "Fuel for school pickup and airport run",
    status: "approved",
    neededBy: "Today",
    requestedAt: "Yesterday",
    approvedAt: "Today",
    staffId: "2",
    staffName: "Marcus Thorne",
    staffRole: "Chauffeur",
  },
];

const initialAttendanceRequests: AttendanceCorrectionRequest[] = [
  {
    id: "ar1",
    staffId: "2",
    staffName: "Marcus Thorne",
    staffRole: "Chauffeur",
    date: new Date().toISOString().split("T")[0],
    currentStatus: "late",
    requestedStatus: "present",
    reason: "Reached the gate at 8:00 AM but NFC tap did not record because the phone battery was low.",
    status: "pending",
    requestedAt: "Today",
  },
];

const onboardingDoneKey = "homemaker_onboarding_done";
const demoModeKey = "homemaker_demo_mode";
const demoBackupKey = "homemaker_demo_backup";
const absencePayrollMarker = "Auto payroll absence deduction";

function attendanceDateKey(value: string): string {
  return value.split(",")[0].trim();
}

function dailyAbsenceDeduction(member: StaffMember): number {
  return Math.ceil(member.payroll.baseSalary / 30);
}

function hasAutoAbsenceDeduction(member: StaffMember, dateKey: string): boolean {
  return member.attendance.some((entry) => (
    attendanceDateKey(entry.date) === dateKey && entry.detail.includes(absencePayrollMarker)
  ));
}

function shouldDeductForAttendance(type: string): boolean {
  return type === "leave" || type === "absent";
}

function hasLocalOnboardingCompletion(): boolean {
  return localStorage.getItem(onboardingDoneKey) === "true";
}

async function rememberOnboardingCompletion(): Promise<void> {
  localStorage.setItem(onboardingDoneKey, "true");
  const user = await getCurrentAuthUser();
  if (user?.uid) {
    localStorage.setItem(`${onboardingDoneKey}_${user.uid}`, "true");
  }
}

function cloneStaff(members: StaffMember[]): StaffMember[] {
  return members.map((member) => ({
    ...member,
    skills: [...member.skills],
    assignments: member.assignments.map((assignment) => ({ ...assignment })),
    attendance: member.attendance.map((entry) => ({ ...entry })),
    payroll: { ...member.payroll },
  }));
}

function getDemoHouseholdState(ownerName: string): HouseholdStateSnapshot {
  const savedLanguage = localStorage.getItem("homemaker_language");
  const savedRole = localStorage.getItem("homemaker_app_role");
  const savedStaffId = localStorage.getItem("homemaker_active_staff_id");
  const language: AppLanguage = savedLanguage === "hi" || savedLanguage === "te" || savedLanguage === "kn" || savedLanguage === "ml"
    ? savedLanguage
    : "en";
  const appRole: AppRole = savedRole === "staff" ? "staff" : "owner";

  return {
    staff: cloneStaff(initialStaff),
    expenses: initialExpenses.map((expense) => ({ ...expense })),
    cashRequests: initialCashRequests.map((request) => ({ ...request })),
    attendanceRequests: initialAttendanceRequests.map((request) => ({ ...request })),
    alerts: initialAlerts.map((alert) => ({ ...alert, actions: [...alert.actions] })),
    setupComplete: true,
    householdProfile: {
      name: "Homemaker Demo Residence",
      ownerName,
      addressLabel: "Secunderabad, Telangana",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
    },
    homemates: [
      { id: "demo-mate-1", name: "Aarav", relationLabel: "Son", phone: "+91 90000 00001" },
      { id: "demo-mate-2", name: "Meera", relationLabel: "Parent", phone: "+91 90000 00002" },
    ],
    rooms: [
      { id: "demo-room-1", name: "Kitchen", floorLabel: "Ground floor" },
      { id: "demo-room-2", name: "Living Room", floorLabel: "Ground floor" },
      { id: "demo-room-3", name: "Garden", floorLabel: "Outdoor" },
      { id: "demo-room-4", name: "Kids Room", floorLabel: "First floor" },
    ],
    inventoryItems: [
      { id: "demo-item-1", name: "Rice", category: "Groceries", unit: "kg", currentQuantity: 18, minimumQuantity: 5, roomId: "demo-room-1" },
      { id: "demo-item-2", name: "Tomatoes", category: "Vegetables", unit: "kg", currentQuantity: 2, minimumQuantity: 3, roomId: "demo-room-1" },
      { id: "demo-item-3", name: "Cleaning liquid", category: "Household", unit: "bottle", currentQuantity: 4, minimumQuantity: 2, roomId: "demo-room-2" },
      { id: "demo-item-4", name: "Dog food", category: "Pet supplies", unit: "bag", currentQuantity: 1, minimumQuantity: 1 },
    ],
    ownerName,
    language,
    appRole,
    activeStaffId: appRole === "staff" ? savedStaffId || initialStaff[0]?.id || null : savedStaffId,
    isDarkMode: false,
    nfcEnabled: false,
  };
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [staff, setStaff] = useState<StaffMember[]>(() => isFirebaseConfigured ? [] : initialStaff);
  const [expenses, setExpenses] = useState<Expense[]>(() => isFirebaseConfigured ? [] : initialExpenses);
  const [cashRequests, setCashRequests] = useState<StaffCashRequest[]>(() => isFirebaseConfigured ? [] : initialCashRequests);
  const [attendanceRequests, setAttendanceRequests] = useState<AttendanceCorrectionRequest[]>(() => isFirebaseConfigured ? [] : initialAttendanceRequests);
  const [alerts, setAlerts] = useState<Alert[]>(() => isFirebaseConfigured ? [] : initialAlerts);
  const [setupComplete, setSetupComplete] = useState(() => !isFirebaseConfigured);
  const [householdProfile, setHouseholdProfile] = useState<HouseholdProfile | null>(null);
  const [homemates, setHomemates] = useState<HomemateProfile[]>([]);
  const [rooms, setRooms] = useState<RoomZoneProfile[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventorySetupItem[]>([]);
  const [sqlHouseholdId, setSqlHouseholdId] = useState<string | null>(null);
  const [hasLoadedRemoteState, setHasLoadedRemoteState] = useState(false);
  const [hasBootstrappedSql, setHasBootstrappedSql] = useState(false);
  const isApplyingRemoteStateRef = useRef(false);
  const lastSavedStateRef = useRef("");
  const [ownerName, setOwnerNameState] = useState<string>(() => {
    return localStorage.getItem("homemaker_owner_name") || "Boss";
  });
  const [ownerLocation, setOwnerLocation] = useState<string>("Fetching location...");
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem("homemaker_language");
    return saved === "hi" || saved === "te" || saved === "kn" || saved === "ml" ? saved : "en";
  });
  const [appRole, setAppRoleState] = useState<AppRole>(() => {
    return localStorage.getItem("homemaker_app_role") === "staff" ? "staff" : "owner";
  });
  const [activeStaffId, setActiveStaffIdState] = useState<string | null>(() => {
    return localStorage.getItem("homemaker_active_staff_id") || null;
  });
  const [isDarkMode, setIsDarkModeState] = useState<boolean>(() => {
    return localStorage.getItem("homemaker_dark_mode") === "true";
  });
  const [nfcEnabled, setNfcEnabledState] = useState<boolean>(() => {
    return localStorage.getItem("homemaker_nfc_enabled") === "true";
  });
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem(demoModeKey) === "true";
  });

  const currentHouseholdState: HouseholdStateSnapshot = {
    staff,
    expenses,
    cashRequests,
    attendanceRequests,
    alerts,
    setupComplete,
    householdProfile,
    homemates,
    rooms,
    inventoryItems,
    ownerName,
    language,
    appRole,
    activeStaffId,
    isDarkMode,
    nfcEnabled,
  };
  const currentHouseholdStateJson = JSON.stringify(currentHouseholdState);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.setAttribute("data-app-language", language);
  }, [language]);

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
        if (localStorage.getItem(demoModeKey) === "true") {
          remoteStateSettled = true;
          setHasLoadedRemoteState(true);
          return;
        }
        const locallyCompletedSetup = hasLocalOnboardingCompletion();
        const nextSetupComplete = !!state.setupComplete || locallyCompletedSetup;
        remoteStateSettled = true;
        isApplyingRemoteStateRef.current = true;
        const nextState = { ...state, setupComplete: nextSetupComplete };
        lastSavedStateRef.current = JSON.stringify(nextState);
        setStaff(state.staff);
        setExpenses(state.expenses);
        setCashRequests(state.cashRequests || []);
        setAttendanceRequests(state.attendanceRequests || []);
        setAlerts(state.alerts);
        setSetupComplete(nextSetupComplete);
        setHouseholdProfile(state.householdProfile || null);
        setHomemates(state.homemates || []);
        setRooms(state.rooms || []);
        setInventoryItems(state.inventoryItems || []);
        setOwnerNameState(state.ownerName);
        setLanguageState(state.language || "en");
        setAppRoleState(state.appRole || "owner");
        setActiveStaffIdState(state.activeStaffId || null);
        setIsDarkModeState(state.isDarkMode);
        setNfcEnabledState(state.nfcEnabled);
        localStorage.setItem("homemaker_owner_name", state.ownerName);
        localStorage.setItem("homemaker_language", state.language || "en");
        localStorage.setItem("homemaker_app_role", state.appRole || "owner");
        if (state.activeStaffId) localStorage.setItem("homemaker_active_staff_id", state.activeStaffId);
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
    if (isFirebaseConfigured && !hasBootstrappedSql) return;
    if (isDemoMode) return;
    if (lastSavedStateRef.current === currentHouseholdStateJson) return;

    const timeout = setTimeout(() => {
      lastSavedStateRef.current = currentHouseholdStateJson;
      saveHouseholdState(currentHouseholdState).catch((error) => {
        console.warn("Unable to save Firebase household state", error);
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [currentHouseholdStateJson, hasBootstrappedSql, hasLoadedRemoteState, isDemoMode]);

  useEffect(() => {
    if (!hasLoadedRemoteState) return;
    if (isDemoMode) {
      setHasBootstrappedSql(true);
      return;
    }

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
        if (cancelled) return;
        if (!snapshot) {
          if (hasLocalOnboardingCompletion()) {
            setSetupComplete(true);
          }
          return;
        }
        isApplyingRemoteStateRef.current = true;
        setStaff(snapshot.staff);
        setExpenses(snapshot.expenses);
        setCashRequests(snapshot.cashRequests);
        setAttendanceRequests(snapshot.attendanceRequests || []);
        setAlerts(snapshot.alerts);
        setOwnerNameState(snapshot.ownerName);
        setSqlHouseholdId(snapshot.householdId);
        setSetupComplete(true);
        rememberOnboardingCompletion().catch(() => undefined);
        setHouseholdProfile(snapshot.householdProfile);
        setHomemates(snapshot.homemates);
        setRooms(snapshot.rooms);
        setInventoryItems(snapshot.inventoryItems);
        queueMicrotask(() => {
          isApplyingRemoteStateRef.current = false;
        });
      })
      .catch((error) => {
        console.warn("Firebase SQL Connect household bootstrap unavailable", error);
        if (!cancelled && hasLocalOnboardingCompletion()) {
          setSetupComplete(true);
        }
      })
      .finally(() => {
        clearTimeout(sqlBootstrapTimeout);
        if (!cancelled) setHasBootstrappedSql(true);
      });

    return () => {
      cancelled = true;
      clearTimeout(sqlBootstrapTimeout);
    };
  }, [hasLoadedRemoteState, isDemoMode]);

  const persistSql = useCallback((operation: () => Promise<unknown>) => {
    if (isDemoMode) return;
    if (!sqlHouseholdId) return;
    operation().catch((error) => {
      console.warn("SQL Connect persistence failed", error);
    });
  }, [isDemoMode, sqlHouseholdId]);

  const getNfcTagStorageKey = useCallback((staffId: string) => `homemaker_nfc_tag_id_${staffId}`, []);

  const setOwnerName = useCallback((name: string) => {
    setOwnerNameState(name);
    localStorage.setItem("homemaker_owner_name", name);
  }, []);

  const setLanguage = useCallback((nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
    localStorage.setItem("homemaker_language", nextLanguage);
  }, []);

  const setAppRole = useCallback((role: AppRole) => {
    setAppRoleState(role);
    localStorage.setItem("homemaker_app_role", role);
  }, []);

  const setActiveStaffId = useCallback((staffId: string | null) => {
    setActiveStaffIdState(staffId);
    if (staffId) localStorage.setItem("homemaker_active_staff_id", staffId);
    else localStorage.removeItem("homemaker_active_staff_id");
  }, []);

  useEffect(() => {
    if (appRole !== "staff") return;
    if (activeStaffId && staff.some((member) => member.id === activeStaffId)) return;
    const firstStaffId = staff[0]?.id || null;
    if (firstStaffId) setActiveStaffId(firstStaffId);
  }, [activeStaffId, appRole, setActiveStaffId, staff]);

  const setDarkMode = useCallback((v: boolean) => {
    setIsDarkModeState(v);
    localStorage.setItem("homemaker_dark_mode", String(v));
  }, []);

  const setNfcEnabled = useCallback((v: boolean) => {
    setNfcEnabledState(v);
    localStorage.setItem("homemaker_nfc_enabled", String(v));
  }, []);

  const applyHouseholdSnapshot = useCallback((snapshot: HouseholdStateSnapshot) => {
    isApplyingRemoteStateRef.current = true;
    setStaff(cloneStaff(snapshot.staff));
    setExpenses(snapshot.expenses.map((expense) => ({ ...expense })));
    setCashRequests((snapshot.cashRequests || []).map((request) => ({ ...request })));
    setAttendanceRequests((snapshot.attendanceRequests || []).map((request) => ({ ...request })));
    setAlerts(snapshot.alerts.map((alert) => ({ ...alert, actions: [...alert.actions] })));
    setSetupComplete(!!snapshot.setupComplete);
    setHouseholdProfile(snapshot.householdProfile || null);
    setHomemates(snapshot.homemates || []);
    setRooms(snapshot.rooms || []);
    setInventoryItems(snapshot.inventoryItems || []);
    setOwnerNameState(snapshot.ownerName || "Boss");
    setLanguageState(snapshot.language || "en");
    setAppRoleState(snapshot.appRole || "owner");
    setActiveStaffIdState(snapshot.activeStaffId || null);
    setIsDarkModeState(!!snapshot.isDarkMode);
    setNfcEnabledState(!!snapshot.nfcEnabled);
    lastSavedStateRef.current = JSON.stringify(snapshot);
    queueMicrotask(() => {
      isApplyingRemoteStateRef.current = false;
    });
  }, []);

  const enableDemoMode = useCallback(() => {
    const liveSnapshot: HouseholdStateSnapshot = {
      staff,
      expenses,
      cashRequests,
      attendanceRequests,
      alerts,
      setupComplete,
      householdProfile,
      homemates,
      rooms,
      inventoryItems,
      ownerName,
      language,
      appRole,
      activeStaffId,
      isDarkMode,
      nfcEnabled,
    };
    localStorage.setItem(demoBackupKey, JSON.stringify(liveSnapshot));
    localStorage.setItem(demoModeKey, "true");
    setIsDemoMode(true);
    setSqlHouseholdId(null);
    applyHouseholdSnapshot(getDemoHouseholdState(ownerName === "Boss" ? "Demo Owner" : ownerName));
  }, [
    activeStaffId,
    alerts,
    appRole,
    applyHouseholdSnapshot,
    cashRequests,
    attendanceRequests,
    expenses,
    homemates,
    householdProfile,
    inventoryItems,
    isDarkMode,
    language,
    nfcEnabled,
    ownerName,
    rooms,
    setupComplete,
    staff,
  ]);

  const disableDemoMode = useCallback(() => {
    const backupJson = localStorage.getItem(demoBackupKey);
    localStorage.removeItem(demoModeKey);
    localStorage.removeItem(demoBackupKey);
    setIsDemoMode(false);

    if (backupJson) {
      try {
        applyHouseholdSnapshot(JSON.parse(backupJson) as HouseholdStateSnapshot);
        setHasLoadedRemoteState(false);
        setHasBootstrappedSql(false);
        return;
      } catch {
        // Fall through to a full reload when the backup is unavailable or invalid.
      }
    }

    window.location.reload();
  }, [applyHouseholdSnapshot]);

  useEffect(() => {
    if (!isDemoMode) return;
    applyHouseholdSnapshot(getDemoHouseholdState(ownerName === "Boss" ? "Demo Owner" : ownerName));
    setHasLoadedRemoteState(true);
    setHasBootstrappedSql(true);
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

  const createCashRequest = useCallback((request: Omit<StaffCashRequest, "id" | "status" | "requestedAt">) => {
    const tempId = `cr${Date.now()}`;
    const requestedAt = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const nextRequest: StaffCashRequest = {
      ...request,
      id: tempId,
      status: "pending",
      requestedAt,
    };
    setCashRequests((prev) => [nextRequest, ...prev]);
    persistSql(async () => {
      const result = await sqlCreateStaffCashRequest({
        householdId: sqlHouseholdId!,
        staffId: request.staffId || null,
        inventoryItemId: request.inventoryItemId || null,
        category: request.category,
        amountRequested: request.amountRequested,
        reason: request.reason,
        neededBy: request.neededBy ? `${request.neededBy}T00:00:00.000Z` : null,
        notes: request.notes || null,
      });
      setCashRequests((prev) => prev.map((item) => (
        item.id === tempId ? { ...item, id: result.data.staffCashRequest_insert.id } : item
      )));
    });
  }, [persistSql, sqlHouseholdId]);

  const reviewCashRequest = useCallback((
    requestId: string,
    status: "approved" | "rejected",
    amountApproved?: number,
    notes?: string
  ) => {
    const reviewedAt = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    setCashRequests((prev) => prev.map((request) => (
      request.id === requestId
        ? { ...request, status, amountApproved, notes: notes || request.notes, approvedAt: reviewedAt }
        : request
    )));
    persistSql(() => sqlReviewStaffCashRequest({
      requestId,
      status,
      amountApproved: amountApproved ?? null,
      notes: notes || null,
    }));
  }, [persistSql]);

  const markCashRequestPurchased = useCallback((
    requestId: string,
    linkedExpenseId?: string,
    receiptUrl?: string,
    notes?: string
  ) => {
    const purchasedAt = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    setCashRequests((prev) => prev.map((request) => (
      request.id === requestId
        ? { ...request, status: "purchased", linkedExpenseId, receiptUrl, notes: notes || request.notes, purchasedAt }
        : request
    )));
    persistSql(() => sqlMarkStaffCashRequestPurchased({
      requestId,
      linkedExpenseId: linkedExpenseId || null,
      receiptUrl: receiptUrl || null,
      notes: notes || null,
    }));
  }, [persistSql]);

  const createAttendanceCorrectionRequest = useCallback((
    request: Omit<AttendanceCorrectionRequest, "id" | "status" | "requestedAt">
  ) => {
    const tempId = `ar${Date.now()}`;
    const requestedAt = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const nextRequest: AttendanceCorrectionRequest = {
      ...request,
      id: tempId,
      status: "pending",
      requestedAt,
    };
    setAttendanceRequests((prev) => [nextRequest, ...prev]);
    persistSql(async () => {
      const result = await sqlCreateAttendanceCorrectionRequest({
        householdId: sqlHouseholdId!,
        staffId: request.staffId,
        currentStatus: request.currentStatus || null,
        requestedStatus: request.requestedStatus,
        requestedFor: request.date,
        reason: request.reason,
      });
      setAttendanceRequests((prev) => prev.map((item) => (
        item.id === tempId ? { ...item, id: result.data.attendanceCorrectionRequest_insert.id } : item
      )));
    });
  }, [persistSql, sqlHouseholdId]);

  const reviewAttendanceCorrectionRequest = useCallback((
    requestId: string,
    status: "approved" | "rejected",
    notes?: string
  ) => {
    const request = attendanceRequests.find((item) => item.id === requestId);
    const reviewedAt = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    setAttendanceRequests((prev) => prev.map((item) => (
      item.id === requestId ? { ...item, status, reviewedAt, notes: notes || item.notes } : item
    )));
    persistSql(() => sqlReviewAttendanceCorrectionRequest({
      requestId,
      status,
      notes: notes || null,
    }));

    if (!request || status !== "approved") return;

    const currentMember = staff.find((member) => member.id === request.staffId);
    const statusByRequest: Record<AttendanceCorrectionRequest["requestedStatus"], StaffStatus> = {
      present: "on-duty",
      late: "late",
      absent: "absent",
      "off-duty": "off-duty",
    };
    const eventTypeByRequest: Record<AttendanceCorrectionRequest["requestedStatus"], string> = {
      present: "check-in",
      late: "late",
      absent: "leave",
      "off-duty": "check-out",
    };
    const correctedStatus = statusByRequest[request.requestedStatus];
    const eventType = eventTypeByRequest[request.requestedStatus];
    const detail = `Attendance correction approved by owner. Requested: ${request.requestedStatus}. Reason: ${request.reason}`;
    const timeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
    const dateKey = attendanceDateKey(request.date);
    const requestedIsAbsent = request.requestedStatus === "absent";
    const currentWasAbsent = request.currentStatus?.toLowerCase().includes("absent") || false;
    const existingAutoDeduction = currentMember ? hasAutoAbsenceDeduction(currentMember, dateKey) : false;
    const dailyDeduction = currentMember ? dailyAbsenceDeduction(currentMember) : 0;
    const payrollAdjustment = currentMember && requestedIsAbsent && !existingAutoDeduction
      ? dailyDeduction
      : currentMember && currentWasAbsent && !requestedIsAbsent
      ? -Math.min(dailyDeduction, currentMember.payroll.deductions)
      : 0;
    const nextDeductions = currentMember
      ? Math.max(0, currentMember.payroll.deductions + payrollAdjustment)
      : 0;
    const payrollDetail = payrollAdjustment > 0
      ? `${absencePayrollMarker}: ₹${payrollAdjustment.toLocaleString("en-IN")} applied.`
      : payrollAdjustment < 0
      ? `${absencePayrollMarker} reversed: ₹${Math.abs(payrollAdjustment).toLocaleString("en-IN")} restored.`
      : "";
    const detailWithPayroll = payrollDetail ? `${detail}\n${payrollDetail}` : detail;

    setStaff((prev) => prev.map((member) => (
      member.id === request.staffId
        ? {
            ...member,
            status: correctedStatus,
            payroll: payrollAdjustment
              ? {
                  ...member.payroll,
                  deductions: Math.max(0, member.payroll.deductions + payrollAdjustment),
                  netPay: member.payroll.baseSalary - Math.max(0, member.payroll.deductions + payrollAdjustment),
                }
              : member.payroll,
            attendance: [
              {
                date: `${request.date}, ${timeStr}`,
                type: eventType,
                detail: detailWithPayroll,
              },
              ...member.attendance,
            ],
          }
        : member
    )));

    persistSql(() => sqlUpdateStaffStatus({ staffId: request.staffId, status: correctedStatus }));
    persistSql(() => sqlRecordAttendanceEvent({
      householdId: sqlHouseholdId!,
      staffId: request.staffId,
      eventType,
      source: "owner-correction",
      detail: detailWithPayroll,
    }));
    if (currentMember && payrollAdjustment) {
      persistSql(() => sqlRecordPayrollDeduction({
        householdId: sqlHouseholdId!,
        staffId: request.staffId,
        monthLabel: currentMember.payroll.month,
        baseSalary: currentMember.payroll.baseSalary,
        deductions: nextDeductions,
        advances: 0,
        netPay: currentMember.payroll.baseSalary - nextDeductions,
        status: "draft",
      }));
    }
  }, [attendanceRequests, persistSql, sqlHouseholdId, staff]);

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
    const current = staff.find((s) => s.id === staffId);
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
    if (current) {
      const deductions = current.payroll.deductions + amount;
      const netPay = current.payroll.baseSalary - deductions;
      persistSql(() => sqlRecordPayrollDeduction({
        householdId: sqlHouseholdId!,
        staffId,
        monthLabel: current.payroll.month,
        baseSalary: current.payroll.baseSalary,
        deductions,
        advances: 0,
        netPay,
        status: "draft",
      }));
    }
  }, [persistSql, sqlHouseholdId, staff]);

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
    const tempId = `a${Date.now()}`;
    setAlerts((prev) => [{ ...alert, id: tempId, dismissed: false }, ...prev]);
    persistSql(async () => {
      const result = await sqlCreateAlert({
        householdId: sqlHouseholdId!,
        staffId: alert.staffId || null,
        taskId: null,
        alertType: alert.type,
        severity: alert.severity,
        title: alert.title,
        description: alert.description,
      });
      setAlerts((prev) => prev.map((a) => (
        a.id === tempId ? { ...a, id: result.data.alert_insert.id } : a
      )));
    });
  }, [persistSql, sqlHouseholdId]);

  const updateStaffTelegramId = useCallback((staffId: string, telegramChatId: string) => {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, telegramChatId } : s)));
    persistSql(() => sqlUpdateStaffTelegramId({ staffId, telegramChatId }));
  }, [persistSql]);

  const addInventoryItem = useCallback((item: Omit<InventorySetupItem, "id">) => {
    const tempId = `item-${Date.now()}`;
    const nextItem: InventorySetupItem = {
      ...item,
      id: tempId,
      currentQuantity: Number(item.currentQuantity) || 0,
      minimumQuantity: item.minimumQuantity === undefined ? undefined : Number(item.minimumQuantity) || 0,
    };
    setInventoryItems((prev) => [...prev, nextItem]);
    persistSql(async () => {
      const result = await sqlCreateInventoryItem({
        householdId: sqlHouseholdId!,
        roomId: item.roomId || null,
        name: item.name,
        category: item.category,
        unit: item.unit,
        currentQuantity: nextItem.currentQuantity,
        minimumQuantity: nextItem.minimumQuantity ?? null,
      });
      setInventoryItems((prev) => prev.map((existing) => (
        existing.id === tempId ? { ...existing, id: result.data.inventoryItem_insert.id } : existing
      )));
    });
  }, [persistSql, sqlHouseholdId]);

  const updateInventoryItem = useCallback((itemId: string, updates: Partial<Omit<InventorySetupItem, "id">>) => {
    setInventoryItems((prev) => prev.map((item) => (
      item.id === itemId
        ? {
            ...item,
            ...updates,
            currentQuantity: updates.currentQuantity === undefined ? item.currentQuantity : Number(updates.currentQuantity) || 0,
            minimumQuantity: updates.minimumQuantity === undefined ? item.minimumQuantity : Number(updates.minimumQuantity) || 0,
          }
        : item
    )));
  }, []);

  const deleteInventoryItem = useCallback((itemId: string) => {
    setInventoryItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const markAttendance = useCallback((staffId: string, type: string, detail: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
    const todayKey = now.toISOString().split("T")[0];
    const dateStr = `${todayKey}, ${timeStr}`;
    const currentMember = staff.find((member) => member.id === staffId);
    const shouldApplyDeduction = currentMember
      ? shouldDeductForAttendance(type) && !hasAutoAbsenceDeduction(currentMember, todayKey)
      : false;
    const deductionAmount = currentMember && shouldApplyDeduction ? dailyAbsenceDeduction(currentMember) : 0;
    const detailWithPayroll = deductionAmount
      ? `${detail}\n${absencePayrollMarker}: ₹${deductionAmount.toLocaleString("en-IN")} applied.`
      : detail;
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? {
              ...s,
              payroll: deductionAmount
                ? {
                    ...s.payroll,
                    deductions: s.payroll.deductions + deductionAmount,
                    netPay: s.payroll.baseSalary - (s.payroll.deductions + deductionAmount),
                  }
                : s.payroll,
              attendance: [{ date: dateStr, type, detail: detailWithPayroll }, ...s.attendance],
            }
          : s
      )
    );
    persistSql(() => sqlRecordAttendanceEvent({
      householdId: sqlHouseholdId!,
      staffId,
      eventType: type,
      source: "app",
      detail: detailWithPayroll,
    }));
    if (currentMember && deductionAmount) {
      const deductions = currentMember.payroll.deductions + deductionAmount;
      persistSql(() => sqlRecordPayrollDeduction({
        householdId: sqlHouseholdId!,
        staffId,
        monthLabel: currentMember.payroll.month,
        baseSalary: currentMember.payroll.baseSalary,
        deductions,
        advances: 0,
        netPay: currentMember.payroll.baseSalary - deductions,
        status: "draft",
      }));
    }
  }, [persistSql, sqlHouseholdId, staff]);

  const registerStaffNfcTag = useCallback(async (staffId: string, label?: string): Promise<string | null> => {
    if (!sqlHouseholdId) return null;
    const member = staff.find((s) => s.id === staffId);
    if (!member) return null;

    try {
      const result = await sqlRegisterNfcTag({
        householdId: sqlHouseholdId,
        tagUid: `staff:${staffId}`,
        tagType: "staff-attendance",
        label: label || `${member.name} attendance tag`,
        roomId: null,
        staffId,
        taskTemplateId: null,
      });
      const tagId = result.data.nfcTag_insert.id;
      localStorage.setItem(getNfcTagStorageKey(staffId), tagId);
      return tagId;
    } catch (error) {
      console.warn("SQL Connect NFC tag registration failed", error);
      return null;
    }
  }, [getNfcTagStorageKey, sqlHouseholdId, staff]);

  const recordNfcTap = useCallback((staffId: string, actionType: string, deviceLabel?: string) => {
    if (!sqlHouseholdId) return;
    const tagId = localStorage.getItem(getNfcTagStorageKey(staffId));
    if (!tagId) return;

    persistSql(() => sqlRecordNfcTap({
      householdId: sqlHouseholdId,
      tagId,
      staffId,
      roomId: null,
      taskId: null,
      actionType,
      deviceLabel: deviceLabel || navigator.userAgent,
    }));
  }, [getNfcTagStorageKey, persistSql, sqlHouseholdId]);

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

  const completeHouseholdSetup = useCallback(async (setup: HouseholdSetupPayload) => {
    const profile: HouseholdProfile = {
      name: setup.householdName,
      ownerName: setup.ownerName,
      ownerPhone: setup.ownerPhone,
      addressLabel: setup.addressLabel,
      timezone: setup.timezone,
    };

    isApplyingRemoteStateRef.current = true;
    setHouseholdProfile(profile);
    setHomemates(setup.homemates);
    setRooms(setup.rooms);
    setInventoryItems(setup.inventoryItems);
    setOwnerNameState(setup.ownerName);
    setStaff(setup.staff);
    setExpenses([]);
    setCashRequests([]);
    setAttendanceRequests([]);
    setAlerts([]);
    setSetupComplete(true);
    localStorage.setItem("homemaker_owner_name", setup.ownerName);
    rememberOnboardingCompletion().catch(() => undefined);

    let persistedStaff = setup.staff;
    let persistedExpenses: Expense[] = [];
    let persistedCashRequests: StaffCashRequest[] = [];
    let persistedAttendanceRequests: AttendanceCorrectionRequest[] = [];
    let persistedAlerts: Alert[] = [];

    try {
      const snapshot = await createConfiguredSqlConnectHousehold(setup);
      if (snapshot) {
        setSqlHouseholdId(snapshot.householdId);
        setStaff(snapshot.staff);
        setExpenses(snapshot.expenses);
        setCashRequests(snapshot.cashRequests);
        setAlerts(snapshot.alerts);
        persistedStaff = snapshot.staff;
        persistedExpenses = snapshot.expenses;
        persistedCashRequests = snapshot.cashRequests;
        persistedAlerts = snapshot.alerts;
      }
    } finally {
      queueMicrotask(() => {
        isApplyingRemoteStateRef.current = false;
        const nextState: HouseholdStateSnapshot = {
          staff: persistedStaff,
          expenses: persistedExpenses,
          cashRequests: persistedCashRequests,
          attendanceRequests: persistedAttendanceRequests,
          alerts: persistedAlerts,
          setupComplete: true,
          householdProfile: profile,
          homemates: setup.homemates,
          rooms: setup.rooms,
          inventoryItems: setup.inventoryItems,
          ownerName: setup.ownerName,
          language,
          appRole,
          activeStaffId,
          isDarkMode,
          nfcEnabled,
        };
        lastSavedStateRef.current = JSON.stringify(nextState);
        saveHouseholdState(nextState).catch((error) => {
          console.warn("Unable to save setup state", error);
        });
      });
    }
  }, [activeStaffId, appRole, isDarkMode, language, nfcEnabled]);

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
        staff, expenses, alerts, setupComplete, householdProfile, homemates, rooms, inventoryItems,
        ownerName, ownerLocation, language, appRole, activeStaffId, isDarkMode, nfcEnabled, isDemoMode,
        cashRequests, attendanceRequests,
        setOwnerName, setLanguage, setAppRole, setActiveStaffId, setDarkMode, setNfcEnabled, toggleTask, updateStaffStatus, updateStaffRole, updateStaffShift,
        enableDemoMode, disableDemoMode,
        addExpense, createCashRequest, reviewCashRequest, markCashRequestPurchased, createAttendanceCorrectionRequest, reviewAttendanceCorrectionRequest, editExpense, deleteExpense, dismissAlert, addTask, removeStaff, deleteTask,
        addStaff, addDeduction, updateStaffPhoto, updateTaskDueDate, addAlert, updateStaffTelegramId,
        addInventoryItem, updateInventoryItem, deleteInventoryItem,
        markAttendance, registerStaffNfcTag, recordNfcTap, reassignTask, extendTaskDeadlineByName,
        updatePunctualityScore, updateReliabilityScore,
        completeHouseholdSetup,
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
