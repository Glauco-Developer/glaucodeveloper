import { BlogIndex } from "@/components/blog/BlogIndex"
import { blogArticles, blogCategories } from "@/data/blog"

export default function BlogPage() {
  return <BlogIndex articles={blogArticles} categories={blogCategories} />
}
