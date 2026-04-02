import { useEffect, useRef, useState, useCallback } from "react";
import { startNfcScan, isNfcSupported } from "@/lib/nfc";
import { logAttendanceToSheets } from "@/lib/googleSheets";
import { useAppState } from "@/context/AppContext";
import type { StaffStatus } from "@/data/staff";
import { toast } from "sonner";
import { sendMessage } from "@/lib/telegram";

export interface NfcEvent {
  staffId: string;
  staffName: string;
  eventType: "check-in" | "check-out";
  timestamp: Date;
}

export function useNfcAttendance(enabled: boolean) {
  const { staff, updateStaffStatus, markAttendance } = useAppState();
  const cleanupRef = useRef<(() => void) | null>(null);
  const [lastEvent, setLastEvent] = useState<NfcEvent | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = useCallback(
    async (staffId: string, timestamp: Date) => {
      const member = staff.find((s) => s.id === staffId);
      if (!member) {
        toast.error("Unknown NFC tag", { description: `Staff ID: ${staffId}` });
        return;
      }

      // Toggle: if on-duty → check out, otherwise → check in
      const isOnDuty = member.status === "on-duty";
      const eventType: "check-in" | "check-out" = isOnDuty ? "check-out" : "check-in";
      const newStatus: StaffStatus = isOnDuty ? "off-duty" : "on-duty";

      updateStaffStatus(member.id, newStatus);

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

      const detail =
        eventType === "check-in"
          ? `NFC Check-in: ${timeStr}\nMethod: NFC Tag`
          : `NFC Check-out: ${timeStr}\nMethod: NFC Tag`;

      markAttendance(member.id, eventType, detail);

      const event: NfcEvent = {
        staffId: member.id,
        staffName: member.name,
        eventType,
        timestamp,
      };
      setLastEvent(event);

      toast.success(`${member.name} ${eventType === "check-in" ? "checked in" : "checked out"}`, {
        description: `${timeStr} · NFC`,
      });

      // Log to Google Sheets
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

      // Notify owner via Telegram (if owner has a chat ID saved in settings)
      const ownerChatId = localStorage.getItem("homemaker_owner_telegram_chat_id");
      if (ownerChatId) {
        await sendMessage(
          ownerChatId,
          `🏠 <b>${member.name}</b> (${member.role}) just <b>${eventType === "check-in" ? "arrived" : "left"}</b> at ${timeStr}`
        );
      }

      // Also notify the staff member on their own Telegram
      if (member.telegramChatId) {
        await sendMessage(
          member.telegramChatId,
          `✅ Your ${eventType} has been recorded at ${timeStr}. Have a great ${eventType === "check-in" ? "shift" : "day"}!`
        );
      }
    },
    [staff, updateStaffStatus, markAttendance]
  );

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
        handleScan(result.staffId, result.timestamp);
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
  }, [enabled, handleScan]);

  return { scanning, error, lastEvent, isSupported: isNfcSupported() };
}
