# Fase 5 — Editor Rico (Tiptap)

## Objetivo
Integrar o Tiptap como editor de conteúdo no admin, salvar o conteúdo como JSON no banco e renderizá-lo no blog público com o layout visual já existente.

---

## 5.1 Por que Tiptap?

| Critério | Tiptap | React Quill | TipTap vs Markdown |
|----------|--------|-------------|-------------------|
| Integração React | Excelente | Boa | — |
| Saída | JSON (ProseMirror) ou HTML | HTML | Texto puro |
| Extensões | Enorme ecossistema | Limitado | — |
| SSR (Next.js) | Suportado | Problemático | — |
| Personalização visual | Total | Limitada | — |

O Tiptap salva conteúdo como **JSON estruturado** (ProseMirror), o que permite:
- Preservar heading, blockquote, código e listas como nós tipados
- Renderizar com componentes React customizados (sem `dangerouslySetInnerHTML`)
- Fazer busca e extração de texto puro facilmente

---

## 5.2 Instalar Tiptap

```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-character-count
```

Pacotes:
- **`@tiptap/react`** — integração React
- **`@tiptap/pm`** — ProseMirror core (necessário)
- **`@tiptap/starter-kit`** — extensões básicas: bold, italic, heading, blockquote, code, lists, etc.
- **`@tiptap/extension-placeholder`** — placeholder quando o editor está vazio
- **`@tiptap/extension-character-count`** — contador de palavras (para calcular read_time)

---

## 5.3 Componente do editor

`src/components/admin/RichEditor.tsx` — **Client Component** (o Tiptap precisa de DOM):

```typescript
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import type { JSONContent } from '@tiptap/react'

type Props = {
  initialContent?: JSONContent
  onChange: (json: JSONContent, text: string) => void
}

export function RichEditor({ initialContent, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Escreva o artigo aqui...' }),
      CharacterCount,
    ],
    content: initialContent ?? '',
    onUpdate({ editor }) {
      onChange(editor.getJSON(), editor.getText())
    },
  })

  if (!editor) return null

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-[var(--line)] pb-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          label="H2"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          label="H3"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          label="B"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          label="I"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          label="❝"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          label="•"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          label="<>"
        />
      </div>

      {/* Área de edição */}
      <EditorContent
        editor={editor}
        className="prose prose-invert min-h-[400px] max-w-none rounded-lg border border-[var(--line)] p-4 focus-within:border-[var(--ink)] [&_.tiptap]:outline-none"
      />

      {/* Contador */}
      <p className="text-right font-mono text-xs text-[var(--muted)]">
        {editor.storage.characterCount?.words() ?? 0} palavras
        {' / '}
        {Math.ceil((editor.storage.characterCount?.words() ?? 0) / 200)} min de leitura
      </p>
    </div>
  )
}

function ToolbarButton({
  onClick,
  active,
  label,
}: {
  onClick: () => void
  active: boolean
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2.5 py-1 font-mono text-xs transition-colors ${
        active
          ? 'bg-[var(--ink)] text-[var(--inv-ink)]'
          : 'border border-[var(--line)] text-[var(--muted)] hover:border-[var(--ink)]'
      }`}
    >
      {label}
    </button>
  )
}
```

---

## 5.4 PostForm — formulário completo do admin

`src/components/admin/PostForm.tsx`:

```typescript
'use client'

import { useState, useTransition } from 'react'
import type { JSONContent } from '@tiptap/react'
import { RichEditor } from './RichEditor'
import { createPost, updatePost, deletePost } from '@/app/admin/posts/actions'
import type { BlogPost } from '@/types'

export function PostForm({ post }: { post?: BlogPost }) {
  const isEditing = !!post
  const [isPending, startTransition] = useTransition()
  const [content, setContent] = useState<JSONContent>(
    (post?.content as JSONContent) ?? {}
  )
  const [contentText, setContentText] = useState(post?.contentText ?? '')

  function handleEditorChange(json: JSONContent, text: string) {
    setContent(json)
    setContentText(text)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    // Injetar conteúdo do editor (não está num input normal)
    formData.set('content', JSON.stringify(content))
    formData.set('content_text', contentText)
    if (isEditing) formData.set('was_published', String(post.published))

    startTransition(() => {
      if (isEditing) {
        updatePost(post.id, formData)
      } else {
        createPost(formData)
      }
    })
  }

  function handleDelete() {
    if (!post || !confirm('Tem certeza? Esta ação é irreversível.')) return
    startTransition(() => deletePost(post.id))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {isEditing ? 'Editar post' : 'Novo post'}
        </h1>
        <div className="flex gap-3">
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
            >
              Deletar
            </button>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-[var(--ink)] px-4 py-2 text-sm text-[var(--inv-ink)] disabled:opacity-50"
          >
            {isPending ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Título" name="title" defaultValue={post?.title} required />
        <Field label="Slug" name="slug" defaultValue={post?.slug} required
          hint="URL: /blog/meu-slug" />
      </div>

      <Field label="Excerpt" name="excerpt" defaultValue={post?.excerpt}
        as="textarea" rows={2} required />

      <div className="grid grid-cols-3 gap-4">
        <Field label="Categoria" name="category" defaultValue={post?.category} required />
        <Field label="Tags (separadas por vírgula)" name="tags"
          defaultValue={post?.tags?.join(', ')} />
        <Field label="Read time" name="read_time"
          defaultValue={post?.readTime ?? '5 min read'} />
      </div>

      <Field label="Imagem de capa" name="cover_image" as="file"
        hint="JPEG, PNG ou WebP — enviada para o bucket blog-covers no Supabase Storage" />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published"
            defaultChecked={post?.published} value="true" />
          Publicado
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured"
            defaultChecked={post?.featured} value="true" />
          Destaque
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-[var(--muted)]">Conteúdo</label>
        <RichEditor
          initialContent={post?.content as JSONContent}
          onChange={handleEditorChange}
        />
      </div>
    </form>
  )
}

function Field({ label, name, hint, as: Tag = 'input', ...props }: {
  label: string
  name: string
  hint?: string
  as?: 'input' | 'textarea'
  [key: string]: unknown
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-[var(--muted)]">{label}</label>
      <Tag
        name={name}
        className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm outline-none focus:border-[var(--ink)]"
        {...props}
      />
      {hint && <p className="text-xs text-[var(--muted)]">{hint}</p>}
    </div>
  )
}
```

---

## 5.5 Renderizar o conteúdo Tiptap no blog público

O conteúdo salvo é JSON do ProseMirror. Para renderizar no `[slug]/page.tsx`, usamos a função `generateHTML` do Tiptap (roda no servidor, zero JS no cliente):

```typescript
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'

function renderContent(content: Record<string, unknown>): string {
  try {
    return generateHTML(content as JSONContent, [StarterKit])
  } catch {
    return ''
  }
}

// No JSX do artigo:
<div
  className="prose prose-invert max-w-none"
  dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
/>
```

> **`dangerouslySetInnerHTML` é seguro aqui?**
> Sim, porque o conteúdo vem do nosso próprio banco e foi gerado pelo Tiptap. Não é input direto do usuário sem sanitização. Se quiser mais segurança, adicione `DOMPurify` no server.

---

## 5.6 Estilos do conteúdo renderizado

Instalar o plugin de tipografia do Tailwind:

```bash
npm install @tailwindcss/typography
```

Adicionar em `tailwind.config.ts`:

```typescript
plugins: [require('@tailwindcss/typography')]
```

O `prose prose-invert` já estiliza `h2`, `h3`, `blockquote`, `code`, `p`, `ul`, `li` automaticamente com tipografia elegante.

---

## Checklist da Fase 5

- [ ] `npm install @tiptap/react @tiptap/pm @tiptap/starter-kit ...`
- [ ] `src/components/admin/RichEditor.tsx` criado
- [ ] `src/components/admin/PostForm.tsx` criado (substitui forma simples da Fase 4)
- [ ] `npm install @tailwindcss/typography` e configurado
- [ ] `[slug]/page.tsx` atualizado para renderizar JSON do Tiptap
- [ ] Testar: criar um artigo com títulos, blockquote e lista
- [ ] Verificar que o post aparece formatado corretamente no blog público

---

## O que vem a seguir

[Fase 6 → Blog Dinâmico](./06-dynamic-blog.md)
