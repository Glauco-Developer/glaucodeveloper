'use server'

import { redirect } from "next/navigation"
import { getSiteUrl, isAdminEmail } from "@/lib/supabase/env"
import { createClient } from "@/lib/supabase/server"

export type LoginState = {
  error?: string
  success?: string
}

export async function sendMagicLink(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()

  if (!email) {
    return { error: "Informe o email do admin." }
  }

  if (!isAdminEmail(email)) {
    return { error: "Esse email nao tem acesso ao admin." }
  }

  const supabase = await createClient({ writeCookies: true })
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/admin`,
    },
  })

  if (error) {
    return { error: getMagicLinkErrorMessage(error.message) }
  }

  return {
    success: "Link enviado. Abra o email do admin e clique no acesso magico.",
  }
}

export async function signOut() {
  const supabase = await createClient({ writeCookies: true })
  await supabase.auth.signOut()
  redirect("/admin/login")
}

function getMagicLinkErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase()

  if (normalizedMessage.includes("email not confirmed")) {
    return "Esse usuario existe, mas o email ainda nao foi confirmado no Supabase."
  }

  if (
    normalizedMessage.includes("user not found") ||
    normalizedMessage.includes("signup is disabled") ||
    normalizedMessage.includes("signups not allowed for otp")
  ) {
    return "O Supabase nao esta permitindo criar o usuario por Magic Link."
  }

  if (
    normalizedMessage.includes("email provider is disabled") ||
    normalizedMessage.includes("unsupported email provider")
  ) {
    return "O login por email esta desativado no painel do Supabase."
  }

  if (
    normalizedMessage.includes("redirect") ||
    normalizedMessage.includes("site url")
  ) {
    return "A URL de callback nao bate com a configuracao do Supabase."
  }

  return `Supabase: ${message}`
}
