import { useLocation, useNavigate } from "react-router-dom";
import { Home, Users, ClipboardList, Wallet, BarChart3, Receipt, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useAppState } from "@/context/AppContext";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Users, label: "Staff", path: "/staff" },
  { icon: ClipboardList, label: "Tasks", path: "/tasks" },
  { icon: Wallet, label: "Payroll", path: "/payroll" },
  { icon: BarChart3, label: "Insights", path: "/insights" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { alerts } = useAppState();
  const activeAlerts = alerts.filter((a) => !a.dismissed).length;

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md estate-gradient z-50 safe-area-bottom">
      <div className="flex items-center justify-around py-3 px-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = isActive(path);
          return (
            <motion.button
              key={path}
              whileTap={{ scale: 0.85 }}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-1 px-3 py-1 transition-all relative ${
                active ? "text-primary-foreground" : "text-primary-foreground/50"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 w-1 h-1 rounded-full bg-secondary-container"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="text-[0.625rem] font-sans font-semibold uppercase tracking-wider">
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
