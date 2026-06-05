import { AboutTimeline, AboutPrinciples } from "@/components/about/AboutExperience"
import { AboutAwards } from "@/components/about/AboutAwards"

const stats = [
  { value: "5+", label: "Years of craft" },
  { value: "30+", label: "Projects shipped" },
  { value: "12", label: "Clients served" },
  { value: "100%", label: "Remote" },
]

export default function AboutPage() {
  return (
    <div className="px-[4vw] pb-[140px] pt-[140px]">
      <div className="mx-auto max-w-[1600px]">

        {/* ── Header ─────────────────────────────────────────────── */}
        <section className="border-b border-[var(--line)] pb-16">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-[var(--muted)]">
              About / Practice
            </p>
          </div>

          <h1 className="mt-8 text-[clamp(46px,7.5vw,120px)] font-semibold leading-[0.92] tracking-[-0.06em]">
            Front-end shaped<br />like product work.
          </h1>

          <p className="mt-8 max-w-[52ch] text-[18px] leading-[1.7] text-[var(--muted)]">
            I work at the intersection of interface, product thinking and delivery
            discipline, with attention to motion, clarity and long-term structure.
          </p>
        </section>

        {/* ── Stats ──────────────────────────────────────────────── */}
        <section className="grid grid-cols-2 border-b border-[var(--line)] lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`py-10 ${i !== 0 ? "border-l border-[var(--line)] pl-8" : ""}`}
            >
              <div className="text-[clamp(42px,5vw,72px)] font-semibold leading-none tracking-[-0.05em]">
                {stat.value}
              </div>
              <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* ── Timeline ───────────────────────────────────────────── */}
        <div className="mt-20">
          <AboutTimeline />
        </div>

        {/* ── Awards ─────────────────────────────────────────────── */}
        <AboutAwards />

        {/* ── Principles ─────────────────────────────────────────── */}
        <AboutPrinciples />

      </div>
    </div>
  )
}
