import type { Project } from "@/types"

export const projects: Project[] = [
  {
    id: "1",
    title: "Benoît Nihant Chocolatier",
    description:
      "Creative website for an award-winning Belgian chocolatier. Winner of Awwwards Honorable Mention and Communication Arts Webpick of the Day. Immersive storytelling and rich visual layers.",
    technologies: ["HTML5", "CSS3", "JavaScript", "GSAP", "Craft CMS"],
    demoUrl: "https://www.benoitnihant.be",
    mentions: [
      { label: "Awwwards", url: "https://www.awwwards.com/" },
      { label: "Communication Arts", url: "https://www.commarts.com/" },
    ],
    featured: true,
    category: "frontend",
    agency: "Perverte",
    role: "Front-end Developer",
  },
  {
    id: "2",
    title: "The Spider Awards",
    description:
      "Platform for Ireland's premier digital awards. Contributed to the development of the 'Digital for Good' award-winning environment. Focused on accessibility and performance.",
    technologies: ["TypeScript", "JavaScript", "WordPress", "CI/CD"],
    demoUrl: "https://www.spiderawards.com",
    mentions: [
      { label: "Spider Awards", url: "https://www.spiderawards.com" },
    ],
    featured: true,
    category: "frontend",
    agency: "Ebow Digital",
    role: "Web Developer",
  },
  {
    id: "3",
    title: "The New York Times / The Guardian",
    description:
      "Contributed to high-impact interactive work featured in globally recognized publications, with attention to scalable front-end architecture and semantic structure.",
    technologies: ["HTML5", "SCSS", "JavaScript", "REST APIs"],
    mentions: [
      { label: "The New York Times", url: "https://www.nytimes.com" },
      { label: "The Guardian", url: "https://www.theguardian.com" },
    ],
    featured: true,
    category: "frontend",
    agency: "Ebow Digital",
    role: "Senior Engineer",
  },
  {
    id: "4",
    title: "Simbweb",
    description:
      "Founded and led a digital agency for over 5 years. That period built a broader foundation in delivery, client relationships, operations and digital execution.",
    technologies: ["PHP", "JavaScript", "jQuery", "MySQL"],
    featured: true,
    category: "personal",
    role: "Founder",
  },
]
