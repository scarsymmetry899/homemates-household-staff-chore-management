import { executeMutation, executeQuery, getDataConnect, mutationRef, queryRef } from "firebase/data-connect";
import { connectorConfig } from "@homemaker/dataconnect";
import { localDateKey } from "./localDate";

export const dayStatuses = ["present", "late", "absent", "off-duty"] as const;
export type DayStatus = typeof dayStatuses[number];

interface PeriodData {
  corrections: { staffId: string; requestedFor: string; requestedStatus: DayStatus }[];
  events: { staffId: string; occurredAt: string; eventType: string; detail?: string; source: string }[];
}

export function statusFromEvent(type: string, detail = ""): DayStatus | undefined {
  if (type === "off-duty") return "off-duty";
  if (type === "late" || (type === "check-in" && /late by/i.test(detail))) return "late";
  if (type === "absent" || type === "leave") return "absent";
  if (["check-in", "on-site", "present"].includes(type)) return "present";
}

export async function loadAttendancePeriod(householdId: string, from: string, to: string) {
  const start = new Date(from + "T00:00:00");
  const end = new Date(to + "T00:00:00");
  end.setDate(end.getDate() + 1);
  const vars = { householdId, from, to, start: start.toISOString(), end: end.toISOString() };
  const { data } = await executeQuery(queryRef<PeriodData, typeof vars>(
    getDataConnect(connectorConfig), "OwnerAttendancePeriod", vars
  ), { fetchPolicy: "SERVER_ONLY" });
  const days = new Map<string, DayStatus>();
  // Both result sets are newest first. Approved corrections take precedence over raw taps.
  for (const edit of data.corrections) {
    const key = edit.staffId + "/" + edit.requestedFor;
    if (!days.has(key)) days.set(key, edit.requestedStatus);
  }
  for (const event of data.events) {
    if (event.source === "owner-correction") continue;
    const key = event.staffId + "/" + localDateKey(new Date(event.occurredAt));
    const value = statusFromEvent(event.eventType, event.detail);
    if (value && !days.has(key)) days.set(key, value);
  }
  return days;
}

export async function saveDayAttendance(householdId: string, staffId: string, date: string, status: DayStatus, reason: string) {
  const vars = { householdId, staffId, date, status, reason };
  return executeMutation(mutationRef(getDataConnect(connectorConfig), "SetOwnerDayAttendance", vars));
}
