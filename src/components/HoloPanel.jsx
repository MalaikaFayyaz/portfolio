import { useEffect } from "react";
import { cn } from "../utils/cn";
import { audioEngine } from "../assets/audio";

export function HoloPanel({
  children,
  className,
  playSound = true,
  onClose,
}) {
  useEffect(() => {
    if (playSound) audioEngine.playUiBlip();
  }, [playSound]);

  return (
    <div
      className={cn(
        "holo-panel relative overflow-hidden rounded-xl border border-sol-cyan/25 bg-gradient-to-br from-sol-panel/60 via-sol-panel/40 to-sol-bg-deep/50 shadow-[0_8px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(147,161,161,0.08)] backdrop-blur-xl animate-glitch-in",
        className
      )}
    >
      {onClose && (
        <button type="button" className="holo-panel-close" onClick={onClose} aria-label="Close details" title="Close details">
          ×
        </button>
      )}
      <div className="pointer-events-none absolute inset-0 animate-glitch-flash bg-sol-cyan/25 mix-blend-screen" />
      <div
        className="holo-panel-scan pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-sol-cyan/50 to-transparent"
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: "repeating-linear-gradient(0deg, #eee8d5 0px, #eee8d5 1px, transparent 1px, transparent 3px)",
      }} />
      <div className="pointer-events-none absolute -inset-px rounded-xl border border-sol-cyan/10" />
      <div className="relative">{children}</div>
    </div>
  );
}
