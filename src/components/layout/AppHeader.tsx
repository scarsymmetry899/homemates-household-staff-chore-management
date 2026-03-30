import { motion } from "framer-motion";
import { Bell, Settings } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import logoImg from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";

const AppHeader = () => {
  const { alerts } = useAppState();
  const navigate = useNavigate();
  const activeAlerts = alerts.filter((a) => !a.dismissed).length;

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
          {activeAlerts > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-status-absent text-[10px] text-primary-foreground flex items-center justify-center font-bold shadow-btn"
            >
              {activeAlerts}
            </motion.span>
          )}
        </motion.button>
      </div>
    </header>
  );
};

export default AppHeader;
