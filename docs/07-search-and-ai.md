# Fase 7 — Busca, Filtros e AI Search

## Objetivo
Implementar três modos de busca: busca textual client-side (já existe), busca full-text via PostgreSQL, e busca semântica por IA usando pgvector + embeddings.

---

## 7.1 O que já existe vs o que vamos melhorar

| Feature | Estado atual | Fase 7 |
|---------|-------------|--------|
| Search textual | Client-side (filtra array em memória) | Full-text search no PostgreSQL |
| Filtros por categoria | Client-side | URL-based (link shareable) |
| Sort | Client-side | Parâmetro de URL |
| AI Search | Mock (botão que não faz nada) | Embeddings reais + pgvector |

---

## 7.2 Full-text Search com PostgreSQL

O Supabase expõe a busca full-text do PostgreSQL via SDK.

### Route Handler para busca

`src/app/api/search/route.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { rowToPost } from '@/lib/supabase/transforms'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') ?? ''
  const category = request.nextUrl.searchParams.get('category') ?? 'All'
  const sort = request.nextUrl.searchParams.get('sort') ?? 'latest'

  if (!query.trim()) {
    return NextResponse.json({ results: [] })
  }

  const supabase = await createClient()

  let dbQuery = supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .textSearch('search_vector', query, {
      type: 'websearch',      // interpreta "dark UI" como AND, "dark | UI" como OR
      config: 'english',
    })

  if (category !== 'All') {
    dbQuery = dbQuery.eq('category', category)
  }

  if (sort === 'title') {
    dbQuery = dbQuery.order('title', { ascending: true })
  } else if (sort === 'reading') {
    dbQuery = dbQuery.order('read_time', { ascending: false })
  } else {
    dbQuery = dbQuery.order('published_at', { ascending: false })
  }

  const { data, error } = await dbQuery

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ results: (data ?? []).map(rowToPost) })
}
```

### Como `textSearch` funciona

O campo `search_vector` que criamos na Fase 2 é um índice GIN que o PostgreSQL usa para busca full-text:

```sql
-- O que o Supabase executa por baixo:
SELECT * FROM blog_posts
WHERE published = true
  AND search_vector @@ websearch_to_tsquery('english', 'dark UI');
```

Suporta:
- `dark UI` → ambos os termos
- `"dark mode"` → frase exata
- `dark OR light` → qualquer um
- `-muddy` → excluir termo

---

## 7.3 AI Search com pgvector

### O que são embeddings?

Embeddings são representações vetoriais de texto. Frases semanticamente similares ficam próximas no espaço vetorial, mesmo com palavras diferentes:

- "motion design" ≈ "animation principles"
- "dark UI" ≈ "low-light interface"

### Setup do pgvector no Supabase

```sql
-- Habilitar extensão (já disponível no Supabase)
create extension if not exists vector;

-- Adicionar coluna de embedding na tabela
alter table public.blog_posts
  add column embedding vector(1536);  -- dimensão para text-embedding-3-small

-- Índice para busca aproximada (HNSW = mais rápido)
create index blog_posts_embedding_idx on public.blog_posts
  using hnsw (embedding vector_cosine_ops);

-- Função SQL para busca semântica
create or replace function search_posts_semantic(
  query_embedding vector(1536),
  match_count int default 10,
  filter_category text default null
)
returns table (
  id uuid,
  slug text,
  title text,
  excerpt text,
  category text,
  similarity float
)
language sql stable
as $$
  select
    id, slug, title, excerpt, category,
    1 - (embedding <=> query_embedding) as similarity
  from blog_posts
  where
    published = true
    and embedding is not null
    and (filter_category is null or category = filter_category)
  order by embedding <=> query_embedding
  limit match_count;
$$;
```

### Gerar embeddings ao salvar posts

Adicionar em `src/app/admin/posts/actions.ts` uma função para gerar e salvar o embedding:

```typescript
async function generateAndSaveEmbedding(postId: string, text: string) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  })

  const { data } = await response.json()
  const embedding = data[0].embedding

  const supabase = await createClient()
  await supabase
    .from('blog_posts')
    .update({ embedding })
    .eq('id', postId)
}

// Chamar dentro de createPost e updatePost:
// await generateAndSaveEmbedding(data.id, `${title} ${excerpt} ${contentText}`)
```

### Variável de ambiente necessária

```env
OPENAI_API_KEY=sk-...
```

### Route Handler para AI Search

`src/app/api/ai-search/route.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { query, category } = await request.json()

  if (!query?.trim()) {
    return NextResponse.json({ results: [] })
  }

  // 1. Gerar embedding para a query do usuário
  const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: query,
    }),
  })

  const { data } = await embeddingResponse.json()
  const queryEmbedding = data[0].embedding

  // 2. Buscar posts semanticamente similares no Supabase
  const supabase = await createClient()
  const { data: results, error } = await supabase.rpc('search_posts_semantic', {
    query_embedding: queryEmbedding,
    match_count: 10,
    filter_category: category === 'All' ? null : category,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ results: results ?? [] })
}
```

---

## 7.4 Filtros e sorting por URL

Em vez de estado client-side para categoria e sort, podemos usar URL params para que os filtros sejam compartilháveis:

```
/blog?category=Motion&sort=latest
/blog?q=dark+UI&sort=title
```

### Atualizar `BlogIndex.tsx` para ler URL params

```typescript
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function BlogIndex({ articles, categories }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const category = searchParams.get('category') ?? 'All'
  const sort = (searchParams.get('sort') ?? 'latest') as SortMode
  const query = searchParams.get('q') ?? ''

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value && value !== 'All' && value !== 'latest' && value !== '') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    }
    router.push(`/blog?${params.toString()}`, { scroll: false })
  }

  // Ao clicar numa categoria:
  // updateParams({ category: item })

  // Ao mudar o sort:
  // updateParams({ sort: mode })

  // Ao submeter busca:
  // updateParams({ q: inputValue })
}
```

---

## 7.5 AI Search integrado ao `BlogIndex`

Quando o usuário ativa o AI Mode e submete a busca, o `BlogIndex` chama o Route Handler:

```typescript
const [aiResults, setAiResults] = useState<BlogPost[]>([])
const [isAiLoading, setIsAiLoading] = useState(false)

async function handleAiSearch(query: string) {
  setIsAiLoading(true)
  try {
    const response = await fetch('/api/ai-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, category }),
    })
    const { results } = await response.json()
    setAiResults(results)
  } finally {
    setIsAiLoading(false)
  }
}
```

Os resultados do AI Search são exibidos no lugar dos artigos normais quando `isAiMode` está ativo.

---

## 7.6 Diagrama do fluxo completo

```
Usuário digita query
       │
       ├─── Normal Mode ──→ /api/search?q=... ──→ PostgreSQL full-text search
       │
       └─── AI Mode ───────→ POST /api/ai-search
                                    │
                                    ├─ OpenAI: text → embedding vector
                                    │
                                    └─ Supabase: embedding → posts similares (cosine distance)
```

---

## 7.7 Custo estimado da AI Search

- **OpenAI text-embedding-3-small**: $0,02 por 1M tokens
- Uma query típica tem ~10 tokens → $0,0000002 por busca
- 10.000 buscas/mês → ~$0,002

Praticamente gratuito para um portfólio pessoal.

---

## Checklist da Fase 7

- [ ] `src/app/api/search/route.ts` criado
- [ ] Full-text search testado no blog
- [ ] `pgvector` habilitado no Supabase
- [ ] Função SQL `search_posts_semantic` criada
- [ ] `OPENAI_API_KEY` adicionada ao `.env.local`
- [ ] Geração de embeddings integrada ao admin (create/update post)
- [ ] `src/app/api/ai-search/route.ts` criado
- [ ] `BlogIndex.tsx` atualizado para chamar os Route Handlers
- [ ] Filtros usando URL params (category, sort, q)
- [ ] Testar AI Search com queries semânticas

---

## Resultado final

Ao completar as 7 fases, o blog terá:

- Todos os posts no Supabase com conteúdo rico (Tiptap JSON)
- Admin protegido por login para gerenciar posts
- Blog público dinâmico com ISR
- Busca textual via PostgreSQL full-text search
- Busca semântica por IA com embeddings + pgvector
- Filtros e sorting por URL (compartilháveis)
