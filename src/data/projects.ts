import type { Project } from "@/types"

export const projects: Project[] = [
  {
    id: "1",
    title: "AllDash AI",
    description:
      "A WordPress plugin I built that uses AI to monitor and manage client site portfolios — real-time health checks, automated diagnostics on error logs, and weekly reports for agencies running multiple WordPress sites.",
    technologies: ["WordPress", "PHP", "JavaScript", "AI APIs"],
    demoUrl: "https://alldashai.com",
    featured: true,
    category: "personal",
    role: "Creator",
    year: "2025 — Current",
  },
  {
    id: "2",
    title: "Benoît Nihant Chocolatier",
    description:
      "Creative website for an award-winning Belgian chocolatier, built on Angular with a headless CMS. Immersive storytelling and rich visual layers earned recognition from Awwwards, CSS Design Awards and Communication Arts.",
    technologies: ["Angular", "Headless CMS", "GSAP", "JavaScript"],
    demoUrl: "https://www.benoitnihant.be",
    mentions: [
      { label: "Awwwards", url: "https://www.awwwards.com/" },
      { label: "CSS Design Awards", url: "https://www.cssdesignawards.com/" },
      { label: "Communication Arts", url: "https://www.commarts.com/" },
    ],
    featured: true,
    category: "frontend",
    agency: "Perverte",
    role: "Front-end Developer",
    year: "2018",
  },
  {
    id: "3",
    title: "Virtual Treasury — Portals",
    description:
      "Contributed front-end development, built on Angular with a headless CMS, to the Portals section of the Virtual Record Treasury of Ireland — a Trinity College Dublin-led project digitally reconstructing archives destroyed in the 1922 Public Record Office fire. The project was later featured in The New York Times and The Guardian.",
    technologies: ["Angular", "Headless CMS", "TypeScript", "JavaScript"],
    demoUrl: "https://virtualtreasury.ie/portals",
    mentions: [
      { label: "The New York Times", url: "https://virtualtreasury.ie/news/vrti-featured-in-nytimes-article" },
      { label: "The Guardian", url: "https://www.theguardian.com/world/2025/jun/30/pioneering-project-releases-more-lost-irish-records-spanning-700-years" },
    ],
    featured: true,
    category: "frontend",
    agency: "Ebow Digital",
    role: "Web Developer",
    year: "2022 — Current",
  },
]
