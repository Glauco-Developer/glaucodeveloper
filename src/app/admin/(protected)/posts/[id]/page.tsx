import Link from "next/link"
import { notFound } from "next/navigation"
import { PostForm } from "@/components/admin/PostForm"
import { deletePost, updatePost } from "../actions"
import { getAdminPostById, getCategories } from "@/lib/supabase/queries"
import { rowToArticle } from "@/lib/supabase/transforms"

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [row, categories] = await Promise.all([getAdminPostById(id), getCategories()])

  if (!row) {
    notFound()
  }

  const post = rowToArticle(row)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/admin"
            className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--muted)] hover:text-[var(--ink)]"
          >
            ← Voltar ao dashboard
          </Link>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
            Editar post
          </h2>
        </div>

        <form action={deletePost.bind(null, post.id, post.slug)}>
          <button
            type="submit"
            className="rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-600 hover:bg-red-500/10 dark:text-red-300"
          >
            Excluir post
          </button>
        </form>
      </div>

      <PostForm
        action={updatePost.bind(null, post.id)}
        categories={categories}
        post={post}
        submitLabel="Salvar alteracoes"
      />
    </div>
  )
}
