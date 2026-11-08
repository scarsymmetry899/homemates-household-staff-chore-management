export interface NfcScanResult {
  staffId: string;
  rawData: string;
  timestamp: Date;
}

export type NfcScanCallback = (result: NfcScanResult) => void;
export type NfcErrorCallback = (error: Error) => void;
let programming = false;

// Returns a cleanup function
export async function startNfcScan(onScan: NfcScanCallback, onError: NfcErrorCallback): Promise<() => void> {
  // Check for NDEFReader support
  if (!("NDEFReader" in window)) {
    onError(new Error("Web NFC is not supported on this device/browser. Use Chrome on Android."));
    return () => {};
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reader = new (window as any).NDEFReader();
    await reader.scan();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (event: any) => {
      if (programming) return;
      try {
        const decoder = new TextDecoder();
        for (const record of event.message.records) {
          if (record.recordType === "text" || record.recordType === "url") {
            const rawData = decoder.decode(record.data);
            // Expect format: "homemates:staffId:XXXXX"
            const match = /^homemates:staffId:([^:\s]+)$/.exec(rawData);
            if (!match) continue;
            const staffId = match[1];
            onScan({ staffId, rawData, timestamp: new Date() });
            break;
          }
        }
      } catch (e) {
        onError(e instanceof Error ? e : new Error("NFC read error"));
      }
    };
    reader.addEventListener("reading", handler);
    return () => reader.removeEventListener("reading", handler);
  } catch (e) {
    onError(e instanceof Error ? e : new Error("Failed to start NFC scan"));
    return () => {};
  }
}

// Write a staff ID to an NFC tag
export async function writeNfcTag(staffId: string): Promise<void> {
  if (!("NDEFReader" in window)) throw new Error("Web NFC not supported");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const writer = new (window as any).NDEFReader();
  if (programming) throw new Error("Finish the current tag setup first.");
  const payload = `homemates:staffId:${staffId}`;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 45000);
  programming = true;
  try {
    await writer.write({ records: [{ recordType: "text", data: payload }] }, { signal: controller.signal });
    const readback = new Promise<void>((resolve, reject) => {
      writer.onreading = (event: { message: { records: { recordType: string; data: DataView }[] } }) => {
        const verified = event.message.records.some(record =>
          record.recordType === "text" && new TextDecoder().decode(record.data) === payload
        );
        if (verified) resolve();
        else reject(new Error("Different sticker detected. Try again with the sticker you wrote."));
      };
      writer.onreadingerror = () => reject(new Error("Could not read the sticker. Hold it against the phone and retry."));
      controller.signal.addEventListener("abort", () => reject(new Error("Verification timed out. Tap the sticker again to retry.")), { once: true });
    });
    await Promise.all([readback, writer.scan({ signal: controller.signal })]);
  } finally {
    writer.onreading = null;
    writer.onreadingerror = null;
    controller.abort();
    window.clearTimeout(timeout);
    programming = false;
  }
}

export function isNfcSupported(): boolean {
  return "NDEFReader" in window;
}
