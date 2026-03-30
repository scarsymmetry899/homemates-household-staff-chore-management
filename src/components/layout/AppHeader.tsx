import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import avatarImg from "@/assets/staff/arthur-penhaligon.jpg";
import { useNavigate } from "react-router-dom";

const AppHeader = () => {
  const { alerts } = useAppState();
  const navigate = useNavigate();
  const activeAlerts = alerts.filter((a) => !a.dismissed).length;

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background">
      <div className="flex items-center gap-3">
        <img
          src={avatarImg}
          alt="Estate Manager"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="font-display text-base font-medium text-foreground tracking-tight">
          Heritage Estate
        </span>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/alerts")}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-low text-foreground relative"
      >
        <Bell size={18} />
        {activeAlerts > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-status-absent text-[10px] text-primary-foreground flex items-center justify-center font-bold"
          >
            {activeAlerts}
          </motion.span>
        )}
      </motion.button>
    </header>
  );
};

export default AppHeader;
