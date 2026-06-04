export type Project = {
  id: string
  title: string
  description: string
  technologies: string[]
  demoUrl?: string
  githubUrl?: string
  imageUrl?: string
  featured: boolean
  category: "frontend" | "fullstack" | "mobile" | "personal" | "other"
  agency?: string
  role?: string
}

export type Technology = {
  name: string
  icon: string
  color: string
  level: "expert" | "advanced" | "intermediate"
}

export type BlogArticle = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  publishedAt: string
  featured: boolean
  coverTone: string
  tags: string[]
  intro: string
  sections: Array<{
    title: string
    body: string[]
  }>
  href: string
}
