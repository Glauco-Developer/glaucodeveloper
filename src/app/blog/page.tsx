import { BlogIndex } from "@/components/blog/BlogIndex"
import { getPublishedCategories, getPublishedPosts } from "@/lib/supabase/queries"

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  const [articles, categories] = await Promise.all([
    getPublishedPosts(),
    getPublishedCategories(),
  ])

  return <BlogIndex articles={articles} categories={categories} />
}
