'use client'

import { useActionState, useState } from "react"
import { slugify } from "@/lib/blog"
import type { BlogArticle, BlogCategory } from "@/types"

type PostFormState = {
  error?: string
}

type PostFormAction = (state: PostFormState, formData: FormData) => Promise<PostFormState>

type EditableSection = {
  title: string
  bodyText: string
}

type PostFormProps = {
  action: PostFormAction
  categories: BlogCategory[]
  post?: BlogArticle
  submitLabel: string
}

const initialState: PostFormState = {}

function toEditableSections(post?: BlogArticle): EditableSection[] {
  if (!post || post.sections.length === 0) {
    return [{ title: "", bodyText: "" }]
  }

  return post.sections.map((section) => ({
    title: section.title,
    bodyText: section.body.join("\n\n"),
  }))
}

export function PostForm({
  action,
  categories,
  post,
  submitLabel,
}: PostFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState)
  const [title, setTitle] = useState(post?.title ?? "")
  const [slugInput, setSlugInput] = useState(post?.slug ?? "")
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug))
  const [sections, setSections] = useState<EditableSection[]>(toEditableSections(post))
  const [coverPreview, setCoverPreview] = useState<string | null>(post?.coverImageUrl ?? null)
  const slug = slugTouched ? slugInput : slugify(title)

  function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setCoverPreview(URL.createObjectURL(file))
  }

  const serializedSections = JSON.stringify(
    sections.map((section) => ({
      title: section.title.trim(),
      body: section.bodyText
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
    }))
  )

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="sections" value={serializedSections} />
      <input
        type="hidden"
        name="existing_published_at"
        value={post?.publishedAt ?? ""}
      />
      <input
        type="hidden"
        name="existing_cover_image_url"
        value={post?.coverImageUrl ?? ""}
      />

      {state.error ? (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {state.error}
        </p>
      ) : null}

      {categories.length === 0 ? (
        <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          Crie pelo menos uma categoria antes de salvar posts.
        </p>
      ) : null}

      <section className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-[var(--muted)]">Titulo</span>
          <input
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg-2)] px-4 py-3 text-sm outline-none focus:border-[var(--ink)]"
          />
        </label>

        <label className="space-y-2">
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
      </section>

      <label className="block space-y-2">
        <span className="text-sm text-[var(--muted)]">Resumo do card</span>
        <textarea
          name="excerpt"
          defaultValue={post?.excerpt ?? ""}
          required
          rows={3}
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg-2)] px-4 py-3 text-sm outline-none focus:border-[var(--ink)]"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-[var(--muted)]">Introducao do artigo</span>
        <textarea
          name="intro"
          defaultValue={post?.intro ?? ""}
          required
          rows={5}
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg-2)] px-4 py-3 text-sm outline-none focus:border-[var(--ink)]"
        />
      </label>

      <section className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-[var(--muted)]">Categoria</span>
          <select
            name="category_id"
            defaultValue={post?.categoryId ?? ""}
            required
            disabled={categories.length === 0}
            className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg-2)] px-4 py-3 text-sm outline-none focus:border-[var(--ink)] disabled:opacity-60"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm text-[var(--muted)]">Tempo de leitura</span>
          <input
            name="read_time"
            defaultValue={post?.readTime ?? "5 min read"}
            required
            className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg-2)] px-4 py-3 text-sm outline-none focus:border-[var(--ink)]"
          />
        </label>
      </section>

      <label className="block space-y-2">
        <span className="text-sm text-[var(--muted)]">Tags</span>
        <input
          name="tags"
          defaultValue={post ? post.tags.join(", ") : ""}
          placeholder="Next.js, Supabase, UI"
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg-2)] px-4 py-3 text-sm outline-none focus:border-[var(--ink)]"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-[var(--muted)]">Imagem de capa</span>
        {coverPreview ? (
          <div
            className="h-48 w-full rounded-2xl border border-[var(--line)] bg-cover bg-center"
            style={{ backgroundImage: `url(${coverPreview})` }}
          />
        ) : null}
        <input
          type="file"
          name="cover_image"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleCoverChange}
          required={!post?.coverImageUrl}
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg-2)] px-4 py-3 text-sm outline-none focus:border-[var(--ink)]"
        />
        <p className="text-xs text-[var(--muted)]">
          {post?.coverImageUrl
            ? "Envie uma nova imagem para substituir a capa atual, ou deixe em branco para manter."
            : "JPEG, PNG ou WebP. Sera redimensionada para o card do blog."}
        </p>
      </label>

      <section className="space-y-4 rounded-[1.5rem] border border-[var(--line)] bg-[var(--bg-2)] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.03em]">Conteudo</h2>
            <p className="text-sm text-[var(--muted)]">
              Cada secao tem um titulo e um texto. Separe paragrafos com uma linha em branco.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setSections((current) => [...current, { title: "", bodyText: "" }])
            }
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm hover:border-[var(--ink)]"
          >
            Adicionar secao
          </button>
        </div>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={`${index}-${section.title}`}
              className="space-y-3 rounded-[1.25rem] border border-[var(--line)] bg-[var(--card)] p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  Secao {index + 1}
                </p>
                {sections.length > 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setSections((current) => current.filter((_, itemIndex) => itemIndex !== index))
                    }
                    className="text-sm text-[var(--muted)] hover:text-red-500"
                  >
                    Remover
                  </button>
                ) : null}
              </div>

              <input
                value={section.title}
                onChange={(event) =>
                  setSections((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, title: event.target.value } : item
                    )
                  )
                }
                placeholder="Titulo da secao"
                className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg-2)] px-4 py-3 text-sm outline-none focus:border-[var(--ink)]"
              />

              <textarea
                value={section.bodyText}
                onChange={(event) =>
                  setSections((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, bodyText: event.target.value } : item
                    )
                  )
                }
                rows={8}
                placeholder="Escreva o texto da secao aqui."
                className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg-2)] px-4 py-3 text-sm leading-7 outline-none focus:border-[var(--ink)]"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--bg-2)] px-4 py-3 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post?.published ?? false}
          />
          Publicado
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--bg-2)] px-4 py-3 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={post?.featured ?? false}
          />
          Destacar na home e no topo do blog
        </label>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || categories.length === 0}
          className="rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-medium text-[var(--inv-ink)] disabled:opacity-60"
        >
          {pending ? "Salvando..." : submitLabel}
        </button>

        {post ? (
          <p className="text-sm text-[var(--muted)]">
            Se despublicar o post, ele some do blog publico.
          </p>
        ) : null}
      </div>
    </form>
  )
}
