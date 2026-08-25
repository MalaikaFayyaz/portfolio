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
    "id": "exp-1",
    "role": "Software Engineer Intern",
    "org": "MaqMinds",
    "period": "July 2025 – September 2025",
    "location": "Johar Town, Lahore",
    "summary": "Built internal tools and dashboards to automate business workflows and drive digital transformation.",
    "description": "Developed low-code internal applications and integrated backend systems to streamline operations.",
    "responsibilities": [
      "Built Retool dashboards to automate workflows and reduce manual effort.",
      "Integrated APIs and databases (SQL, MongoDB) for seamless data flow.",
      "Collaborated with engineers to deploy production-ready features.",
      "Debugged issues and enhanced UI/UX based on stakeholder feedback."
    ],
    "technologies": ["JavaScript", "SQL", "MongoDB", "Retool"],
    "achievements": [
      "Built appointment scheduler integrating Google Calendar, Gmail, and Classroom APIs.",
      "Deployed Retool workflow that automated key internal business processes."
    ]
  },
  {
    "id": "exp-2",
    "role": "Tech Head Assistant",
    "org": "Seed Programming",
    "period": "January 2024 – January 2025",
    "location": "Hybrid",
    "summary": "Orchestrated programming camp execution and technical operations to drive educational outreach.",
    "description": "Led end-to-end camp coordination including marketing, content creation, and technical execution.",
    "responsibilities": [
      "Executed programming camp launches including social media, email campaigns, and promotional materials.",
      "Managed website content using WordPress and CMS tools.",
      "Collaborated with team lead to optimize outreach and operations."
    ],
    "technologies": ["WordPress", "Google Sheets", "Adobe Photoshop"],
    "achievements": [
      "Launched summer and winter camps with 150+ student enrollment."
    ]
  },
  {
    "id": "exp-3",
    "role": "Teaching Assistant",
    "org": "Seed Programming",
    "period": "June 2024 – August 2024 & December 2024 – January 2025",
    "location": "Lahore, Pakistan",
    "summary": "Mentored students in Python and C++ through hands-on projects and personalized support.",
    "description": "Supported summer and winter coding camps by providing academic guidance to diverse learners.",
    "responsibilities": [
      "Mentored students on Python and C++ projects through one-on-one and group sessions.",
      "Assisted with debugging strategies and problem-solving techniques.",
      "Monitored student progress and adapted support based on individual needs."
    ],
    "technologies": ["Python", "C++"],
    "achievements": [
      "Guided students from basics to building projects like 'Game of Life'.",
      "Maintained ongoing mentorship with students beyond camp completion."
    ]
  },
  {
    "id": "exp-4",
    "role": "Home Tutor",
    "org": "Self-Employed",
    "period": "2022 – 2026",
    "location": "Lahore, Pakistan",
    "summary": "Provided personalized STEM tutoring for over four years to students in grades 6–10.",
    "description": "Designed custom learning plans focused on building conceptual foundations and independent problem-solving.",
    "responsibilities": [
      "Tutored Mathematics, Physics, Computer Science, and programming fundamentals.",
      "Created tailored lesson plans based on student strengths and learning pace.",
      "Simplified complex concepts using practical examples and step-by-step explanations.",
      "Supported homework, assignments, and exam preparation."
    ],
    "technologies": ["Mathematics", "Physics", "Programming Fundamentals"],
    "achievements": [
      "Helped a Grade 9 student pass after previously failing annual exams.",
      "Developed independent learning skills through conceptual understanding."
    ]
  },
  {
    "id": "exp-5",
    "role": "Video Editor",
    "org": "Seed Programming",
    "period": "February 2024 – January 2025",
    "location": "Hybrid",
    "summary": "Managed end-to-end video content preparation and publishing for educational purposes.",
    "description": "Owned the complete video content pipeline from raw footage to final publication.",
    "responsibilities": [
      "Edited videos including sorting, cutting, and final preparation.",
      "Uploaded and organized video content on the website.",
      "Ensured content met quality standards and educational messaging."
    ],
    "technologies": ["Adobe Premiere Pro", "Video Editing"],
    "achievements": [
      "Streamlined video content workflow for consistent quality output."
    ]
  },
  {
    "id": "exp-6",
    "role": "Graphic Designer",
    "org": "Freelance",
    "period": "August 2022 – July 2023",
    "location": "Remote",
    "summary": "Delivered creative graphic design solutions including ads, CVs, and posters.",
    "description": "Provided freelance design services across diverse projects, from concept to final delivery.",
    "responsibilities": [
      "Designed marketing materials, CVs, posters, and digital assets.",
      "Collaborated with clients to understand and meet design requirements.",
      "Managed multiple projects while meeting deadlines."
    ],
    "technologies": ["Adobe Photoshop", "Image Editing", "Online Graphics"],
    "achievements": [
      "Built strong portfolio through successful completion of diverse client projects."
    ]
  }
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