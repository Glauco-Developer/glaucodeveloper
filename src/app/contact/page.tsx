import Link from "next/link"
import { ContactForm } from "@/components/contact/ContactForm"

const services = [
  "Landing pages & marketing sites",
  "Product UI & design systems",
  "Interface redesigns",
  "Front-end from Figma",
]

const markets = ["Ireland", "United Kingdom", "Belgium", "Switzerland", "United States", "Brazil"]

export default function ContactPage() {
  return (
    <div className="px-[4vw] pb-[140px] pt-[140px]">
      <div className="mx-auto max-w-[1600px]">

        {/* ── Heading ────────────────────────────────────────────── */}
        <div className="mb-14 border-b border-(--line) pb-12">
          <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-(--muted)">
            Contact / Projects
          </p>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <h1 className="max-w-[14ch] text-[clamp(40px,6vw,96px)] font-semibold leading-[0.93] tracking-tighter">
              Let's make the interface feel sharper.
            </h1>
            <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-(--line) px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-(--muted)">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Accepting projects
            </span>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-start">

          {/* Left panel ─ dark card */}
          <div className="rounded-[28px] bg-(--bg-2) p-8 lg:sticky lg:top-32">
            <a
              href="mailto:glauco.developer@gmail.com"
              className="group block border-b border-(--line) pb-7"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-(--muted)">
                Email
              </p>
              <p className="mt-2 text-[16px] font-medium transition-opacity duration-200 group-hover:opacity-60">
                glauco.developer@gmail.com
              </p>
            </a>

            <div className="mt-7 flex gap-6 border-b border-(--line) pb-7 font-mono text-[11px] uppercase tracking-[0.22em]">
              <Link href="#" className="text-(--muted) transition-colors hover:text-(--ink)">LinkedIn</Link>
              <Link href="#" className="text-(--muted) transition-colors hover:text-(--ink)">GitHub</Link>
            </div>

            <div className="mt-7 border-b border-(--line) pb-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-(--muted)">
                What I take on
              </p>
              <ul className="mt-4 space-y-3">
                {services.map((s) => (
                  <li key={s} className="flex items-start gap-3 text-[14px] text-(--muted)">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-(--muted)" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-(--muted)">
                Working globally
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {markets.map((m) => (
                  <span
                    key={m}
                    className="rounded-full border border-(--line) px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-(--muted)"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <ContactForm />
        </div>

      </div>
    </div>
  )
}
