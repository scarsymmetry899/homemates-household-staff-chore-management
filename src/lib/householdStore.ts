import type { Alert, Expense } from "@/context/AppContext";
import type { StaffMember } from "@/data/staff";
import { getCurrentAuthUser, getFirebaseFirestore, isFirebaseConfigured } from "@/lib/firebase";

export interface HouseholdStateSnapshot {
  staff: StaffMember[];
  expenses: Expense[];
  alerts: Alert[];
  ownerName: string;
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
  if (!ref) return () => {};

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
          alerts: data.alerts,
          ownerName: data.ownerName || "Boss",
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
