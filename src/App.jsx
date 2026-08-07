import { useEffect, useMemo, useRef, useState } from "react";
import CarSVG from "./components/CarSVG";
import HillsBackground from "./components/HillsBackground";
import PortfolioNav from "./components/PortfolioNav";
import EyeTracker from "./components/EyeTracker";
import { DOMAINS, PAGES } from "./data";
import { buildHillPath, hillY } from "./utils/terrain";
import { usePortfolioScroll } from "./hooks/usePortfolioScroll";

export default function App() {
  const { scrollRef, vw, vh, scrollX, activePage, onScroll, goTo } = usePortfolioScroll();
  const [domain, setDomain] = useState(null);
  const eyesRef = useRef(null);
  const [eyesCenter, setEyesCenter] = useState({ x: 0, y: 0 });

  const totalWidth = vw * PAGES.length + vw * 2;
  const nearPath = useMemo(() => buildHillPath(totalWidth, vh * 0.62, 1), [totalWidth, vh]);
  const farPath = useMemo(() => buildHillPath(totalWidth * 0.6, vh * 0.5, 1.6), [totalWidth, vh]);

  useEffect(() => {
    const el = eyesRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setEyesCenter({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
  }, [vw, vh]);

  const carScreenX = vw * 0.32;
  const carPathX = scrollX + carScreenX;
  const baseline = vh * 0.62;
  const carScreenY = baseline - hillY(carPathX) * 1 - 20;
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
      <HillsBackground totalWidth={totalWidth} vh={vh} scrollX={scrollX} nearPath={nearPath} farPath={farPath} />

      <div style={{ position: "absolute", left: carScreenX - 43, top: carScreenY - 27, zIndex: 15 }}>
        <CarSVG rotation={rotation} />
      </div>

      <div className="pf-scroll" ref={scrollRef} onScroll={onScroll}>
        <section className="pf-page">
          <div className="pf-content">
            <EyeTracker eyeRef={eyesRef} px={px} py={py} />
            <div className="eyebrow">Software Engineer · Builder</div>
            <h1 className="pf-title">hi, i'm <span className="accent">[your name]</span> — here.</h1>
            <p className="pf-desc">
              I build things across software, AI, and hardware. This portfolio doubles as a
              playground: the hills keep going as long as you keep scrolling, and so does the car.
            </p>
            <a className="pf-cta" href="mailto:0915malaika@gmail.com">say hi →</a>
          </div>
        </section>

        <section className="pf-page">
          <div className="pf-content">
            <div className="eyebrow">About</div>
            <h1 className="pf-title">a bit more <span className="accent">context</span>.</h1>
            <p className="pf-desc">
              Replace this with your real bio — where you work, what you studied, what you
              obsess over outside of work. Two to three short paragraphs read best here.
            </p>
            <ul className="pf-list">
              <li><span>&gt;</span> Based in [city]</li>
              <li><span>&gt;</span> Currently building [thing]</li>
              <li><span>&gt;</span> Into [hobby / interest]</li>
            </ul>
          </div>
        </section>

        <section className="pf-page">
          <div className="pf-content">
            <div className="eyebrow">Experience</div>
            <h1 className="pf-title">where i've <span className="accent">worked</span>.</h1>
            <div className="exp-item">
              <div className="role">Software Engineer — [Company]</div>
              <div className="meta">2024 — present</div>
              <div className="desc">One or two lines on scope and impact. Keep it concrete.</div>
            </div>
            <div className="exp-item">
              <div className="role">Intern — [Company]</div>
              <div className="meta">2023</div>
              <div className="desc">Same format, same brevity. Numbers help if you have them.</div>
            </div>
          </div>
        </section>

        <section className="pf-page">
          <div className="pf-content">
            <div className="eyebrow">Projects</div>
            {!domain ? (
              <>
                <h1 className="pf-title">pick a <span className="accent">domain</span>.</h1>
                <div className="domain-grid">
                  {DOMAINS.map((d) => (
                    <button key={d.id} className="domain-card" onClick={() => setDomain(d.id)}>
                      <div className="dn">{d.label}</div>
                      <div className="db">{d.blurb}</div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <button className="back-btn" onClick={() => setDomain(null)}>← back</button>
                <h1 className="pf-title">
                  {selectedDomain.label} <span className="accent">projects</span>.
                </h1>
                <ul className="pf-list">
                  {selectedDomain.items.map((it) => (
                    <li key={it}><span>#</span>{it}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      </div>

      <div className="pf-hint">scroll (trackpad / wheel) →</div>
    </div>
  );
}
