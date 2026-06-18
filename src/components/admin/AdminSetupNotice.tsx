type AdminSetupNoticeProps = {
  missingEnv: string[]
}

export function AdminSetupNotice({ missingEnv }: AdminSetupNoticeProps) {
  return (
    <div className="px-4 pb-16 pt-32">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--line)] bg-[var(--card)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
          Admin Setup
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
          Faltam variaveis de ambiente para ligar a autenticacao.
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
          Crie um arquivo <code>.env.local</code> na raiz do projeto e preencha as
          variaveis abaixo.
        </p>

        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          {missingEnv.join(", ")}
        </div>

        <pre className="mt-6 overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--bg-2)] p-4 text-sm leading-7 text-[var(--ink)]">
{`NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=voce@dominio.com`}
        </pre>
      </div>
    </div>
  )
}
