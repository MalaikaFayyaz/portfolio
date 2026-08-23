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
            You have entered a Nomad. <br></br>
            I am a scientist by day and an artist by night. Evenings are often passed in liminality. 
            <br></br> Currently, I am occupied by researching about the cache replacement using RL and working on its constraints.
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
