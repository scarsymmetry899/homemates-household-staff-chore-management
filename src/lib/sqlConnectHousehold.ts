import type { Alert, Expense } from "@/context/AppContext";
import type { Department, StaffMember, StaffStatus } from "@/data/staff";
import { getCurrentAuthUser, isFirebaseConfigured } from "@/lib/firebase";
import {
  addExpenseEntry,
  addStaffMember,
  addTaskInstance,
  createHousehold,
  myHouseholds,
  upsertCurrentUser,
  type MyHouseholdsData,
  type UUIDString,
} from "@homemaker/dataconnect";

export interface SqlConnectHouseholdSnapshot {
  householdId: UUIDString;
  staff: StaffMember[];
  expenses: Expense[];
  alerts: Alert[];
  ownerName: string;
}

interface SeedSnapshot {
  staff: StaffMember[];
  expenses: Expense[];
  alerts: Alert[];
  ownerName: string;
}

type SqlHousehold = MyHouseholdsData["households"][number];

const staffStatuses = new Set<StaffStatus>(["on-duty", "late", "absent", "en-route", "off-duty"]);
const departments = new Set<Department>(["Hospitality", "Security", "Grounds", "Culinary", "Maintenance", "Other"]);

function toStaffStatus(value: string): StaffStatus {
  return staffStatuses.has(value as StaffStatus) ? (value as StaffStatus) : "off-duty";
}

function toDepartment(value: string): Department {
  return departments.has(value as Department) ? (value as Department) : "Other";
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function mapHousehold(household: SqlHousehold, ownerName: string): SqlConnectHouseholdSnapshot {
  const tasksByStaffId = new Map<string, { task: string; done: boolean; dueDate?: string }[]>();

  household.taskInstances_on_household.forEach((task) => {
    const staffId = task.assignedStaff?.id;
    if (!staffId) return;
    const existing = tasksByStaffId.get(staffId) || [];
    existing.push({
      id: task.id,
      task: task.title,
      done: task.status === "completed",
      dueDate: task.dueAt ? task.dueAt.split("T")[0] : undefined,
    });
    tasksByStaffId.set(staffId, existing);
  });

  return {
    householdId: household.id,
    ownerName,
    staff: household.staffMembers_on_household.map((member) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      department: toDepartment(member.department),
      photo: member.photoUrl || "/placeholder.svg",
      phone: member.phone || "",
      salary: member.salary,
      status: toStaffStatus(member.status),
      reliabilityScore: member.reliabilityScore,
      punctualityScore: member.punctualityScore,
      tenure: "New profile",
      location: member.locationLabel || "Not set",
      skills: [],
      shiftStart: member.shiftStart || "09:00 AM",
      shiftEnd: member.shiftEnd || "06:00 PM",
      assignments: tasksByStaffId.get(member.id) || [],
      notes: member.notes || undefined,
      attendance: [],
      payroll: {
        baseSalary: member.salary,
        deductions: 0,
        netPay: member.salary,
        month: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      },
      telegramChatId: member.telegramChatId || undefined,
    })),
    expenses: household.expenseEntries_on_household.map((expense) => ({
      id: expense.id,
      category: expense.category as Expense["category"],
      amount: expense.amount,
      description: expense.description,
      staffName: expense.staff?.name,
      date: formatDate(expense.spentAt),
    })),
    alerts: household.alerts_on_household.map((alert) => ({
      id: alert.id,
      type: alert.alertType as Alert["type"],
      severity: alert.severity as Alert["severity"],
      title: alert.title,
      description: alert.description,
      staffName: alert.staff?.name,
      staffId: alert.staff?.id,
      time: formatDate(alert.createdAt),
      dismissed: alert.status !== "active",
      actions: ["Acknowledge"],
    })),
  };
}

async function seedHousehold(seed: SeedSnapshot): Promise<UUIDString> {
  const created = await createHousehold({
    name: `${seed.ownerName || "My"} Household`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
    addressLabel: null,
  });

  const householdId = created.data.household_insert.id;
  const staffIdBySeedId = new Map<string, UUIDString>();

  for (const member of seed.staff) {
    const inserted = await addStaffMember({
      householdId,
      name: member.name,
      role: member.role,
      department: member.department,
      phone: member.phone || null,
      salary: member.salary,
      shiftStart: member.shiftStart,
      shiftEnd: member.shiftEnd,
    });
    staffIdBySeedId.set(member.id, inserted.data.staffMember_insert.id);
  }

  for (const member of seed.staff) {
    const assignedStaffId = staffIdBySeedId.get(member.id);
    for (const assignment of member.assignments) {
      await addTaskInstance({
        householdId,
        assignedStaffId,
        title: assignment.task,
        dueAt: assignment.dueDate ? `${assignment.dueDate}T00:00:00.000Z` : null,
      });
    }
  }

  for (const expense of seed.expenses) {
    const staffId = expense.staffName
      ? [...staffIdBySeedId.entries()].find(([seedStaffId]) => {
          const member = seed.staff.find((staffMember) => staffMember.id === seedStaffId);
          return member?.name === expense.staffName;
        })?.[1]
      : null;

    await addExpenseEntry({
      householdId,
      staffId,
      category: expense.category,
      amount: expense.amount,
      description: expense.description,
      receiptUrl: null,
    });
  }

  return householdId;
}

export async function bootstrapSqlConnectHousehold(
  seed: SeedSnapshot
): Promise<SqlConnectHouseholdSnapshot | null> {
  if (!isFirebaseConfigured) return null;

  const user = await getCurrentAuthUser();
  if (!user) return null;

  await upsertCurrentUser({
    displayName: user.displayName || seed.ownerName || null,
    email: user.email || null,
  });

  let householdsResult = await myHouseholds({ fetchPolicy: "network-only" });
  let household = householdsResult.data.households[0];

  if (!household) {
    await seedHousehold(seed);
    householdsResult = await myHouseholds({ fetchPolicy: "network-only" });
    household = householdsResult.data.households[0];
  }

  if (!household) return null;

  return mapHousehold(household, user.displayName || seed.ownerName || "Boss");
}
