# Fase 2 — Schema do Banco de Dados

## Objetivo
Criar as tabelas no Supabase, configurar segurança (RLS) e atualizar os tipos TypeScript do projeto.

---

## 2.1 A tabela `blog_posts`

Execute no **SQL Editor** do Supabase (Dashboard → SQL Editor → New query):

```sql
-- Habilitar extensão UUID (geralmente já está ativa)
create extension if not exists "uuid-ossp";

create table public.blog_posts (
  id            uuid primary key default uuid_generate_v4(),
  slug          text not null unique,
  title         text not null,
  excerpt       text not null,
  category      text not null,
  tags          text[] not null default '{}',
  cover_tone    text not null default 'linear-gradient(135deg,#111827 0%,#09090b 100%)',
  content       jsonb not null default '{}',   -- conteúdo Tiptap (JSON)
  content_text  text not null default '',       -- versão plana para full-text search
  read_time     text not null default '5 min read',
  featured      boolean not null default false,
  published     boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Trigger para atualizar updated_at automaticamente
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute procedure update_updated_at();
```

### Explicação das colunas

| Coluna | Tipo | Propósito |
|--------|------|-----------|
| `id` | uuid | Chave primária gerada automaticamente |
| `slug` | text unique | URL amigável (ex: `dark-ui-without-muddy-contrast`) |
| `title` | text | Título do artigo |
| `excerpt` | text | Resumo curto exibido nos cards |
| `category` | text | Categoria (Design Systems, Motion, etc.) |
| `tags` | text[] | Array de tags |
| `cover_tone` | text | Gradiente CSS para o cover visual |
| `content` | jsonb | Conteúdo rico do Tiptap em JSON |
| `content_text` | text | Versão em texto puro (para busca full-text) |
| `read_time` | text | Estimativa de leitura ("5 min read") |
| `featured` | boolean | Aparece em destaque na home/blog |
| `published` | boolean | Controla visibilidade pública |
| `published_at` | timestamptz | Data de publicação (pode ser no futuro) |
| `created_at` | timestamptz | Criação do registro |
| `updated_at` | timestamptz | Atualização automática via trigger |

---

## 2.2 Índices para performance

```sql
-- Busca por slug (rota /blog/[slug])
create index blog_posts_slug_idx on public.blog_posts (slug);

-- Filtro por categoria
create index blog_posts_category_idx on public.blog_posts (category);

-- Posts publicados ordenados por data (listagem principal)
create index blog_posts_published_at_idx on public.blog_posts (published_at desc)
  where published = true;

-- Full-text search em português/inglês
alter table public.blog_posts
  add column search_vector tsvector
  generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content_text, ''))
  ) stored;

create index blog_posts_search_idx on public.blog_posts using gin(search_vector);
```

---

## 2.3 Row Level Security (RLS)

O RLS é a camada de segurança do PostgreSQL que decide **quem pode ver ou editar** cada linha, diretamente no banco.

```sql
-- Habilitar RLS na tabela
alter table public.blog_posts enable row level security;

-- Política pública: qualquer pessoa pode LER posts publicados
create policy "posts públicos são leitura pública"
  on public.blog_posts for select
  using (published = true);

-- Política admin: usuários autenticados têm acesso total
create policy "admins têm acesso total"
  on public.blog_posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

> **Como o RLS funciona na prática:**
> - A `anon key` pública só enxerga posts com `published = true`
> - A `service_role key` ignora RLS (use somente no server)
> - Um usuário logado via Supabase Auth (`authenticated`) tem acesso total
> - Isso protege o banco mesmo que alguém descubra a `anon key`

---

## 2.4 Criar o usuário admin

No Supabase Dashboard → **Authentication → Users → Add user**:

- Email: o seu email de admin
- Password: senha forte
- Marque **Auto Confirm User** (para não precisar de email de confirmação)

Ou via SQL:

```sql
-- Não use isso em produção sem entender as implicações
-- Prefira criar pelo Dashboard
```

---

## 2.5 Atualizar os tipos TypeScript

Substitua o tipo `BlogArticle` em `src/types/index.ts`:

```typescript
// Tipo que vem do banco (snake_case = convenção do PostgreSQL)
export type BlogPostRow = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  cover_tone: string
  content: Record<string, unknown>   // JSON do Tiptap
  content_text: string
  read_time: string
  featured: boolean
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

// Tipo para exibição nos componentes (camelCase = convenção JS)
export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  coverTone: string
  content: Record<string, unknown>
  contentText: string
  readTime: string
  featured: boolean
  published: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  href: string  // computado: `/blog/${slug}`
}

// Manter BlogArticle como alias por compatibilidade enquanto migramos
export type BlogArticle = BlogPost
```

---

## 2.6 Função helper de conversão

Criar `src/lib/supabase/transforms.ts`:

```typescript
import type { BlogPostRow, BlogPost } from '@/types'

export function rowToPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    tags: row.tags,
    coverTone: row.cover_tone,
    content: row.content,
    contentText: row.content_text,
    readTime: row.read_time,
    featured: row.featured,
    published: row.published,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    href: `/blog/${row.slug}`,
  }
}
```

---

## 2.7 Migrar os dados estáticos

Para não perder os 3 artigos que já existem em `src/data/blog.ts`, vamos inserí-los manualmente via SQL Editor no Supabase após a fase do editor estar pronta (Fase 5).

---

## Checklist da Fase 2

- [ ] Tabela `blog_posts` criada via SQL Editor
- [ ] Trigger `updated_at` funcionando
- [ ] Índices criados (slug, category, published_at, search_vector)
- [ ] RLS habilitado com as 2 políticas
- [ ] Usuário admin criado no Authentication
- [ ] Tipos TypeScript atualizados em `src/types/index.ts`
- [ ] `src/lib/supabase/transforms.ts` criado

---

## O que vem a seguir

[Fase 3 → Autenticação](./03-authentication.md)
