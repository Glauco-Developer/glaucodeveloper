function requireEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }

  return value
}

export function getMissingEnv(names: string[]) {
  return names.filter((name) => {
    const value = process.env[name]
    return !value || !value.trim()
  })
}

export function getSupabaseEnv() {
  return {
    url: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  }
}

export function getAdminEmail() {
  return requireEnv("ADMIN_EMAIL").toLowerCase()
}

export function getSiteUrl() {
  return requireEnv("NEXT_PUBLIC_SITE_URL").replace(/\/+$/, "")
}

export function getMissingAdminAuthEnv() {
  return getMissingEnv([
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SITE_URL",
    "ADMIN_EMAIL",
  ])
}

export function isAdminEmail(email?: string | null) {
  if (!email) {
    return false
  }

  return email.toLowerCase() === getAdminEmail()
}
