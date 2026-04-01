import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanFace, CheckCircle2, User, Clock, AlertTriangle, ArrowLeft } from "lucide-react";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageTransition } from "@/components/animations/MotionComponents";

type ScanState = "idle" | "scanning" | "success" | "error";

const NfcLogger = () => {
  const navigate = useNavigate();
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [scanMessage, setScanMessage] = useState("Ready to scan");
  const [scannedStaff, setScannedStaff] = useState<{name: string, role: string, newStatus: string, timeStr: string} | null>(null);

  // Web NFC API Check
  const nfcSupported = "NDEFReader" in window;

  const startScanning = useCallback(async () => {
    if (!nfcSupported) {
      toast.error("NFC is not supported on this device/browser.", {
        description: "Please use Chrome on an Android device with NFC enabled."
      });
      return;
    }

    try {
      setScanState("scanning");
      setScanMessage("Tap an NFC tag to the back of this device...");
      
      type NDEFReaderConstructor = new () => { scan: () => Promise<void>, onreading: (event: unknown) => void, onreadingerror: () => void };
      const ndef = new (window as unknown as { NDEFReader: NDEFReaderConstructor }).NDEFReader();
      await ndef.scan();

      ndef.onreading = async (event: unknown) => {
        const serialNumber = (event as { serialNumber: string }).serialNumber;
        await processNfcScan(serialNumber);
      };

      ndef.onreadingerror = () => {
        setScanState("error");
        setScanMessage("Error reading tag. Please try again.");
        setTimeout(() => resetScanner(), 3000);
      };

    } catch (error: unknown) {
      console.error(error);
      setScanState("error");
      setScanMessage((error as Error).message || "Failed to start NFC scanner.");
      setTimeout(() => resetScanner(), 3000);
    }
  }, [nfcSupported]);

  const processNfcScan = async (tagId: string) => {
    setScanState("scanning");
    setScanMessage("Tag detected. Authenticating...");
    
    try {
      // 1. Identify Tag
      const tagsQuery = query(collection(db, "nfc_tags"), where("tagId", "==", tagId));
      const tagsSnapshot = await getDocs(tagsQuery);
      
      if (tagsSnapshot.empty) {
        setScanState("error");
        setScanMessage("Unknown Tag. Access Denied.");
        setTimeout(() => resetScanner(), 3000);
        return;
      }

      const staffId = tagsSnapshot.docs[0].data().staffId;

      // 2. Fetch Staff Details
      const staffQuery = query(collection(db, "staff"));
      const staffSnapshot = await getDocs(staffQuery);
      let staffDoc: unknown = null;
      let staffData: Record<string, unknown> | null = null;

      staffSnapshot.forEach(doc => {
        if (doc.id === staffId) {
          staffDoc = doc;
          staffData = doc.data();
        }
      });

      if (!staffData) {
        setScanState("error");
        setScanMessage("Staff member not found in database.");
        setTimeout(() => resetScanner(), 3000);
        return;
      }

      // 3. Determine new status
      const isCheckingIn = staffData.status === "off-duty" || staffData.status === "absent";
      const newStatus = isCheckingIn ? "on-duty" : "off-duty";
      const attendanceType = isCheckingIn ? "check-in" : "check-out";
      
      const timeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

      // 4. Update Staff Status
      await updateDoc(doc(db, "staff", staffId), { status: newStatus });

      // 5. Log Attendance
      await addDoc(collection(db, "attendance"), {
        staffId: staffId,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        type: attendanceType,
        detail: `${attendanceType === "check-in" ? "Checked In" : "Checked Out"}: NFC Terminal\nTime: ${timeStr}`,
        logMethod: "nfc",
        timestamp: serverTimestamp(),
      });

      // Show Success
      setScannedStaff({ 
        name: String(staffData.name), 
        role: String(staffData.role), 
        newStatus, 
        timeStr 
      });
      setScanState("success");
      setScanMessage(isCheckingIn ? "Check-in successful!" : "Check-out successful!");
      
      // Play a sound if possible (omitted for brevity)
      
      // Auto-reset for next person
      setTimeout(() => resetScanner(), 4000);

    } catch (error: unknown) {
      console.error(error);
      setScanState("error");
      setScanMessage("Database error while processing scan.");
      setTimeout(() => resetScanner(), 3000);
    }
  };

  const resetScanner = () => {
    setScanState("idle");
    setScanMessage("Ready to scan");
    setScannedStaff(null);
  };

  useEffect(() => {
    // Attempt to start scanning on mount if supported
    if (nfcSupported) {
      startScanning();
    }
  }, [nfcSupported, startScanning]);

  return (
    <PageTransition className="h-screen bg-background flex flex-col pt-8">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
        
        <AnimatePresence mode="wait">
          {scanState === "idle" || scanState === "scanning" ? (
            <motion.div
              key="scanning"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="space-y-6"
            >
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                {scanState === "scanning" && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-[3px] border-dashed border-primary/50"
                  />
                )}
                {scanState === "scanning" && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                  />
                )}
                <div className="w-32 h-32 rounded-full glass-card flex items-center justify-center shadow-card relative z-10 bg-background/80 backdrop-blur-md">
                  <ScanFace size={56} className={`${scanState === "scanning" ? "text-primary" : "text-muted-foreground"}`} />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="display-sm text-foreground">NFC Terminal</h1>
                <p className="text-muted-foreground label-sm max-w-xs mx-auto">{scanMessage}</p>
              </div>
              {!nfcSupported && (
                <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl inline-flex items-center gap-2 max-w-sm mt-4 text-left">
                  <AlertTriangle size={24} className="shrink-0" />
                  <span>Web NFC is currently only supported on Chrome for Android.</span>
                </div>
              )}
            </motion.div>
          ) : scanState === "success" && scannedStaff ? (
            <motion.div
              key="success"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-sm glass-card rounded-3xl p-8 space-y-6 bg-status-on-time/5 border border-status-on-time/20"
            >
              <div className="w-20 h-20 rounded-full bg-status-on-time/20 flex items-center justify-center mx-auto text-status-on-time">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-1">
                <p className="text-secondary label-sm uppercase tracking-wider">{scannedStaff.newStatus === "on-duty" ? "Clocked In" : "Clocked Out"}</p>
                <h2 className="font-display text-2xl text-foreground">{scannedStaff.name}</h2>
                <p className="text-muted-foreground text-sm">{scannedStaff.role}</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-foreground font-medium bg-surface-low py-3 rounded-xl text-lg">
                <Clock size={18} className="text-secondary" />
                {scannedStaff.timeStr}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="error"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm glass-card rounded-3xl p-8 space-y-6 bg-destructive/5 border border-destructive/20"
            >
              <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto text-destructive">
                <AlertTriangle size={40} />
              </div>
              <div className="space-y-1">
                <h2 className="font-display text-2xl text-foreground">Scan Failed</h2>
                <p className="text-muted-foreground text-sm">{scanMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={scanState !== "scanning" ? startScanning : undefined}
          className={`btn-estate label-sm px-8 py-3.5 rounded-2xl transition-all ${scanState === "scanning" ? "opacity-50 pointer-events-none" : ""}`}
        >
          {scanState === "scanning" ? "Scanning..." : "Activate Scanner"}
        </button>
      </div>

      <div className="p-6">
        <button 
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 w-full glass-card py-4 rounded-2xl text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors"
        >
          <ArrowLeft size={16} /> Exit Terminal
        </button>
      </div>
    </PageTransition>
  );
};

export default NfcLogger;
