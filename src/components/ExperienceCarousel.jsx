import { useCallback, useEffect, useRef, useState } from "react";

const GAP = 16;
const PEEK_RATIO = 0.45;
const WHEEL_STEP_THRESHOLD = 60;
const SWIPE_STEP_THRESHOLD = 42;

// Vertical carousel for experience entries: two fully visible cards plus a
// blurred sliver of the next one as an invitation to keep going. Wheel input
// (desktop) and vertical swipes (touch) step through the list; both are bound
// locally here so they never reach the page-level navigation handlers.
export default function ExperienceCarousel({ items, selectedId, onSelect }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const wheelStateRef = useRef({ accumulated: 0, lastTime: 0, lockedUntil: 0 });
  const swipeRef = useRef(null);
  const [slot, setSlot] = useState(0);
  const [index, setIndex] = useState(0);

  const maxIndex = Math.max(0, items.length - 2);

  useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(0, items.length - 2)));
  }, [items.length]);

  // Cards have different text lengths; the step size is the tallest card so
  // rows always land perfectly aligned after each move.
  useEffect(() => {
    const measure = () => {
      let tallest = 0;
      const cards = trackRef.current?.children;
      if (cards) {
        for (const card of cards) tallest = Math.max(tallest, card.offsetHeight);
      }
      if (tallest) setSlot(tallest + GAP);
    };
    measure();
    const observer = new ResizeObserver(measure);
    const first = trackRef.current?.children[0];
    if (first) observer.observe(first);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items.length]);

  const step = useCallback((direction) => {
    setIndex((current) => Math.min(maxIndex, Math.max(0, current + direction)));
  }, [maxIndex]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return undefined;
    const onWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const now = performance.now();
      const state = wheelStateRef.current;
      if (now < state.lockedUntil) return;
      if (now - state.lastTime > 260) state.accumulated = 0;
      state.lastTime = now;
      state.accumulated += event.deltaY || event.deltaX;
      if (Math.abs(state.accumulated) >= WHEEL_STEP_THRESHOLD) {
        step(state.accumulated > 0 ? 1 : -1);
        state.accumulated = 0;
        state.lockedUntil = now + 380;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [step]);

  const beginSwipe = (event) => {
    swipeRef.current = { x: event.clientX, y: event.clientY };
  };

  const endSwipe = (event) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!(Math.abs(dy) > SWIPE_STEP_THRESHOLD && Math.abs(dy) > Math.abs(dx))) return;
    step(dy < 0 ? 1 : -1);
  };

  const peek = slot ? slot * PEEK_RATIO : 96;

  return (
    <div
      className="exp-carousel"
      ref={viewportRef}
      data-no-drag
      style={{ height: slot ? slot * 2 + peek : undefined, opacity: slot ? 1 : 0 }}
      onPointerDown={beginSwipe}
      onPointerUp={endSwipe}
      onPointerCancel={() => { swipeRef.current = null; }}
    >
      <div
        className="exp-carousel-track"
        ref={trackRef}
        style={{ transform: `translateY(${slot ? -index * slot : 0}px)` }}
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`exp-item${selectedId === item.id ? " is-selected" : ""}`}
            onClick={() => onSelect(item.id)}
            aria-expanded={selectedId === item.id}
            aria-controls="experience-details"
          >
            <span className="role">{item.role}</span>
            <span className="meta">{item.period} · {item.org}</span>
            <span className="desc">{item.summary}</span>
          </button>
        ))}
      </div>
      <div
        className="exp-carousel-mist"
        style={{ height: peek, opacity: index >= maxIndex ? 0 : 1 }}
      />
    </div>
  );
}
