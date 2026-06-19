import Link from "next/link"
import { getAdminPosts, getCategories } from "@/lib/supabase/queries"
import { toPostListItem } from "@/lib/supabase/transforms"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const [rows, categories] = await Promise.all([getAdminPosts(), getCategories()])
  const posts = rows.map(toPostListItem)

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-[var(--line)] bg-[var(--bg-2)] p-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
            Admin Dashboard
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
            Gerencie posts e categorias do blog.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            O blog publico passa a ler do Supabase. Aqui voce cria categorias e edita o conteudo
            dos artigos em um formato simples: introducao e secoes.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/categories/new"
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm hover:border-[var(--ink)]"
          >
            Nova categoria
          </Link>
          <Link
            href="/admin/posts/new"
            className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-[var(--inv-ink)]"
          >
            Novo post
          </Link>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--card)]">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
            <h3 className="text-lg font-semibold tracking-[-0.03em]">Posts</h3>
            <span className="text-sm text-[var(--muted)]">{posts.length} itens</span>
          </div>

          <div className="divide-y divide-[var(--line)]">
            {posts.length === 0 ? (
              <div className="px-5 py-6 text-sm text-[var(--muted)]">
                Nenhum post criado ainda.
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{post.title}</p>
                    <div className="flex flex-wrap gap-3 font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                      <span>{post.category}</span>
                      <span>{post.publishedLabel}</span>
                      {post.featured ? <span>Destaque</span> : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        post.published
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-300"
                      }`}
                    >
                      {post.published ? "Publicado" : "Rascunho"}
                    </span>

                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--card)]">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
            <h3 className="text-lg font-semibold tracking-[-0.03em]">Categorias</h3>
            <span className="text-sm text-[var(--muted)]">{categories.length} itens</span>
          </div>

          <div className="divide-y divide-[var(--line)]">
            {categories.length === 0 ? (
              <div className="px-5 py-6 text-sm text-[var(--muted)]">
                Crie a primeira categoria antes de cadastrar posts.
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                      {category.slug}
                    </p>
                  </div>

                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
                  >
                    Editar
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
