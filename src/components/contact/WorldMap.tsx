"use client"

import dynamic from "next/dynamic"

const MapClient = dynamic(
  () => import("./MapClient").then((m) => m.MapClient),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-[var(--bg-2)]" />,
  }
)

export function WorldMap() {
  return (
    <section className="relative left-1/2 mt-24 w-screen -translate-x-1/2 overflow-hidden">
      {/* map layer */}
      <div className="h-[560px] w-full">
        <MapClient />
      </div>

      {/* fade top — blends into page bg */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28"
        style={{ background: "linear-gradient(to bottom, var(--bg) 0%, transparent 100%)" }}
      />

      {/* fade bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
        style={{ background: "linear-gradient(to top, var(--bg) 0%, transparent 100%)" }}
      />

      {/* text overlaid bottom-left */}
      <div className="pointer-events-none absolute bottom-10 left-[4vw] right-[4vw]">
        <div className="mx-auto max-w-[1600px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
            Delivery map
          </p>
          <h2 className="mt-3 text-[clamp(22px,3vw,42px)] font-semibold leading-[1] tracking-[-0.04em]">
            Digital work shipped across multiple markets.
          </h2>
        </div>
      </div>
    </section>
  )
}
