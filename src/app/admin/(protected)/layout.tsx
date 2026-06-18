import { redirect } from "next/navigation"
import { signOut } from "../actions"
import { AdminSetupNotice } from "@/components/admin/AdminSetupNotice"
import { getMissingAdminAuthEnv, isAdminEmail } from "@/lib/supabase/env"
import { createClient } from "@/lib/supabase/server"

export default async function AdminProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const missingEnv = getMissingAdminAuthEnv()

  if (missingEnv.length > 0) {
    return <AdminSetupNotice missingEnv={missingEnv} />
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  if (!isAdminEmail(user.email)) {
    await supabase.auth.signOut()
    redirect("/admin/login?error=Esse+usuario+nao+tem+acesso")
  }

  return (
    <div className="px-4 pb-16 pt-28">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-[var(--line)] bg-[var(--card)] shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
        <header className="flex flex-col gap-4 border-b border-[var(--line)] px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              Admin
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
              CMS do blog
            </h1>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <span className="text-sm text-[var(--muted)]">{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-[var(--line)] px-4 py-2 text-sm transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
              >
                Sair
              </button>
            </form>
          </div>
        </header>

        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
