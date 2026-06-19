import { formatBlogDate, parseSections } from "@/lib/blog"
import type {
  BlogArticle,
  BlogCategory,
  BlogCategoryRow,
  BlogPostRowWithCategory,
} from "@/types"

type RawCategory = Pick<BlogCategoryRow, "id" | "slug" | "name">

type RawPostRow = Omit<BlogPostRowWithCategory, "blog_categories"> & {
  blog_categories: RawCategory | RawCategory[] | null
}

export function rowToCategory(row: BlogCategoryRow): BlogCategory {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    createdAt: row.created_at,
  }
}

export function rowToArticle(row: BlogPostRowWithCategory): BlogArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.blog_categories?.name ?? "Uncategorized",
    categoryId: row.category_id,
    categorySlug: row.blog_categories?.slug ?? "uncategorized",
    readTime: row.read_time,
    publishedAt: row.published_at,
    featured: row.featured,
    published: row.published,
    coverTone: row.cover_tone,
    tags: row.tags ?? [],
    intro: row.intro,
    sections: parseSections(row.sections),
    href: `/blog/${row.slug}`,
  }
}

export function toPostListItem(row: BlogPostRowWithCategory) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.blog_categories?.name ?? "Uncategorized",
    featured: row.featured,
    published: row.published,
    publishedAt: row.published_at,
    publishedLabel: formatBlogDate(row.published_at),
    updatedAt: row.updated_at,
  }
}

export function normalizePostRow(row: RawPostRow): BlogPostRowWithCategory {
  const category = Array.isArray(row.blog_categories)
    ? (row.blog_categories[0] ?? null)
    : row.blog_categories

  return {
    ...row,
    blog_categories: category,
  }
}
