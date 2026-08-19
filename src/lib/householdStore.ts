import type {
  Alert,
  Expense,
  HomemateProfile,
  HouseholdProfile,
  InventorySetupItem,
  RoomZoneProfile,
  type AppRole,
  type AppLanguage,
  type StaffCashRequest,
  type AttendanceCorrectionRequest,
} from "@/context/AppContext";
import type { StaffMember } from "@/data/staff";
import { getCurrentAuthUser, getFirebaseFirestore, isFirebaseConfigured } from "@/lib/firebase";

export interface HouseholdStateSnapshot {
  staff: StaffMember[];
  expenses: Expense[];
  cashRequests?: StaffCashRequest[];
  attendanceRequests?: AttendanceCorrectionRequest[];
  alerts: Alert[];
  setupComplete?: boolean;
  householdProfile?: HouseholdProfile | null;
  homemates?: HomemateProfile[];
  rooms?: RoomZoneProfile[];
  inventoryItems?: InventorySetupItem[];
  ownerName: string;
  language?: AppLanguage;
  appRole?: AppRole;
  activeStaffId?: string | null;
  isDarkMode: boolean;
  nfcEnabled: boolean;
}

type Unsubscribe = () => void;

async function getHouseholdDocRef() {
  if (!isFirebaseConfigured) return null;

  const [db, user] = await Promise.all([
    getFirebaseFirestore(),
    getCurrentAuthUser(),
  ]);

  if (!db || !user) return null;

  const { doc } = await import("firebase/firestore");
  return doc(
    db as import("firebase/firestore").Firestore,
    "users",
    user.uid,
    "household_data",
    "default"
  );
}

function stripUndefined<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function subscribeToHouseholdState(
  onState: (state: HouseholdStateSnapshot) => void,
  onMissing: () => void,
  onError?: (error: unknown) => void
): Promise<Unsubscribe> {
  const ref = await getHouseholdDocRef();
  if (!ref) {
    onMissing();
    return () => {};
  }

  const { onSnapshot } = await import("firebase/firestore");
  return onSnapshot(
    ref,
    (snapshot) => {
      if (!snapshot.exists()) {
        onMissing();
        return;
      }

      const data = snapshot.data() as Partial<HouseholdStateSnapshot>;
      if (data.staff && data.expenses && data.alerts) {
        onState({
          staff: data.staff,
          expenses: data.expenses,
          cashRequests: data.cashRequests || [],
          attendanceRequests: data.attendanceRequests || [],
          alerts: data.alerts,
          setupComplete: !!data.setupComplete,
          householdProfile: data.householdProfile || null,
          homemates: data.homemates || [],
          rooms: data.rooms || [],
          inventoryItems: data.inventoryItems || [],
          ownerName: data.ownerName || "Boss",
          language: data.language || "en",
          appRole: data.appRole || "owner",
          activeStaffId: data.activeStaffId || null,
          isDarkMode: !!data.isDarkMode,
          nfcEnabled: !!data.nfcEnabled,
        });
      }
    },
    (error) => onError?.(error)
  );
}

export async function saveHouseholdState(state: HouseholdStateSnapshot): Promise<void> {
  const ref = await getHouseholdDocRef();
  if (!ref) return;

  const { serverTimestamp, setDoc } = await import("firebase/firestore");
  await setDoc(
    ref,
    {
      ...stripUndefined(state),
      schemaVersion: 1,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
