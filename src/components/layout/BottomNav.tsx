import { useLocation, useNavigate } from "react-router-dom";
import { Home, Users, ClipboardList, Wallet, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

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

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-3 pb-[env(safe-area-inset-bottom,6px)]">
      <div className="glass-card rounded-2xl mx-1 mb-1">
        <div className="flex items-center justify-around py-2.5 px-1">
          {navItems.map(({ icon: Icon, label, path }) => {
            const active = isActive(path);
            return (
              <motion.button
                key={path}
                whileTap={{ scale: 0.85 }}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative ${
                  active
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-0.5 w-5 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="text-[0.6rem] font-sans font-semibold uppercase tracking-wider">
                  {label}
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
