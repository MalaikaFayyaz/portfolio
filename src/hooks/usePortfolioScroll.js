import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { audioEngine } from "../assets/audio";
import { clamp } from "../utils/terrain";

const ACCEL = 950;
const MAX_SPEED = 430;
const FRICTION = 1150;
const CAR_HALF_WIDTH = 43;
const CAR_START_RATIO = 0.32;
const CAMERA_LEFT_RATIO = 0.3;
const CAMERA_RIGHT_RATIO = 0.58;

// Original horizontal scroll controller, extended with the later driving,
// keyboard, touch-drag, and audio behavior. This keeps one source of truth.
export function usePortfolioScroll() {
  const scrollRef = useRef(null);
  const [vw, setVw] = useState(1500);
  const [vh, setVh] = useState(700);
  const [scrollX, setScrollX] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const [isGameMode, setIsGameMode] = useState(false);
  const [facingDirection, setFacingDirection] = useState(1);
  const [carWorldX, setCarWorldX] = useState(0);
  const scrollRafRef = useRef(null);
  const driveRafRef = useRef(null);
  const velocityRef = useRef(0);
  const keysRef = useRef({ left: false, right: false });
  const gameModeRef = useRef(false);
  const stillTimerRef = useRef(0);
  const dragRef = useRef(null);
  const carWorldXRef = useRef(null);
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
        if (carWorldXRef.current == null) {
          carWorldXRef.current = el.clientWidth * CAR_START_RATIO;
          setCarWorldX(carWorldXRef.current);
        }
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
      // Wheel, touch, and navigation can move the camera without driving.
      // Bring the car back into view only after it has left the viewport.
      const carX = carWorldXRef.current;
      if (carX != null && (carX < el.scrollLeft + CAR_HALF_WIDTH || carX > el.scrollLeft + el.clientWidth - CAR_HALF_WIDTH)) {
        const visibleCarX = clamp(
          el.scrollLeft + el.clientWidth * CAR_START_RATIO,
          CAR_HALF_WIDTH,
          Math.max(CAR_HALF_WIDTH, el.scrollWidth - CAR_HALF_WIDTH)
        );
        carWorldXRef.current = visibleCarX;
        setCarWorldX(visibleCarX);
      }
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
        setFacingDirection(event.key === "ArrowRight" ? 1 : -1);
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
        // Moving right advances through the portfolio; moving left returns
        // toward the home page. The scroll bounds keep the car in the world.
        const direction = (right ? 1 : 0) - (left ? 1 : 0);
        if (direction) {
          velocityRef.current = clamp(velocityRef.current + direction * ACCEL * dt, -MAX_SPEED, MAX_SPEED);
        } else {
          const magnitude = Math.max(0, Math.abs(velocityRef.current) - FRICTION * dt);
          velocityRef.current = Math.sign(velocityRef.current) * magnitude;
        }
        if (velocityRef.current) {
          const maxCarX = Math.max(CAR_HALF_WIDTH, el.scrollWidth - CAR_HALF_WIDTH);
          const nextCarX = clamp(
            (carWorldXRef.current ?? el.clientWidth * CAR_START_RATIO) + velocityRef.current * dt,
            CAR_HALF_WIDTH,
            maxCarX
          );
          carWorldXRef.current = nextCarX;
          setCarWorldX(nextCarX);

          const screenX = nextCarX - el.scrollLeft;
          const leftCameraEdge = el.clientWidth * CAMERA_LEFT_RATIO;
          const rightCameraEdge = el.clientWidth * CAMERA_RIGHT_RATIO;
          if (screenX > rightCameraEdge) {
            el.scrollLeft = clamp(nextCarX - rightCameraEdge, 0, Math.max(0, el.scrollWidth - el.clientWidth));
          } else if (screenX < leftCameraEdge) {
            el.scrollLeft = clamp(nextCarX - leftCameraEdge, 0, Math.max(0, el.scrollWidth - el.clientWidth));
          }

          if (nextCarX === CAR_HALF_WIDTH || nextCarX === maxCarX) {
            velocityRef.current = 0;
          }
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
    scrollRef, vw, vh, scrollX, carWorldX, activePage, onScroll, goTo, nudgePage, isTouch, isGameMode, facingDirection,
    bindDrag: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  };
}
