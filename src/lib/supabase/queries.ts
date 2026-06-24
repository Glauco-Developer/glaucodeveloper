import { createClient } from "./server"
import { normalizePostRow, rowToArticle, rowToCategory } from "./transforms"
import type { BlogCategoryRow, BlogPostRowWithCategory } from "@/types"

const PUBLISHED_POST_SELECT =
  "id, slug, title, excerpt, intro, category_id, tags, cover_image_url, sections, content_text, read_time, featured, published, published_at, created_at, updated_at, blog_categories(id, slug, name)"

export async function getPublishedPosts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, intro, category_id, tags, cover_image_url, sections, content_text, read_time, featured, published, published_at, created_at, updated_at, blog_categories(id, slug, name)"
    )
    .eq("published", true)
    .order("published_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as unknown[]).map((row) =>
    rowToArticle(normalizePostRow(row as unknown as BlogPostRowWithCategory))
  )
}

const MIN_SIMILARITY = 0.35

export async function searchPostsByEmbedding(embedding: number[], limit = 6) {
  const supabase = await createClient()
  const { data: matches, error: matchError } = await supabase.rpc("match_blog_posts", {
    query_embedding: embedding,
    match_count: limit,
  })

  if (matchError) {
    throw new Error(matchError.message)
  }

  const orderedIds = ((matches ?? []) as { id: string; similarity: number }[])
    .filter((match) => match.similarity >= MIN_SIMILARITY)
    .map((match) => match.id)

  if (orderedIds.length === 0) {
    return []
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select(PUBLISHED_POST_SELECT)
    .in("id", orderedIds)

  if (error) {
    throw new Error(error.message)
  }

  const rows = ((data ?? []) as unknown[]).map((row) =>
    normalizePostRow(row as unknown as BlogPostRowWithCategory)
  )

  return orderedIds
    .map((id) => rows.find((row) => row.id === id))
    .filter((row): row is BlogPostRowWithCategory => Boolean(row))
    .map(rowToArticle)
}

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
}

function tokenizeQuery(query: string) {
  return Array.from(
    new Set(
      normalizeSearchText(query)
        .split(/[^a-z0-9]+/g)
        .map((token) => token.trim())
        .filter((token) => token.length >= 3)
    )
  )
}

function scoreKeywordMatch(
  row: BlogPostRowWithCategory,
  query: string,
  tokens: string[]
) {
  const title = normalizeSearchText(row.title)
  const excerpt = normalizeSearchText(row.excerpt)
  const intro = normalizeSearchText(row.intro)
  const tags = normalizeSearchText((row.tags ?? []).join(" "))
  const content = normalizeSearchText(row.content_text)
  const normalizedQuery = normalizeSearchText(query).trim()

  let score = 0

  if (normalizedQuery && title.includes(normalizedQuery)) score += 12
  if (normalizedQuery && excerpt.includes(normalizedQuery)) score += 8
  if (normalizedQuery && intro.includes(normalizedQuery)) score += 6
  if (normalizedQuery && content.includes(normalizedQuery)) score += 5

  for (const token of tokens) {
    if (title.includes(token)) score += 4
    if (tags.includes(token)) score += 3
    if (excerpt.includes(token)) score += 2
    if (intro.includes(token)) score += 2
    if (content.includes(token)) score += 1
  }

  return score
}

export async function searchPostsByKeyword(query: string, limit = 6) {
  const normalizedQuery = query.trim()

  if (!normalizedQuery) {
    return []
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select(PUBLISHED_POST_SELECT)
    .eq("published", true)

  if (error) {
    throw new Error(error.message)
  }

  const rows = ((data ?? []) as unknown[]).map((row) =>
    normalizePostRow(row as unknown as BlogPostRowWithCategory)
  )
  const tokens = tokenizeQuery(normalizedQuery)

  return rows
    .map((row) => ({
      row,
      score: scoreKeywordMatch(row, normalizedQuery, tokens),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((entry) => rowToArticle(entry.row))
}

export async function getPublishedCategories() {
  const posts = await getPublishedPosts()
  const categories = [...new Set(posts.map((post) => post.category))].sort((left, right) =>
    left.localeCompare(right)
  )

  return ["All", ...categories]
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, intro, category_id, tags, cover_image_url, sections, content_text, read_time, featured, published, published_at, created_at, updated_at, blog_categories(id, slug, name)"
    )
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (error) {
    return null
  }

  return rowToArticle(normalizePostRow(data as unknown as BlogPostRowWithCategory))
}

export async function getHomePosts(limit = 3) {
  const posts = await getPublishedPosts()
  return posts.slice(0, limit)
}

export async function getAdminPosts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, intro, category_id, tags, cover_image_url, sections, content_text, read_time, featured, published, published_at, created_at, updated_at, blog_categories(id, slug, name)"
    )
    .order("updated_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as unknown[]).map((row) =>
    normalizePostRow(row as unknown as BlogPostRowWithCategory)
  )
}

export async function getAdminPostById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, intro, category_id, tags, cover_image_url, sections, content_text, read_time, featured, published, published_at, created_at, updated_at, blog_categories(id, slug, name)"
    )
    .eq("id", id)
    .single()

  if (error) {
    return null
  }

  return normalizePostRow(data as unknown as BlogPostRowWithCategory)
}

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("blog_categories")
    .select("id, slug, name, created_at")
    .order("name", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as BlogCategoryRow[]).map(rowToCategory)
}

export async function getCategoryById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("blog_categories")
    .select("id, slug, name, created_at")
    .eq("id", id)
    .single()

  if (error) {
    return null
  }

  return rowToCategory(data as BlogCategoryRow)
}
