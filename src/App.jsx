import { useEffect, useMemo, useRef, useState } from "react";
import CarSVG from "./components/CarSVG";
import HillsBackground from "./components/HillsBackground";
import PortfolioNav from "./components/PortfolioNav";
import { PAGES } from "./data";
import { buildHillPath, hillY } from "./utils/terrain";
import { usePortfolioScroll } from "./hooks/usePortfolioScroll";
import HomeSection from "./sections/HomeSection";
import AboutSection from "./sections/AboutSection";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectsSection from "./sections/ProjectsSection";

export default function App() {
  const { scrollRef, vw, vh, scrollX, carWorldX, activePage, onScroll, goTo, nudgePage, isTouch, bindDrag, facingDirection } = usePortfolioScroll();
  const [domain, setDomain] = useState(null);
  const eyesRef = useRef(null);
  const [eyesCenter, setEyesCenter] = useState({ x: 0, y: 0 });
  const totalWidth = vw * (PAGES.length + 2) + 2000;
  const nearPath = useMemo(() => buildHillPath(totalWidth, vh * 0.85, 1), [totalWidth, vh]);
  const farPath = useMemo(() => buildHillPath(totalWidth * 0.9, vh * 0.78, 1.6), [totalWidth, vh]);

  useEffect(() => {
    const el = eyesRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setEyesCenter({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
  }, [vw, vh]);

  const carScreenX = Math.max(43, Math.min(vw - 43, carWorldX - scrollX));
  const carPathX = carWorldX;
  // The near path is the road the car drives on. Place the bottom of each
  // wheel directly on that curve rather than on a separate baseline.
  const nearTerrainY = vh * 0.85 - hillY(carPathX);
  const carTop = nearTerrainY - 48;
  const slope = hillY(carPathX + 6) - hillY(carPathX - 6);
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
      <HillsBackground totalWidth={totalWidth} vh={vh} scrollX={scrollX} nearPath={nearPath} farPath={farPath} />

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
