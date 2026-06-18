"use client"

import { useRef, useState, useEffect } from "react"

export function CallToAction() {
  const ref = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-80px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="contact" ref={ref} className="px-[4vw] pb-[110px] pt-[150px] text-center">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-[46px] flex items-center justify-center gap-[10px] font-mono text-[12px] uppercase tracking-[1.5px] text-[var(--muted)]">
          <span className="h-px w-8 bg-[var(--line)]" />
          <b className="font-medium text-[var(--ink)]">05</b> / Contact
        </div>

        <h2
          className={`mb-10 text-[clamp(36px,7vw,110px)] font-semibold leading-none tracking-[-0.04em] ${
            isInView ? "animate-fade-up" : "opacity-0"
          }`}
        >
          Reach out
          <br />
          if relevant.
        </h2>

        <a
          href="mailto:glauco.developer@gmail.com"
          className={`cta-shape cta-shape-ghost inline-flex items-center justify-center rounded-[40px] px-8 py-5 font-mono text-[clamp(16px,2.4vw,22px)] text-[var(--ink)] ${
            isInView ? "animate-fade-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.2s" }}
          data-interactive="true"
        >
          <span className="cta-shape-fill" />
          <span className="relative z-[1]">glauco.developer@gmail.com</span>
        </a>

        <div
          className={`mt-[60px] flex flex-wrap justify-center gap-8 ${
            isInView ? "animate-fade-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.4s" }}
        >
          {["GitHub", "LinkedIn", "Resume ↗"].map((label) => (
            <a
              key={label}
              href="#"
              className="font-mono text-[13px] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--ink)]"
              data-interactive="true"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
