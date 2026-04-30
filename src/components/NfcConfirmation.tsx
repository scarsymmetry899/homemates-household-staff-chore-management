import { useEffect, useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock } from "lucide-react";
import type { NfcEvent } from "@/hooks/useNfcAttendance";
import type { StaffMember } from "@/data/staff";

interface Props {
  event: NfcEvent | null;
  staff: StaffMember[];
  /** Auto-dismiss duration in ms. Default 5000. */
  durationMs?: number;
}

/**
 * Full-screen confirmation overlay shown after a successful NFC tap.
 * Displays photo, name, time, date, and lateness/early-leave status.
 * Auto-dismisses after `durationMs`; tap anywhere to dismiss earlier.
 */
export default function NfcConfirmation({ event, staff, durationMs = 5000 }: Props) {
  const [shownTimestamp, setShownTimestamp] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!event) return;
    const ts = event.timestamp.getTime();
    if (ts === shownTimestamp) return; // already showed (or dismissed) this exact event
    setShownTimestamp(ts);
    setDismissed(false);
    const timer = setTimeout(() => setDismissed(true), durationMs);
    return () => clearTimeout(timer);
  }, [event, durationMs, shownTimestamp]);

  const member = event ? staff.find((s) => s.id === event.staffId) : null;
  const visible = !!event && !!member && !dismissed;

  // Compute display content (only meaningful when visible — avoids null guards in JSX)
  let isCheckIn = true;
  let eyebrow = "";
  let title = "";
  let subtitle = "";
  let timeStr = "";
  let dateStr = "";
  let statusLabel = "";
  let statusVar = "--status-on-time";

  if (event && member) {
    isCheckIn = event.eventType === "check-in";

    timeStr = event.timestamp.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    dateStr = event.timestamp.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const firstName = member.name.split(" ")[0];

    if (isCheckIn) {
      eyebrow = "Attendance Recorded";
      title = `Welcome, ${firstName}`;
      subtitle = "Have a great shift today!";
    } else {
      eyebrow = "Shift Complete";
      title = `Thank you, ${firstName}`;
      subtitle = "Have a wonderful day!";
    }

    switch (event.status) {
      case "late":
        statusLabel = `${event.minutesOffset} min late`;
        statusVar = "--status-late";
        break;
      case "early-arrival":
        statusLabel = `${Math.abs(event.minutesOffset)} min early`;
        statusVar = "--status-on-time";
        break;
      case "early-leave":
        statusLabel = `Left ${Math.abs(event.minutesOffset)} min early`;
        statusVar = "--status-late";
        break;
      case "overtime":
        statusLabel = `${event.minutesOffset} min overtime`;
        statusVar = "--status-on-time";
        break;
      case "no-shift":
        statusLabel = "Recorded";
        statusVar = "--status-leave";
        break;
      case "on-time":
      default:
        statusLabel = isCheckIn ? "On time" : "Shift complete";
        statusVar = "--status-on-time";
    }
  }

  const accentColor = `hsl(var(${statusVar}))`;
  const ringStyle: CSSProperties = {
    boxShadow: `0 0 0 4px ${accentColor}, 0 0 0 8px hsl(var(${statusVar}) / 0.18)`,
  };

  return (
    <AnimatePresence>
      {visible && member && event && (
        <motion.div
          key={shownTimestamp ?? "nfc"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={() => setDismissed(true)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cursor-pointer"
          style={{
            background: "rgba(47, 65, 86, 0.55)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          aria-live="polite"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.92, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-3xl shadow-2xl w-full max-w-md overflow-hidden cursor-default"
          >
            <div className="px-8 pt-9 pb-7 flex flex-col items-center text-center">
              {/* Photo with accent ring + check badge */}
              <div className="relative mb-5">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover"
                  style={ringStyle}
                />
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.18, type: "spring", stiffness: 500, damping: 18 }}
                  className="absolute -bottom-1 -right-1 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ring-4 ring-card"
                  style={{ background: accentColor }}
                >
                  <Check size={26} strokeWidth={3} />
                </motion.div>
              </div>

              {/* Eyebrow */}
              <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-muted-foreground mb-1.5">
                {eyebrow}
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-foreground leading-tight mb-1">
                {title}
              </h2>

              {/* Role */}
              <p className="text-sm text-muted-foreground mb-4">{member.role}</p>

              {/* Subtitle */}
              <p className="text-sm text-foreground/70 mb-6 italic">{subtitle}</p>

              {/* Big time */}
              <div className="text-5xl font-bold tabular-nums text-foreground tracking-tight mb-1.5">
                {timeStr}
              </div>

              {/* Date */}
              <div className="text-sm text-muted-foreground mb-5">{dateStr}</div>

              {/* Status pill */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white shadow-sm"
                style={{ background: accentColor }}
              >
                <Clock size={12} strokeWidth={2.5} />
                {statusLabel}
              </div>
            </div>

            {/* Auto-dismiss progress bar */}
            <div className="h-1 bg-muted/40 relative overflow-hidden">
              <motion.div
                key={`bar-${shownTimestamp}`}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: durationMs / 1000, ease: "linear" }}
                className="absolute inset-y-0 left-0"
                style={{ background: accentColor }}
              />
            </div>

            {/* Hint */}
            <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground text-center">
              Tap anywhere to dismiss
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
