import type {
  Alert,
  AttendanceCorrectionRequest,
  AttendanceCorrectionStatus,
  Expense,
  StaffCashRequest,
  StaffCashRequestStatus,
} from "@/context/AppContext";
import type { Department, StaffMember, StaffStatus } from "@/data/staff";
import { getCurrentAuthUser, isFirebaseConfigured } from "@/lib/firebase";
import {
  addExpenseEntry,
  addStaffMember,
  addTaskInstance,
  createHousehold,
  createHomemateProfile,
  createInventoryItem,
  createPayrollProfile,
  createRoomZone,
  createStaffSkill,
  myHouseholds,
  recordPayrollDeduction,
  upsertCurrentUser,
  type MyHouseholdsData,
  type UUIDString,
} from "@homemaker/dataconnect";
import type { HouseholdSetupPayload } from "@/context/AppContext";

export interface SqlConnectHouseholdSnapshot {
  householdId: UUIDString;
  staff: StaffMember[];
  expenses: Expense[];
  cashRequests: StaffCashRequest[];
  attendanceRequests: AttendanceCorrectionRequest[];
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

function toCashRequestStatus(value: string): StaffCashRequestStatus {
  return value === "approved" || value === "rejected" || value === "purchased" ? value : "pending";
}

function toAttendanceRequestStatus(value: string): AttendanceCorrectionStatus {
  return value === "approved" || value === "rejected" ? value : "pending";
}

function mapHousehold(household: SqlHousehold, ownerName: string): SqlConnectHouseholdSnapshot {
  const tasksByStaffId = new Map<string, { task: string; done: boolean; dueDate?: string }[]>();
  const latestPayrollByStaffId = new Map<string, SqlHousehold["payrollRuns_on_household"][number]>();

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

  household.payrollRuns_on_household.forEach((run) => {
    if (!latestPayrollByStaffId.has(run.staff.id)) {
      latestPayrollByStaffId.set(run.staff.id, run);
    }
  });

  return {
    householdId: household.id,
    ownerName,
    staff: household.staffMembers_on_household.map((member) => {
      const payrollRun = latestPayrollByStaffId.get(member.id);
      return {
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
          baseSalary: payrollRun?.baseSalary ?? member.salary,
          deductions: payrollRun?.deductions ?? 0,
          netPay: payrollRun?.netPay ?? member.salary,
          month: payrollRun?.monthLabel || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        },
        telegramChatId: member.telegramChatId || undefined,
      };
    }),
    expenses: household.expenseEntries_on_household.map((expense) => ({
      id: expense.id,
      category: expense.category as Expense["category"],
      amount: expense.amount,
      description: expense.description,
      staffName: expense.staff?.name,
      date: formatDate(expense.spentAt),
    })),
    cashRequests: household.staffCashRequests_on_household.map((request) => ({
      id: request.id,
      category: request.category,
      amountRequested: request.amountRequested,
      amountApproved: request.amountApproved ?? undefined,
      reason: request.reason,
      status: toCashRequestStatus(request.status),
      neededBy: request.neededBy ? formatDate(request.neededBy) : undefined,
      requestedAt: formatDate(request.requestedAt),
      approvedAt: request.approvedAt ? formatDate(request.approvedAt) : undefined,
      purchasedAt: request.purchasedAt ? formatDate(request.purchasedAt) : undefined,
      receiptUrl: request.receiptUrl || undefined,
      notes: request.notes || undefined,
      staffId: request.staff?.id,
      staffName: request.staff?.name,
      staffRole: request.staff?.role,
      inventoryItemId: request.inventoryItem?.id,
      inventoryItemName: request.inventoryItem?.name,
      linkedExpenseId: request.linkedExpense?.id,
    })),
    attendanceRequests: household.attendanceCorrectionRequests_on_household.map((request) => ({
      id: request.id,
      staffId: request.staff.id,
      staffName: request.staff.name,
      staffRole: request.staff.role,
      date: request.requestedFor,
      currentStatus: request.currentStatus || undefined,
      requestedStatus: request.requestedStatus as AttendanceCorrectionRequest["requestedStatus"],
      reason: request.reason,
      status: toAttendanceRequestStatus(request.status),
      requestedAt: formatDate(request.requestedAt),
      reviewedAt: request.reviewedAt ? formatDate(request.reviewedAt) : undefined,
      notes: request.notes || undefined,
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

async function createEmptyHousehold(ownerName: string): Promise<UUIDString> {
  const created = await createHousehold({
    name: `${ownerName || "My"} Household`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
    addressLabel: null,
  });
  return created.data.household_insert.id;
}

export async function createConfiguredSqlConnectHousehold(
  setup: HouseholdSetupPayload
): Promise<SqlConnectHouseholdSnapshot | null> {
  if (!isFirebaseConfigured) return null;

  const user = await getCurrentAuthUser();
  if (!user) return null;

  await upsertCurrentUser({
    displayName: setup.ownerName || user.displayName || null,
    email: user.email || null,
  });

  const created = await createHousehold({
    name: setup.householdName,
    timezone: setup.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
    addressLabel: setup.addressLabel || null,
  });
  const householdId = created.data.household_insert.id;

  const roomIdByLocalId = new Map<string, UUIDString>();
  for (const room of setup.rooms) {
    const inserted = await createRoomZone({
      householdId,
      name: room.name,
      floorLabel: room.floorLabel || null,
      notes: room.notes || null,
    });
    roomIdByLocalId.set(room.id, inserted.data.roomZone_insert.id);
  }

  for (const homemate of setup.homemates) {
    await createHomemateProfile({
      householdId,
      name: homemate.name,
      relationLabel: homemate.relationLabel || null,
      phone: homemate.phone || null,
      notes: homemate.notes || null,
    });
  }

  const staffIdByLocalId = new Map<string, UUIDString>();
  for (const member of setup.staff) {
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
    const staffId = inserted.data.staffMember_insert.id;
    staffIdByLocalId.set(member.id, staffId);
    for (const skill of member.skills) {
      await createStaffSkill({ staffId, name: skill });
    }
    for (const assignment of member.assignments) {
      await addTaskInstance({
        householdId,
        assignedStaffId: staffId,
        title: assignment.task,
        dueAt: assignment.dueDate ? `${assignment.dueDate}T00:00:00.000Z` : null,
      });
    }
    await createPayrollProfile({
      householdId,
      staffId,
      baseSalary: member.salary,
      payFrequency: "monthly",
      deductionPolicy: setup.payroll.deductionPolicy || null,
    });
    await recordPayrollDeduction({
      householdId,
      staffId,
      monthLabel: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      baseSalary: member.salary,
      deductions: 0,
      advances: 0,
      netPay: member.salary,
      status: "draft",
    });
  }

  for (const item of setup.inventoryItems) {
    await createInventoryItem({
      householdId,
      roomId: item.roomId ? roomIdByLocalId.get(item.roomId) || null : null,
      name: item.name,
      category: item.category,
      unit: item.unit,
      currentQuantity: item.currentQuantity,
      minimumQuantity: item.minimumQuantity ?? null,
    });
  }

  const householdsResult = await myHouseholds({ fetchPolicy: "network-only" });
  const household = householdsResult.data.households[0];
  return household ? mapHousehold(household, setup.ownerName || user.displayName || "Boss") : null;
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
    await createEmptyHousehold(user.displayName || seed.ownerName || "My");
    householdsResult = await myHouseholds({ fetchPolicy: "network-only" });
    household = householdsResult.data.households[0];
  }

  if (!household) return null;

  return mapHousehold(household, user.displayName || seed.ownerName || "Boss");
}
