import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Home, Users, ClipboardList, Wallet, BarChart3, Receipt, Settings, Boxes, Ellipsis } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useAppState } from "@/context/AppContext";

const navItems = [
  { icon: Home, labelKey: "nav.home", path: "/" },
  { icon: Users, labelKey: "nav.staff", path: "/staff" },
  { icon: ClipboardList, labelKey: "nav.tasks", path: "/tasks" },
  { icon: Receipt, labelKey: "nav.expenses", path: "/expenses" },
  { icon: Boxes, labelKey: "nav.inventory", path: "/inventory" },
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
  const [moreOpen, setMoreOpen] = useState(false);
  const visibleNavItems = appRole === "staff" ? staffNavItems : navItems;
  const mobileItems = appRole === "staff" ? staffNavItems : navItems.slice(0, 4);
  const moreItems = appRole === "staff" ? [] : navItems.slice(4);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav aria-label="Primary navigation" className="fixed bottom-0 inset-x-0 z-50 px-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.35rem)] md:relative md:inset-auto md:h-full md:px-3 md:py-6 md:bg-surface-low/70 md:border-r md:border-border/40">
      {moreOpen && moreItems.length > 0 && (
        <div className="absolute bottom-[calc(env(safe-area-inset-bottom,0px)+5.5rem)] right-2 left-2 glass-card rounded-2xl p-2 shadow-card-hover md:hidden" aria-label={t("nav.more")}>
          {moreItems.map(({ icon: Icon, labelKey, path }) => (
            <button key={path} type="button" onClick={() => { setMoreOpen(false); navigate(path); }}
              aria-current={isActive(path) ? "page" : undefined}
              className="w-full min-h-11 flex items-center gap-3 px-4 rounded-xl text-sm font-semibold text-foreground hover:bg-primary/5">
              <Icon size={18} aria-hidden="true" />{t(labelKey)}
            </button>
          ))}
        </div>
      )}
      <div className="glass-card rounded-2xl mx-auto max-w-3xl md:mx-0 md:max-w-none md:h-full md:rounded-3xl md:bg-transparent md:border-0 md:shadow-none">
        <div className="flex items-center gap-0.5 py-2 px-1 md:flex-col md:items-stretch md:gap-2 md:py-0 md:px-0">
          {visibleNavItems.map(({ icon: Icon, labelKey, path }) => {
            const active = isActive(path);
            return (
              <motion.button
                key={path}
                whileTap={{ scale: 0.96 }}
                onClick={() => { setMoreOpen(false); navigate(path); }}
                aria-current={active ? "page" : undefined}
                className={`hidden md:flex md:w-full md:min-w-0 md:flex-row md:justify-start md:gap-3 md:px-4 md:py-3 items-center rounded-xl transition-colors relative ${
                  active ? "text-primary bg-primary/8" : "text-muted-foreground"
                }`}
              >
                <Icon size={19} strokeWidth={active ? 2.4 : 1.7} />
                <span className="text-xs font-sans font-semibold uppercase tracking-normal whitespace-nowrap">
                  {t(labelKey)}
                </span>
              </motion.button>
            );
          })}
          {mobileItems.map(({ icon: Icon, labelKey, path }) => {
            const active = isActive(path);
            return (
              <motion.button key={`mobile-${path}`} whileTap={{ scale: 0.96 }}
                onClick={() => { setMoreOpen(false); navigate(path); }} aria-current={active ? "page" : undefined}
                className={`flex md:hidden min-w-0 flex-1 min-h-11 flex-col items-center justify-center gap-1 rounded-xl ${active ? "text-primary bg-primary/8" : "text-muted-foreground"}`}>
                <Icon size={19} strokeWidth={active ? 2.4 : 1.7} />
                <span className="text-[0.58rem] font-sans font-semibold uppercase truncate max-w-full">{t(labelKey)}</span>
              </motion.button>
            );
          })}
          {moreItems.length > 0 && (
            <button type="button" aria-expanded={moreOpen} aria-label={t("nav.more")}
              onClick={() => setMoreOpen((open) => !open)}
              className={`flex md:hidden min-w-0 flex-1 min-h-11 flex-col items-center justify-center gap-1 rounded-xl ${moreOpen || moreItems.some((item) => isActive(item.path)) ? "text-primary bg-primary/8" : "text-muted-foreground"}`}>
              <Ellipsis size={19} aria-hidden="true" />
              <span className="text-[0.58rem] font-sans font-semibold uppercase truncate max-w-full">{t("nav.more")}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
