'use client'

import { useActionState } from "react"
import { sendMagicLink, type LoginState } from "@/app/admin/actions"

const initialState: LoginState = {}

export function LoginForm() {
  const [state, action, pending] = useActionState(sendMagicLink, initialState)

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm text-[var(--muted)]"
        >
          Email do admin
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="voce@dominio.com"
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition-colors focus:border-[var(--ink)]"
        />
      </div>

      {state.error ? (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
          {state.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-medium text-[var(--inv-ink)] transition-opacity disabled:opacity-60"
      >
        {pending ? "Enviando link..." : "Enviar Magic Link"}
      </button>
    </form>
  )
}
