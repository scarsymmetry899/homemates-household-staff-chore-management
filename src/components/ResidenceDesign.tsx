import { DoorOpen } from "lucide-react";
import hall from "@/assets/estate-hallway.jpg";

export function ResidenceBanner({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div className="residence-banner" style={{ backgroundImage: `linear-gradient(0deg, rgba(25,45,60,.86), transparent 90%), url(${hall})` }}>
    <strong>{title}</strong>{subtitle && <span>{subtitle}</span>}
  </div>;
}

export function RoomDirectory({ rooms }: { rooms: { id: string; name: string; floorLabel?: string }[] }) {
  const named = rooms.filter(r => r.name.trim());
  if (!named.length) return null;
  return <figure className="room-directory"><figcaption>Room directory</figcaption><div>
    {named.map(r => <div className="room-outline" key={r.id}><DoorOpen size={17} /><b>{r.name}</b>{r.floorLabel && <small>{r.floorLabel}</small>}</div>)}
  </div></figure>;
}

export function ResidentFaces({ names }: { names: string[] }) {
  const residents = names.filter(n => n.trim()).slice(0, 5);
  return <div className="resident-faces" aria-hidden="true">{residents.map((n,i) =>
    <span key={i}>{n.trim().split(/\s+/).slice(0,2).map(word => word[0]).join("")}</span>
  )}</div>;
}

export function ExpenseTrend({ ledger, period }: { ledger: { date: string; amount: number }[]; period: string }) {
  const days = new Date(Number(period.slice(0,4)), Number(period.slice(5)), 0).getDate();
  const daily = Array<number>(days).fill(0);
  for (const row of ledger) {
    const day = /^\d{4}-\d{2}-\d{2}$/.test(row.date) ? Number(row.date.slice(-2)) : new Date(row.date).getDate();
    if (day >= 1 && day <= days) daily[day - 1] += row.amount;
  }
  let sum = 0;
  const totals = daily.map(amount => sum += amount);
  const max = Math.max(1, ...totals);
  return <figure className="expense-trend" aria-label="Cumulative expenses for the selected month">
    <svg viewBox="0 0 312 58" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 9H312M0 31H312M0 53H312" stroke="currentColor" opacity=".25" strokeDasharray="3 4" />
      <path d={totals.reduce((d, amount,i) => d + ` H${(i+1)*312/days} V${53-amount/max*44}`, "M0 53")} fill="none" stroke="currentColor" strokeWidth="2.5"/>
    </svg><figcaption><span>Day 1</span><span>Day {days}</span></figcaption>
  </figure>;
}
