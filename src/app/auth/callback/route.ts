import { NextResponse } from "next/server"
import { isAdminEmail } from "@/lib/supabase/env"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = getSafeRedirectPath(requestUrl.searchParams.get("next"))

  if (!code) {
    return NextResponse.redirect(
      new URL("/admin/login?error=Link+invalido", requestUrl.origin)
    )
  }

  const supabase = await createClient({ writeCookies: true })
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(
      new URL("/admin/login?error=Falha+ao+validar+o+link", requestUrl.origin)
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!isAdminEmail(user?.email)) {
    await supabase.auth.signOut()

    return NextResponse.redirect(
      new URL("/admin/login?error=Esse+usuario+nao+tem+acesso", requestUrl.origin)
    )
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin))
}

function getSafeRedirectPath(next: string | null) {
  if (!next || !next.startsWith("/")) {
    return "/admin"
  }

  return next
}
