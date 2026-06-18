"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

const awards = [
  {
    index: "01",
    title: "Digital for Good Award",
    org: "The Spider Awards",
    year: "2024",
    category: "Impact",
    previewImage: "/awards/spider-award.svg",
  },
  {
    index: "02",
    title: "Awwwards Honorable Mention",
    org: "Awwwards",
    year: "2023",
    category: "Immersive",
    previewImage: "/awards/awwwards-hm.svg",
  },
  {
    index: "03",
    title: "Mobile Excellence",
    org: "Awwwards",
    year: "2023",
    category: "Performance",
    previewImage: "/awards/awwwards-mobile.svg",
  },
  {
    index: "04",
    title: "Webpick of the Day",
    org: "Communication Arts",
    year: "2022",
    category: "Creative",
    previewImage: "/awards/commarts-webpick.svg",
  },
  {
    index: "05",
    title: "Best UX Design",
    org: "CSS Awards",
    year: "2021",
    category: "UX/UI",
    previewImage: "/awards/css-best-ux.svg",
  },
]

const PREVIEW_W = 260
const PREVIEW_H = 325

export function AboutAwards() {
  const [activeAward, setActiveAward] = useState<(typeof awards)[number] | null>(null)
  const [mounted, setMounted] = useState(false)
  // Ref para manipular a posição do tooltip diretamente no DOM — sem re-renders do React
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  function moveTooltip(clientX: number, clientY: number) {
    const el = tooltipRef.current
    if (!el) return
    const maxX = window.innerWidth - PREVIEW_W - 24
    const maxY = window.innerHeight - PREVIEW_H - 24
    const x = Math.max(24, Math.min(clientX + 28, maxX))
    const y = Math.max(24, Math.min(clientY + 24, maxY))
    // Atualiza posição diretamente no DOM — mais performático que setState
    el.style.left = `${x}px`
    el.style.top = `${y}px`
  }

  return (
    <section className="mt-[120px]">
      {/* Portal do tooltip — renderiza no <body> para ficar acima de tudo */}
      {mounted && activeAward
        ? createPortal(
            <div
              ref={tooltipRef}
              className="pointer-events-none fixed z-[1200] w-[260px] overflow-hidden rounded-[22px] border border-white/10 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.35)] animate-tooltip-in"
              style={{ top: 0, left: 0, transform: "rotate(-2deg)" }}
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={activeAward.previewImage}
                  alt={`${activeAward.title} preview`}
                  fill
                  className="object-cover"
                  sizes="260px"
                />
              </div>
            </div>,
            document.body
          )
        : null}

      <div className="mb-10 flex items-end justify-between gap-8 border-b border-[var(--line)] pb-8">
        <h2 className="text-[clamp(32px,5vw,72px)] font-semibold leading-[0.95] tracking-[-0.04em]">
          Recognition
        </h2>
        <p className="mb-1 max-w-[36ch] text-right font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--muted)]">
          Recognition tied to projects I contributed to
        </p>
      </div>

      <ul className="px-4 md:px-6">
        {awards.map((award) => (
          <li
            key={award.index}
            className="relative"
            onPointerEnter={(e) => { setActiveAward(award); moveTooltip(e.clientX, e.clientY) }}
            onPointerLeave={() => setActiveAward(null)}
            onPointerMove={(e) => moveTooltip(e.clientX, e.clientY)}
          >
            <div className="group grid cursor-default grid-cols-[48px_1fr_auto] items-center gap-x-8 border-b border-[var(--line)] py-7 transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--ink)_4%,transparent)] lg:grid-cols-[48px_120px_1fr_160px_80px]">

              <span className="font-mono text-[11px] tracking-[0.16em] text-[var(--muted)] transition-colors duration-200 group-hover:text-[var(--ink)]">
                {award.index}
              </span>

              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] lg:block">
                {award.category}
              </span>

              <h3 className="text-[clamp(22px,3.2vw,52px)] font-semibold leading-[1.05] tracking-[-0.03em] transition-[letter-spacing] duration-500 group-hover:tracking-[-0.01em]">
                {award.title}
              </h3>

              <span className="hidden text-right font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] lg:block">
                {award.org}
              </span>

              <span className="text-right font-mono text-[11px] tracking-[0.16em] text-[var(--muted)]">
                {award.year}
                <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
