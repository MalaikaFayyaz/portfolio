import { memo } from "react";
import EyeTracker from "../components/EyeTracker";
import AsciiPortrait from "../components/AsciiPortrait";

function HomeSection() {
  return (
    <section className="pf-page">
      <div className="pf-content pf-home-layout">
        <div className="pf-home-copy">
          <EyeTracker />
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

export default memo(HomeSection);
