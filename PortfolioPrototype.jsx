import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ---------------------------------------------------------
   DESIGN TOKENS — Solarized Dark
   base03 (bg) #002b36   base02 (panel) #073642
   base01 (muted) #586e75  base0 (body) #839496  base1 (bright) #93a1a1
   accent yellow #b58900 (car/signature)  accent cyan #2aa198 (links/active)
   accent orange #cb4b16 (secondary accent)
--------------------------------------------------------- */

const PAGES = ["home", "about", "experience", "projects"];

const DOMAINS = [
  { id: "software", label: "Software", blurb: "Full-stack apps, tools, and things that ship.", items: ["Realtime collab editor", "CLI task runner", "Portfolio engine (this site)"] },
  { id: "ai", label: "AI / ML", blurb: "Models, pipelines, and the occasional overfit.", items: ["Terrain-generation model", "Resume-ranking classifier", "Small transformer from scratch"] },
  { id: "hardware", label: "Hardware", blurb: "Circuits, sensors, things that beep.", items: ["ESP32 weather rig", "Line-following robot", "Custom mechanical keyboard"] },
  { id: "research", label: "Research", blurb: "Papers, experiments, open questions.", items: ["Pathfinding under uncertainty", "Procedural terrain survey", "Undergrad thesis notes"] },
];

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

function Badge({ href, children, title }) {
  return (
    <a href={href} title={title} target="_blank" rel="noreferrer" className="badge">
      {children}
    </a>
  );
}

function CarSVG({ rotation }) {
  return (
    <svg width="86" height="54" viewBox="0 0 86 54" style={{ transform: `rotate(${rotation}deg)`, transition: "transform 60ms linear" }}>
      <ellipse cx="43" cy="46" rx="34" ry="4" fill="#00212b" opacity="0.5" />
      <path d="M8 36 Q6 22 22 20 L30 10 Q34 6 42 6 L58 6 Q64 6 66 12 L72 20 Q80 21 80 32 Q80 38 74 38 L14 38 Q8 38 8 36 Z" fill="#b58900" stroke="#00212b" strokeWidth="2" />
      <path d="M32 20 L37 12 Q39 10 43 10 L56 10 Q60 10 62 14 L66 20 Z" fill="#2aa198" opacity="0.85" />
      <circle cx="47" cy="17" r="5.2" fill="#eee8d5" />
      <circle cx="49" cy="15.5" r="2.1" fill="#073642" />
      <circle cx="22" cy="40" r="8" fill="#073642" stroke="#eee8d5" strokeWidth="2" />
      <circle cx="66" cy="40" r="8" fill="#073642" stroke="#eee8d5" strokeWidth="2" />
      <circle cx="22" cy="40" r="2.6" fill="#eee8d5" />
      <circle cx="66" cy="40" r="2.6" fill="#eee8d5" />
    </svg>
  );
}

export default function PortfolioPrototype() {
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

  // Car stays at a fixed screen position; the hill scrolls beneath it.
  const carScreenX = vw * 0.32;
  const carPathX = scrollX + carScreenX;
  const baseline = vh * 0.62;
  const carScreenY = baseline - hillY(carPathX) * 1 - 20;
  const slope = hillY(carPathX + 6) - hillY(carPathX - 6);
  const rotation = Math.max(-16, Math.min(16, slope * 2.2));

  // Eyes (intro, home page only) track the car's screen position.
  const eyesRef = useRef(null);
  const [eyesCenter, setEyesCenter] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const el = eyesRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setEyesCenter({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
  }, [vw, vh]);

  const carAbsX = carScreenX; // car sits inside the same viewport as eyes
  const carAbsY = carScreenY;
  const eyeDX = carAbsX - eyesCenter.x;
  const eyeDY = carAbsY - eyesCenter.y;
  const eyeAngle = Math.atan2(eyeDY, eyeDX);
  const pupilR = 3.2;
  const px = Math.cos(eyeAngle) * pupilR;
  const py = Math.sin(eyeAngle) * pupilR;

  return (
    <div className="pf-root">
      <style>{`
        .pf-root {
          --bg: #002b36; --panel: #073642; --muted: #586e75; --body: #839496;
          --bright: #93a1a1; --yellow: #b58900; --cyan: #2aa198; --orange: #cb4b16;
          --cream: #eee8d5;
          width: 100%; height: 100%; min-height: 640px; background: var(--bg);
          color: var(--body); font-family: 'Space Mono', 'JetBrains Mono', monospace;
          position: relative; overflow: hidden; border-radius: 8px;
        }
        .pf-nav {
          position: absolute; top: 0; left: 0; right: 0; height: 56px; z-index: 30;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 22px; background: rgba(0,43,54,0.72); backdrop-filter: blur(6px);
          border-bottom: 1px solid rgba(88,110,117,0.35);
        }
        .pf-nav-links { display: flex; gap: 22px; }
        .pf-nav-link { background: none; border: none; cursor: pointer; font-family: inherit;
          font-size: 13px; letter-spacing: 0.06em; color: var(--muted); padding: 6px 2px;
          border-bottom: 2px solid transparent; text-transform: lowercase; }
        .pf-nav-link.active { color: var(--cyan); border-bottom-color: var(--cyan); }
        .pf-nav-link:hover { color: var(--bright); }
        .pf-badges { display: flex; gap: 8px; }
        .badge { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--muted); border-radius: 4px; font-size: 10px; color: var(--body);
          text-decoration: none; letter-spacing: 0.03em; }
        .badge:hover { border-color: var(--cyan); color: var(--cyan); }

        .pf-scroll { position: absolute; inset: 0; display: flex; overflow-x: scroll; overflow-y: hidden;
          scroll-snap-type: x mandatory; scrollbar-width: none; }
        .pf-scroll::-webkit-scrollbar { display: none; }
        .pf-page { min-width: 100%; height: 100%; scroll-snap-align: start; position: relative;
          display: flex; align-items: center; padding: 0 8vw; box-sizing: border-box; }

        .pf-hills { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .pf-hills svg { position: absolute; bottom: 0; left: 0; }

        .pf-content { position: relative; z-index: 10; max-width: 640px; }
        .eyebrow { color: var(--yellow); font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 10px; }
        h1.pf-title { font-size: clamp(28px, 4vw, 46px); color: var(--cream); margin: 0 0 14px; line-height: 1.15; }
        .pf-title .accent { color: var(--cyan); }
        p.pf-desc { font-size: 15px; line-height: 1.7; color: var(--body); margin: 0 0 22px; }
        .pf-cta { display: inline-flex; align-items: center; gap: 8px; color: var(--cyan); text-decoration: none;
          font-size: 13px; border: 1px solid var(--cyan); padding: 8px 14px; border-radius: 4px; }
        .pf-cta:hover { background: rgba(42,161,152,0.12); }

        .eyes-wrap { display: flex; gap: 18px; margin-bottom: 26px; }
        .eye { width: 46px; height: 46px; border-radius: 50%; background: var(--panel);
          border: 1px solid var(--muted); display: flex; align-items: center; justify-content: center; position: relative; }
        .pupil { width: 12px; height: 12px; border-radius: 50%; background: var(--cream); position: absolute; }

        .pf-list { list-style: none; margin: 0 0 22px; padding: 0; }
        .pf-list li { padding: 8px 0; border-bottom: 1px dashed rgba(88,110,117,0.4); font-size: 14px; color: var(--bright); }
        .pf-list li span { color: var(--yellow); margin-right: 10px; }

        .exp-item { border-left: 2px solid var(--muted); padding-left: 16px; margin-bottom: 20px; }
        .exp-item .role { color: var(--cream); font-size: 15px; }
        .exp-item .meta { color: var(--yellow); font-size: 12px; margin: 2px 0 6px; }
        .exp-item .desc { font-size: 13px; color: var(--body); line-height: 1.6; }

        .domain-grid { display: grid; grid-template-columns: repeat(2, minmax(180px,1fr)); gap: 14px; margin-top: 6px; max-width: 560px; }
        .domain-card { background: var(--panel); border: 1px solid rgba(88,110,117,0.4); border-radius: 6px;
          padding: 16px; cursor: pointer; text-align: left; color: var(--body); font-family: inherit; }
        .domain-card:hover { border-color: var(--cyan); transform: translateY(-2px); }
        .domain-card .dn { color: var(--cream); font-size: 15px; margin-bottom: 4px; }
        .domain-card .db { font-size: 12px; color: var(--muted); }

        .back-btn { background: none; border: 1px solid var(--muted); color: var(--bright); font-family: inherit;
          font-size: 12px; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-bottom: 16px; }
        .back-btn:hover { border-color: var(--cyan); color: var(--cyan); }

        .pf-hint { position: absolute; bottom: 16px; right: 22px; z-index: 20; font-size: 11px;
          color: var(--muted); letter-spacing: 0.08em; }
      `}</style>

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
        {/* HOME */}
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

        {/* ABOUT */}
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

        {/* EXPERIENCE */}
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

        {/* PROJECTS */}
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
