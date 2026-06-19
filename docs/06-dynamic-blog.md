# Fase 6 — Blog Dinâmico

## Objetivo

Fazer o blog público ler apenas do Supabase.

---

## 6.1 Estratégia usada aqui

Para manter a implementação clara, o blog público foi colocado como:

- `dynamic = "force-dynamic"` em `/blog`
- `dynamic = "force-dynamic"` em `/blog/[slug]`

Isso não é o ponto final de performance, mas é o jeito mais simples de garantir que:

- o conteúdo publicado apareça logo
- as edições do admin reflitam sem confusão de cache

---

## 6.2 Queries centralizadas

As queries do blog ficam em:

`src/lib/supabase/queries.ts`

Principais funções:

- `getPublishedPosts()`
- `getPublishedCategories()`
- `getPostBySlug()`
- `getHomePosts()`

---

## 6.3 Página `/blog`

Arquivo:

`src/app/blog/page.tsx`

Ela agora:

1. busca posts publicados
2. busca categorias disponíveis
3. entrega isso ao componente `BlogIndex`

O componente visual continua praticamente o mesmo. A diferença é a origem dos dados.

---

## 6.4 Página `/blog/[slug]`

Arquivo:

`src/app/blog/[slug]/page.tsx`

Ela:

1. recebe o slug
2. busca o post publicado no banco
3. renderiza o mesmo layout do artigo atual

Como o formato do conteúdo continuou sendo `intro + sections[]`, não foi preciso reescrever todo o layout do artigo.

---

## 6.5 Home page

Arquivo:

`src/app/page.tsx`

Ela agora chama `getHomePosts()` e passa os posts para:

`src/components/home/Blog.tsx`

Assim, a home também começa a refletir o banco.

---

## 6.6 Sobre categorias e busca

Agora as categorias deixam de ser texto solto no front e passam a ser gerenciadas pelo admin.

Isso ajuda muito a busca depois porque:

- evita categoria duplicada com nomes diferentes
- deixa os filtros consistentes
- prepara a base para evoluir a busca textual e semântica

---

## Checklist da Fase 6

- [ ] `/blog` lendo do banco
- [ ] `/blog/[slug]` lendo do banco
- [ ] home lendo posts do banco
- [ ] categorias vindo do banco
- [ ] criar um post no admin e ver aparecer no blog

---

## O que vem a seguir

[Fase 7 → Busca, Filtros e AI Search](./07-search-and-ai.md)
