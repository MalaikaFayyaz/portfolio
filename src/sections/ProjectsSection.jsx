import { DOMAINS } from "../data";

export default function ProjectsSection({ domain, setDomain, selectedDomain }) {
  return (
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
  );
}
