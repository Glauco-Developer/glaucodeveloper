import { ContactForm } from "@/components/contact/ContactForm"

const focusAreas = [
  "Interface systems and front-end craft",
  "Exploring AI-powered applications",
  "Product-minded execution",
  "Experience working with international teams",
]

const markets = ["Ireland", "United Kingdom", "Belgium", "Switzerland", "United States", "Brazil"]

export default function ContactPage() {
  return (
    <div className="px-[4vw] pb-[140px] pt-[140px]">
      <div className="mx-auto max-w-[1600px]">

        {/* ── Heading ────────────────────────────────────────────── */}
        <div className="animate-fade-up mb-14 border-b border-(--line) pb-12">
          <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-(--muted)">
            Contact / Profile
          </p>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <h1 className="max-w-[14ch] text-[clamp(40px,6vw,96px)] font-semibold leading-[0.93] tracking-tighter">
              Say hello — I read every message myself.
            </h1>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────── */}
        <div
          className="animate-fade-up grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-start"
          style={{ animationDelay: "0.1s" }}
        >

          {/* Left panel */}
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
              <a
                href="https://www.linkedin.com/in/glauco-raupp-russo/"
                target="_blank"
                rel="noreferrer"
                className="text-(--muted) transition-colors hover:text-(--ink)"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/Glauco-Developer"
                target="_blank"
                rel="noreferrer"
                className="text-(--muted) transition-colors hover:text-(--ink)"
              >
                GitHub
              </a>
            </div>

            <div className="mt-7 border-b border-(--line) pb-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-(--muted)">
                Current focus
              </p>
              <ul className="mt-4 space-y-3">
                {focusAreas.map((s) => (
                  <li key={s} className="flex items-start gap-3 text-[14px] text-(--muted)">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-(--muted)" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-(--muted)">
                Places in the journey
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
