import EyeTracker from "../components/EyeTracker";
export default function AboutSection({ eyeRef, px, py }) {
  return (
    <section className="pf-page">
      <div className="pf-content">
        <EyeTracker eyeRef={eyeRef} px={px} py={py} />
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
  );
}
