import { useCallback, useEffect, useRef, useState } from "react";

export function usePortfolioScroll() {
  const scrollRef = useRef(null);
  const [vw, setVw] = useState(1200);
  const [vh, setVh] = useState(700);
  const [scrollX, setScrollX] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const rafRef = useRef(null);

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
    return () => window.removeEventListener("resize", measure);
  }, []);

  const onScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      setScrollX(el.scrollLeft);
      setActivePage(Math.round(el.scrollLeft / vw));
    });
  }, [vw]);

  const onWheel = useCallback((e) => {
    const el = scrollRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  const goTo = useCallback((idx) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * vw, behavior: "smooth" });
  }, [vw]);

  return { scrollRef, vw, vh, scrollX, activePage, onScroll, goTo };
}
