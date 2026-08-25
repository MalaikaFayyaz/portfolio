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
  "id": "software",
  "label": "Software",
  "blurb": "Full-stack apps, tools, and things that ship.",
  "glyph": "◱",
  "projects": [
    {
      "id": "sw-1",
      "title": "Pixel-Drive Interactive Portfolio",
      "tagline": "Game-inspired portfolio with driveable car physics",
      "description": "A side-scrolling portfolio where visitors drive through résumé sections.",
      "stack": ["React 18", "Vite", "Canvas API", "Web Audio API", "SVG", "CSS3"],
      "highlights": [
        "Built vehicle physics with unified scroll controller supporting wheel, trackpad, touch-drag, keyboard, and nav-bar input.",
        "Rendered infinite seamless parallax terrain from integer-harmonic wave functions as tiled SVG layers.",
        "Developed Canvas particle portrait with pointer-repulsion forces and devicePixelRatio-aware sizing.",
        "Sustained smooth 60fps animation with rAF loops — zero shipped audio or image assets."
      ],
      "link": "#"
    },
    {
      "id": "sw-2",
      "title": "Grandir ",
      "tagline": "Configurable commerce platform for small businesses",
      "description": "A modular commerce platform with configurable storefronts, product catalogues, and order management, built with a scalable Supabase backend and React frontend.",
      "stack": ["React", "TypeScript", "Tailwind CSS", "Supabase"],
      "highlights": [
        "Architected scalable Supabase database schema with Row-Level Security and normalized data models.",
        "Designed automated database workflows following modular architecture for maintainability.",
        "Collaborated using Git feature branches and documented decisions through architecture documentation."
      ],
      "link": "#"
    },
    {
      "id": "sw-3",
      "title": "AURIS (Audiobook Sharing Platform)",
      "tagline": "Modular audiobook platform with streaming and playback",
      "description": "A full-featured audiobook sharing platform supporting authentication, bookmarking, playback progress tracking, and file management.",
      "stack": ["React", "Node.js", "Express", "MongoDB"],
      "highlights": [
        "Designed and implemented modular architecture with authentication and bookmarking features.",
        "Built backend APIs and file-management workflows for audiobook storage and streaming."
      ],
      "link": "#"
    },
    {
      "id": "sw-4",
      "title": "DIY Community Platform",
      "tagline": "Full-stack MERN community application",
      "description": "A full-stack community platform for user-generated content.",
      "stack": ["MongoDB", "Express.js", "React", "Node.js"],
      "highlights": [
        "Built authentication, CRUD operations, content filtering, and a responsive UI end to end.",
        "Designed REST APIs and integrated MongoDB for efficient data management."
      ],
      "link": "#"
    }
  ]
},
  {
    "id": "systems",
    "label": "Systems Programming",
    "blurb": "Kernels, memory, and low-level control.",
    "glyph": "◧",
    "projects": [
      {
        "id": "sys-1",
        "title": "Memory-Mapped File System in xv6",
        "tagline": "mmap/munmap system calls in RISC-V kernel",
        "description": "Implemented memory-mapped file I/O system calls in the xv6-RISC-V kernel with demand paging and lazy allocation.",
        "stack": ["C", "xv6", "RISC-V", "Kernel Development"],
        "highlights": [
          "Implemented mmap/munmap system calls with demand paging and lazy allocation, loading pages only on access to reduce memory overhead.",
          "Debugged kernel-level components including page fault handling, interrupt management, and user-kernel context switching."
        ],
        "link": "#"
      },
      {
        "id": "sys-2",
        "title": "RSA Key Generator",
        "tagline": "Secure key generation with distributed computing",
        "description": "A secure RSA key generation system with client-server architecture, leveraging Azure VMs for distributed prime number computation.",
        "stack": ["C", "Azure VMs", "Socket Programming"],
        "highlights": [
          "Built client-server architecture for secure RSA key generation.",
          "Integrated Azure Virtual Machines for distributed key generation and prime number computation.",
          "Applied socket programming for inter-process communication and scalability testing."
        ],
        "link": "#"
      }
    ]
  },
    {
    "id": "hardware",
    "label": "Hardware",
    "blurb": "Circuits, processors, and low-level architecture.",
    "glyph": "◧",
    "projects": [
      {
        "id": "hw-1",
        "title": "Mano's Basic Computer Implementation",
        "tagline": "Complete processor implementation in Logisim",
        "description": "A full and exact working implementation of the processor described in Morris Mano's 'Computer System Architecture', with all instructions fully functional — covering the complete instruction cycle, control logic, registers, ALU, and memory.",
        "stack": ["Logisim", "Digital Logic Design", "Computer Architecture"],
        "highlights": [
          "Implemented all instructions from Mano's Basic Computer specification with full functionality.",
          "Designed complete instruction cycle including fetch, decode, and execute phases.",
          "Built control logic, register file, ALU, and memory subsystems from basic gates.",
          "Verified exact behavior matching textbook specifications through comprehensive testing."
        ],
        "link": "#"
      }
    ]
  },
  {
    "id": "ai",
    "label": "AI / ML",
    "blurb": "Models, pipelines, and the occasional overfit.",
    "glyph": "◈",
    "projects": [
      {
        "id": "ai-1",
        "title": "Household Economic Classification System",
        "tagline": "ML pipeline for economic status classification",
        "description": "A bag-level machine learning pipeline classifying household economic status from grouped demographic and financial records.",
        "stack": ["Python", "Random Forest", "XGBoost", "LightGBM", "CatBoost", "PyTorch"],
        "highlights": [
          "Engineered 40+ statistical, diversity, inequality, and socio-economic interaction features from raw data.",
          "Evaluated multiple models including Random Forest, XGBoost, LightGBM, CatBoost, and PyTorch neural networks.",
          "Improved macro F1-score from 0.54 to 0.73 through feature engineering, class balancing, and threshold optimization."
        ],
        "link": "#"
      },
      {
        "id": "ai-2",
        "title": "Handwritten Paragraph Recognition MLOps Pipeline",
        "tagline": "Deployed deep learning OCR system",
        "description": "End-to-end MLOps deployment of a handwriting recognition system based on FSDL architecture using Docker, AWS Lambda, and REST APIs.",
        "stack": ["Python", "Docker", "AWS Lambda", "CNN", "Transformer", "ResNet"],
        "highlights": [
          "Deployed deep learning OCR system with /health and /predict REST endpoints.",
          "Worked with CNN, Transformer, and ResNet-Transformer architectures on IAMParagraphs datasets.",
          "Debugged infrastructure issues including Lambda integrations, API failures, and server-side inference errors."
        ],
        "link": "#"
      },
      {
        "id": "ai-3",
        "title": "ASL Alphabet Classifier",
        "tagline": "CNN-based sign language recognition",
        "description": "A CNN-based image classifier for American Sign Language alphabet recognition using TensorFlow/Keras.",
        "stack": ["Python", "TensorFlow", "Keras"],
        "highlights": [
          "Designed CNN architecture for image classification.",
          "Applied preprocessing, training, and evaluation techniques for recognition accuracy."
        ],
        "link": "#"
      }
    ]
  },
  {
    "id": "research",
    "label": "Research",
    "blurb": "Papers, experiments, open questions.",
    "glyph": "◭",
    "projects": [
      {
        "id": "res-1",
        "title": "ML Approximation of Optimal Page Replacement",
        "tagline": "Learning-based cache replacement policies",
        "description": "Investigating machine learning approaches for approximating the Optimal Page Replacement (OPT) algorithm using historical memory-access traces and cache-state information.",
        "stack": ["Python", "Decision Trees", "MLPs", "Random Forest", "Logistic Regression"],
        "highlights": [
          "Developed end-to-end pipelines for trace processing, dataset generation, and cache-policy simulation.",
          "Expanded feature set from 5 to 11 features capturing temporal, spatial, cache-state, and eviction-history signals.",
          "Evaluated models on Synthetic, MSR Cambridge, and FIU traces achieving performance beyond LRU across multiple workloads.",
          "Narrowed performance gap with OPT through iterative model refinement and feature engineering."
        ],
        "link": "#"
      }
    ]
  }
];

export const SKILLS = [
  { group: "Languages", items: ["TypeScript", "Python", "Rust", "C++", "SQL"] },
  { group: "Frontend", items: ["React", "Tailwind CSS", "Vite", "Framer Motion"] },
  { group: "Backend", items: ["Node.js", "PostgreSQL", "GraphQL", "Docker", "AWS"] },
  { group: "ML / Data", items: ["PyTorch", "scikit-learn", "Pandas", "Airflow"] },
];