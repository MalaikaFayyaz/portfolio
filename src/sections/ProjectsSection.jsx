import { useEffect, useMemo, useRef, useState, memo } from "react";
import { createPortal } from "react-dom";
import { DOMAINS } from "../data";
import { DOMAINS as PROJECT_DOMAINS } from "../assets/data";
import { HoloPanel } from "../components/HoloPanel";
import { audioEngine } from "../assets/audio";

function ProjectsSection({ domain, setDomain, isTouch = false }) {
  const [index, setIndex] = useState(0);
  const swipeRef = useRef(null);
  const carouselRef = useRef(null);
  const wheelStateRef = useRef({ accumulated: 0, lastTime: 0, lockedUntil: 0 });
  const currentDomain = useMemo(
    () => PROJECT_DOMAINS.find((item) => item.id === domain) ?? null,
    [domain]
  );
  const project = currentDomain?.projects[index % currentDomain.projects.length] ?? null;

  const selectDomain = (id) => {
    audioEngine.playClick();
    setDomain(id);
    setIndex(0);
  };

  const step = (direction) => {
    if (!currentDomain) return;
    audioEngine.playClick();
    setIndex((current) => (
      current + direction + currentDomain.projects.length
    ) % currentDomain.projects.length);
  };

  const closeCarousel = () => {
    setDomain(null);
    setIndex(0);
  };

  // Desktop: vertical wheel over the carousel steps through projects instead
  // of panning the page. Mobile: touches that START inside the top/bottom
  // edge bands of the card flip projects; touches elsewhere scroll the card.
  // The flip decision is deferred to the first real movement so plain taps
  // (arrows, close button, links) always go through untouched.
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return undefined;

    const EDGE_TOP = 56;
    const EDGE_BOTTOM = 72;
    let gesture = null;

    const panelRect = () => {
      const panel = el.querySelector(".project-carousel-panel");
      return panel ? panel.getBoundingClientRect() : null;
    };

    const onTouchStart = (event) => {
      const rect = panelRect();
      const touch = event.touches?.[0];
      if (!rect || !touch) return;
      const withinPanel = touch.clientY >= rect.top && touch.clientY <= rect.bottom;
      const inEdge = withinPanel &&
        (touch.clientY - rect.top < EDGE_TOP || rect.bottom - touch.clientY < EDGE_BOTTOM);
      gesture = inEdge
        ? { startX: touch.clientX, startY: touch.clientY, decided: false, flip: false }
        : null;
    };

    const onTouchMove = (event) => {
      if (!gesture) return;
      const touch = event.touches?.[0];
      if (!touch) return;
      if (gesture.flip) {
        if (event.cancelable) event.preventDefault();
        return;
      }
      if (gesture.decided) return;
      const dy = touch.clientY - gesture.startY;
      const dx = touch.clientX - gesture.startX;
      if (Math.abs(dy) < 10 && Math.abs(dx) < 10) return;
      gesture.decided = true;
      // Vertical intent from an edge band claims the whole gesture before
      // native scrolling can start.
      if (Math.abs(dy) > Math.abs(dx)) {
        gesture.flip = true;
        if (event.cancelable) event.preventDefault();
      }
    };

    const onTouchEnd = (event) => {
      if (!gesture) return;
      const settled = gesture;
      gesture = null;
      if (!settled.flip) return;
      const touch = event.changedTouches?.[0];
      if (!touch) return;
      const dy = touch.clientY - settled.startY;
      const dx = touch.clientX - settled.startX;
      if (!(Math.abs(dy) > 42 && Math.abs(dy) > Math.abs(dx))) return;
      step(dy < 0 ? 1 : -1);
    };

    const onTouchCancel = () => { gesture = null; };

    const onWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (currentDomain && currentDomain.projects.length < 2) return;
      const now = performance.now();
      const state = wheelStateRef.current;
      if (now < state.lockedUntil) return;
      if (now - state.lastTime > 260) state.accumulated = 0;
      state.lastTime = now;
      state.accumulated += event.deltaY || event.deltaX;
      if (Math.abs(state.accumulated) >= 60) {
        step(state.accumulated > 0 ? 1 : -1);
        state.accumulated = 0;
        state.lockedUntil = now + 380;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchCancel);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchCancel);
    };
  });

  const beginSwipe = (event) => {
    swipeRef.current = { x: event.clientX, y: event.clientY };
  };

  const endSwipe = (event) => {
    // Touch flips are fully handled by the touch handlers above; pointer
    // swipes here only serve mouse drags. Native-scrolling touches end in
    // pointercancel, which resets swipeRef without flipping anything.
    if (event.pointerType !== "mouse") {
      swipeRef.current = null;
      return;
    }
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (!(Math.abs(deltaY) > 42 && Math.abs(deltaY) > Math.abs(deltaX))) return;
    step(deltaY < 0 ? 1 : -1);
  };

  const carousel = project && currentDomain && (
    <div
      className="project-carousel"
      ref={carouselRef}
      data-no-drag
      onPointerDown={beginSwipe}
      onPointerUp={endSwipe}
      onPointerCancel={() => { swipeRef.current = null; }}
    >
      {currentDomain.projects.length > 1 && (
        <button className="project-carousel-arrow" type="button" onClick={() => step(-1)} aria-label="Previous project" title="Previous project">⌃</button>
      )}

      <HoloPanel key={`${currentDomain.id}-${project.id}`} className="project-carousel-panel" onClose={closeCarousel}>
        <div id="project-carousel" className="project-carousel-inner">
          <div className="project-carousel-heading">
            <div>
              <p>{currentDomain.label} · {index + 1}/{currentDomain.projects.length}</p>
              <h2>{project.title}</h2>
              <span>{project.tagline}</span>
            </div>
            <strong>● PROJECT FILE</strong>
          </div>

          <p className="project-carousel-description">{project.description}</p>
          <div className="project-carousel-highlights">
            <h3>Highlights</h3>
            <ul>{project.highlights.map((highlight) => <li key={highlight}><span>✓</span>{highlight}</li>)}</ul>
          </div>
          <div className="project-carousel-stack">
            {project.stack.map((technology) => <span key={technology}>{technology}</span>)}
          </div>
          {project.link && <a href={project.link} target="_blank" rel="noreferrer">view project →</a>}
        </div>
      </HoloPanel>

      {currentDomain.projects.length > 1 && (
        <button className="project-carousel-arrow" type="button" onClick={() => step(1)} aria-label="Next project" title="Next project">⌄</button>
      )}
    </div>
  );

  return (
    <section className="pf-page">
      <div className="pf-content projects-content">
        <div className={`projects-layout${currentDomain ? " has-selection" : ""}`}>
          <div className="projects-domain-area">
            <div className="eyebrow">Projects</div>
            <h1 className="pf-title">pick a <span className="accent">domain</span>.</h1>
            <div className="domain-grid">
              {DOMAINS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`domain-card${domain === d.id ? " is-selected" : ""}`}
                  onClick={() => selectDomain(d.id)}
                  aria-expanded={domain === d.id}
                  aria-controls="project-carousel"
                >
                  <div className="dn">{d.label}</div>
                  <div className="db">{d.blurb}</div>
                </button>
              ))}
            </div>
          </div>

          {!isTouch && (
            <div className="project-carousel-slot" aria-live="polite">
              {carousel}
            </div>
          )}
        </div>
      </div>

      {isTouch && carousel && createPortal(
        <div className="pf-modal" onClick={closeCarousel}>
          <div className="pf-modal-frame" aria-live="polite" onClick={(event) => event.stopPropagation()}>
            {carousel}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

export default memo(ProjectsSection);
