"use client"

import { useState } from "react"

const field =
  "w-full rounded-[14px] border border-(--line) bg-(--bg-2) px-4 py-3.5 text-[15px] outline-none transition-colors duration-200 focus:border-(--ink) placeholder:text-(--muted)"

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border border-(--line) bg-(--card) p-10 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-(--line) text-[20px]">
          ✓
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-(--muted)">Message sent</p>
        <p className="mt-3 text-[22px] font-semibold tracking-[-0.03em]">I'll be in touch soon.</p>
      </div>
    )
  }

  return (
    <div className="rounded-[28px] border border-(--line) bg-(--card) p-8 md:p-10">
      <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.26em] text-(--muted)">
        Start a project
      </p>

      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--muted)">Name</span>
            <input required placeholder="Your name" className={field} />
          </label>
          <label className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--muted)">Email</span>
            <input type="email" required placeholder="your@email.com" className={field} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--muted)">Project type</span>
            <input placeholder="Landing page, product UI…" className={field} />
          </label>
          <label className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--muted)">Budget</span>
            <input placeholder="Approx. budget or TBD" className={field} />
          </label>
        </div>

        <label className="space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--muted)">Message</span>
          <textarea
            required
            rows={6}
            placeholder="Tell me about the project, timeline and goals…"
            className={`${field} resize-none`}
          />
        </label>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="cta-shape cta-shape-light inline-flex items-center gap-2.5 rounded-[40px] px-7 py-3.5 font-mono text-[13px] font-medium text-black"
            data-interactive="true"
          >
            <span className="cta-shape-fill" />
            <span className="relative z-[1]">Send inquiry</span>
            <span className="relative z-[1] text-[11px]">↗</span>
          </button>
        </div>
      </form>
    </div>
  )
}
