import { useState } from "react";
import Badge from "./Badge";
import { PAGES } from "../data";

export default function PortfolioNav({ activePage, goTo }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (index) => {
    goTo(index);
    setMenuOpen(false);
  };

  return (
    <nav className="pf-nav">
      <div className="pf-nav-links">
        {PAGES.map((p, i) => (
          <button key={p} className={"pf-nav-link" + (activePage === i ? " active" : "")} onClick={() => navigate(i)}>
            {p}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="pf-menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-controls="mobile-page-menu"
        aria-label="Toggle page navigation"
      >
        ☰
      </button>
      <div className="pf-badges">
        <Badge href="https://www.linkedin.com/in/malaika-fayyaz-a09baa265/" title="LinkedIn">in</Badge>
        <Badge href="mailto:0915malaika@gmail.com" title="Email">@</Badge>
        <Badge href="https://github.com/MalaikaFayyaz" title="GitHub">gh</Badge>
        <Badge href="https://leetcode.com/u/0915malaika/" title="LeetCode">lc</Badge>
      </div>
      {menuOpen && (
        <div id="mobile-page-menu" className="pf-mobile-menu">
          {PAGES.map((p, i) => (
            <button
              key={p}
              type="button"
              className={"pf-mobile-menu-link" + (activePage === i ? " active" : "")}
              onClick={() => navigate(i)}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
