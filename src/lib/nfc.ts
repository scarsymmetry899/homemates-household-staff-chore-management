export interface NfcScanResult {
  staffId: string;
  rawData: string;
  timestamp: Date;
}

export type NfcScanCallback = (result: NfcScanResult) => void;
export type NfcErrorCallback = (error: Error) => void;

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
      try {
        const decoder = new TextDecoder();
        for (const record of event.message.records) {
          if (record.recordType === "text" || record.recordType === "url") {
            const rawData = decoder.decode(record.data);
            // Expect format: "homemates:staffId:XXXXX"
            const parts = rawData.split(":");
            const staffId = parts.length >= 3 ? parts[2] : rawData;
            onScan({ staffId, rawData, timestamp: new Date() });
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
  await writer.write({
    records: [{ recordType: "text", data: `homemates:staffId:${staffId}` }],
  });
}

export function isNfcSupported(): boolean {
  return "NDEFReader" in window;
}
