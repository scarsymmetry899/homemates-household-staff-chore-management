import { useLocation, useNavigate } from "react-router-dom";
import { Home, Users, ClipboardList, Wallet, BarChart3, Receipt, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useAppState } from "@/context/AppContext";

const navItems = [
  { icon: Home, labelKey: "nav.home", path: "/" },
  { icon: Users, labelKey: "nav.staff", path: "/staff" },
  { icon: ClipboardList, labelKey: "nav.tasks", path: "/tasks" },
  { icon: Receipt, labelKey: "nav.expenses", path: "/expenses" },
  { icon: Wallet, labelKey: "nav.payroll", path: "/payroll" },
  { icon: BarChart3, labelKey: "nav.insights", path: "/insights" },
];

const staffNavItems = [
  { icon: Home, labelKey: "nav.myDay", path: "/" },
  { icon: ClipboardList, labelKey: "nav.tasks", path: "/tasks" },
  { icon: Wallet, labelKey: "nav.payroll", path: "/payroll" },
  { icon: Settings, labelKey: "settings.title", path: "/settings" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { appRole } = useAppState();
  const visibleNavItems = appRole === "staff" ? staffNavItems : navItems;

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-3 pb-[env(safe-area-inset-bottom,6px)]">
      <div className="glass-card rounded-2xl mx-1 mb-1">
        <div className="flex items-center justify-around py-2 px-0.5">
          {visibleNavItems.map(({ icon: Icon, labelKey, path }) => {
            const active = isActive(path);
            return (
              <motion.button
                key={path}
                whileTap={{ scale: 0.85 }}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all relative ${
                  active ? "text-primary bg-primary/8" : "text-muted-foreground"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-0.5 w-5 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="text-[0.55rem] font-sans font-semibold uppercase tracking-wider">
                  {t(labelKey)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
