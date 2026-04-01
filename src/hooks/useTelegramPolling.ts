import { useEffect, useRef, useCallback } from "react";
import { getUpdates } from "@/lib/telegram";
import { useAppState } from "@/context/AppContext";
import type { StaffMember, StaffStatus } from "@/data/staff";
import { toast } from "sonner";

const POLL_INTERVAL_MS = 12000;

function stripPossessive(text: string): string {
  return text.replace(/'s$/i, "").replace(/s$/i, "");
}

export function useTelegramPolling(enabled: boolean) {
  const offsetRef = useRef<number>(0);
  const { staff, updateStaffStatus, addTask, markAttendance, addAlert } = useAppState();

  const findStaff = useCallback(
    (word: string): StaffMember | undefined => {
      const lower = word.toLowerCase();
      const stripped = stripPossessive(lower);
      return staff.find(
        (s) =>
          s.name.toLowerCase().startsWith(stripped) ||
          s.name.split(" ")[0].toLowerCase() === stripped ||
          s.name.toLowerCase().startsWith(lower) ||
          s.name.split(" ")[0].toLowerCase() === lower
      );
    },
    [staff]
  );

  const processText = useCallback(
    (text: string): string | null => {
      const lower = text.toLowerCase().trim();

      // "mark [name] late/absent/on duty/on-duty/off duty"
      const statusMatch = lower.match(
        /\bmark\s+(\w+)\s+(late|absent|on[\s-]duty|off[\s-]duty)\b/i
      );
      if (statusMatch) {
        const member = findStaff(statusMatch[1]);
        if (member) {
          const rawStatus = statusMatch[2].toLowerCase().replace(/\s+/, "-");
          const statusMap: Record<string, StaffStatus> = {
            late: "late",
            absent: "absent",
            "on-duty": "on-duty",
            "off-duty": "off-duty",
          };
          const status: StaffStatus = statusMap[rawStatus] ?? "on-duty";
          updateStaffStatus(member.id, status);
          if (status === "late") markAttendance(member.id, "late", "Marked late via Telegram command");
          if (status === "absent") markAttendance(member.id, "leave", "Marked absent via Telegram command");
          toast.success(`[Telegram] ${member.name} → ${status}`);
          return `✅ ${member.name} marked as ${status}`;
        }
      }

      // "add task [task text] for [name]" / "assign task [task text] to [name]"
      const taskMatch = lower.match(
        /\b(?:add|assign)\s+task\s+(.+?)\s+(?:for|to)\s+(\w+)\b/i
      );
      if (taskMatch) {
        const member = findStaff(taskMatch[2]);
        if (member) {
          const taskText = taskMatch[1].trim();
          addTask(member.id, taskText);
          toast.success(`[Telegram] Task added for ${member.name}`);
          return `✅ Task added for ${member.name}: "${taskText}"`;
        }
      }

      // "check in [name]" / "[name] checked in"
      const checkinMatch = lower.match(
        /\b(?:check.?in\s+(\w+)|(\w+)\s+checked.?in)\b/i
      );
      if (checkinMatch) {
        const nameWord = checkinMatch[1] || checkinMatch[2];
        const member = findStaff(nameWord);
        if (member) {
          updateStaffStatus(member.id, "on-duty");
          markAttendance(member.id, "check-in", "Check-in recorded via Telegram");
          toast.success(`[Telegram] ${member.name} checked in`);
          return `✅ ${member.name} checked in`;
        }
      }

      return null;
    },
    [findStaff, updateStaffStatus, addTask, markAttendance]
  );

  useEffect(() => {
    if (!enabled) return;
    let active = true;

    const poll = async () => {
      if (!active) return;
      try {
        const updates = await getUpdates(offsetRef.current);
        for (const update of updates) {
          offsetRef.current = update.update_id + 1;
          if (update.message?.text) {
            processText(update.message.text);
          }
        }
      } catch {
        // Silently fail — bot token may not be configured
      }
    };

    poll(); // immediate first run
    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [enabled, processText]);
}
