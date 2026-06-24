"use client"

import { useRef, useState, useEffect } from "react"

const principles = [
  {
    title: "AI Engineering — Infnet",
    text: "Undergraduate degree in Artificial Intelligence Engineering at Faculdade Infnet, covering data processing, front and back-end development, computer science fundamentals, machine learning and multi-agent systems.",
  },
  {
    title: "Applied AI Engineering — UNIPDS",
    text: "Specialization in Applied AI Engineering (UNIPDS, partnered with Anhanguera), covering LLMs, generative AI APIs, prompt engineering, MCP, autonomous agents and AI-assisted system architecture.",
  },
  {
    title: "Always learning",
    text: "Constantly studying spec-driven development, AI-assisted engineering and the evolving Next.js and React ecosystem to keep my craft current.",
  },
]

const timeline = [
  {
    year: "Jul 2018 — Present",
    title: "Web Developer at Ebow Digital",
    location: "County Dublin, Ireland",
    text: "Contributed to international digital projects for organisations across Ireland, the United States, the United Kingdom, Switzerland, and beyond, including the Virtual Record Treasury of Ireland, later featured in The New York Times and The Guardian.",
  },
  {
    year: "May 2017 — Mar 2018",
    title: "Front-end Developer at Perverte",
    location: "Porto Alegre, Brazil",
    text: "Developed award-winning immersive experiences, including Benoît Nihant, recognized by Awwwards and Communication Arts.",
  },
  {
    year: "Sep 2016 — Dec 2017",
    title: "Front-end Developer at Ideia Agência Digital",
    location: "Porto Alegre, Brazil",
    text: "Built and maintained client websites at a digital agency.",
  },
  {
    year: "Mar 2014 — Aug 2015",
    title: "Front-end Developer at Segundo Andar",
    location: "Porto Alegre, Brazil",
    text: "Front-end development work early in my career.",
  },
  {
    year: "Jul 2008 — Dec 2013",
    title: "Front-end Developer (Founder) at Simbweb",
    location: "Porto Alegre, Brazil",
    text: "Founded and built websites end to end for local clients.",
  },
]

function useInViewOnce(margin = "-80px") {
  const ref = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect() } },
      { rootMargin: margin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [margin])

  return { ref, isInView }
}

export function AboutTimeline() {
  const { ref, isInView } = useInViewOnce()

  return (
    <section
      ref={ref}
      className="grid gap-12 border-b border-[var(--line)] pb-16 lg:grid-cols-[0.9fr_1.1fr]"
    >
      <div>
        <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-[var(--muted)]">
          Timeline
        </p>
        <h2 className="mt-5 text-[clamp(34px,4.5vw,64px)] font-semibold leading-[0.95] tracking-[-0.05em]">
          A front-end path shaped by product, pacing and presentation.
        </h2>
      </div>

      <div className="space-y-8">
        {timeline.map((item, index) => (
          <div
            key={item.year}
            className={`grid gap-4 border-t border-[var(--line)] pt-6 md:grid-cols-[220px_1fr] md:gap-x-10 ${
              isInView ? "animate-fade-up" : "opacity-0"
            }`}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--muted)]">
              {item.year}
            </div>
            <div>
              <h3 className="text-[24px] font-semibold tracking-[-0.03em]">{item.title}</h3>
              <p className="mt-1 font-mono text-[12px] text-[var(--muted)]">{item.location}</p>
              <p className="mt-3 max-w-[44ch] text-[15px] leading-7 text-[var(--muted)]">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function AboutPrinciples() {
  const { ref, isInView } = useInViewOnce()

  return (
    <section ref={ref} className="mt-16 grid gap-6 lg:grid-cols-3">
      {principles.map((item, index) => (
        <article
          key={item.title}
          className={`group rounded-[22px] border border-[var(--line)] bg-[color:color-mix(in_srgb,var(--card)_88%,transparent)] p-7 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1.5 ${
            isInView ? "animate-fade-up" : "opacity-0"
          }`}
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
            0{index + 1}
          </div>
          <h3 className="mt-6 text-[28px] font-semibold leading-[1.18] tracking-[-0.04em]">{item.title}</h3>
          <p className="mt-4 text-[15px] leading-8 text-[var(--muted)]">{item.text}</p>
        </article>
      ))}
    </section>
  )
}
