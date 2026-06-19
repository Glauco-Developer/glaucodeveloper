'use client'

import { useActionState, useState } from "react"
import { slugify } from "@/lib/blog"
import type { BlogCategory } from "@/types"

type CategoryFormState = {
  error?: string
}

type CategoryFormAction = (
  state: CategoryFormState,
  formData: FormData
) => Promise<CategoryFormState>

type CategoryFormProps = {
  action: CategoryFormAction
  category?: BlogCategory
  submitLabel: string
}

const initialState: CategoryFormState = {}

export function CategoryForm({
  action,
  category,
  submitLabel,
}: CategoryFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState)
  const [name, setName] = useState(category?.name ?? "")
  const [slugInput, setSlugInput] = useState(category?.slug ?? "")
  const [slugTouched, setSlugTouched] = useState(Boolean(category?.slug))
  const slug = slugTouched ? slugInput : slugify(name)

  return (
    <form action={formAction} className="space-y-6">
      {state.error ? (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {state.error}
        </p>
      ) : null}

      <label className="block space-y-2">
        <span className="text-sm text-[var(--muted)]">Nome</span>
        <input
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg-2)] px-4 py-3 text-sm outline-none focus:border-[var(--ink)]"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-[var(--muted)]">Slug</span>
        <input
          name="slug"
          value={slug}
          onChange={(event) => {
            setSlugTouched(true)
            setSlugInput(event.target.value)
          }}
          placeholder="gerado automaticamente se vazio"
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg-2)] px-4 py-3 text-sm outline-none focus:border-[var(--ink)]"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-medium text-[var(--inv-ink)] disabled:opacity-60"
      >
        {pending ? "Salvando..." : submitLabel}
      </button>
    </form>
  )
}
