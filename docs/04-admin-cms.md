# Fase 4 — Admin CMS (CRUD de Posts)

## Objetivo
Construir a área de administração onde o blog pode ser gerenciado: listar, criar, editar e remover posts, tudo autenticado.

---

## 4.1 Estrutura de rotas do admin

```
/admin                    → lista de posts (Server Component)
/admin/posts/new          → criar novo post
/admin/posts/[id]         → editar post existente
```

---

## 4.2 Página principal do admin — lista de posts

`src/app/admin/page.tsx`:

```typescript
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { rowToPost } from '@/lib/supabase/transforms'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: rows } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  const posts = (rows ?? []).map(rowToPost)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-[var(--ink)] px-4 py-2 text-sm text-[var(--inv-ink)]"
        >
          Novo post
        </Link>
      </div>

      <div className="divide-y divide-[var(--line)] rounded-xl border border-[var(--line)]">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between px-4 py-4">
            <div className="space-y-1">
              <p className="font-medium">{post.title}</p>
              <div className="flex gap-3 font-mono text-xs text-[var(--muted)]">
                <span>{post.category}</span>
                <span>{post.publishedAt ?? 'Rascunho'}</span>
                {post.featured && <span className="text-amber-500">Destaque</span>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-2 py-0.5 text-xs ${
                post.published
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-zinc-500/10 text-zinc-500'
              }`}>
                {post.published ? 'Publicado' : 'Rascunho'}
              </span>
              <Link
                href={`/admin/posts/${post.id}`}
                className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
              >
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 4.3 Server Actions para CRUD

`src/app/admin/posts/actions.ts`:

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ── Criar post ─────────────────────────────────────────
export async function createPost(formData: FormData) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      slug: formData.get('slug') as string,
      title: formData.get('title') as string,
      excerpt: formData.get('excerpt') as string,
      category: formData.get('category') as string,
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()),
      cover_tone: formData.get('cover_tone') as string,
      content: JSON.parse(formData.get('content') as string),
      content_text: formData.get('content_text') as string,
      read_time: formData.get('read_time') as string,
      featured: formData.get('featured') === 'true',
      published: formData.get('published') === 'true',
      published_at: formData.get('published') === 'true' ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/blog')
  revalidatePath('/admin')
  redirect('/admin')
}

// ── Atualizar post ─────────────────────────────────────
export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient()

  const wasPublished = formData.get('was_published') === 'true'
  const isPublished = formData.get('published') === 'true'

  const { error } = await supabase
    .from('blog_posts')
    .update({
      slug: formData.get('slug') as string,
      title: formData.get('title') as string,
      excerpt: formData.get('excerpt') as string,
      category: formData.get('category') as string,
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()),
      cover_tone: formData.get('cover_tone') as string,
      content: JSON.parse(formData.get('content') as string),
      content_text: formData.get('content_text') as string,
      read_time: formData.get('read_time') as string,
      featured: formData.get('featured') === 'true',
      published: isPublished,
      // Só define published_at na primeira vez que publica
      published_at: !wasPublished && isPublished ? new Date().toISOString() : undefined,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/blog')
  revalidatePath(`/blog/${formData.get('slug')}`)
  revalidatePath('/admin')
  redirect('/admin')
}

// ── Deletar post ───────────────────────────────────────
export async function deletePost(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/blog')
  revalidatePath('/admin')
  redirect('/admin')
}
```

---

## 4.4 Página de edição de post

`src/app/admin/posts/[id]/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { rowToPost } from '@/lib/supabase/transforms'
import { PostForm } from '@/components/admin/PostForm'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: row } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!row) notFound()

  return <PostForm post={rowToPost(row)} />
}
```

`src/app/admin/posts/new/page.tsx`:

```typescript
import { PostForm } from '@/components/admin/PostForm'

export default function NewPostPage() {
  return <PostForm />
}
```

---

## 4.5 Conceitos-chave aprendidos aqui

**`revalidatePath`**:
- O Next.js 16 usa cache agressivo para Server Components
- Quando uma mutation acontece (criar/editar/deletar), precisamos invalidar o cache das páginas afetadas
- `revalidatePath('/blog')` faz o Next.js re-buscar os dados do blog na próxima request

**Por que usar `FormData` nas Server Actions?**
- `FormData` é o padrão da web — funciona sem JavaScript no cliente
- Progressive enhancement: o form funciona mesmo com JS desabilitado
- Server Actions com `FormData` são o padrão recomendado pelo Next.js App Router

**`revalidatePath` vs `revalidateTag`**:
- `revalidatePath` invalida uma rota específica
- `revalidateTag` invalida qualquer cache com aquela tag (mais granular)
- Para o blog, `revalidatePath` é suficiente

---

## Checklist da Fase 4

- [ ] `src/app/admin/page.tsx` (lista de posts) criado
- [ ] `src/app/admin/posts/actions.ts` com create, update, delete
- [ ] `src/app/admin/posts/new/page.tsx` criado
- [ ] `src/app/admin/posts/[id]/page.tsx` criado
- [ ] Testar: criar um post rascunho no admin
- [ ] Testar: editar o post criado
- [ ] Testar: deletar o post

> **Nota:** O `PostForm` com o editor rico é a Fase 5. Nesta fase, pode-se usar campos de texto simples para validar o fluxo CRUD antes de adicionar o editor.

---

## O que vem a seguir

[Fase 5 → Editor Rico (Tiptap)](./05-rich-text-editor.md)
