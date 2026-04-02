const SHEETS_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL as string | undefined;

export interface AttendanceLogRow {
  staffId: string;
  staffName: string;
  staffRole: string;
  eventType: "check-in" | "check-out" | "nfc-tap";
  timestamp: string; // ISO string
  date: string;
  time: string;
  logMethod: "nfc" | "manual" | "telegram";
  notes?: string;
}

export async function logAttendanceToSheets(row: AttendanceLogRow): Promise<boolean> {
  if (!SHEETS_WEBHOOK_URL) {
    console.warn("VITE_GOOGLE_SHEETS_WEBHOOK_URL not set. Skipping Google Sheets log.");
    return false;
  }
  try {
    const res = await fetch(SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logAttendance", ...row }),
      mode: "no-cors", // Apps Script requires no-cors
    });
    // no-cors means we can't read the response, assume success
    console.log("Sheets log sent:", res.type);
    return true;
  } catch (e) {
    console.error("Failed to log to Google Sheets:", e);
    return false;
  }
}

export function getSheetsSetupInstructions(): string {
  return `To enable Google Sheets sync:
1. Open Google Sheets, create a new spreadsheet
2. Add headers: Staff ID | Name | Role | Event | Timestamp | Date | Time | Method | Notes
3. Go to Extensions > Apps Script
4. Paste the following script and deploy as Web App (Anyone can access):

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  if (data.action === 'logAttendance') {
    sheet.appendRow([data.staffId, data.staffName, data.staffRole, data.eventType, data.timestamp, data.date, data.time, data.logMethod, data.notes || '']);
  }
  return ContentService.createTextOutput('OK');
}

5. Copy the deployed URL
6. Add to .env.local: VITE_GOOGLE_SHEETS_WEBHOOK_URL="<your URL>"`;
}
