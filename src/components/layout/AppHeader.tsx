import { motion } from "framer-motion";
import { Bell, Globe, Settings } from "lucide-react";
import { useAppState, type AppLanguage } from "@/context/AppContext";
import logoImg from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";

const languages: { code: AppLanguage; short: string; label: string }[] = [
  { code: "en", short: "EN", label: "English" },
  { code: "hi", short: "हि", label: "Hindi" },
  { code: "te", short: "తె", label: "Telugu" },
  { code: "kn", short: "ಕ", label: "Kannada" },
  { code: "ml", short: "മ", label: "Malayalam" },
];

const AppHeader = () => {
  const { alerts, language, setLanguage } = useAppState();
  const navigate = useNavigate();
  const activeAlerts = alerts.filter((a) => !a.dismissed);
  const activeLanguage = languages.find((item) => item.code === language) || languages[0];

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="flex items-center gap-3"
      >
        <img src={logoImg} alt="Homemaker" className="w-14 h-14 object-contain" />
      </motion.button>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Globe size={14} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <select
            aria-label="Change language"
            value={language}
            onChange={(event) => setLanguage(event.target.value as AppLanguage)}
            className="h-10 rounded-xl glass-btn pl-7 pr-2 text-xs font-semibold text-foreground outline-none appearance-none"
            title={activeLanguage.label}
          >
            {languages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.short}
              </option>
            ))}
          </select>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/settings")}
          className="w-10 h-10 flex items-center justify-center rounded-xl glass-btn text-foreground"
        >
          <Settings size={18} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/alerts")}
          className="w-10 h-10 flex items-center justify-center rounded-xl glass-btn text-foreground relative"
        >
          <Bell size={18} />
          {activeAlerts.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-status-absent text-[10px] text-primary-foreground flex items-center justify-center font-bold shadow-btn"
            >
              {activeAlerts.length}
            </motion.span>
          )}
        </motion.button>
      </div>
    </header>
  );
};

export default AppHeader;
