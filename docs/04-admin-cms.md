# Fase 4 — Admin CMS

## Objetivo

Criar um admin simples para:

- criar categorias
- editar categorias
- remover categorias
- criar posts
- editar posts
- remover posts

---

## 4.1 Rotas do admin

As URLs públicas ficam assim:

- `/admin`
- `/admin/categories/new`
- `/admin/categories/[id]`
- `/admin/posts/new`
- `/admin/posts/[id]`

Internamente, as páginas protegidas ficam dentro de:

`src/app/admin/(protected)/`

Esse route group existe para que `/admin/login` fique fora da proteção e não entre em loop de redirect.

---

## 4.2 Dashboard

`/admin` mostra duas listas:

1. posts
2. categorias

Ali você já consegue:

- abrir edição
- criar item novo
- ver status de publicação

Arquivo:

`src/app/admin/(protected)/page.tsx`

---

## 4.3 CRUD de categorias

As ações de categoria ficam em:

`src/app/admin/(protected)/categories/actions.ts`

O que elas fazem:

- `createCategory`
- `updateCategory`
- `deleteCategory`

As páginas usam um formulário simples com:

- `name`
- `slug`

Se o slug vier vazio, o servidor gera automaticamente com `slugify()`.

---

## 4.4 CRUD de posts

As ações de post ficam em:

`src/app/admin/(protected)/posts/actions.ts`

O formulário principal fica em:

`src/components/admin/PostForm.tsx`

### Campos do post

- título
- slug
- excerpt
- intro
- categoria
- tags
- read time
- cover tone
- publicado
- destaque
- seções do artigo

### Como o conteúdo é editado

Em vez de usar Tiptap ou outro editor rico agora, o conteúdo do artigo fica assim:

- uma introdução (`intro`)
- várias seções (`sections`)

Cada seção tem:

- `title`
- `bodyText`

No formulário, o usuário escreve os parágrafos separados por linha em branco. Antes de salvar, o componente converte isso para o JSON que vai para o banco.

---

## 4.5 Server Actions

O CRUD foi feito com `Server Actions`, porque esse é o caminho mais simples e idiomático no App Router.

Fluxo:

1. o `<form>` envia `FormData`
2. a action roda no servidor
3. o Supabase grava no banco
4. o Next revalida as páginas afetadas
5. a action redireciona de volta

As revalidações principais são:

- `/`
- `/blog`
- `/blog/[slug]`
- `/admin`

---

## 4.6 Validação e autorização

Cada action faz duas coisas importantes:

1. valida os campos principais
2. confirma que o usuário logado ainda é o admin

Essa segunda parte é importante porque `Server Actions` podem ser chamadas por requisições diretas, não só pela UI.

O helper usado para isso está em:

`src/lib/supabase/admin.ts`

---

## Checklist da Fase 4

- [ ] criar categoria
- [ ] editar categoria
- [ ] excluir categoria
- [ ] criar post
- [ ] editar post
- [ ] excluir post
- [ ] testar publicar e despublicar post

---

## O que vem a seguir

[Fase 6 → Blog Dinâmico](./06-dynamic-blog.md)
