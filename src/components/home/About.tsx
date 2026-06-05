"use client"

import { useEffect, useState } from "react"
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion"
import { useRef } from "react"

const stats = [
  { value: 18, suffix: "", label: "years working across web, product and digital experiences" },
  { value: 5, suffix: "", label: "years leading an agency across delivery, clients and operations" },
  { value: 6, suffix: "+", label: "international recognitions — Awwwards, Spiders, CSS Awards and CommArts" },
]

function CountUp({
  target,
  suffix,
  active,
}: {
  target: number
  suffix: string
  active: boolean
}) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!active) return

    const controls = animate(count, target, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for professional feel
      delay: 0.2,
    })

    return controls.stop
  }, [active, count, target])

  // Sync motion value with React state for rendering
  useEffect(() => {
    return rounded.on("change", (latest) => setDisplay(latest))
  }, [rounded])

  return (
    <>
      {display}
      <span>{suffix}</span>
    </>
  )
}

export function About() {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const isTitleInView = useInView(titleRef, { once: true, margin: "-100px" })
  const statsRef = useRef(null)
  const areStatsInView = useInView(statsRef, { once: true, margin: "-100px" })

  return (
    <section id="about" className="px-[4vw] py-[130px]" ref={containerRef}>
      <div className="mx-auto max-w-[1600px]">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={isTitleInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-[46px] flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[1.5px] text-[var(--muted)]"
        >
          <span className="h-px w-8 bg-[var(--line)]" />
          <b className="font-medium text-[var(--ink)]">02</b> / About
        </motion.div>

        <motion.p
          ref={titleRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[1050px] text-[clamp(26px,4vw,54px)] font-normal leading-[1.2] tracking-[-0.025em]"
        >
          I&apos;ve been building for the web since 2008 —{" "}
          <span className="text-[var(--muted)]">
            across agency leadership, hands-on production, and senior roles on global digital products
          </span>
          . That path gave me a broader view than just shipping code: product judgment, communication, delivery, and currently a deeper exploration into <span className="text-[var(--ink)] font-medium">Applied AI Engineering</span>.
        </motion.p>

        <div className="mt-24 space-y-12" ref={statsRef}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              animate={areStatsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 1.2, 
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1 * index 
              }}
              className="group"
            >
              <div className="grid gap-6 border-b border-[var(--line)] pb-10 md:grid-cols-[minmax(220px,320px)_1fr] md:items-end">
                <div className="relative">
                  <motion.div 
                    initial={{ width: "4rem" }}
                    whileHover={{ width: "6rem" }}
                    className="mb-6 h-px bg-[color:color-mix(in_srgb,var(--ink)_25%,transparent)] transition-colors duration-300 group-hover:bg-[var(--ink)]" 
                  />
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
