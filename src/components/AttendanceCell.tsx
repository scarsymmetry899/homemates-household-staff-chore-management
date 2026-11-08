import { useEffect, useRef } from "react";

type Props = { label: string; text: string; className: string; editable: boolean; onOpen: () => void; onInspect: () => void };
export default function AttendanceCell({ label, text, className, editable, onOpen, onInspect }: Props) {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const origin = useRef([0, 0]);
  const held = useRef(false);
  const cancel = () => clearTimeout(timer.current);
  useEffect(() => cancel, []);
  return <button type="button" aria-label={label} aria-haspopup={editable ? "dialog" : undefined}
    className={"select-none capitalize " + className}
    onPointerDown={e => {
      cancel();
      held.current = false;
      if (!editable || !e.isPrimary || e.button !== 0) return;
      origin.current = [e.clientX, e.clientY];
      timer.current = setTimeout(() => { held.current = true; onOpen(); }, 500);
    }}
    onPointerMove={e => {
      if (Math.hypot(e.clientX - origin.current[0], e.clientY - origin.current[1]) > 8) cancel();
    }}
    onPointerUp={cancel} onPointerCancel={cancel} onPointerLeave={cancel} onBlur={cancel}
    onContextMenu={e => { if (editable) { e.preventDefault(); cancel(); onOpen(); } }}
    onClick={e => { if (!held.current || e.detail === 0) { if (editable) onOpen(); else onInspect(); } held.current = false; }}
  >{text}</button>;
}
