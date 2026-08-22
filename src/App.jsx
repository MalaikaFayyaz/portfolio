import { useEffect, useRef, useState } from "react";
import CarSVG from "./components/CarSVG";
import HillsBackground from "./components/HillsBackground";
import PortfolioNav from "./components/PortfolioNav";
import { CarPositionContext } from "./components/EyeTracker";
import { usePortfolioScroll } from "./hooks/usePortfolioScroll";
import { hillY } from "./utils/terrain";
import HomeSection from "./sections/HomeSection";
import AboutSection from "./sections/AboutSection";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectsSection from "./sections/ProjectsSection";

const IDLE_SPEED = 46;

export default function App() {
  const { scrollRef, vw, vh, scrollX, carWorldX, activePage, onScroll, goTo, nudgePage, isTouch, isGameMode, bindDrag, facingDirection } = usePortfolioScroll();
  const [domain, setDomain] = useState(null);
  const [idlePhase, setIdlePhase] = useState(0);
  const carPositionRef = useRef({ x: -1000, y: 0 });

  // Ambient cruise: while nobody is driving, the world slides past the
  // stationary car. Driving freezes the phase so the hills track the real
  // scroll position instead, and it resumes on release.
  useEffect(() => {
    if (isGameMode) return undefined;
    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setIdlePhase((phase) => phase + IDLE_SPEED * dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isGameMode]);

  const carScreenX = Math.max(43, Math.min(vw - 43, carWorldX - scrollX));
  // The near hill layer is drawn at -(scrollX + idlePhase), so the ground
  // directly under the car corresponds to this terrain coordinate.
  const groundX = carWorldX + idlePhase;
  const nearTerrainY = vh * 0.85 - hillY(groundX);
  const carTop = nearTerrainY - 48;
  const slope = hillY(groundX + 6) - hillY(groundX - 6);
  const rotation = Math.max(-16, Math.min(16, slope * 2.2));

  useEffect(() => {
    carPositionRef.current = { x: carScreenX, y: carTop + 24 };
  });

  return (
    <div className="pf-root">
      <PortfolioNav activePage={activePage} goTo={goTo} />
      <HillsBackground vh={vh} scrollX={scrollX} idlePhase={idlePhase} />

      <div style={{ position: "absolute", left: carScreenX - 43, top: carTop, zIndex: 15, transform: `scaleX(${facingDirection})` }}>
        <CarSVG rotation={rotation * facingDirection} />
      </div>

      <CarPositionContext.Provider value={carPositionRef}>
        <div className="pf-scroll" ref={scrollRef} onScroll={onScroll} {...bindDrag}>
          <HomeSection />
          <AboutSection />
          <ExperienceSection />
          <ProjectsSection domain={domain} setDomain={setDomain} />
        </div>
      </CarPositionContext.Provider>
    </div>
  );
}
