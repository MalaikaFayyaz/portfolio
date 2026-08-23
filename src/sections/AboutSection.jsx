import { memo } from "react";

function AboutSection() {
  return (
    <section className="pf-page">
      <div className="pf-content">
        <div className="eyebrow">About</div>
        <h1 className="pf-title">a bit more <span className="accent">context</span>.</h1>
        <p className="pf-desc">
         Juggling between coursework, TAship, and internship, I am trying to survive. Alongside, I am building a product based on solving an issue faced by local commerce platforms. Thus, the current work stack is MERN. Besides this, When I am busy procastinating, I love to build out of my lexicon and be nerdy about computer architecture.              
        </p>
        <ul className="pf-list">
          <li><span>&gt;</span> Based in Sol 3.</li>
          <li><span>&gt;</span> Currently building Grandir.</li>
          <li><span>&gt;</span> Computer Science Senior at ITU.</li>
        </ul>
      </div>
    </section>
  );
}

export default memo(AboutSection);
