import { Bell } from "lucide-react";
import avatarImg from "@/assets/staff/arthur-penhaligon.jpg";

const AppHeader = () => {
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
      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-low text-foreground">
        <Bell size={18} />
      </button>
    </header>
  );
};

export default AppHeader;
