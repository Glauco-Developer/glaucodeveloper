"use client"

import { useRef, useState, useEffect } from "react"

const stats = [
  { value: 12, suffix: "+", label: "years of experience across studios and product teams" },
  { value: 8, suffix: "+", label: "international recognitions tied to projects I've contributed to" },
]

// Contador animado em JS puro — sem Framer Motion
function CountUp({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!active) return

    const duration = 2000
    const startTime = performance.now() + 200
    let raf: number

    const step = (now: number) => {
      const elapsed = now - startTime
      if (elapsed < 0) { raf = requestAnimationFrame(step); return }
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [active, target])

  return <>{display}{suffix}</>
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const [isTitleInView, setIsTitleInView] = useState(false)
  const [areStatsInView, setAreStatsInView] = useState(false)

  useEffect(() => {
    const titleEl = sectionRef.current
    const statsEl = statsRef.current
    if (!titleEl || !statsEl) return

    const titleObserver = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsTitleInView(true); titleObserver.disconnect() } },
      { rootMargin: "-100px" }
    )
    const statsObserver = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAreStatsInView(true); statsObserver.disconnect() } },
      { rootMargin: "-100px" }
    )

    titleObserver.observe(titleEl)
    statsObserver.observe(statsEl)

    return () => { titleObserver.disconnect(); statsObserver.disconnect() }
  }, [])

  return (
    <section id="about" ref={sectionRef} className="px-[4vw] py-[130px]">
      <div className="mx-auto max-w-[1600px]">

        <div
          className={`mb-[46px] flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[1.5px] text-[var(--muted)] ${
            isTitleInView ? "animate-fade-up" : "opacity-0"
          }`}
        >
          <span className="h-px w-8 bg-[var(--line)]" />
          <b className="font-medium text-[var(--ink)]">02</b> / About
        </div>

        <p
          className={`max-w-[1050px] text-[clamp(26px,4vw,54px)] font-normal leading-[1.2] tracking-[-0.025em] ${
            isTitleInView ? "animate-fade-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          I&apos;ve spent the last twelve years building on the web —{" "}
          <span className="text-[var(--muted)]">
            across studios and international teams, shipping production work end to end
          </span>
          . That gave me more than code: product judgment, communication, and the discipline of delivery. Lately I&apos;m digging into{" "}
          <span className="font-medium text-[var(--ink)]">React, Next.js</span>{" "}
          and AI-powered applications.
        </p>

        <div ref={statsRef} className="mt-24 space-y-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`group ${areStatsInView ? "animate-fade-up" : "opacity-0"}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="grid gap-6 border-b border-[var(--line)] pb-10 md:grid-cols-[minmax(220px,320px)_1fr] md:items-end">
                <div className="relative">
                  {/* Linha decorativa com hover via CSS */}
                  <div className="mb-6 h-px w-16 bg-[color:color-mix(in_srgb,var(--ink)_25%,transparent)] transition-[width,background-color] duration-300 group-hover:w-24 group-hover:bg-[var(--ink)]" />
                  <div className="mb-6 text-[clamp(64px,10vw,140px)] font-semibold leading-none tracking-[-0.07em] text-[var(--ink)]">
                    <CountUp target={stat.value} suffix={stat.suffix} active={areStatsInView} />
                  </div>
                </div>
                <div className="max-w-[34rem] pb-2">
                  <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--muted)]">
                    Metric {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-4 text-[clamp(20px,2.4vw,32px)] font-medium leading-[1.25] tracking-[-0.03em] text-[var(--ink)]">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
