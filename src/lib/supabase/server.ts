import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getSupabaseEnv } from "./env"

type CreateClientOptions = {
  writeCookies?: boolean
}

export async function createClient(options: CreateClientOptions = {}) {
  const cookieStore = await cookies()
  const { url, anonKey } = getSupabaseEnv()
  const { writeCookies = false } = options

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      ...(writeCookies
        ? {
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            },
          }
        : {}),
    },
  })
}
