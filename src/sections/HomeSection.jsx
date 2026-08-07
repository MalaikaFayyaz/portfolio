import EyeTracker from "../components/EyeTracker";

export default function HomeSection({ eyeRef, px, py }) {
  return (
    <section className="pf-page">
      <div className="pf-content">
        <EyeTracker eyeRef={eyeRef} px={px} py={py} />
        <div className="eyebrow">Software Engineer · Builder</div>
        <h1 className="pf-title">hi, i'm <span className="accent">Malaika Fayyaz</span> </h1>
        <p className="pf-desc">
          I build things across software, AI, and hardware. This portfolio doubles as a
          playground: the hills keep going as long as you keep scrolling, and so does the car.
        </p>
        {/* <a className="pf-cta" href="mailto:0915malaika@gmail.com">say hi →</a> */}
      </div>
    </section>
  );
}
