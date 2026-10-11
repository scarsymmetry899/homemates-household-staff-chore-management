import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import AppHeader from "./AppHeader";
import SmartCommandBox from "@/components/SmartCommandBox";
import { useAppState } from "@/context/AppContext";

const AppLayout = () => {
  const location = useLocation();
  const { appRole } = useAppState();
  const isStaffProfile = location.pathname.startsWith("/staff/");

  return (
    <div className="h-[100dvh] bg-background max-w-[1440px] mx-auto relative overflow-hidden md:grid md:grid-cols-[220px_minmax(0,1fr)] md:border-x md:border-border/40">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[70] focus:top-3 focus:left-3 focus:rounded-xl focus:bg-card focus:px-4 focus:py-2">
        Skip to content
      </a>
      <BottomNav />
      <div className="min-w-0 min-h-0 flex flex-col">
        {!isStaffProfile && <AppHeader />}
        <main
          id="main-content"
          className="app-shell-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-none pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] md:pb-10"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="w-full max-w-[1060px] mx-auto"><Outlet /></div>
        </main>
        {appRole === "owner" && <SmartCommandBox />}
      </div>
    </div>
  );
};

export default AppLayout;
