"use client"

import { useEffect, useState } from "react"

export function HomeChrome() {
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window === "undefined") {
      return false
    }

    return !window.localStorage.getItem("home_loader_seen")
  })
  useEffect(() => {
    if (showLoader) {
      document.body.style.overflow = "hidden"

      const timeout = window.setTimeout(() => {
        setShowLoader(false)
        document.body.style.overflow = ""
        window.localStorage.setItem("home_loader_seen", "true")
      }, 1800)

      return () => {
        window.clearTimeout(timeout)
        document.body.style.overflow = ""
      }
    }
  }, [showLoader])

  useEffect(() => {
    function onScroll() {
      const total = document.body.scrollHeight - window.innerHeight
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0
      document.documentElement.style.setProperty("--scroll-progress", `${progress}%`)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.045] home-grain" />
      <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
        <div className="ambient-orb ambient-orb-one" />
        <div className="ambient-orb ambient-orb-two" />
      </div>
      <div className="fixed left-0 top-0 z-[300] h-0.5 w-[var(--scroll-progress)] bg-[var(--ink)]" />
      {showLoader && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[var(--bg)]">
          <div className="flex flex-col items-center gap-5">
            <div className="font-mono text-xs uppercase tracking-[0.42em] text-[var(--muted)]">
              Loading
            </div>
            <div className="h-px w-40 overflow-hidden bg-[color:color-mix(in_srgb,var(--ink)_12%,transparent)]">
              <div className="h-full w-full origin-left bg-[var(--ink)] animate-[loaderPulse_1s_cubic-bezier(.16,1,.3,1)_infinite]" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
