import Link from "next/link"
import { notFound } from "next/navigation"
import { CategoryForm } from "@/components/admin/CategoryForm"
import { deleteCategory, updateCategory } from "../actions"
import { getCategoryById } from "@/lib/supabase/queries"

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const category = await getCategoryById(id)

  if (!category) {
    notFound()
  }

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
            Editar categoria
          </h2>
        </div>

        <form action={deleteCategory.bind(null, category.id)}>
          <button
            type="submit"
            className="rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-600 hover:bg-red-500/10 dark:text-red-300"
          >
            Excluir categoria
          </button>
        </form>
      </div>

      <CategoryForm
        action={updateCategory.bind(null, category.id)}
        category={category}
        submitLabel="Salvar categoria"
      />
    </div>
  )
}
