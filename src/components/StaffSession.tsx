import { useCallback, useEffect, useState, type ReactNode } from "react";
import { staffRead, staffWrite, type StaffWork } from "@/lib/staffAccess";
import { getCurrentAuthUser } from "@/lib/firebase";

const button = "glass-btn rounded-xl px-4 py-3";
const card = "glass-card rounded-2xl p-5 space-y-3";

export default function StaffSession({
  uid,
  onLogout,
  children,
}: {
  uid: string;
  onLogout: () => void;
  children: ReactNode;
}) {
  const [hash, setHash] = useState(location.hash);
  const [mode, setMode] = useState<"loading" | "owner" | "staff" | "error">(
    "loading",
  );
  const [version, setVersion] = useState(0);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const joining = hash.startsWith("#/join/");
  useEffect(() => {
    let active = true;
    if (joining)
      getCurrentAuthUser().then((user) => {
        if (active) setEmail(user?.email || "");
      });
    return () => {
      active = false;
    };
  }, [joining, uid]);
  useEffect(() => {
    const change = () => {
      setHash(location.hash);
      setError("");
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    let active = true;
    if (joining) return;
    setMode("loading");
    staffRead<{ profiles: { id: string }[] }>("MyStaffIdentity")
      .then(({ data }) => {
        if (active) setMode(data.profiles.length ? "staff" : "owner");
      })
      .catch(() => {
        if (active) setMode("error");
      });
    return () => {
      active = false;
    };
  }, [uid, joining, version]);
  async function accept() {
    const [, , staffId, code] = hash.split("/");
    setWorking(true);
    setError("");
    const openWork = () => {
      history.replaceState(
        null,
        "",
        location.pathname + location.search + "#/my-day",
      );
      setMode("staff");
      setHash("#/my-day");
    };
    try {
      await staffWrite("ClaimStaffLogin", { staffId, code });
      openWork();
    } catch {
      const result = await staffRead<{ profiles: { id: string }[] }>(
        "MyStaffIdentity",
      ).catch(() => null);
      if (
        result?.data.profiles.some(
          (p) => p.id.replace(/-/g, "") === staffId?.replace(/-/g, ""),
        )
      )
        openWork();
      else
        setError(
          "Could not accept this invitation. Check your connection or ask the owner for a new link.",
        );
    } finally {
      setWorking(false);
    }
  }
  if (!joining && mode === "owner") return <>{children}</>;
  if (!joining && mode === "staff")
    return <PersonalStaffDay onLogout={onLogout} />;
  return (
    <main className="native-entry mx-auto max-w-md p-5 space-y-4">
      <h1 className="display-sm">
        {joining ? "Join your household" : "Opening your household"}
      </h1>
      {joining && (
        <>
          <p>
            Connect {email || "this signed-in account"} to the staff profile on
            your invitation.
          </p>
          <button disabled={working} onClick={accept} className={button}>
            {working ? "Connecting…" : "Accept staff invitation"}
          </button>
        </>
      )}
      {error && <p role="alert">{error}</p>}
      {!joining && mode === "error" && (
        <>
          <p>Could not check your household access.</p>
          <button className={button} onClick={() => setVersion((v) => v + 1)}>
            Retry
          </button>
        </>
      )}
      <button className={button} onClick={onLogout}>
        Sign out
      </button>
    </main>
  );
}

function PersonalStaffDay({ onLogout }: { onLogout: () => void }) {
  const [work, setWork] = useState<StaffWork>();
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((v) => v + 1), []);
  const [busy, setBusy] = useState("");
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    let active = true;
    staffRead<StaffWork>("MyStaffWork")
      .then(({ data }) => {
        if (active) {
          setWork(data);
          setError("");
        }
      })
      .catch(() => {
        if (active) {
          setWork(undefined);
          setError("Could not load your work. Please retry.");
        }
      });
    return () => {
      active = false;
    };
  }, [revision]);
  useEffect(() => {
    const timer = setInterval(refresh, 15000);
    window.addEventListener("focus", refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);
  const person = work?.profiles[0];
  const today =
    person &&
    new Intl.DateTimeFormat("en-CA", {
      timeZone: person.household.timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  const tasks = (work?.tasks || [])
    .filter(
      (t) =>
        showAll ||
        !t.occurrenceDay ||
        t.occurrenceDay === today ||
        (t.occurrenceDay < today && t.status !== "completed"),
    )
    .sort((a, b) => (a.dueAt || "").localeCompare(b.dueAt || ""));
  async function finish(id: string) {
    if (busy) return;
    setBusy(id);
    try {
      await staffWrite("CompleteMyStaffTask", { taskId: id });
      refresh();
    } catch {
      setError(
        "Could not confirm completion. Refresh to check the task before retrying.",
      );
    } finally {
      setBusy("");
    }
  }
  return (
    <main className="native-entry mx-auto max-w-2xl space-y-5 p-4">
      <header className="flex justify-between items-center">
        <span className="residence-brand">Homemates</span>
        <button className={button} onClick={onLogout}>
          Sign out
        </button>
      </header>
      <h1 className="display-sm">My work</h1>
      {error && <p role="alert">{error}</p>}
      {!work && !error && <p>Loading your work…</p>}
      {work && !person && (
        <p>Your staff access has ended. Contact your household owner.</p>
      )}
      <button className={button} onClick={refresh}>
        Refresh
      </button>
      {work && person && (
        <>
          <p>
            {person.name} · {person.role} · {person.household.name}
          </p>
          <section className={card}>
            <h2 className="headline-sm">My tasks</h2>
            <button
              className={button}
              onClick={() => setShowAll((v) => !v)}
              aria-pressed={showAll}
            >
              {showAll ? "Show current tasks" : "Show all dates"}
            </button>
            {!tasks.length && <p>No assigned tasks for this view.</p>}
            {tasks.map((t) => (
              <div
                key={t.id}
                className="border-t py-2 flex flex-wrap justify-between items-center gap-2"
              >
                <span>
                  {t.title}
                  {t.dueAt && (
                    <small className="block">
                      Due{" "}
                      {new Date(t.dueAt).toLocaleString(undefined, {
                        timeZone: person.household.timezone,
                      })}
                    </small>
                  )}
                  {t.routineRoom && (
                    <small className="block">{t.routineRoom}</small>
                  )}
                  {t.routineInstructions && (
                    <small className="block whitespace-pre-line">
                      {t.routineInstructions}
                    </small>
                  )}
                </span>
                {t.status === "completed" ? (
                  <span>Completed</span>
                ) : (
                  <button
                    className={button}
                    disabled={!!busy}
                    onClick={() => finish(t.id)}
                  >
                    {busy === t.id ? "Saving…" : "Mark complete"}
                  </button>
                )}
              </div>
            ))}
          </section>
          <section className={card}>
            <h2 className="headline-sm">My attendance</h2>
            {!work.attendance.length && !work.corrections.length && (
              <p>No attendance recorded.</p>
            )}
            {work.corrections.map((c) => (
              <p key={c.id}>
                {c.requestedFor} · {c.requestedStatus} (approved correction)
              </p>
            ))}
            {work.attendance.map((e) => (
              <p key={e.id}>
                {new Date(e.occurredAt).toLocaleString(undefined, {
                  timeZone: person.household.timezone,
                })}{" "}
                · {e.eventType}
              </p>
            ))}
          </section>
          <section className={card}>
            <h2 className="headline-sm">My pay</h2>
            {!work.pay.length && <p>No pay statement yet.</p>}
            {work.pay.map((p) => (
              <div key={p.id} className="border-t py-2">
                <strong>
                  {p.monthLabel} · {p.status}
                </strong>
                <p>
                  Base ₹{p.baseSalary} · Deductions ₹{p.deductions} · Advances ₹
                  {p.advances}
                </p>
                <p>Net pay ₹{p.netPay}</p>
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
