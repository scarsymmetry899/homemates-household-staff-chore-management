import type { StaffMember } from "@/data/staff";

/**
 * Time after `shiftStart` (in minutes) within which a check-in is still
 * counted as on-time. Past this, the tap is logged as late and the
 * staff member's status is set to "late".
 */
export const LATENESS_GRACE_MIN = 15;

/**
 * If a tap arrives more than this many minutes before `shiftStart`, the
 * detail line notes "arrived early" — but the staff is still on-duty
 * with no penalty.
 */
export const EARLY_ARRIVAL_THRESHOLD_MIN = 10;

/**
 * Tolerance window after `shiftEnd` — a check-out within this many
 * minutes after end-of-shift counts as on-time (not overtime).
 */
export const OVERTIME_THRESHOLD_MIN = 5;

/** Punctuality score deduction per late check-in event. */
export const LATE_PUNCTUALITY_PENALTY = 2;

/** Reliability score deduction per early-leave event. */
export const EARLY_LEAVE_RELIABILITY_PENALTY = 1;

/**
 * Parse a 12-hour-formatted shift string ("08:00 AM", "5:30 PM", "11:00 pm")
 * into a Date on the given base date (defaults to today). Returns null
 * if the format is unrecognised.
 */
export function parseShiftTime(shift: string, baseDate: Date = new Date()): Date | null {
  if (!shift) return null;
  const match = shift.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  const result = new Date(baseDate);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/** Difference (a − b) in minutes, rounded. Positive = a is after b. */
export function minutesDiff(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / 60000);
}

export type CheckInOutcome =
  | { kind: "on-time"; minutesOffset: number }
  | { kind: "early"; minutesEarly: number }
  | { kind: "late"; minutesLate: number }
  | { kind: "no-shift" };

/**
 * Evaluate a check-in tap against the staff member's scheduled shift start.
 *  - More than LATENESS_GRACE_MIN past start → "late" with minutesLate
 *  - More than EARLY_ARRIVAL_THRESHOLD_MIN before start → "early"
 *  - Otherwise → "on-time"
 *  - If staff has no parseable shift → "no-shift"
 */
export function evaluateCheckIn(staff: StaffMember, tapTime: Date): CheckInOutcome {
  const start = parseShiftTime(staff.shiftStart, tapTime);
  if (!start) return { kind: "no-shift" };

  const diff = minutesDiff(tapTime, start);

  if (diff > LATENESS_GRACE_MIN) return { kind: "late", minutesLate: diff };
  if (diff < -EARLY_ARRIVAL_THRESHOLD_MIN) return { kind: "early", minutesEarly: -diff };
  return { kind: "on-time", minutesOffset: diff };
}

export type CheckOutOutcome =
  | { kind: "on-time"; minutesOffset: number }
  | { kind: "overtime"; minutesOver: number }
  | { kind: "early-leave"; minutesEarly: number }
  | { kind: "no-shift" };

/**
 * Evaluate a check-out tap against the staff member's scheduled shift end.
 *  - Before end → "early-leave" with minutesEarly
 *  - More than OVERTIME_THRESHOLD_MIN past end → "overtime"
 *  - Otherwise → "on-time"
 *  - If staff has no parseable shift → "no-shift"
 */
export function evaluateCheckOut(staff: StaffMember, tapTime: Date): CheckOutOutcome {
  const end = parseShiftTime(staff.shiftEnd, tapTime);
  if (!end) return { kind: "no-shift" };

  const diff = minutesDiff(tapTime, end);

  if (diff < 0) return { kind: "early-leave", minutesEarly: -diff };
  if (diff > OVERTIME_THRESHOLD_MIN) return { kind: "overtime", minutesOver: diff };
  return { kind: "on-time", minutesOffset: diff };
}
