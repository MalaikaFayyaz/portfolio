export const PAGES = ["home", "about", "experience", "projects"];

export const PAGE_LABELS = {
  home: "home",
  about: "about",
  experience: "experience",
  projects: "projects",
};

export const SOCIALS = [
  { id: "github", label: "GH", title: "GitHub", href: "https://github.com/MalaikaFayyaz" },
  { id: "linkedin", label: "IN", title: "LinkedIn", href: "https://www.linkedin.com/" },
  { id: "email", label: "@", title: "Email me", href: "mailto:malaika.fayyaz@example.com?subject=Hello%20Malaika&body=Hi%20Malaika%2C%0A%0A" },
];

export const EXPERIENCES = [
  {
    id: "exp-1",
    role: "Software Engineer Intern",
    org: "MaqMinds",
    period: "July 2025 – September 2025",
    location: "Johar Town, Lahore.",
    summary: "Building digital solutions and tech consulting to drive business growth and digital transformation.",
    description:
      "Built internal tools and dashboards using Retool to automate business workflows and improve operational efficiency",
    responsibilities: [      
      "Integrated APIs and databases to streamline data flow between systems",
      "Collaborated with engineers to design, test, and deploy production-ready features",
      "Debugged issues, implemented feature enhancements, and improved UI usability based on stakeholder feedback",
    ],
    technologies: ["JavaScript", "SQL", "MongoDB", "Retool"],
    achievements: [
      
    ],
  },
  {
    id: "exp-2",
    role: "Software Engineering Intern",
    org: "Pixel & Co. Labs",
    period: "2022 — 2023",
    location: "Hybrid",
    summary: "Prototyped ML-assisted tooling and shipped a public data pipeline.",
    description:
      "Worked within a small R&D pod exploring applied ML for internal tooling. Delivered a production data pipeline and an experimental terrain-generation model used for internal demos.",
    responsibilities: [
      "Built ETL pipelines processing 2M+ records/day with Airflow",
      "Prototyped a procedural terrain-generation model for visualization demos",
      "Wrote documentation and onboarding guides adopted by 3 teams",
    ],
    technologies: ["Python", "PyTorch", "Airflow", "GCP", "SQL"],
    achievements: [
      "Cut manual data-cleaning time by 70% with an automated pipeline",
      "Presented findings at the internal engineering demo day",
      "Co-authored an internal RFC on model evaluation standards",
    ],
  },
];

export const DOMAINS = [
  {
    id: "software",
    label: "Software",
    blurb: "Full-stack apps, tools, and things that ship.",
    glyph: "◱",
    projects: [
      {
        id: "sw-1",
        title: "Realtime Collab Editor",
        tagline: "Google-docs-style editor with CRDT sync",
        description:
          "A collaborative text editor supporting simultaneous multi-user editing using conflict-free replicated data types, with presence cursors and offline recovery.",
        stack: ["React", "TypeScript", "WebSockets", "Yjs"],
        highlights: ["Sub-100ms sync latency", "Offline-first with automatic merge", "500+ concurrent test sessions"],
        link: "#",
      },
      {
        id: "sw-2",
        title: "CLI Task Runner",
        tagline: "A tiny, fast task orchestrator",
        description:
          "A dependency-aware task runner for monorepos with smart caching, parallel execution, and a plugin API.",
        stack: ["Rust", "Node.js"],
        highlights: ["3x faster than prior tool", "Content-hash based caching", "Published on npm & crates.io"],
        link: "#",
      },
      {
        id: "sw-3",
        title: "Portfolio Engine (this site)",
        tagline: "The pixel world you're standing in",
        description:
          "A hand-built side-scrolling portfolio engine with a driveable car, terrain physics, holographic UI panels, and synthesized ambient audio.",
        stack: ["React", "TypeScript", "Tailwind", "Web Audio API"],
        highlights: ["Physics-based driving", "Procedural terrain", "Zero external audio/image assets"],
        link: "#",
      },
    ],
  },
  {
    id: "ai",
    label: "AI / ML",
    blurb: "Models, pipelines, and the occasional overfit.",
    glyph: "◈",
    projects: [
      {
        id: "ai-1",
        title: "Terrain-Generation Model",
        tagline: "Procedural landscapes via learned heightmaps",
        description:
          "A lightweight generative model producing plausible terrain heightmaps for use in games and visualizations, trained on satellite elevation data.",
        stack: ["PyTorch", "NumPy", "CUDA"],
        highlights: ["Trained on 50k tile dataset", "Real-time inference (<10ms/tile)"],
        link: "#",
      },
      {
        id: "ai-2",
        title: "Resume-Ranking Classifier",
        tagline: "Explainable candidate-role matching",
        description:
          "A transparent ranking model that scores resume-role fit and explains its reasoning via feature attributions rather than a black box score.",
        stack: ["Python", "scikit-learn", "SHAP"],
        highlights: ["78% agreement with human reviewers", "Full explainability report per prediction"],
        link: "#",
      },
      {
        id: "ai-3",
        title: "Small Transformer From Scratch",
        tagline: "A character-level transformer, no frameworks",
        description:
          "An educational reimplementation of a decoder-only transformer built from raw tensor ops, used to teach attention mechanisms in a workshop.",
        stack: ["Python", "NumPy"],
        highlights: ["No autograd library used", "Used in a 40-person workshop"],
        link: "#",
      },
    ],
  },
  {
    id: "hardware",
    label: "Hardware",
    blurb: "Circuits, sensors, things that beep.",
    glyph: "◧",
    projects: [
      {
        id: "hw-1",
        title: "ESP32 Weather Rig",
        tagline: "Solar-powered weather station",
        description:
          "A self-sustaining outdoor sensor rig streaming temperature, humidity, and air-quality readings to a small dashboard over MQTT.",
        stack: ["ESP32", "MQTT", "C++"],
        highlights: ["6-month uninterrupted uptime", "Solar + battery power management"],
        link: "#",
      },
      {
        id: "hw-2",
        title: "Line-Following Robot",
        tagline: "PID-tuned autonomous bot",
        description:
          "A competition robot using IR sensor arrays and a tuned PID loop to navigate track courses at high speed.",
        stack: ["Arduino", "C++", "PID Control"],
        highlights: ["Top-3 finish, regional competition", "Custom-etched PCB"],
        link: "#",
      },
    ],
  },
  {
    id: "research",
    label: "Research",
    blurb: "Papers, experiments, open questions.",
    glyph: "◭",
    projects: [
      {
        id: "res-1",
        title: "Pathfinding Under Uncertainty",
        tagline: "Robust routing on noisy graphs",
        description:
          "A study comparing pathfinding algorithms under uncertain edge weights, proposing a hybrid heuristic with strong worst-case guarantees.",
        stack: ["Python", "NetworkX", "LaTeX"],
        highlights: ["Presented at undergrad research symposium", "12% improvement over baseline heuristic"],
        link: "#",
      },
      {
        id: "res-2",
        title: "Procedural Terrain Survey",
        tagline: "A literature review + benchmark suite",
        description:
          "A survey of procedural terrain-generation techniques with a reproducible benchmark comparing quality, speed, and controllability.",
        stack: ["Python", "Jupyter"],
        highlights: ["Open-sourced benchmark suite", "Cited in 2 follow-up student projects"],
        link: "#",
      },
    ],
  },
];

export const SKILLS = [
  { group: "Languages", items: ["TypeScript", "Python", "Rust", "C++", "SQL"] },
  { group: "Frontend", items: ["React", "Tailwind CSS", "Vite", "Framer Motion"] },
  { group: "Backend", items: ["Node.js", "PostgreSQL", "GraphQL", "Docker", "AWS"] },
  { group: "ML / Data", items: ["PyTorch", "scikit-learn", "Pandas", "Airflow"] },
];