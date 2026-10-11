import type {
  Alert,
  AttendanceCorrectionRequest,
  AttendanceCorrectionStatus,
  Expense,
  HomemateProfile,
  HouseholdProfile,
  InventorySetupItem,
  RoomZoneProfile,
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
  updateStaffPhoto,
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
  householdProfile: HouseholdProfile;
  homemates: HomemateProfile[];
  rooms: RoomZoneProfile[];
  inventoryItems: InventorySetupItem[];
  ownerName: string;
}

interface SeedSnapshot {
  staff: StaffMember[];
  expenses: Expense[];
  alerts: Alert[];
  ownerName: string;
}

type SqlHousehold = MyHouseholdsData["households"][number];

function containsNames(expected: string[], actual: string[]): boolean {
  const remaining = [...actual];
  return expected.every((name) => {
    const index = remaining.indexOf(name);
    if (index < 0) return false;
    remaining.splice(index, 1);
    return true;
  });
}

export function isConfiguredHouseholdComplete(household: SqlHousehold, setup: HouseholdSetupPayload): boolean {
  if (household.name !== setup.householdName) return false;
  if (!containsNames(setup.rooms.map((room) => room.name), household.roomZones_on_household.map((room) => room.name))) return false;
  if (!containsNames(setup.homemates.map((mate) => mate.name), household.homemateProfiles_on_household.map((mate) => mate.name))) return false;
  if (!containsNames(setup.inventoryItems.map((item) => item.name), household.inventoryItems_on_household.map((item) => item.name))) return false;
  if (!containsNames(setup.staff.map((member) => member.name), household.staffMembers_on_household.map((member) => member.name))) return false;

  return setup.staff.every((member) => {
    const saved = household.staffMembers_on_household.find((item) => item.name === member.name);
    return !!saved && saved.role === member.role && saved.salary === member.salary &&
      containsNames(
        member.assignments.map((assignment) => assignment.task),
        household.taskInstances_on_household
          .filter((task) => task.assignedStaff?.id === saved.id)
          .map((task) => task.title)
      ) && household.payrollRuns_on_household.some((run) => run.staff.id === saved.id);
  });
}

async function readConfiguredHousehold(householdId: UUIDString, setup: HouseholdSetupPayload): Promise<SqlHousehold> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const result = await myHouseholds({ fetchPolicy: "SERVER_ONLY" });
      const household = result.data.households.find((item) => item.id === householdId);
      if (household && isConfiguredHouseholdComplete(household, setup)) return household;
    } catch (error) {
      if (attempt === 2) throw error;
    }
    if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
  }
  throw new Error("The household may be partially saved. Reload before trying setup again; do not create a duplicate.");
}

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
    householdProfile: {
      name: household.name,
      ownerName,
      addressLabel: household.addressLabel || undefined,
      timezone: household.timezone,
    },
    homemates: household.homemateProfiles_on_household.map((homemate) => ({
      id: homemate.id,
      name: homemate.name,
      relationLabel: homemate.relationLabel || "",
      phone: homemate.phone || undefined,
      notes: homemate.notes || undefined,
    })),
    rooms: household.roomZones_on_household.map((room) => ({
      id: room.id,
      name: room.name,
      floorLabel: room.floorLabel || undefined,
      notes: room.notes || undefined,
    })),
    inventoryItems: household.inventoryItems_on_household.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      unit: item.unit,
      currentQuantity: item.currentQuantity,
      minimumQuantity: item.minimumQuantity ?? undefined,
      roomId: item.room?.id,
    })),
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

  const existing = (await myHouseholds({ fetchPolicy: "SERVER_ONLY" })).data.households.filter((item) => item.name === setup.householdName);
  const complete = existing.find((item) => isConfiguredHouseholdComplete(item, setup));
  if (complete) return mapHousehold(complete, setup.ownerName || user.displayName || "Boss");
  if (existing.length > 0) {
    throw new Error("A household with this name already exists but setup is incomplete. Reload to recover it rather than creating a duplicate.");
  }

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
    if (member.photo && member.photo !== "/placeholder.svg") {
      await updateStaffPhoto({ staffId, photoUrl: member.photo });
    }
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

  const household = await readConfiguredHousehold(householdId, setup);
  return mapHousehold(household, setup.ownerName || user.displayName || "Boss");
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

  const householdsResult = await myHouseholds({ fetchPolicy: "SERVER_ONLY" });
  const household = householdsResult.data.households.find((item) =>
    item.roomZones_on_household.length > 0 ||
    item.staffMembers_on_household.length > 0 ||
    item.homemateProfiles_on_household.length > 0 ||
    item.inventoryItems_on_household.length > 0
  );

  if (!household) return null;

  return mapHousehold(household, user.displayName || seed.ownerName || "Boss");
}
