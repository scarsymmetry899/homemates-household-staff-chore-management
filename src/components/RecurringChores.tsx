import { useEffect, useState, type FormEvent } from "react";
import { useAppState } from "@/context/AppContext";
import { staffRead, staffWrite } from "@/lib/staffAccess";

type Routine = {
  id: string;
  name: string;
  assignedStaffId: string;
  roomId?: string;
  weekdays: string;
  startsOn: string;
  endsOn: string;
  localTime: string;
  instructions: string;
};
const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const field = "block w-full rounded-xl border bg-card p-3";
const button = "glass-btn rounded-xl px-4 py-3";
function newRoutine(today: string, staffId: string): Routine {
  const end = new Date(today + "T12:00:00Z");
  end.setUTCDate(end.getUTCDate() + 27);
  return {
    id: crypto.randomUUID(),
    name: "",
    assignedStaffId: staffId,
    roomId: "",
    weekdays: "1,2,3,4,5",
    startsOn: today,
    endsOn: end.toISOString().slice(0, 10),
    localTime: "08:00",
    instructions: "",
  };
}

export default function RecurringChores({
  householdId,
}: {
  householdId: string;
}) {
  const { staff, rooms, householdProfile } = useAppState();
  const zone = householdProfile?.timezone || "Asia/Kolkata";
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [draft, setDraft] = useState<Routine | null>(null);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [occurrences, setOccurrences] = useState<
    {
      id: string;
      occurrenceDay: string;
      title: string;
      assignedStaffId: string;
    }[]
  >([]);
  const [single, setSingle] = useState<(typeof occurrences)[number] | null>(
    null,
  );
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    staffRead<{ routines: Routine[] }>("HouseholdRoutines", { householdId })
      .then(({ data }) => {
        if (active) setRoutines(data.routines);
      })
      .catch(() => {
        if (active)
          setMessage("Could not load recurring chores. Please refresh.");
      });
    return () => {
      active = false;
    };
  }, [householdId, revision]);
  function edit<K extends keyof Routine>(key: K, value: Routine[K]) {
    setDraft((prev) => prev && { ...prev, [key]: value });
  }
  function saved(text: string) {
    setSingle(null);
    setDraft(null);
    setMessage(text);
    setRevision((v) => v + 1);
    window.dispatchEvent(new Event("homemates-saved"));
  }
  async function openOne(id: string) {
    setBusy(true);
    setDraft(null);
    setSingle(null);
    setMessage("");
    try {
      const { data } = await staffRead<{ chores: typeof occurrences }>(
        "RoutineOccurrences",
        { id },
      );
      setOccurrences(data.chores);
      setSingle(data.chores[0] || null);
      if (!data.chores.length) setMessage("No pending occurrences to edit.");
    } catch {
      setMessage("Could not load occurrences. Please retry.");
    } finally {
      setBusy(false);
    }
  }
  async function saveOne(e: FormEvent) {
    e.preventDefault();
    if (!single || busy) return;
    setBusy(true);
    try {
      await staffWrite("EditOneChore", {
        id: single.id,
        householdId,
        staffId: single.assignedStaffId,
        name: single.title.trim(),
      });
      saved("Occurrence updated.");
    } catch {
      setMessage(
        "Could not save this occurrence. Check its current status and retry.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!draft || busy) return;
    const {
      id,
      name,
      assignedStaffId,
      roomId,
      weekdays,
      startsOn,
      endsOn,
      localTime,
      instructions,
    } = draft;
    if (!weekdays) {
      setMessage("Choose at least one weekday.");
      return;
    }
    const days = (Date.parse(endsOn) - Date.parse(startsOn)) / 86400000;
    if (days < 0 || days > 90) {
      setMessage("Choose an end date within 90 days of the start.");
      return;
    }
    const eligibleStart = new Date(
      (startsOn > today ? startsOn : today) + "T12:00:00Z",
    );
    const eligibleDays = Math.min(
      7,
      1 +
        Math.round(
          (Date.parse(endsOn + "T12:00:00Z") - eligibleStart.getTime()) /
            86400000,
        ),
    );
    if (
      !Array.from({ length: Math.max(0, eligibleDays) }, (_, offset) =>
        String(((eligibleStart.getUTCDay() + offset + 6) % 7) + 1),
      ).some((day) => weekdays.split(",").includes(day))
    ) {
      setMessage("No selected weekday falls in the remaining dates.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const vars = {
        id,
        name: name.trim(),
        staffId: assignedStaffId,
        roomId: roomId || null,
        weekdays,
        start: startsOn,
        end: endsOn,
        time: localTime,
        instructions: instructions || "",
      };
      await staffWrite(
        editing ? "EditRoutine" : "CreateRoutine",
        editing ? vars : { ...vars, householdId },
      );
      saved(
        editing ? "Upcoming chores updated." : "Recurring chore scheduled.",
      );
    } catch {
      setMessage(
        "Could not confirm the save. Refresh the list before retrying.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function stop(id: string) {
    if (
      !window.confirm(
        "Stop this routine and remove its pending chores from today onward?",
      )
    )
      return;
    setBusy(true);
    try {
      await staffWrite("StopRoutine", { id });
      saved("Recurring chore stopped.");
    } catch {
      setMessage("Could not stop this routine. Please retry.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <details className="glass-card space-y-3 p-4 rounded-2xl">
      <summary className="cursor-pointer font-semibold">
        Recurring chores
      </summary>
      <ul>
        {routines.map((r) => (
          <li key={r.id} className="border-b py-3 space-y-1">
            <strong>{r.name}</strong>
            <p>
              {r.weekdays
                .split(",")
                .map((d) => labels[Number(d) - 1])
                .join(", ")}{" "}
              · {r.localTime} ·{" "}
              {staff.find((s) => s.id === r.assignedStaffId)?.name ||
                "Unassigned"}
            </p>
            <p>Through {r.endsOn}</p>
            <button
              className={button}
              disabled={busy}
              onClick={() => openOne(r.id)}
            >
              Edit one occurrence
            </button>
            <button
              className={button}
              disabled={busy}
              onClick={() => {
                setSingle(null);
                setDraft({ ...r });
                setEditing(true);
                setMessage("");
              }}
            >
              Edit upcoming chores
            </button>{" "}
            <button
              className={button}
              disabled={busy}
              onClick={() => stop(r.id)}
            >
              Stop routine
            </button>
          </li>
        ))}
      </ul>
      {!draft && !single && (
        <button
          className={button}
          onClick={() => {
            setEditing(false);
            setDraft(newRoutine(today, staff[0]?.id || ""));
            setMessage("");
          }}
        >
          Add recurring chore
        </button>
      )}
      {single && (
        <form className="grid gap-3" onSubmit={saveOne}>
          <label>
            Occurrence date
            <select
              aria-label="Occurrence date"
              className={field}
              value={single.id}
              onChange={(e) =>
                setSingle(
                  occurrences.find((o) => o.id === e.target.value) || null,
                )
              }
            >
              {occurrences.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.occurrenceDay}
                </option>
              ))}
            </select>
          </label>
          <label>
            Chore for this date
            <input
              required
              className={field}
              value={single.title}
              onChange={(e) => setSingle({ ...single, title: e.target.value })}
            />
          </label>
          <label>
            Staff for this date
            <select
              aria-label="Staff for this date"
              className={field}
              value={single.assignedStaffId}
              onChange={(e) =>
                setSingle({ ...single, assignedStaffId: e.target.value })
              }
            >
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <button disabled={busy} className={button}>
            Save this occurrence
          </button>
          <button
            type="button"
            className={button}
            onClick={() => setSingle(null)}
          >
            Cancel
          </button>
        </form>
      )}
      {draft && (
        <form onSubmit={save} className="grid gap-3">
          <label>
            Chore name
            <input
              required
              className={field}
              value={draft.name}
              onChange={(e) => edit("name", e.target.value)}
            />
          </label>
          <label>
            Assigned staff
            <select
              aria-label="Assigned staff"
              required
              className={field}
              value={draft.assignedStaffId}
              onChange={(e) => edit("assignedStaffId", e.target.value)}
            >
              <option value="">Choose staff</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Room
            <select
              className={field}
              value={draft.roomId || ""}
              onChange={(e) => edit("roomId", e.target.value)}
            >
              <option value="">Any room</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend>Repeat on</legend>
            <div className="flex flex-wrap gap-2">
              {labels.map((label, i) => {
                const day = String(i + 1),
                  selected = draft.weekdays.split(",").filter(Boolean),
                  checked = selected.includes(day);
                return (
                  <label key={day} className="rounded-lg border p-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        edit(
                          "weekdays",
                          (checked
                            ? selected.filter((d) => d !== day)
                            : [...selected, day]
                          )
                            .sort()
                            .join(","),
                        )
                      }
                    />{" "}
                    {label}
                  </label>
                );
              })}
            </div>
          </fieldset>
          <label>
            Start date
            <input
              required
              className={field}
              type="date"
              min={editing ? undefined : today}
              value={draft.startsOn}
              onChange={(e) => edit("startsOn", e.target.value)}
            />
          </label>
          <label>
            Repeat until
            <input
              required
              className={field}
              type="date"
              min={draft.startsOn}
              value={draft.endsOn}
              onChange={(e) => edit("endsOn", e.target.value)}
            />
          </label>
          <label>
            Due time ({zone})
            <input
              required
              className={field}
              type="time"
              value={draft.localTime}
              onChange={(e) => edit("localTime", e.target.value)}
            />
          </label>
          <label>
            Instructions (optional)
            <textarea
              className={field}
              value={draft.instructions || ""}
              onChange={(e) => edit("instructions", e.target.value)}
            />
          </label>
          {editing && (
            <p>
              These changes apply to pending occurrences from today onward. To
              change one occurrence, edit its task.
            </p>
          )}
          <button
            className="btn-estate text-primary-foreground rounded-xl p-3"
            disabled={busy}
          >
            {busy ? "Saving…" : "Save schedule"}
          </button>
          <button
            type="button"
            disabled={busy}
            className={button}
            onClick={() => setDraft(null)}
          >
            Cancel
          </button>
        </form>
      )}
      {message && (
        <p role="status">
          {message}{" "}
          <button
            className="underline"
            onClick={() => setRevision((v) => v + 1)}
          >
            Refresh list
          </button>
        </p>
      )}
    </details>
  );
}
