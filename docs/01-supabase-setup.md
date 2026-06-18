# Fase 1 — Setup do Supabase

## Objetivo
Ter o SDK instalado, o projeto Supabase criado e as variáveis de ambiente configuradas antes de qualquer código de banco.

---

## 1.1 Criar o projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta (ou faça login)
2. Clique em **New project**
3. Escolha um nome (ex: `glaucodeveloper`), região e senha do banco
4. Aguarde ~1 min o provisionamento

Na dashboard do projeto você vai encontrar as credenciais em:
**Settings → API**

| Chave | Onde usar |
|-------|----------|
| `Project URL` | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` key | `SUPABASE_SERVICE_ROLE_KEY` (somente server-side, nunca exposta no client) |

---

## 1.2 Instalar dependências

```bash
npm install @supabase/supabase-js @supabase/ssr
```

- **`@supabase/supabase-js`** — SDK principal (queries, auth, storage)
- **`@supabase/ssr`** — helper para cookies em Next.js App Router (SSR seguro)

---

## 1.3 Variáveis de ambiente

Crie `.env.local` na raiz (já está no `.gitignore`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=voce@dominio.com
```

> **Regra de ouro**: variáveis com `NEXT_PUBLIC_` são expostas no browser. Use a `service_role` key **somente** em Server Actions ou Route Handlers — nunca em Client Components.

Para o fluxo de Magic Link do admin:

1. Crie o usuário manualmente em **Authentication → Users**
2. Use exatamente o mesmo email em `ADMIN_EMAIL`
3. Defina `NEXT_PUBLIC_SITE_URL` com a URL pública do app
4. Em **Authentication → URL Configuration**, adicione:
   - `Site URL`: `http://localhost:3000`
   - `Redirect URL`: `http://localhost:3000/auth/callback`

---

## 1.4 Criar o cliente Supabase do servidor

Para o login do admin com Magic Link, basta um cliente server-side:

### `src/lib/supabase/server.ts` — para Server Components, Server Actions e Route Handlers

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

> **Nota para quem está começando:**  
> Não crie o cliente browser agora. Ele só é necessário quando você realmente precisar chamar Supabase direto de um Client Component.

---

## 1.5 Convenção do Next.js 16

O nome da convenção mudou: no Next.js 16, `middleware.ts` passou a se chamar `proxy.ts`.

Para este projeto, o setup inicial de auth **nao precisa** de `proxy.ts`. Vamos proteger o `/admin` diretamente no Server Component do layout e usar um callback do Supabase para criar a sessao.

---

## Checklist da Fase 1

- [ ] Projeto criado no Supabase
- [ ] `.env.local` com as 5 variáveis
- [ ] `npm install @supabase/supabase-js @supabase/ssr`
- [ ] `src/lib/supabase/server.ts` criado
- [ ] Usuário admin criado no Supabase Auth
- [ ] Redirect URL `/auth/callback` configurada no Supabase
- [ ] `next dev` rodando sem erros

---

## O que vem a seguir

[Fase 2 → Schema do banco](./02-database-schema.md)
