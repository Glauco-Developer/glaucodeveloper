"use client"

import { useEffect, useState } from "react"
import { AboutTimeline, AboutPrinciples } from "@/components/about/AboutExperience"
import { AboutAwards } from "@/components/about/AboutAwards"

const stats = [
  { value: 5, suffix: "+", label: "Years of craft" },
  { value: 30, suffix: "+", label: "Projects shipped" },
  { value: 12, suffix: "", label: "Clients served" },
  { value: 100, suffix: "%", label: "Remote" },
]

// Animação de contador em JS puro — sem Framer Motion
function StatCount({ value, suffix, delay }: { value: number; suffix: string; delay: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const duration = 1200 // ms
    const startTime = performance.now() + delay * 1000
    let raf: number

    const step = (now: number) => {
      const elapsed = now - startTime
      if (elapsed < 0) { raf = requestAnimationFrame(step); return }

      const progress = Math.min(elapsed / duration, 1)
      // Cubic ease-out: começa rápido, desacelera no final
      const eased = 1 - (1 - progress) ** 3
      setDisplay(Math.round(eased * value))

      if (progress < 1) raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, delay])

  return <>{display}{suffix}</>
}

export default function AboutPage() {
  return (
    <div className="px-[4vw] pb-[140px] pt-[140px]">
      <div className="mx-auto max-w-[1600px]">

        {/* ── Header ─────────────────────────────────────────────── */}
        <section className="animate-fade-up border-b border-[var(--line)] pb-16">
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
        <section
          className="animate-fade-up grid grid-cols-2 border-b border-[var(--line)] lg:grid-cols-4"
          style={{ animationDelay: "0.1s" }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`py-10 ${i !== 0 ? "border-l border-[var(--line)] pl-8" : ""}`}
            >
              <div className="text-[clamp(42px,5vw,72px)] font-semibold leading-none tracking-[-0.05em]">
                <StatCount value={stat.value} suffix={stat.suffix} delay={0.22 + i * 0.08} />
              </div>
              <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* ── Timeline ───────────────────────────────────────────── */}
        <div className="animate-fade-up mt-20" style={{ animationDelay: "0.15s" }}>
          <AboutTimeline />
        </div>

        {/* ── Awards ─────────────────────────────────────────────── */}
        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <AboutAwards />
        </div>

        {/* ── Principles ─────────────────────────────────────────── */}
        <div className="animate-fade-up" style={{ animationDelay: "0.25s" }}>
          <AboutPrinciples />
        </div>

      </div>
    </div>
  )
}
