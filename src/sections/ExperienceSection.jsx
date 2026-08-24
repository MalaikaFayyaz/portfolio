import { useState, memo } from "react";
import { createPortal } from "react-dom";
import { EXPERIENCES } from "../assets/data";
import { HoloPanel } from "../components/HoloPanel";
import { audioEngine } from "../assets/audio";
import EyeTracker from "../components/EyeTracker";

// Keep the original entries and their left-side copy intact. The new data is
// only used to fill the detail panel for the corresponding selected item.
const EXPERIENCE_ITEMS = [
  {
    id: "software-engineer",
    role: "Software Engineer Intern — MaqMinds",
    period: "July 2025 – September 2025",
    summary: "One or two lines on scope and impact. Keep it concrete.",
    details: EXPERIENCES[0],
  },
  {
    id: "intern",
    role: "Tech Head Assistant — Seed Programming",
    period: "January 2024 – January 2025",
    summary: "Same format, same brevity. Numbers help if you have them.",
    details: EXPERIENCES[1],
  },
];

function ExperienceSection({ isTouch = false }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected = EXPERIENCE_ITEMS.find((item) => item.id === selectedId) ?? null;

  const select = (id) => {
    audioEngine.playClick();
    setSelectedId(id);
  };

  const detailPanel = selected && (
    <HoloPanel key={selected.id} className="experience-detail" onClose={() => setSelectedId(null)}>
      <div id="experience-details" className="experience-detail-inner">
        <div className="experience-detail-heading">
          <div>
            <p className="experience-detail-period">{selected.details.period}</p>
            <h2>{selected.details.role}</h2>
            <p className="experience-detail-org">{selected.details.org} · {selected.details.location}</p>
          </div>
          <span className="experience-live">● LIVE FEED</span>
        </div>

        <p className="experience-detail-description">{selected.details.description}</p>

        <div className="experience-detail-columns">
          <div>
            <h3>Responsibilities</h3>
            <ul>{selected.details.responsibilities.map((item) => <li key={item}><span>▸</span>{item}</li>)}</ul>
          </div>
          <div>
            <h3>Achievements</h3>
            <ul>{selected.details.achievements.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul>
          </div>
        </div>

        <div className="experience-tech">
          <h3>Technologies</h3>
          <div>{selected.details.technologies.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
      </div>
    </HoloPanel>
  );

  return (
    <section className="pf-page">
      <div className="pf-content experience-content">
        <div className="experience-layout">
          <div className="experience-list">
            <EyeTracker />
            <div className="eyebrow">Experience</div>
            <h1 className="pf-title">where i've <span className="accent">worked</span>.</h1>

            {EXPERIENCE_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`exp-item${selected?.id === item.id ? " is-selected" : ""}`}
                onClick={() => select(item.id)}
                aria-expanded={selected?.id === item.id}
                aria-controls="experience-details"
              >
                <span className="role">{item.role}</span>
                <span className="meta">{item.period}</span>
                <span className="desc">{item.summary}</span>
              </button>
            ))}
          </div>

          {!isTouch && (
            <div className="experience-detail-slot" aria-live="polite">
              {detailPanel}
            </div>
          )}
        </div>
      </div>

      {isTouch && selected && createPortal(
        <div className="pf-modal" onClick={() => setSelectedId(null)}>
          <div className="pf-modal-frame" onClick={(event) => event.stopPropagation()}>
            {detailPanel}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

export default memo(ExperienceSection);
