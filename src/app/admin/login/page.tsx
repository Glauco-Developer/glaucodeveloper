import { redirect } from "next/navigation"
import { AdminSetupNotice } from "@/components/admin/AdminSetupNotice"
import { LoginForm } from "@/components/admin/LoginForm"
import { getMissingAdminAuthEnv, isAdminEmail } from "@/lib/supabase/env"
import { createClient } from "@/lib/supabase/server"

type SearchParams = Promise<{
  error?: string
}>

export default async function LoginPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const missingEnv = getMissingAdminAuthEnv()

  if (missingEnv.length > 0) {
    return <AdminSetupNotice missingEnv={missingEnv} />
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (isAdminEmail(user?.email)) {
    redirect("/admin")
  }

  return (
    <div className="px-4 pb-16 pt-32">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-[var(--line)] bg-[var(--bg-2)] p-8 md:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
            Admin Access
          </p>
          <h1 className="mt-4 max-w-xl text-4xl font-bold tracking-[-0.04em] text-[var(--ink)] md:text-5xl">
            Login sem senha, com um unico email autorizado.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--muted)] md:text-base">
            O fluxo envia um Magic Link para o email configurado em{" "}
            <code>ADMIN_EMAIL</code>. O admin so abre o link e a sessao e criada
            no servidor.
          </p>
        </section>

        <section className="rounded-[2rem] border border-[var(--line)] bg-[var(--card)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">
              Entrar no CMS
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Informe o email de admin para receber o link seguro de acesso.
            </p>
          </div>

          {searchParams.error ? (
            <p className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
              {searchParams.error}
            </p>
          ) : null}

          <div className="mt-6">
            <LoginForm />
          </div>
        </section>
      </div>
    </div>
  )
}
