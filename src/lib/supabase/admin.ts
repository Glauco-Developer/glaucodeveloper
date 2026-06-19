import { redirect } from "next/navigation"
import { createClient } from "./server"
import { isAdminEmail } from "./env"

export async function getAdminPageClient() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  if (!isAdminEmail(user.email)) {
    redirect("/admin/login?error=Esse+usuario+nao+tem+acesso")
  }

  return { supabase, user }
}

export async function getAdminActionClient() {
  const supabase = await createClient({ writeCookies: true })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!isAdminEmail(user?.email)) {
    throw new Error("Unauthorized")
  }

  return { supabase, user }
}
