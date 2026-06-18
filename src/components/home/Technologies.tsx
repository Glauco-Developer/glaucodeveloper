"use client"

import { useRef, useState, useEffect } from "react"
import {
  siAngular,
  siFigma,
  siGit,
  siJavascript,
  siNextdotjs,
  siNodedotjs,
  siReact,
  siSass,
  siTailwindcss,
  siTypescript,
  siWebpack,
  siWordpress,
} from "simple-icons"
import { technologies } from "@/data/technologies"

const iconMap = {
  react: siReact,
  nextjs: siNextdotjs,
  typescript: siTypescript,
  tailwind: siTailwindcss,
  javascript: siJavascript,
  figma: siFigma,
  angular: siAngular,
  nodejs: siNodedotjs,
  sass: siSass,
  wordpress: siWordpress,
  git: siGit,
  webpack: siWebpack,
} as const

function OfficialIcon({ path }: { path: string }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

export function Technologies() {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  // Intersection Observer nativo — dispara a animação só quando a seção entra na tela
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect() // para de observar após o primeiro trigger
        }
      },
      { rootMargin: "-80px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="stack" className="px-[4vw] py-[130px]">
      <div className="mx-auto max-w-[1600px]">

        <div className="animate-fade-up mb-[46px] flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[1.5px] text-[var(--muted)]">
          <span className="h-px w-8 bg-[var(--line)]" />
          <b className="font-medium text-[var(--ink)]">01</b> / Stack
        </div>

        <div
          ref={ref}
          className="grid overflow-hidden rounded-[14px] border border-[var(--line)] [grid-template-columns:repeat(2,1fr)] md:[grid-template-columns:repeat(3,1fr)] xl:[grid-template-columns:repeat(6,1fr)]"
        >
          {technologies.map((tech, index) => {
            const icon = iconMap[tech.icon as keyof typeof iconMap]

            return (
              <div
                key={tech.name}
                className={`group relative aspect-[1.25/1] overflow-hidden border-b border-r border-[var(--line)] ${
                  isInView ? "animate-fade-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
                data-interactive="true"
              >
                <div className="absolute inset-0 translate-y-[101%] bg-[var(--inv)] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0" />
                <div className="relative z-[1] flex h-full flex-col items-center justify-center gap-3.5 px-3 text-center">
                  <div className="text-[30px] text-[var(--muted)] transition-all duration-500 group-hover:-translate-y-1 group-hover:text-[var(--inv-ink)]">
                    <OfficialIcon path={icon.path} />
                  </div>
                  <span className="font-mono text-[11px] tracking-[0.3px] text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--inv-ink)]">
                    {tech.name}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
