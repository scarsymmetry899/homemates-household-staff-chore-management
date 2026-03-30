import { useLocation, useNavigate } from "react-router-dom";
import { Home, Users, ClipboardList, Wallet, BarChart3 } from "lucide-react";

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
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md estate-gradient z-50">
      <div className="flex items-center justify-around py-3 px-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-1 px-3 py-1 transition-all ${
                active ? "text-primary-foreground" : "text-primary-foreground/50"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[0.625rem] font-sans font-semibold uppercase tracking-wider">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
