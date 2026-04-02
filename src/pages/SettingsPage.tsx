import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Users, Receipt, BarChart3, Shield, Moon, Globe, ChevronRight, LogOut, User, Pencil, Wifi, MessageCircle, Check, X, Nfc, Send } from "lucide-react";
import { PageTransition, AnimatedCard, PullToRefresh } from "@/components/animations/MotionComponents";
import { useAppState } from "@/context/AppContext";
import { useNfcAttendance } from "@/hooks/useNfcAttendance";
import { isNfcSupported, writeNfcTag } from "@/lib/nfc";
import { toast } from "sonner";

interface SettingToggle {
  id: string;
  label: string;
  description: string;
  icon: typeof Bell;
  defaultOn: boolean;
}

interface SettingsPageProps {
  onLogout: () => void;
}

const settingSections: { title: string; items: SettingToggle[] }[] = [
  {
    title: "Notifications",
    items: [
      { id: "alerts", label: "Staff Alerts", description: "Late arrivals, absences & security", icon: Bell, defaultOn: true },
      { id: "tasks", label: "Task Updates", description: "Completion and assignment changes", icon: Shield, defaultOn: true },
      { id: "expenses", label: "Expense Alerts", description: "Budget thresholds and new entries", icon: Receipt, defaultOn: false },
    ],
  },
  {
    title: "Dashboard Modules",
    items: [
      { id: "personnel", label: "Personnel Tracking", description: "Show staff cards on home", icon: Users, defaultOn: true },
      { id: "financials", label: "Financial Snapshot", description: "Monthly expenditure overview", icon: BarChart3, defaultOn: true },
      { id: "insights", label: "Attendance Insights", description: "Heatmap and stats on home", icon: Globe, defaultOn: true },
    ],
  },
  {
    title: "Appearance",
    items: [
      { id: "darkMode", label: "Dark Mode", description: "Switch to dark theme", icon: Moon, defaultOn: false },
    ],
  },
];

const SettingsPage = ({ onLogout }: SettingsPageProps) => {
  const { ownerName, setOwnerName, isDarkMode, setDarkMode, staff } = useAppState();
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {};
    settingSections.forEach((s) => s.items.forEach((i) => (defaults[i.id] = i.defaultOn)));
    defaults.darkMode = isDarkMode;
    defaults.nfcEnabled = false;
    return defaults;
  });
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(ownerName);

  // Telegram owner chat ID
  const [ownerChatId, setOwnerChatId] = useState(
    () => localStorage.getItem("homemaker_owner_telegram_chat_id") || ""
  );
  const [editingChatId, setEditingChatId] = useState(false);
  const [chatIdInput, setChatIdInput] = useState(ownerChatId);

  // NFC write picker
  const [nfcWriteStaffId, setNfcWriteStaffId] = useState<string | null>(null);
  const [writingNfc, setWritingNfc] = useState(false);

  // NFC attendance scanning
  const { scanning, error: nfcError, lastEvent, isSupported: nfcSupported } = useNfcAttendance(
    toggles.nfcEnabled && nfcSupported
  );

  const handleToggle = (id: string) => {
    if (id === "darkMode") {
      setDarkMode(!toggles.darkMode);
    }
    setToggles((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (id !== "nfcEnabled") {
        toast.success(next[id] ? "Enabled" : "Disabled", {
          description: settingSections.flatMap((s) => s.items).find((i) => i.id === id)?.label,
        });
      } else {
        if (next.nfcEnabled && !nfcSupported) {
          toast.error("NFC not supported", { description: "Use Chrome on Android for NFC." });
          return prev;
        }
        toast.success(next.nfcEnabled ? "NFC Scanning Active" : "NFC Scanning Stopped");
      }
      return next;
    });
  };

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setOwnerName(nameInput.trim());
      toast.success("Display name updated", { description: nameInput.trim() });
    }
    setEditingName(false);
  };

  const handleSaveChatId = () => {
    const trimmed = chatIdInput.trim();
    setOwnerChatId(trimmed);
    localStorage.setItem("homemaker_owner_telegram_chat_id", trimmed);
    toast.success("Owner Telegram ID saved");
    setEditingChatId(false);
  };

  const handleWriteNfc = async (staffId: string) => {
    setWritingNfc(true);
    try {
      await writeNfcTag(staffId);
      const member = staff.find((s) => s.id === staffId);
      toast.success("NFC tag written", { description: `Tag programmed for ${member?.name}` });
      setNfcWriteStaffId(null);
    } catch (e) {
      toast.error("NFC write failed", { description: e instanceof Error ? e.message : "Unknown error" });
    } finally {
      setWritingNfc(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Settings refreshed");
  }, []);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <PageTransition className="px-5 space-y-6">
        <section className="space-y-2">
          <p className="label-sm text-muted-foreground">Control Panel</p>
          <h1 className="display-sm text-foreground">Settings</h1>
        </section>

        {/* Owner Name */}
        <AnimatedCard delay={0.02} className="glass-card rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="label-sm text-muted-foreground">Display Name</p>
              {editingName ? (
                <div className="flex gap-2 mt-1">
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="bg-surface-low rounded-lg px-3 py-1.5 text-sm text-card-foreground border border-border/30 flex-1"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  />
                  <button onClick={handleSaveName} className="label-sm text-secondary px-3">Save</button>
                </div>
              ) : (
                <p className="text-sm font-semibold text-card-foreground">{ownerName}</p>
              )}
            </div>
            {!editingName && (
              <button onClick={() => { setEditingName(true); setNameInput(ownerName); }} className="text-secondary">
                <Pencil size={14} />
              </button>
            )}
          </div>
        </AnimatedCard>

        {settingSections.map((section, si) => (
          <AnimatedCard key={section.title} delay={(si + 1) * 0.08} className="space-y-3">
            <h3 className="headline-sm text-foreground">{section.title}</h3>
            <div className="glass-card rounded-2xl overflow-hidden divide-y divide-border/20">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isOn = toggles[item.id];
                return (
                  <motion.div
                    key={item.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleToggle(item.id)}
                    className="p-4 flex items-center gap-4 cursor-pointer select-none"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-card-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                    <div className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 ${isOn ? "bg-primary" : "bg-muted"}`}>
                      <motion.div
                        animate={{ x: isOn ? 20 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="w-6 h-6 rounded-full bg-primary-foreground shadow-card"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedCard>
        ))}

        {/* ── Telegram Integration ───────────────────────────────── */}
        <AnimatedCard delay={0.28} className="space-y-3">
          <h3 className="headline-sm text-foreground">Telegram Integration</h3>
          <div className="glass-card rounded-2xl p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <MessageCircle size={18} className="text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-card-foreground">Owner Telegram Chat ID</p>
                <p className="text-xs text-muted-foreground">Receive NFC check-in/out alerts on Telegram</p>
              </div>
              <button onClick={() => { setEditingChatId(true); setChatIdInput(ownerChatId); }} className="text-secondary">
                <Pencil size={14} />
              </button>
            </div>
            <AnimatePresence>
              {editingChatId ? (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                  <p className="text-xs text-muted-foreground">Message @userinfobot on Telegram to get your Chat ID</p>
                  <div className="flex gap-2">
                    <input
                      value={chatIdInput}
                      onChange={(e) => setChatIdInput(e.target.value)}
                      placeholder="e.g. 123456789"
                      className="bg-surface-low rounded-lg px-3 py-2 text-sm text-card-foreground border border-border/30 flex-1"
                      autoFocus
                    />
                    <button onClick={handleSaveChatId} className="w-9 h-9 rounded-lg glass-btn flex items-center justify-center text-status-on-time">
                      <Check size={14} />
                    </button>
                    <button onClick={() => setEditingChatId(false)} className="w-9 h-9 rounded-lg glass-btn flex items-center justify-center text-muted-foreground">
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center gap-2">
                  <Wifi size={12} className={ownerChatId ? "text-status-on-time" : "text-muted-foreground"} />
                  <span className="text-xs text-muted-foreground">
                    {ownerChatId ? `Connected · ID: ${ownerChatId}` : "Not configured"}
                  </span>
                </div>
              )}
            </AnimatePresence>

            <div className="border-t border-border/20" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Send size={12} />
              <span>Bot commands: "mark Elena late", "add task X for Julian", "check in Maria"</span>
            </div>
          </div>
        </AnimatedCard>

        {/* ── NFC Attendance ─────────────────────────────────────── */}
        <AnimatedCard delay={0.32} className="space-y-3">
          <h3 className="headline-sm text-foreground">NFC Attendance</h3>
          <div className="glass-card rounded-2xl p-4 space-y-4">
            {/* Enable NFC toggle */}
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => handleToggle("nfcEnabled")}
              className="flex items-center gap-4 cursor-pointer select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                <Nfc size={18} className="text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-card-foreground">NFC Scanning</p>
                <p className="text-xs text-muted-foreground">
                  {nfcSupported ? (scanning ? "Active — tap a tag to log attendance" : "Tap to enable") : "Requires Chrome on Android"}
                </p>
              </div>
              <div className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 ${toggles.nfcEnabled ? "bg-primary" : "bg-muted"}`}>
                <motion.div
                  animate={{ x: toggles.nfcEnabled ? 20 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-6 h-6 rounded-full bg-primary-foreground shadow-card"
                />
              </div>
            </motion.div>

            {/* Scanning status */}
            {scanning && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 bg-status-on-time/10 rounded-xl px-3 py-2">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2 h-2 rounded-full bg-status-on-time"
                />
                <span className="text-xs text-status-on-time font-semibold">Scanning for NFC tags…</span>
              </motion.div>
            )}

            {nfcError && (
              <div className="bg-destructive/10 rounded-xl px-3 py-2 text-xs text-destructive">{nfcError}</div>
            )}

            {lastEvent && (
              <div className="glass rounded-xl px-3 py-2 text-xs space-y-0.5">
                <p className="font-semibold text-card-foreground">Last NFC Event</p>
                <p className="text-muted-foreground">
                  {lastEvent.staffName} · {lastEvent.eventType} · {lastEvent.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                </p>
              </div>
            )}

            <div className="border-t border-border/20" />

            {/* Program NFC Tags */}
            <div className="space-y-2">
              <p className="label-sm text-muted-foreground">Program NFC Tags</p>
              <p className="text-xs text-muted-foreground">Select a staff member to write their ID to an NFC tag</p>
              <div className="space-y-2">
                {staff.map((s) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <img src={s.photo} alt={s.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-card-foreground truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.role}</p>
                    </div>
                    {nfcWriteStaffId === s.id ? (
                      <div className="flex gap-1">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleWriteNfc(s.id)}
                          disabled={writingNfc}
                          className="label-sm px-3 py-1.5 rounded-lg btn-estate text-primary-foreground text-[11px] disabled:opacity-60"
                        >
                          {writingNfc ? "Writing…" : "Tap & Write"}
                        </motion.button>
                        <button onClick={() => setNfcWriteStaffId(null)} className="w-7 h-7 glass-btn rounded-lg flex items-center justify-center">
                          <X size={12} className="text-muted-foreground" />
                        </button>
                      </div>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (!nfcSupported) { toast.error("NFC not supported on this device"); return; }
                          setNfcWriteStaffId(s.id);
                        }}
                        className="label-sm px-3 py-1.5 rounded-lg glass-btn text-foreground text-[11px]"
                      >
                        Program
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* About */}
        <AnimatedCard delay={0.38} className="glass-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-card-foreground">HOMEMAKER</p>
              <p className="text-xs text-muted-foreground">HomeHelp Manager v1.0</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
        </AnimatedCard>

        {/* Sign Out */}
        <AnimatedCard delay={0.42}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              toast.success("Signed out successfully");
              onLogout();
            }}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 cursor-pointer border border-destructive/20"
          >
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
              <LogOut size={18} className="text-destructive" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-destructive">Sign Out</p>
              <p className="text-xs text-muted-foreground">Log out of your account</p>
            </div>
            <ChevronRight size={16} className="text-destructive/50" />
          </motion.button>
        </AnimatedCard>

        <div className="pb-4" />
      </PageTransition>
    </PullToRefresh>
  );
};

export default SettingsPage;
