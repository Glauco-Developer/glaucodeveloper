# Fase 3 — Autenticação

## Objetivo

Criar um acesso simples, didático e seguro para a rota `/admin`, usando **Supabase Magic Link** para um único admin.

---

## 3.1 Decisão de arquitetura

Como apenas uma pessoa vai acessar o CMS, o fluxo mais enxuto é:

1. O usuário informa o email do admin em `/admin/login`
2. Uma `Server Action` envia um Magic Link via Supabase Auth
3. O email aponta para `/auth/callback`
4. O callback troca o `code` por sessão e grava os cookies HTTP
5. O `src/app/admin/(protected)/layout.tsx` verifica a sessão no servidor
6. O layout também confere se `user.email === ADMIN_EMAIL`
7. Logout remove a sessão e redireciona para `/admin/login`

Esse caminho evita:

- senha local para memorizar ou resetar
- form client-side com lógica de sessão
- `proxy.ts` logo no início
- redirecionamento global desnecessário

---

## 3.2 Por que esse fluxo é o melhor aqui

**Simples**

O login vira apenas um campo de email + um clique no link enviado.

**Didático**

Você enxerga claramente os três blocos da autenticação:

- envio do link
- callback que cria a sessão
- proteção server-side da área privada

**Seguro**

- o email autorizado é fixado em `ADMIN_EMAIL`
- o form rejeita qualquer email diferente de `ADMIN_EMAIL`
- o primeiro login pode criar o usuário automaticamente no Supabase
- o layout do admin valida a sessão no servidor em toda renderização
- se alguém entrar com outro email, a sessão é invalidada

---

## 3.3 Arquivos desta fase

```text
src/
  app/
    admin/
      (protected)/
        layout.tsx
        page.tsx
      actions.ts
      login/page.tsx
    auth/
      callback/route.ts
  components/
    admin/
      LoginForm.tsx
  lib/
    supabase/
      env.ts
      server.ts
```

---

## 3.4 Fluxo de login

### `src/app/admin/actions.ts`

- recebe o email do form
- rejeita qualquer email diferente de `ADMIN_EMAIL`
- chama `supabase.auth.signInWithOtp()`
- usa `NEXT_PUBLIC_SITE_URL` para montar o callback absoluto

Trecho essencial:

```typescript
const { error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    shouldCreateUser: true,
    emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/admin`,
  },
})
```

### `src/app/auth/callback/route.ts`

- lê `code` da URL
- chama `supabase.auth.exchangeCodeForSession(code)`
- confere se o email da sessão é o admin correto
- redireciona para `/admin`

---

## 3.5 Proteção do `/admin`

O controle real fica em `src/app/admin/(protected)/layout.tsx`.

O motivo do route group `/(protected)`:

- ele mantém a URL final como `/admin`
- mas evita que o layout protegido envolva `/admin/login`
- isso impede loop de redirecionamento

Ele faz:

1. `supabase.auth.getUser()`
2. `redirect('/admin/login')` se não houver sessão
3. `signOut()` se o email não bater com `ADMIN_EMAIL`

Isso segue a direção da doc do Next.js 16: a checagem principal deve ficar perto dos dados e da renderização server-side, não depender só de `proxy.ts`.

---

## 3.6 Sobre `middleware.ts` no Next 16

A doc antiga deste projeto citava `src/middleware.ts`, mas no **Next.js 16** a convenção foi renomeada para **`proxy.ts`**.

Mais importante: para este caso, `proxy.ts` é opcional. O fluxo atual funciona sem ele porque a proteção principal acontece no layout do admin e no callback do Supabase.

Use `proxy.ts` depois apenas se você quiser:

- redirecionar cedo antes da página renderizar
- centralizar checagens otimistas
- proteger rotas estáticas compartilhadas

---

## 3.7 Checklist da fase

- [ ] `ADMIN_EMAIL` configurado
- [ ] Usuário admin criado em Supabase Auth
- [ ] `/auth/callback` autorizado no Supabase
- [ ] `src/app/admin/login/page.tsx` criado
- [ ] `src/components/admin/LoginForm.tsx` criado
- [ ] `src/app/auth/callback/route.ts` criado
- [ ] `src/app/admin/(protected)/layout.tsx` protegendo a área privada
- [ ] `src/app/admin/actions.ts` com envio de Magic Link e logout
- [ ] Testar: `/admin` sem login redireciona para `/admin/login`
- [ ] Testar: email errado não recebe acesso ao CMS
- [ ] Testar: Magic Link abre `/admin`
- [ ] Testar: logout remove a sessão

---

## O que vem a seguir

[Fase 4 → Admin CMS](./04-admin-cms.md)
