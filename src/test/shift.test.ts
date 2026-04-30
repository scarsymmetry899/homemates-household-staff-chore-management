import { describe, it, expect } from "vitest";
import {
  parseShiftTime,
  minutesDiff,
  evaluateCheckIn,
  evaluateCheckOut,
  LATENESS_GRACE_MIN,
} from "@/lib/shift";
import type { StaffMember } from "@/data/staff";

const baseStaff = (overrides: Partial<StaffMember> = {}): StaffMember => ({
  id: "test",
  name: "Test Staff",
  role: "Tester",
  department: "Other",
  photo: "",
  phone: "",
  salary: 0,
  status: "off-duty",
  reliabilityScore: 100,
  punctualityScore: 100,
  tenure: "0",
  location: "",
  skills: [],
  shiftStart: "08:00 AM",
  shiftEnd: "05:00 PM",
  assignments: [],
  attendance: [],
  payroll: { baseSalary: 0, deductions: 0, netPay: 0, month: "" },
  ...overrides,
});

describe("parseShiftTime", () => {
  it("parses 12-hour AM time", () => {
    const d = parseShiftTime("08:00 AM", new Date(2026, 3, 30));
    expect(d).toBeTruthy();
    expect(d!.getHours()).toBe(8);
    expect(d!.getMinutes()).toBe(0);
  });

  it("parses 12-hour PM time", () => {
    const d = parseShiftTime("05:30 PM", new Date(2026, 3, 30));
    expect(d!.getHours()).toBe(17);
    expect(d!.getMinutes()).toBe(30);
  });

  it("handles midnight as 12:00 AM", () => {
    const d = parseShiftTime("12:00 AM", new Date(2026, 3, 30));
    expect(d!.getHours()).toBe(0);
  });

  it("handles noon as 12:00 PM", () => {
    const d = parseShiftTime("12:00 PM", new Date(2026, 3, 30));
    expect(d!.getHours()).toBe(12);
  });

  it("accepts lowercase meridiem", () => {
    const d = parseShiftTime("11:00 pm", new Date(2026, 3, 30));
    expect(d!.getHours()).toBe(23);
  });

  it("returns null for unparseable input", () => {
    expect(parseShiftTime("not a time")).toBeNull();
    expect(parseShiftTime("")).toBeNull();
    expect(parseShiftTime("25:99 PM")).toBeNull();
  });
});

describe("minutesDiff", () => {
  it("returns positive when a is later than b", () => {
    const a = new Date(2026, 3, 30, 8, 30);
    const b = new Date(2026, 3, 30, 8, 0);
    expect(minutesDiff(a, b)).toBe(30);
  });

  it("returns negative when a is earlier than b", () => {
    const a = new Date(2026, 3, 30, 7, 45);
    const b = new Date(2026, 3, 30, 8, 0);
    expect(minutesDiff(a, b)).toBe(-15);
  });
});

describe("evaluateCheckIn", () => {
  const staff = baseStaff({ shiftStart: "08:00 AM" });
  const today = new Date(2026, 3, 30);

  const at = (h: number, m: number) => {
    const d = new Date(today);
    d.setHours(h, m, 0, 0);
    return d;
  };

  it("returns on-time for tap exactly at shift start", () => {
    const result = evaluateCheckIn(staff, at(8, 0));
    expect(result.kind).toBe("on-time");
  });

  it("returns on-time for tap within grace buffer", () => {
    const result = evaluateCheckIn(staff, at(8, 14));
    expect(result.kind).toBe("on-time");
  });

  it("returns on-time at exactly the grace boundary", () => {
    // 15 min past = boundary, should still be on-time (not late)
    const result = evaluateCheckIn(staff, at(8, LATENESS_GRACE_MIN));
    expect(result.kind).toBe("on-time");
  });

  it("returns late one minute past the grace buffer", () => {
    const result = evaluateCheckIn(staff, at(8, LATENESS_GRACE_MIN + 1));
    expect(result.kind).toBe("late");
    if (result.kind === "late") expect(result.minutesLate).toBe(LATENESS_GRACE_MIN + 1);
  });

  it("returns late with correct minute count for 32 minutes late", () => {
    const result = evaluateCheckIn(staff, at(8, 32));
    if (result.kind === "late") expect(result.minutesLate).toBe(32);
    else throw new Error("Expected late");
  });

  it("returns early for tap well before shift", () => {
    const result = evaluateCheckIn(staff, at(7, 30));
    expect(result.kind).toBe("early");
    if (result.kind === "early") expect(result.minutesEarly).toBe(30);
  });

  it("returns on-time for slightly-early tap within early threshold", () => {
    const result = evaluateCheckIn(staff, at(7, 55));
    expect(result.kind).toBe("on-time");
  });

  it("returns no-shift if shiftStart is unparseable", () => {
    const noShift = baseStaff({ shiftStart: "" });
    const result = evaluateCheckIn(noShift, at(8, 0));
    expect(result.kind).toBe("no-shift");
  });
});

describe("evaluateCheckOut", () => {
  const staff = baseStaff({ shiftEnd: "05:00 PM" });
  const today = new Date(2026, 3, 30);

  const at = (h: number, m: number) => {
    const d = new Date(today);
    d.setHours(h, m, 0, 0);
    return d;
  };

  it("returns on-time for tap at shift end", () => {
    const result = evaluateCheckOut(staff, at(17, 0));
    expect(result.kind).toBe("on-time");
  });

  it("returns early-leave for tap before shift end", () => {
    const result = evaluateCheckOut(staff, at(16, 30));
    expect(result.kind).toBe("early-leave");
    if (result.kind === "early-leave") expect(result.minutesEarly).toBe(30);
  });

  it("returns early-leave one minute before shift end", () => {
    const result = evaluateCheckOut(staff, at(16, 59));
    expect(result.kind).toBe("early-leave");
    if (result.kind === "early-leave") expect(result.minutesEarly).toBe(1);
  });

  it("returns on-time within overtime buffer (5 min)", () => {
    const result = evaluateCheckOut(staff, at(17, 4));
    expect(result.kind).toBe("on-time");
  });

  it("returns overtime past the buffer", () => {
    const result = evaluateCheckOut(staff, at(17, 30));
    expect(result.kind).toBe("overtime");
    if (result.kind === "overtime") expect(result.minutesOver).toBe(30);
  });

  it("returns no-shift if shiftEnd is unparseable", () => {
    const noShift = baseStaff({ shiftEnd: "" });
    const result = evaluateCheckOut(noShift, at(17, 0));
    expect(result.kind).toBe("no-shift");
  });
});
