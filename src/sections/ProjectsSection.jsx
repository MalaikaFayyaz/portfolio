import { useMemo, useRef, useState } from "react";
import { DOMAINS } from "../data";
import { DOMAINS as PROJECT_DOMAINS } from "../assets/data";
import { HoloPanel } from "../components/HoloPanel";
import { audioEngine } from "../assets/audio";

export default function ProjectsSection({ domain, setDomain }) {
  const [index, setIndex] = useState(0);
  const swipeRef = useRef(null);
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

  const beginSwipe = (event) => {
    swipeRef.current = { x: event.clientX, y: event.clientY };
  };

  const endSwipe = (event) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaY) > 42 && Math.abs(deltaY) > Math.abs(deltaX)) {
      step(deltaY < 0 ? 1 : -1);
    }
  };

  return (
    <section className="pf-page">
      <div className="pf-content projects-content">
        <div className="projects-layout">
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

          <div className="project-carousel-slot" aria-live="polite">
            {project && currentDomain && (
              <div
                className="project-carousel"
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
