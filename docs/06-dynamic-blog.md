# Fase 6 — Blog Dinâmico

## Objetivo
Substituir os dados estáticos de `src/data/blog.ts` por queries ao Supabase, usando Server Components para a listagem e o artigo individual, com ISR para performance.

---

## 6.1 A estratégia de renderização

| Rota | Estratégia | Por quê |
|------|-----------|---------|
| `/blog` | Dynamic (SSR) | Filtros/busca mudam por usuário |
| `/blog/[slug]` | ISR (revalidate) | Conteúdo muda raramente, mas precisa refletir edições |

O Next.js 16 usa **caching por request** por padrão. Para controlar isso:

```typescript
// Forçar dynamic (sem cache)
export const dynamic = 'force-dynamic'

// ISR: revalidar a cada N segundos
export const revalidate = 3600  // 1 hora
```

---

## 6.2 Funções de query no Supabase

Criar `src/lib/supabase/queries.ts`:

```typescript
import { createClient } from './server'
import { rowToPost } from './transforms'
import type { BlogPost } from '@/types'

// Todos os posts publicados (para listagem)
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []).map(rowToPost)
}

// Post por slug (para artigo individual)
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) return null
  return rowToPost(data)
}

// Categorias únicas (para o sidebar do blog)
export async function getPublishedCategories(): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('category')
    .eq('published', true)

  const categories = [...new Set((data ?? []).map((row) => row.category))]
  return ['All', ...categories.sort()]
}

// Slugs de todos os posts publicados (para generateStaticParams)
export async function getPublishedSlugs(): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('published', true)

  return (data ?? []).map((row) => row.slug)
}
```

---

## 6.3 Atualizar a página `/blog`

`src/app/blog/page.tsx`:

```typescript
import { getPublishedPosts, getPublishedCategories } from '@/lib/supabase/queries'
import { BlogIndex } from '@/components/blog/BlogIndex'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const [articles, categories] = await Promise.all([
    getPublishedPosts(),
    getPublishedCategories(),
  ])

  return <BlogIndex articles={articles} categories={categories} />
}
```

> Nenhuma mudança no `BlogIndex.tsx` — ele continua recebendo `articles` e `categories` como props. A diferença é que agora esses dados vêm do banco.

---

## 6.4 Atualizar a página `/blog/[slug]`

`src/app/blog/[slug]/page.tsx`:

```typescript
import { notFound } from 'next/navigation'
import { getPostBySlug, getPublishedSlugs } from '@/lib/supabase/queries'
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import type { JSONContent } from '@tiptap/react'
import Link from 'next/link'

// ISR: conteúdo re-validado a cada hora
// (o admin pode forçar revalidação manual via revalidatePath nas Server Actions)
export const revalidate = 3600

// Pré-gerar os slugs conhecidos no build
export async function generateStaticParams() {
  const slugs = await getPublishedSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const html = generateHTML(post.content as JSONContent, [StarterKit])

  return (
    <article className="min-h-screen px-[4vw] pb-[140px] pt-[100px]">
      <div className="mx-auto max-w-[780px]">

        {/* Top bar */}
        <div className="flex items-center justify-between gap-6 border-b border-[var(--line)] pb-6">
          <Link
            href="/blog"
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
          >
            ← All Posts / {post.category}
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''} / {post.readTime}
          </span>
        </div>

        {/* Título + excerpt como intro */}
        <div className="mt-14">
          <h1 className="text-[clamp(42px,6.5vw,88px)] font-semibold leading-[0.96] tracking-[-0.05em]">
            {post.title}
          </h1>
          <p className="mt-7 text-[20px] leading-[1.7] text-[var(--muted)]">
            {post.excerpt}
          </p>
        </div>

        {/* Conteúdo rico renderizado */}
        <div
          className="prose prose-invert mt-16 max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Footer nav */}
        <div className="mt-24 flex items-center justify-between border-t border-[var(--line)] pt-8">
          <Link
            href="/blog"
            className="font-mono text-[12px] uppercase tracking-[0.22em] text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
          >
            ← All Posts
          </Link>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </article>
  )
}
```

---

## 6.5 Remover os dados estáticos

Depois que os posts estiverem no banco e a integração estiver funcionando:

1. Delete `src/data/blog.ts`
2. Remova as importações de `blog.ts` em qualquer arquivo
3. O tipo `BlogArticle` em `src/types/index.ts` pode virar apenas um alias de `BlogPost` ou ser removido

---

## 6.6 Home page — featured post dinâmico

A home provavelmente mostra posts recentes. Atualizar `src/components/home/Blog.tsx` para buscar do banco via prop (o Server Component pai chama a query):

```typescript
// src/app/page.tsx (Server Component)
import { getPublishedPosts } from '@/lib/supabase/queries'

export default async function HomePage() {
  const posts = await getPublishedPosts()
  const recentPosts = posts.slice(0, 3)

  return (
    <>
      {/* outros componentes da home */}
      <Blog posts={recentPosts} />
    </>
  )
}
```

---

## 6.7 ISR vs Dynamic — quando usar cada um

| Cenário | Configuração | Resultado |
|---------|-------------|-----------|
| Artigo individual publicado | `revalidate = 3600` | Servido do cache por até 1h |
| Admin edita e salva | `revalidatePath('/blog/meu-slug')` na Server Action | Cache invalidado imediatamente |
| Listagem do blog | `dynamic = 'force-dynamic'` | Sempre fresco (filtros mudam) |
| Home page | `revalidate = 300` | Atualiza a cada 5 min |

---

## Checklist da Fase 6

- [ ] `src/lib/supabase/queries.ts` criado
- [ ] `src/app/blog/page.tsx` atualizado para buscar do banco
- [ ] `src/app/blog/[slug]/page.tsx` atualizado para renderizar conteúdo Tiptap
- [ ] Home page atualizada para posts dinâmicos
- [ ] Testar ISR: editar um post no admin e verificar que a página pública atualiza
- [ ] Migrar os 3 posts estáticos para o banco via admin
- [ ] Remover `src/data/blog.ts`

---

## O que vem a seguir

[Fase 7 → Busca, Filtros e AI Search](./07-search-and-ai.md)
