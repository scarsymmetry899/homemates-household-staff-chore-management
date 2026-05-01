/**
 * Module-level bridge for the NFC simulateTap function.
 *
 * The real `useNfcAttendance` hook lives in <AppInner />, but the test-mode
 * UI lives in SettingsPage. Rather than plumb a function through context
 * (which would force every consumer to re-render whenever its identity
 * changes), AppInner registers the latest simulateTap here and SettingsPage
 * looks it up at click time.
 */

type SimulateTap = (
  staffId: string,
  opts?: { forceEventType?: "check-in" | "check-out"; sendTelegram?: boolean }
) => void;

let _simulateTap: SimulateTap | null = null;

export function registerSimulateTap(fn: SimulateTap): void {
  _simulateTap = fn;
}

export function getSimulateTap(): SimulateTap | null {
  return _simulateTap;
}
