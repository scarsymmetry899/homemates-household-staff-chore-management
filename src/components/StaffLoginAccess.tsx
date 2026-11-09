import { useEffect, useState } from "react";
import { staffRead, staffWrite } from "@/lib/staffAccess";

export default function StaffLoginAccess({ staffId }: { staffId: string }) {
  const [status, setStatus] = useState("Loading access…");
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState(0);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    staffRead<{ profiles: { loginUid?: string; inviteIssuedAt?: string }[] }>(
      "OwnerStaffAccess",
      { staffId },
    )
      .then(({ data }) => {
        if (!active) return;
        const profile = data.profiles[0];
        setStatus(
          profile?.loginUid
            ? "Connected"
            : profile?.inviteIssuedAt
              ? "Invitation issued"
              : "No staff login",
        );
      })
      .catch(() => {
        if (active) setStatus("Access unavailable");
      });
    return () => {
      active = false;
    };
  }, [staffId, retry]);
  async function update(create: boolean) {
    if (busy) return;
    setBusy(true);
    setError("");
    setLink("");
    try {
      if (create) {
        const code = crypto.randomUUID();
        await staffWrite("InviteStaffLogin", { staffId, code });
        setLink(
          location.origin +
            location.pathname +
            "#/join/" +
            staffId +
            "/" +
            code,
        );
        setStatus("Invitation issued");
      } else {
        await staffWrite("RevokeStaffLogin", { staffId });
        setStatus("No staff login");
      }
    } catch {
      setError("Could not update access. Check your connection and retry.");
      setRetry((v) => v + 1);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="glass-card p-5 rounded-2xl space-y-3">
      <h2 className="headline-sm">Staff sign-in</h2>
      <p aria-live="polite">{status}</p>
      {status === "Access unavailable" ? (
        <button onClick={() => setRetry((v) => v + 1)}>Retry</button>
      ) : (
        status !== "Loading access…" && (
          <div className="flex flex-wrap gap-3">
            {status !== "Connected" && (
              <button
                className="btn-estate rounded-xl p-3 text-primary-foreground"
                disabled={busy}
                onClick={() => update(true)}
              >
                {status === "Invitation issued"
                  ? "Replace invitation"
                  : "Create invitation"}
              </button>
            )}
            {status !== "No staff login" && (
              <button
                className="glass-btn rounded-xl p-3"
                disabled={busy}
                onClick={() => update(false)}
              >
                {status === "Connected"
                  ? "Disconnect staff login"
                  : "Cancel invitation"}
              </button>
            )}
          </div>
        )
      )}
      {link && (
        <div className="space-y-2">
          <label className="block">
            Private invitation link
            <input
              className="w-full rounded-lg border p-2"
              readOnly
              value={link}
              onFocus={(e) => e.target.select()}
            />
          </label>
          <p className="text-sm">
            Share privately with this staff member. The link can be used once
            within 24 hours.
          </p>
          <button
            className="glass-btn p-2 rounded-lg"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(link);
                setError("Invitation copied.");
              } catch {
                setError("Select and copy the link above.");
              }
            }}
          >
            Copy invitation
          </button>
        </div>
      )}
      {error && <p role="status">{error}</p>}
    </section>
  );
}
