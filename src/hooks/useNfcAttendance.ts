import { useEffect, useRef, useState, useCallback } from "react";
import { startNfcScan, isNfcSupported } from "@/lib/nfc";
import { logAttendanceToSheets } from "@/lib/googleSheets";
import { useAppState } from "@/context/AppContext";
import type { StaffStatus } from "@/data/staff";
import { toast } from "sonner";
import { sendMessage } from "@/lib/telegram";
import {
  evaluateCheckIn,
  evaluateCheckOut,
  LATE_PUNCTUALITY_PENALTY,
  EARLY_LEAVE_RELIABILITY_PENALTY,
} from "@/lib/shift";

/** Two taps on the same tag closer than this collapse to one. */
const TAP_DEBOUNCE_MS = 10_000;

export type NfcEventStatus =
  | "on-time"
  | "late"
  | "early-arrival"
  | "overtime"
  | "early-leave"
  | "no-shift";

export interface NfcEvent {
  staffId: string;
  staffName: string;
  eventType: "check-in" | "check-out";
  timestamp: Date;
  status: NfcEventStatus;
  /** Signed minutes vs scheduled boundary. + late/overtime, − early. 0 if no shift. */
  minutesOffset: number;
}

export function useNfcAttendance(enabled: boolean) {
  const {
    staff,
    updateStaffStatus,
    markAttendance,
    addAlert,
    updatePunctualityScore,
    updateReliabilityScore,
  } = useAppState();

  const cleanupRef = useRef<(() => void) | null>(null);
  const [lastEvent, setLastEvent] = useState<NfcEvent | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Per-staff timestamp of last accepted tap, for debouncing. */
  const lastTapRef = useRef<Map<string, number>>(new Map());

  const handleScan = useCallback(
    async (staffId: string, timestamp: Date) => {
      const member = staff.find((s) => s.id === staffId);
      if (!member) {
        toast.error("Unknown NFC tag", { description: `Staff ID: ${staffId}` });
        return;
      }

      // Anti-fumble: ignore taps within debounce window for this staff
      const lastTap = lastTapRef.current.get(staffId) ?? 0;
      if (timestamp.getTime() - lastTap < TAP_DEBOUNCE_MS) return;
      lastTapRef.current.set(staffId, timestamp.getTime());

      // "Currently working" → next tap is a check-out. Anything else → check-in.
      const isWorking = member.status === "on-duty" || member.status === "late";
      const eventType: "check-in" | "check-out" = isWorking ? "check-out" : "check-in";

      const timeStr = timestamp.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const dateStr = timestamp.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      let newStatus: StaffStatus;
      let detail: string;
      let toastTitle: string;
      let toastDesc: string;
      let ownerMsg: string;
      let staffMsg: string;
      let eventStatus: NfcEventStatus;
      let minutesOffset = 0;

      if (eventType === "check-in") {
        const outcome = evaluateCheckIn(member, timestamp);

        if (outcome.kind === "late") {
          newStatus = "late";
          minutesOffset = outcome.minutesLate;
          eventStatus = "late";
          detail = `NFC Check-in: ${timeStr}\nLATE by ${outcome.minutesLate} min (shift: ${member.shiftStart})`;
          toastTitle = `${member.name} checked in LATE`;
          toastDesc = `${timeStr} · ${outcome.minutesLate} min late`;
          ownerMsg = `🟡 <b>${member.name}</b> (${member.role}) just <b>arrived LATE</b> at ${timeStr} — <b>${outcome.minutesLate} min</b> past shift start of ${member.shiftStart}`;
          staffMsg = `⚠️ Your check-in has been recorded at ${timeStr}. You were ${outcome.minutesLate} minutes late today.`;

          addAlert({
            type: "attendance",
            severity: outcome.minutesLate > 30 ? "high" : "medium",
            title: `${member.role} arrived ${outcome.minutesLate} minutes late`,
            description: `${member.name} (${member.role}) checked in at ${timeStr}. Shift start was ${member.shiftStart}, exceeding the 15-minute grace buffer.`,
            staffName: member.name,
            staffId: member.id,
            time: timeStr,
            actions: ["Apply Late Penalty", "Waive", "Note"],
          });

          updatePunctualityScore(member.id, -LATE_PUNCTUALITY_PENALTY);
        } else if (outcome.kind === "early") {
          newStatus = "on-duty";
          minutesOffset = -outcome.minutesEarly;
          eventStatus = "early-arrival";
          detail = `NFC Check-in: ${timeStr}\nArrived ${outcome.minutesEarly} min early (shift: ${member.shiftStart})`;
          toastTitle = `${member.name} checked in early`;
          toastDesc = `${timeStr} · ${outcome.minutesEarly} min before shift`;
          ownerMsg = `🏠 <b>${member.name}</b> (${member.role}) arrived <b>early</b> at ${timeStr} (${outcome.minutesEarly} min before shift)`;
          staffMsg = `✅ Your check-in has been recorded at ${timeStr}. Have a great shift!`;
        } else if (outcome.kind === "no-shift") {
          newStatus = "on-duty";
          eventStatus = "no-shift";
          detail = `NFC Check-in: ${timeStr}\nNo shift configured`;
          toastTitle = `${member.name} checked in`;
          toastDesc = timeStr;
          ownerMsg = `🏠 <b>${member.name}</b> (${member.role}) just <b>arrived</b> at ${timeStr}`;
          staffMsg = `✅ Your check-in has been recorded at ${timeStr}. Have a great shift!`;
        } else {
          // on-time
          newStatus = "on-duty";
          minutesOffset = outcome.minutesOffset;
          eventStatus = "on-time";
          detail = `NFC Check-in: ${timeStr}\nOn time (shift: ${member.shiftStart})`;
          toastTitle = `${member.name} checked in`;
          toastDesc = `${timeStr} · On time`;
          ownerMsg = `🏠 <b>${member.name}</b> (${member.role}) just <b>arrived</b> at ${timeStr}`;
          staffMsg = `✅ Your check-in has been recorded at ${timeStr}. Have a great shift!`;
        }
      } else {
        // check-out
        const outcome = evaluateCheckOut(member, timestamp);

        if (outcome.kind === "early-leave") {
          newStatus = "off-duty";
          minutesOffset = -outcome.minutesEarly;
          eventStatus = "early-leave";
          detail = `NFC Check-out: ${timeStr}\nLeft EARLY by ${outcome.minutesEarly} min (shift ends ${member.shiftEnd})`;
          toastTitle = `${member.name} left EARLY`;
          toastDesc = `${timeStr} · ${outcome.minutesEarly} min before shift end`;
          ownerMsg = `🟠 <b>${member.name}</b> (${member.role}) <b>left EARLY</b> at ${timeStr} — <b>${outcome.minutesEarly} min</b> before shift end of ${member.shiftEnd}`;
          staffMsg = `⚠️ Your check-out has been recorded at ${timeStr}. You left ${outcome.minutesEarly} minutes early today.`;

          addAlert({
            type: "attendance",
            severity: outcome.minutesEarly > 60 ? "high" : "medium",
            title: `${member.role} left ${outcome.minutesEarly} minutes early`,
            description: `${member.name} (${member.role}) checked out at ${timeStr}. Shift end was ${member.shiftEnd}.`,
            staffName: member.name,
            staffId: member.id,
            time: timeStr,
            actions: ["Apply Penalty", "Waive", "Note"],
          });

          updateReliabilityScore(member.id, -EARLY_LEAVE_RELIABILITY_PENALTY);
        } else if (outcome.kind === "overtime") {
          newStatus = "off-duty";
          minutesOffset = outcome.minutesOver;
          eventStatus = "overtime";
          detail = `NFC Check-out: ${timeStr}\nOvertime: ${outcome.minutesOver} min (shift ended ${member.shiftEnd})`;
          toastTitle = `${member.name} checked out`;
          toastDesc = `${timeStr} · ${outcome.minutesOver} min overtime`;
          ownerMsg = `🏠 <b>${member.name}</b> (${member.role}) just <b>left</b> at ${timeStr} (overtime: ${outcome.minutesOver} min)`;
          staffMsg = `✅ Your check-out has been recorded at ${timeStr}. Have a great day!`;
        } else if (outcome.kind === "no-shift") {
          newStatus = "off-duty";
          eventStatus = "no-shift";
          detail = `NFC Check-out: ${timeStr}\nNo shift configured`;
          toastTitle = `${member.name} checked out`;
          toastDesc = timeStr;
          ownerMsg = `🏠 <b>${member.name}</b> (${member.role}) just <b>left</b> at ${timeStr}`;
          staffMsg = `✅ Your check-out has been recorded at ${timeStr}. Have a great day!`;
        } else {
          // on-time
          newStatus = "off-duty";
          minutesOffset = outcome.minutesOffset;
          eventStatus = "on-time";
          detail = `NFC Check-out: ${timeStr}\nShift complete (ended ${member.shiftEnd})`;
          toastTitle = `${member.name} checked out`;
          toastDesc = `${timeStr} · On schedule`;
          ownerMsg = `🏠 <b>${member.name}</b> (${member.role}) just <b>left</b> at ${timeStr}`;
          staffMsg = `✅ Your check-out has been recorded at ${timeStr}. Have a great day!`;
        }
      }

      updateStaffStatus(member.id, newStatus);
      markAttendance(member.id, eventType, detail);

      const event: NfcEvent = {
        staffId: member.id,
        staffName: member.name,
        eventType,
        timestamp,
        status: eventStatus,
        minutesOffset,
      };
      setLastEvent(event);

      toast.success(toastTitle, { description: toastDesc });

      // Log to Google Sheets (best-effort)
      await logAttendanceToSheets({
        staffId: member.id,
        staffName: member.name,
        staffRole: member.role,
        eventType,
        timestamp: timestamp.toISOString(),
        date: dateStr,
        time: timeStr,
        logMethod: "nfc",
      });

      // Notify owner
      const ownerChatId = localStorage.getItem("homemaker_owner_telegram_chat_id");
      if (ownerChatId) {
        await sendMessage(ownerChatId, ownerMsg);
      }

      // Notify staff member on their own Telegram
      if (member.telegramChatId) {
        await sendMessage(member.telegramChatId, staffMsg);
      }
    },
    [
      staff,
      updateStaffStatus,
      markAttendance,
      addAlert,
      updatePunctualityScore,
      updateReliabilityScore,
    ]
  );

  // Use a ref so the NFC reader isn't torn down and re-created on every
  // staff state change (which would happen if `handleScan` were a direct dep).
  const handleScanRef = useRef(handleScan);
  useEffect(() => {
    handleScanRef.current = handleScan;
  }, [handleScan]);

  useEffect(() => {
    if (!enabled) {
      cleanupRef.current?.();
      cleanupRef.current = null;
      setScanning(false);
      return;
    }

    if (!isNfcSupported()) {
      setError("Web NFC is not supported on this device. Use Chrome on Android.");
      setScanning(false);
      return;
    }

    setScanning(true);
    setError(null);

    startNfcScan(
      (result) => {
        handleScanRef.current(result.staffId, result.timestamp);
      },
      (err) => {
        setError(err.message);
        setScanning(false);
        toast.error("NFC Error", { description: err.message });
      }
    ).then((cleanup) => {
      cleanupRef.current = cleanup;
    });

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
      setScanning(false);
    };
  }, [enabled]);

  return { scanning, error, lastEvent, isSupported: isNfcSupported() };
}
