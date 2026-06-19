import Link from "next/link"
import { PostForm } from "@/components/admin/PostForm"
import { createPost } from "../actions"
import { getCategories } from "@/lib/supabase/queries"

export default async function NewPostPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <Link
        href="/admin"
        className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--muted)] hover:text-[var(--ink)]"
      >
        ← Voltar ao dashboard
      </Link>

      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-[-0.04em]">Novo post</h2>
        <p className="text-sm text-[var(--muted)]">
          Preencha os campos abaixo. O conteudo do artigo fica dividido em introducao e secoes.
        </p>
      </div>

      <PostForm
        action={createPost}
        categories={categories}
        submitLabel="Criar post"
      />
    </div>
  )
}
