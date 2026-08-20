import EyeTracker from "../components/EyeTracker";
import AsciiPortrait from "../components/AsciiPortrait";

export default function HomeSection({ eyeRef, px, py }) {
  return (
    <section className="pf-page">
      <div className="pf-content pf-home-layout">
        <div className="pf-home-copy">
          <EyeTracker eyeRef={eyeRef} px={px} py={py} />
          <div className="eyebrow">PolyMath · Sloth</div>
          <h1 className="pf-title">i'm <span className="accent">Malaika Fayyaz</span></h1>
          <p className="pf-desc">
            You have entered a Nomad. 
            {/* This portfolio doubles as a
            playground: the hills keep going as long as you keep scrolling, and so does the car. */}
          </p>

        </div>

        <div className="pf-portrait-panel">
          <AsciiPortrait />
        </div>
      </div>
    </section>
  );
}