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
    <div className={cn("holo-panel", className)}>
      {onClose && (
        <button type="button" className="holo-panel-close" onClick={onClose} aria-label="Close details" title="Close details">
          ×
        </button>
      )}
      <div className="holo-panel-flash" />
      <div className="holo-panel-scan" />
      <div className="holo-panel-lines" />
      <div className="holo-panel-body">{children}</div>
    </div>
  );
}
