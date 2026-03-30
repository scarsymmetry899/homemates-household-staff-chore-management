import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import AppHeader from "./AppHeader";

const AppLayout = () => {
  const location = useLocation();
  const isStaffProfile = location.pathname.startsWith("/staff/");

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      {!isStaffProfile && <AppHeader />}
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
