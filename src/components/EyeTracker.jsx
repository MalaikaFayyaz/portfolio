import { createContext, useContext, useEffect, useRef, useState } from "react";

// App keeps a mutable ref with the car's on-screen position; every mounted
// EyeTracker samples it in its own animation frame and steers its pupils
// toward the car. Gaze is eased and only committed to React state when it
// actually changes, so sections stay memoized between movements.
export const CarPositionContext = createContext(null);

const PUPIL_RANGE = 6;
const FOLLOW_SPEED = 9;

export default function EyeTracker() {
  const wrapRef = useRef(null);
  const carPosition = useContext(CarPositionContext);
  const gazeRef = useRef({ x: 0, y: 0 });
  const [gaze, setGaze] = useState(gazeRef.current);

  useEffect(() => {
    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      const wrap = wrapRef.current;
      const target = carPosition?.current;
      if (wrap && target && wrap.isConnected) {
        const rect = wrap.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const angle = Math.atan2(
            target.y - (rect.top + rect.height / 2),
            target.x - (rect.left + rect.width / 2)
          );
          const desiredX = Math.cos(angle) * PUPIL_RANGE;
          const desiredY = Math.sin(angle) * PUPIL_RANGE;
          const ease = 1 - Math.exp(-FOLLOW_SPEED * dt);
          const x = gazeRef.current.x + (desiredX - gazeRef.current.x) * ease;
          const y = gazeRef.current.y + (desiredY - gazeRef.current.y) * ease;
          if (Math.abs(x - gaze.x) > 0.05 || Math.abs(y - gaze.y) > 0.05) {
            const next = { x, y };
            gazeRef.current = next;
            setGaze(next);
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [carPosition, gaze.x, gaze.y]);

  return (
    <div className="eyes-wrap" ref={wrapRef}>
      <div className="eye"><div className="pupil" style={{ transform: `translate(${gaze.x.toFixed(2)}px, ${gaze.y.toFixed(2)}px)` }} /></div>
      <div className="eye"><div className="pupil" style={{ transform: `translate(${gaze.x.toFixed(2)}px, ${gaze.y.toFixed(2)}px)` }} /></div>
    </div>
  );
}
