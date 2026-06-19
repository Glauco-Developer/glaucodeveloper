import Link from "next/link"
import { CategoryForm } from "@/components/admin/CategoryForm"
import { createCategory } from "../actions"

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin"
        className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--muted)] hover:text-[var(--ink)]"
      >
        ← Voltar ao dashboard
      </Link>

      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-[-0.04em]">Nova categoria</h2>
        <p className="text-sm text-[var(--muted)]">
          Crie categorias para organizar os posts e manter a busca por assunto consistente.
        </p>
      </div>

      <CategoryForm action={createCategory} submitLabel="Criar categoria" />
    </div>
  )
}
