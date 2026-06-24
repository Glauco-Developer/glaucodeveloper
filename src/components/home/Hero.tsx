"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    videoRef.current?.play().catch(() => {})
  }, [])

  return (
    <header
      id="home"
      className="hero-shell relative flex min-h-[660px] flex-col justify-end overflow-hidden px-[4vw] pb-[8vh] pt-24"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="hero-video"
        ref={videoRef}
        aria-hidden="true"
      >
        <source src="/bg-hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-layer hero-base" />
      <div className="hero-grain" />
      <div className="hero-scrim" />
      <div className="hero-vlines" />

      <div className="relative z-[3] mx-auto w-full max-w-[1600px]">
        <div className="max-w-[680px] text-white">
          <div
            className="mb-[26px] hidden items-center gap-[9px] rounded-[30px] border border-white/25 bg-black/30 px-4 py-2 font-mono text-xs text-zinc-100 backdrop-blur-[6px] sm:inline-flex"
            data-interactive="true"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Front-end Developer · Remote
          </div>

          <h1 className="text-[clamp(38px,6.2vw,92px)] font-semibold leading-[0.94] tracking-[-0.05em] text-white [text-shadow:0_2px_40px_rgba(0,0,0,0.5)]">
            <span className="block">
            Web development
            </span>
            <span className="block font-light text-white/55">
            and software engineering.
            </span>
          </h1>

          <p className="mt-[22px] max-w-[520px] text-[15px] leading-[1.75] text-white/72 sm:text-[16px]">
            I&apos;m Glauco Russo, a web developer with 15+ years of experience in the industry. My work focuses on developing functional web platforms, combining clean code with modern backend integrations and practical AI features.
          </p>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <Link
              href="/about"
              className="cta-shape cta-shape-light inline-flex items-center gap-2 rounded-[40px] px-6 py-3.5 font-mono text-[13px] font-medium text-black"
              data-interactive="true"
            >
              <span className="cta-shape-fill" />
              <span className="relative z-[1]">About</span>
            </Link>
            <a
              href="#contact"
              className="cta-shape cta-shape-dark inline-flex items-center gap-2 rounded-[40px] px-6 py-3.5 font-mono text-[13px] font-medium text-white"
              data-interactive="true"
            >
              <span className="cta-shape-fill" />
              <span className="relative z-[1]">Contact</span>
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[26px] left-0 z-[3] w-full px-[4vw] font-mono text-[11px] uppercase tracking-[1.5px] text-white/50">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="flex items-center gap-[9px]">
            <span className="animate-[bob_1.6s_cubic-bezier(.16,1,.3,1)_infinite]">↓</span>
            Scroll
          </div>
        </div>
      </div>
    </header>
  )
}
