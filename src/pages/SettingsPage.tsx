import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Bell, Users, Receipt, BarChart3, Shield, Moon, Globe, ChevronRight, LogOut, User, Pencil } from "lucide-react";
import { PageTransition, AnimatedCard, PullToRefresh } from "@/components/animations/MotionComponents";
import { useAppState } from "@/context/AppContext";
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
  const { ownerName, setOwnerName, isDarkMode, setDarkMode } = useAppState();
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {};
    settingSections.forEach((s) => s.items.forEach((i) => (defaults[i.id] = i.defaultOn)));
    defaults.darkMode = isDarkMode;
    return defaults;
  });
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(ownerName);

  const handleToggle = (id: string) => {
    if (id === "darkMode") {
      setDarkMode(!toggles.darkMode);
    }
    setToggles((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      toast.success(next[id] ? "Enabled" : "Disabled", {
        description: settingSections.flatMap((s) => s.items).find((i) => i.id === id)?.label,
      });
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

        {/* About */}
        <AnimatedCard delay={0.3} className="glass-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-card-foreground">HOMEMAKER</p>
              <p className="text-xs text-muted-foreground">HomeHelp Manager v1.0</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
        </AnimatedCard>

        {/* Sign Out */}
        <AnimatedCard delay={0.35}>
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
