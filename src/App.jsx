import { useEffect, useRef, useState } from "react";
import CarSVG from "./components/CarSVG";
import HillsBackground from "./components/HillsBackground";
import PortfolioNav from "./components/PortfolioNav";
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
  const eyesRef = useRef(null);
  const [eyesCenter, setEyesCenter] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = eyesRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setEyesCenter({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
  }, [vw, vh]);

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

  const eyeDX = carScreenX - eyesCenter.x;
  const eyeDY = carTop + 24 - eyesCenter.y;
  const eyeAngle = Math.atan2(eyeDY, eyeDX);
  const pupilR = 3.2;
  const px = Math.cos(eyeAngle) * pupilR;
  const py = Math.sin(eyeAngle) * pupilR;

  return (
    <div className="pf-root">
      <PortfolioNav activePage={activePage} goTo={goTo} />
      <HillsBackground vh={vh} scrollX={scrollX} idlePhase={idlePhase} />

      <div style={{ position: "absolute", left: carScreenX - 43, top: carTop, zIndex: 15, transform: `scaleX(${facingDirection})` }}>
        <CarSVG rotation={rotation * facingDirection} />
      </div>

      <div className="pf-scroll" ref={scrollRef} onScroll={onScroll} {...bindDrag}>
        <HomeSection eyeRef={eyesRef} px={px} py={py} nudgePage={nudgePage} isTouch={isTouch} />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection domain={domain} setDomain={setDomain} />
      </div>
    </div>
  );
}
