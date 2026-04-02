import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import AppHeader from "./AppHeader";
import SmartCommandBox from "@/components/SmartCommandBox";

const AppLayout = () => {
  const location = useLocation();
  const isStaffProfile = location.pathname.startsWith("/staff/");

  return (
    <div className="h-[100dvh] bg-background flex flex-col max-w-md mx-auto relative overflow-hidden">
      {!isStaffProfile && <AppHeader />}
      <main className="flex-1 pb-24 overflow-y-auto overflow-x-hidden overscroll-none" style={{ WebkitOverflowScrolling: 'touch' }}>
        <Outlet />
      </main>
      <SmartCommandBox />
      <BottomNav />
    </div>
  );
};

export default AppLayout;
