import type { Project } from "@/types"

export const projects: Project[] = [
  {
    id: "1",
    title: "Benoît Nihant Chocolatier",
    description:
      "Creative website for an award-winning Belgian chocolatier. Winner of Awwwards Honorable Mention and Communication Arts Webpick of the Day. Immersive storytelling and rich visual layers.",
    technologies: ["HTML5", "CSS3", "JavaScript", "GSAP", "Craft CMS"],
    demoUrl: "#",
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
    demoUrl: "#",
    featured: true,
    category: "frontend",
    agency: "Ebow Digital",
    role: "Web Developer",
  },
  {
    id: "3",
    title: "The New York Times / The Guardian",
    description:
      "Contributed to high-impact interactive projects featured in globally recognized publications. Focused on scalable front-end architecture and semantic code.",
    technologies: ["HTML5", "SCSS", "JavaScript", "REST APIs"],
    demoUrl: "#",
    featured: true,
    category: "frontend",
    agency: "Ebow Digital",
    role: "Senior Engineer",
  },
  {
    id: "4",
    title: "Simbweb",
    description:
      "Founded and led a digital agency for over 5 years. Managed project flow, business administration, and client relationships while delivering full-stack solutions.",
    technologies: ["PHP", "JavaScript", "jQuery", "MySQL"],
    demoUrl: "#",
    featured: true,
    category: "personal",
    role: "Founder & Developer",
  },
]
