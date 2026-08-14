import Badge from "./Badge";
import { PAGES } from "../data";

export default function PortfolioNav({ activePage, goTo }) {
  return (
    <nav className="pf-nav">
      <div className="pf-nav-links">
        {PAGES.map((p, i) => (
          <button key={p} className={"pf-nav-link" + (activePage === i ? " active" : "")} onClick={() => goTo(i)}>
            {p}
          </button>
        ))}
      </div>
      <div className="pf-badges">
        <Badge href="https://www.linkedin.com/in/malaika-fayyaz-a09baa265/" title="LinkedIn">in</Badge>
        <Badge href="mailto:0915malaika@gmail.com" title="Email">@</Badge>
        <Badge href="https://github.com/MalaikaFayyaz" title="GitHub">gh</Badge>
        <Badge href="https://leetcode.com/u/0915malaika/" title="LeetCode">lc</Badge>
      </div>
    </nav>
  );
}
