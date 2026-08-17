import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface StaffAvatarProps {
  name: string;
  src?: string;
  className?: string;
  textClassName?: string;
}

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "HM";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

function isUsablePhoto(src?: string) {
  if (!src) return false;
  if (src === "/placeholder.svg") return false;
  return true;
}

export default function StaffAvatar({ name, src, className, textClassName }: StaffAvatarProps) {
  const [failed, setFailed] = useState(false);
  const initials = initialsFor(name);
  const gradient = useMemo(() => {
    const palettes = [
      "from-[#36576a] to-[#6fa3ad]",
      "from-[#7a5c3e] to-[#d7a968]",
      "from-[#4d6751] to-[#9eb77b]",
      "from-[#733f48] to-[#d88b8e]",
      "from-[#3e4f7a] to-[#8ea4cf]",
    ];
    const index = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % palettes.length;
    return palettes[index];
  }, [name]);

  if (isUsablePhoto(src) && !failed) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-xl object-cover shadow-card bg-surface-container", className)}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      aria-label={name}
      className={cn(
        "rounded-xl shadow-card bg-gradient-to-br flex items-center justify-center text-primary-foreground font-display font-semibold overflow-hidden",
        gradient,
        className
      )}
    >
      <span className={cn("leading-none", textClassName)}>{initials}</span>
    </div>
  );
}
