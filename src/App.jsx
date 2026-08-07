import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Badge from "./components/Badge";
import CarSVG from "./components/CarSVG";
import { PAGES, DOMAINS } from "./data";

function hillY(x) {
  return (
    58 * Math.sin(x * 0.0011) +
    26 * Math.sin(x * 0.0027 + 1.3) +
    14 * Math.sin(x * 0.0006 + 0.6)
  );
}

function buildHillPath(totalWidth, baseline, amp, step = 24) {
  let d = `M 0 ${baseline + 400}`;
  for (let x = 0; x <= totalWidth; x += step) {
    const y = baseline - hillY(x) * amp;
    d += ` L ${x} ${y.toFixed(1)}`;
  }
  d += ` L ${totalWidth} ${baseline + 400} Z`;
  return d;
}

export default function App() {
  const scrollRef = useRef(null);
  const [vw, setVw] = useState(1200);
  const [vh, setVh] = useState(700);
  const [scrollX, setScrollX] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const [domain, setDomain] = useState(null);
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

  const totalWidth = vw * PAGES.length + vw * 2;

  const nearPath = useMemo(() => buildHillPath(totalWidth, vh * 0.62, 1), [totalWidth, vh]);
  const farPath = useMemo(() => buildHillPath(totalWidth * 0.6, vh * 0.5, 1.6), [totalWidth, vh]);

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

  const goTo = (idx) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * vw, behavior: "smooth" });
  };

  const carScreenX = vw * 0.32;
  const carPathX = scrollX + carScreenX;
  const baseline = vh * 0.62;
  const carScreenY = baseline - hillY(carPathX) * 1 - 20;
  const slope = hillY(carPathX + 6) - hillY(carPathX - 6);
  const rotation = Math.max(-16, Math.min(16, slope * 2.2));

  const eyesRef = useRef(null);
  const [eyesCenter, setEyesCenter] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = eyesRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setEyesCenter({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
  }, [vw, vh]);

  const carAbsX = carScreenX;
  const carAbsY = carScreenY;
  const eyeDX = carAbsX - eyesCenter.x;
  const eyeDY = carAbsY - eyesCenter.y;
  const eyeAngle = Math.atan2(eyeDY, eyeDX);
  const pupilR = 3.2;
  const px = Math.cos(eyeAngle) * pupilR;
  const py = Math.sin(eyeAngle) * pupilR;

  return (
    <div className="pf-root">
      <nav className="pf-nav">
        <div className="pf-nav-links">
          {PAGES.map((p, i) => (
            <button key={p} className={"pf-nav-link" + (activePage === i ? " active" : "")} onClick={() => goTo(i)}>
              {p}
            </button>
          ))}
        </div>
        <div className="pf-badges">
          <Badge href="https://linkedin.com" title="LinkedIn">in</Badge>
          <Badge href="mailto:hello@example.com" title="Email">@</Badge>
          <Badge href="https://github.com" title="GitHub">gh</Badge>
          <Badge href="https://leetcode.com" title="LeetCode">lc</Badge>
        </div>
      </nav>

      <div className="pf-hills">
        <svg width={totalWidth * 0.6} height={vh} style={{ transform: `translateX(${-scrollX * 0.35}px)` }}>
          <path d={farPath} fill="#2aa198" opacity="0.10" />
        </svg>
        <svg width={totalWidth} height={vh} style={{ transform: `translateX(${-scrollX}px)` }}>
          <path d={nearPath} fill="#b58900" opacity="0.14" />
        </svg>
      </div>

      <div style={{ position: "absolute", left: carScreenX - 43, top: carScreenY - 27, zIndex: 15 }}>
        <CarSVG rotation={rotation} />
      </div>

      <div className="pf-scroll" ref={scrollRef} onScroll={onScroll}>
        <section className="pf-page">
          <div className="pf-content">
            <div className="eyes-wrap" ref={eyesRef}>
              <div className="eye"><div className="pupil" style={{ transform: `translate(${px}px, ${py}px)` }} /></div>
              <div className="eye"><div className="pupil" style={{ transform: `translate(${px}px, ${py}px)` }} /></div>
            </div>
            <div className="eyebrow">Software Engineer · Builder</div>
            <h1 className="pf-title">hi, i'm <span className="accent">[your name]</span> — here.</h1>
            <p className="pf-desc">
              I build things across software, AI, and hardware. This portfolio doubles as a
              playground: the hills keep going as long as you keep scrolling, and so does the car.
            </p>
            <a className="pf-cta" href="mailto:hello@example.com">say hi →</a>
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
                  {DOMAINS.find((d) => d.id === domain).label} <span className="accent">projects</span>.
                </h1>
                <ul className="pf-list">
                  {DOMAINS.find((d) => d.id === domain).items.map((it) => (
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
