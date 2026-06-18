export default function AdminPage() {
  return (
    <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--bg-2)] p-6">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
          Protected Area
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
          Autenticacao pronta.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">
          Esta rota agora exige sessao valida do Supabase e confere se o email
          logado bate com <code>ADMIN_EMAIL</code>.
        </p>
      </div>

      <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--card)] p-6">
        <h3 className="text-lg font-semibold tracking-[-0.03em]">
          Proximos passos
        </h3>
        <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
          <li>Conectar a lista de posts do CMS.</li>
          <li>Criar formulario para publicar e editar artigos.</li>
          <li>Adicionar rich text editor na fase seguinte.</li>
        </ul>
      </div>
    </section>
  )
}
