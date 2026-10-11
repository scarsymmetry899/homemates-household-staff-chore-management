import { describe, expect, it } from "vitest";
import type { HouseholdSetupPayload } from "@/context/AppContext";
import type { MyHouseholdsData } from "@homemaker/dataconnect";
import { isConfiguredHouseholdComplete } from "@/lib/sqlConnectHousehold";

type SqlHousehold = MyHouseholdsData["households"][number];

const setup = {
  householdName: "QA Home",
  ownerName: "Owner",
  timezone: "Asia/Kolkata",
  rooms: [{ id: "room", name: "Kitchen" }],
  homemates: [{ id: "mate", name: "Resident", relationLabel: "Family" }],
  inventoryItems: [{ id: "item", name: "Rice", category: "Grocery", unit: "kg", currentQuantity: 5 }],
  staff: [{ id: "local-staff", name: "Helper", role: "Cook + Cleaner", salary: 1000, assignments: [{ task: "Prepare breakfast" }] }],
  payroll: {},
} as HouseholdSetupPayload;

const saved = {
  id: "household-id",
  name: "QA Home",
  roomZones_on_household: [{ name: "Kitchen" }],
  homemateProfiles_on_household: [{ name: "Resident" }],
  inventoryItems_on_household: [{ name: "Rice" }],
  staffMembers_on_household: [{ id: "staff-id", name: "Helper", role: "Cook + Cleaner", salary: 1000 }],
  taskInstances_on_household: [{ title: "Prepare breakfast", assignedStaff: { id: "staff-id" } }],
  payrollRuns_on_household: [{ staff: { id: "staff-id" } }],
} as SqlHousehold;

describe("configured household recovery", () => {
  it("recognizes a completed save and ignores later tasks", () => {
    expect(isConfiguredHouseholdComplete(saved, setup)).toBe(true);
    const withNewTask = {
      ...saved,
      taskInstances_on_household: [...saved.taskInstances_on_household, { title: "Later task", assignedStaff: { id: "staff-id" } }],
    } as SqlHousehold;
    expect(isConfiguredHouseholdComplete(withNewTask, setup)).toBe(true);
  });

  it("does not treat a partial staff or task save as complete", () => {
    expect(isConfiguredHouseholdComplete({ ...saved, payrollRuns_on_household: [] }, setup)).toBe(false);
    expect(isConfiguredHouseholdComplete({ ...saved, taskInstances_on_household: [] }, setup)).toBe(false);
  });
});
