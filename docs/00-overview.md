# Blog Dinâmico com Supabase — Visão Geral

## O que vamos construir

Transformar o blog em um sistema completo com:

- **Banco de dados** no Supabase (PostgreSQL gerenciado)
- **Área de admin** protegida por login para criar/editar/remover posts
- **Editor de conteúdo rico** (rich text) para formatar artigos
- **Blog dinâmico** — posts lidos do banco em tempo real
- **Busca textual** com full-text search do PostgreSQL
- **Busca por IA** com embeddings semânticos + pgvector
- **Filtros e sorting** roteados via URL (category, sort)

---

## As 7 fases

| # | Fase | O que entrega |
|---|------|---------------|
| 1 | [Setup do Supabase](./01-supabase-setup.md) | Projeto criado, SDK instalado, env vars configuradas |
| 2 | [Schema do banco](./02-database-schema.md) | Tabelas de categorias e posts, RLS e tipos |
| 3 | [Autenticação](./03-authentication.md) | Magic Link, callback, logout e rota `/admin` protegida |
| 4 | [Admin CMS](./04-admin-cms.md) | CRUD simples de categorias e posts |
| 5 | [Editor rico](./05-rich-text-editor.md) | Tiptap integrado ao admin, conteúdo em HTML/JSON |
| 6 | [Blog dinâmico](./06-dynamic-blog.md) | Páginas lendo do banco, ISR, slug dinâmico |
| 7 | [Busca, filtros e IA](./07-search-and-ai.md) | Full-text search, pgvector, AI search com embeddings |

---

## Stack de tecnologia

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Banco de dados | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Magic Link para 1 admin) |
| ORM/Query | Supabase JS SDK (`@supabase/supabase-js`) |
| SSR cookies | `@supabase/ssr` |
| Editor | Tiptap |
| AI Search | pgvector + OpenAI Embeddings |
| Linguagem | TypeScript |

---

## Estrutura de arquivos que vai emergir

```
src/
  app/
    admin/
      login/page.tsx          ← página de login
      page.tsx                ← lista de posts (protegida)
      posts/
        new/page.tsx          ← criar post
        [id]/page.tsx         ← editar post
    blog/
      page.tsx                ← lista pública (dinâmica)
      [slug]/page.tsx         ← artigo individual (dinâmico)
    api/
      search/route.ts         ← busca textual
      ai-search/route.ts      ← busca semântica
  lib/
    supabase/
      client.ts               ← cliente browser
      server.ts               ← cliente server (SSR)
      middleware.ts            ← helper p/ middleware.ts raiz
  components/
    blog/
      BlogIndex.tsx           ← atualizado para receber dados do server
      BlogEditor.tsx          ← editor Tiptap
  middleware.ts               ← proteção de rotas /admin
```

---

## Decisões de arquitetura

**Por que Supabase Auth e não NextAuth?**
Supabase Auth é nativo ao banco e conversa direto com RLS. Para este projeto, o caminho mais simples é usar Magic Link para um único admin, sem senha local para gerenciar.

**Por que não usar um editor rico agora?**
Como o foco aqui é aprender Next.js e fechar um CRUD funcional primeiro, o conteúdo do post continua em um formato simples e explícito:

- `intro`
- `sections[]`

Isso reduz complexidade sem perder a estrutura do layout atual do blog.

**Por que pgvector para AI Search e não serviço externo?**
O Supabase já oferece a extensão `pgvector` gratuitamente. Os embeddings ficam no mesmo banco, a busca semântica vira uma query SQL, e não precisamos de infra extra.

**Server Components primeiro**
O blog público (`/blog`) vai usar React Server Components para buscar os posts — zero JS desnecessário no cliente. O `BlogIndex` com filtros client-side será um island isolado.
