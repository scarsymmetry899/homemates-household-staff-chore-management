import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import AppHeader from "./AppHeader";
import SmartCommandBox from "@/components/SmartCommandBox";

const AppLayout = () => {
  const location = useLocation();
  const isStaffProfile = location.pathname.startsWith("/staff/");

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col max-w-md mx-auto relative overflow-x-hidden">
      {!isStaffProfile && <AppHeader />}
      <main className="flex-1 pb-24 overflow-x-hidden">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
