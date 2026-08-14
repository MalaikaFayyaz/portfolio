import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { audioEngine } from "../assets/audio";
import { clamp } from "../utils/terrain";

const ACCEL = 2200;
const MAX_SPEED = 760;
const FRICTION = 3200;

// Original horizontal scroll controller, extended with the later driving,
// keyboard, touch-drag, and audio behavior. This keeps one source of truth.
export function usePortfolioScroll() {
  const scrollRef = useRef(null);
  const [vw, setVw] = useState(1500);
  const [vh, setVh] = useState(700);
  const [scrollX, setScrollX] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const [isGameMode, setIsGameMode] = useState(false);
  const scrollRafRef = useRef(null);
  const driveRafRef = useRef(null);
  const velocityRef = useRef(0);
  const keysRef = useRef({ left: false, right: false });
  const gameModeRef = useRef(false);
  const stillTimerRef = useRef(0);
  const dragRef = useRef(null);
  const isTouch = useMemo(
    () => typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0),
    []
  );

  useEffect(() => {
    const measure = () => {
      const el = scrollRef.current;
      if (el) {
        setVw(el.clientWidth);
        setVh(el.clientHeight);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  const onScroll = useCallback(() => {
    if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    scrollRafRef.current = requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      setScrollX(el.scrollLeft);
      setActivePage(Math.round(el.scrollLeft / Math.max(1, vw)));
    });
  }, [vw]);

  const onWheel = useCallback((event) => {
    const el = scrollRef.current;
    if (!el || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    el.scrollLeft += event.deltaY;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  const goTo = useCallback((idx) => {
    const el = scrollRef.current;
    if (!el) return;
    const maxPage = Math.max(0, Math.round((el.scrollWidth - el.clientWidth) / Math.max(1, vw)));
    el.scrollTo({ left: clamp(idx, 0, maxPage) * vw, behavior: "smooth" });
  }, [vw]);

  const nudgePage = useCallback((delta) => {
    const el = scrollRef.current;
    if (!el) return;
    goTo(Math.round(el.scrollLeft / Math.max(1, vw)) + delta);
  }, [goTo, vw]);

  useEffect(() => {
    if (isTouch) return undefined;
    const isTypingTarget = (target) => {
      const tag = target?.tagName?.toLowerCase();
      return tag === "input" || tag === "textarea" || target?.isContentEditable;
    };
    const onKeyDown = (event) => {
      if (isTypingTarget(event.target)) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        keysRef.current[event.key === "ArrowLeft" ? "left" : "right"] = true;
        if (!gameModeRef.current) {
          gameModeRef.current = true;
          setIsGameMode(true);
          audioEngine.resume().then(() => audioEngine.startEngine());
        }
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        nudgePage(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        nudgePage(-1);
      }
    };
    const onKeyUp = (event) => {
      if (event.key === "ArrowLeft") keysRef.current.left = false;
      if (event.key === "ArrowRight") keysRef.current.right = false;
    };
    const onBlur = () => {
      keysRef.current.left = false;
      keysRef.current.right = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [isTouch, nudgePage]);

  useEffect(() => {
    let last = performance.now();
    const tick = (now) => {
      const el = scrollRef.current;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (el && !dragRef.current?.active) {
        const { left, right } = keysRef.current;
        const direction = (left ? 1 : 0) - (right ? 1 : 0);
        if (direction) {
          velocityRef.current = clamp(velocityRef.current + direction * ACCEL * dt, -MAX_SPEED, MAX_SPEED);
        } else {
          const magnitude = Math.max(0, Math.abs(velocityRef.current) - FRICTION * dt);
          velocityRef.current = Math.sign(velocityRef.current) * magnitude;
        }
        if (velocityRef.current) {
          el.scrollLeft = clamp(el.scrollLeft + velocityRef.current * dt, 0, Math.max(0, el.scrollWidth - el.clientWidth));
        }
      }
      const moving = keysRef.current.left || keysRef.current.right || Math.abs(velocityRef.current) > 1.5;
      if (moving) {
        stillTimerRef.current = 0;
      } else if (gameModeRef.current) {
        stillTimerRef.current += dt * 1000;
        if (stillTimerRef.current > 450) {
          gameModeRef.current = false;
          setIsGameMode(false);
          audioEngine.stopEngineFade();
        }
      }
      if (gameModeRef.current) audioEngine.updateEngine(Math.min(1, Math.abs(velocityRef.current) / MAX_SPEED));
      driveRafRef.current = requestAnimationFrame(tick);
    };
    driveRafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(driveRafRef.current);
  }, []);

  const onPointerDown = useCallback((event) => {
    if (event.target.closest("[data-no-drag]")) return;
    dragRef.current = {
      active: true, startX: event.clientX, startScroll: scrollRef.current?.scrollLeft ?? 0,
      lastX: event.clientX, lastTime: performance.now(), velocity: 0, axis: null,
    };
  }, []);

  const onPointerMove = useCallback((event) => {
    const drag = dragRef.current;
    const el = scrollRef.current;
    if (!drag?.active || !el) return;
    const dx = event.clientX - drag.startX;
    if (!drag.axis && Math.abs(dx) > 8) drag.axis = "x";
    if (drag.axis !== "x") return;
    el.scrollLeft = clamp(drag.startScroll - dx, 0, Math.max(0, el.scrollWidth - el.clientWidth));
    const now = performance.now();
    drag.velocity = ((drag.lastX - event.clientX) / Math.max(1, now - drag.lastTime)) * 1000;
    drag.lastX = event.clientX;
    drag.lastTime = now;
  }, []);

  const onPointerUp = useCallback(() => {
    const drag = dragRef.current;
    const el = scrollRef.current;
    if (!drag?.active) return;
    drag.active = false;
    if (drag.axis === "x" && el) {
      goTo(Math.round(el.scrollLeft / Math.max(1, vw) + clamp(drag.velocity / 900, -1, 1) * 0.3));
    }
  }, [goTo, vw]);

  return {
    scrollRef, vw, vh, scrollX, activePage, onScroll, goTo, nudgePage, isTouch, isGameMode,
    bindDrag: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  };
}
