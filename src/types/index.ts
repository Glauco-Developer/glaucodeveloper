export type Project = {
  id: string
  title: string
  description: string
  technologies: string[]
  demoUrl?: string
  mentions?: Array<{
    label: string
    url: string
  }>
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

export type BlogSection = {
  title: string
  body: string[]
}

export type BlogCategoryRow = {
  id: string
  slug: string
  name: string
  created_at: string
}

export type BlogCategory = {
  id: string
  slug: string
  name: string
  createdAt: string
}

export type BlogPostRow = {
  id: string
  slug: string
  title: string
  excerpt: string
  intro: string
  category_id: string | null
  tags: string[]
  cover_tone: string
  sections: BlogSection[]
  content_text: string
  read_time: string
  featured: boolean
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export type BlogPostRowWithCategory = BlogPostRow & {
  blog_categories: Pick<BlogCategoryRow, "id" | "slug" | "name"> | null
}

export type BlogArticle = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  categoryId: string | null
  categorySlug: string
  readTime: string
  publishedAt: string | null
  featured: boolean
  published: boolean
  coverTone: string
  tags: string[]
  intro: string
  sections: BlogSection[]
  href: string
}
