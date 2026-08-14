import { useRef } from "react";
import { CarSVG } from "./CarSVG";
import { useWorldFrame } from "./world";

export function Car() {
  const wrapRef = useRef(null);
  const dustRef = useRef(null);
  const lastDir = useRef(1);

  useWorldFrame((frame) => {
    const el = wrapRef.current;
    if (!el) return;
    if (frame.dirSign !== 0) lastDir.current = frame.dirSign;
    // dirSign > 0 means the LEFT arrow is driving the world forward, so the
    // car should visually face left (mirrored); dirSign < 0 (RIGHT arrow)
    // keeps it facing its natural (right-facing) orientation.
    const flip = lastDir.current > 0 ? -1 : 1;
    el.style.transform = `translate3d(${frame.carScreenX - 43}px, ${frame.carScreenY - 27}px, 0) scaleX(${flip}) rotate(${
      frame.carRotation * flip
    }deg)`;
    if (dustRef.current) {
      dustRef.current.style.opacity = frame.speedNorm > 0.08 ? String(0.25 + frame.speedNorm * 0.5) : "0";
    }
  });

  return (
    <div ref={wrapRef} className="absolute left-0 top-0 z-20 will-change-transform" style={{ transform: "translate3d(0,0,0)" }}>
      <div
        ref={dustRef}
        className="absolute -left-3 bottom-1 h-2 w-10 rounded-full bg-[#eee8d5] opacity-0 blur-[3px] transition-opacity"
        aria-hidden
      />
      <CarSVG glow />
    </div>
  );
}