# Fase 2 — Schema do Banco de Dados

## Objetivo

Criar um schema simples para suportar:

- categorias gerenciáveis no admin
- posts com conteúdo editável
- busca e filtros por categoria no blog

---

## 2.1 O que vai existir no banco

Vamos usar apenas duas tabelas:

1. `blog_categories`
2. `blog_posts`

O arquivo pronto para colar no SQL Editor está em:

`supabase/blog-schema.sql`

---

## 2.2 Tabela `blog_categories`

Cada categoria tem:

- `id`
- `name`
- `slug`
- `created_at`

Exemplos:

- `Design Systems`
- `Motion`
- `UI Craft`

Essa tabela existe para evitar categoria digitada de formas diferentes em posts diferentes.

---

## 2.3 Tabela `blog_posts`

Cada post guarda:

- `slug`
- `title`
- `excerpt`
- `intro`
- `sections`
- `tags`
- `cover_image_url`
- `read_time`
- `featured`
- `published`
- `published_at`
- `category_id`

### Sobre `sections`

O campo `sections` é `jsonb` e guarda o conteúdo principal do artigo no mesmo estilo do blog atual:

```json
[
  {
    "title": "Start with tension, not decoration",
    "body": [
      "Primeiro paragrafo",
      "Segundo paragrafo"
    ]
  }
]
```

Isso foi escolhido porque é o jeito mais simples de:

- manter o layout atual
- editar conteúdo no admin
- evitar introduzir um editor rico cedo demais

---

### Sobre `cover_image_url`

Cada post precisa de uma imagem de capa real, enviada pelo admin (sem mais gradiente
CSS como placeholder). O arquivo é salvo no Supabase Storage, bucket `blog-covers`
(público para leitura), e `cover_image_url` guarda a URL pública gerada.

Esse bucket também é criado pelo `supabase/blog-schema.sql`, com duas policies:

- leitura pública (`select`) para qualquer um, já que as imagens aparecem no site
- escrita (`insert`/`update`/`delete`) só para usuários autenticados — o mesmo
  usuário admin que já gerencia posts e categorias

---

## 2.4 Relação entre posts e categorias

`blog_posts.category_id` aponta para `blog_categories.id`.

Na prática:

- uma categoria pode ter vários posts
- um post pertence a uma categoria

---

## 2.5 Segurança com RLS

O SQL também cria políticas de RLS:

- público pode ler categorias
- público só pode ler posts publicados
- usuário autenticado pode criar, editar e remover categorias e posts

Como o admin usa Supabase Auth, isso já protege o banco sem precisar expor `service_role`.

---

## 2.6 Tipos TypeScript

O projeto agora usa três grupos de tipos:

- `BlogCategoryRow` e `BlogPostRow`
  - representam o formato cru vindo do banco
- `BlogCategory`
  - categoria já pronta para uso na interface
- `BlogArticle`
  - formato final usado pelos componentes do blog

Os tipos estão em:

`src/types/index.ts`

---

## 2.7 O que fazer no Supabase

1. Abra o projeto no Supabase
2. Vá em `SQL Editor`
3. Crie uma nova query
4. Cole o conteúdo de `supabase/blog-schema.sql`
5. Execute

Depois disso, o admin já consegue criar categorias e posts.

---

## Checklist da Fase 2

- [ ] `supabase/blog-schema.sql` executado
- [ ] tabelas `blog_categories` e `blog_posts` criadas
- [ ] RLS habilitado
- [ ] índices criados
- [ ] `src/types/index.ts` atualizado

---

## O que vem a seguir

[Fase 3 → Autenticação](./03-authentication.md)
