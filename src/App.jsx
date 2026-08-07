import { useEffect, useMemo, useRef, useState } from "react";
import CarSVG from "./components/CarSVG";
import HillsBackground from "./components/HillsBackground";
import PortfolioNav from "./components/PortfolioNav";
import { DOMAINS, PAGES } from "./data";
import { buildHillPath, hillY } from "./utils/terrain";
import { usePortfolioScroll } from "./hooks/usePortfolioScroll";
import HomeSection from "./sections/HomeSection";
import AboutSection from "./sections/AboutSection";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectsSection from "./sections/ProjectsSection";

export default function App() {
  const { scrollRef, vw, vh, scrollX, activePage, onScroll, goTo } = usePortfolioScroll();
  const [domain, setDomain] = useState(null);
  const eyesRef = useRef(null);
  const [eyesCenter, setEyesCenter] = useState({ x: 0, y: 0 });
  const [worldX, setWorldX] = useState(0);
  const worldXRef = useRef(0);

  useEffect(() => {
    let rafId;
    let lastTime = null;

    const tick = (time) => {
      if (lastTime == null) lastTime = time;
      const delta = Math.min(32, time - lastTime);
      lastTime = time;
      worldXRef.current += delta * 0.09;
      setWorldX(worldXRef.current);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const totalWidth = Math.max(vw * PAGES.length + vw * 2, worldX + vw * 4 + 2000);
  const nearPath = useMemo(() => buildHillPath(totalWidth, vh * 0.85, 1), [totalWidth, vh]);
  const farPath = useMemo(() => buildHillPath(totalWidth * 0.9, vh * 0.78, 1.6), [totalWidth, vh]);

  useEffect(() => {
    const el = eyesRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setEyesCenter({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
  }, [vw, vh]);

  const carScreenX = vw * 0.32;
  const carPathX = worldX + carScreenX;
  const groundBaseline = vh * 0.86;
  const carScreenY = groundBaseline - hillY(carPathX) * 1 - 26;
  const slope = hillY(carPathX + 6) - hillY(carPathX - 6);
  const rotation = Math.max(-16, Math.min(16, slope * 2.2));

  const eyeDX = carScreenX - eyesCenter.x;
  const eyeDY = carScreenY - eyesCenter.y;
  const eyeAngle = Math.atan2(eyeDY, eyeDX);
  const pupilR = 3.2;
  const px = Math.cos(eyeAngle) * pupilR;
  const py = Math.sin(eyeAngle) * pupilR;

  const selectedDomain = DOMAINS.find((d) => d.id === domain);

  return (
    <div className="pf-root">
      <PortfolioNav activePage={activePage} goTo={goTo} />
      <HillsBackground totalWidth={totalWidth} vh={vh} scrollX={worldX} nearPath={nearPath} farPath={farPath} />

      <div style={{ position: "absolute", left: carScreenX - 43, top: carScreenY - 27, zIndex: 15 }}>
        <CarSVG rotation={rotation} />
      </div>

      <div className="pf-scroll" ref={scrollRef} onScroll={onScroll}>
        <HomeSection eyeRef={eyesRef} px={px} py={py} />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection domain={domain} setDomain={setDomain} selectedDomain={selectedDomain} />
      </div>
    </div>
  );
}
