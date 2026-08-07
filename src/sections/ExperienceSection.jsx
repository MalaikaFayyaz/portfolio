export default function ExperienceSection() {
  return (
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
  );
}
