"use client"

import { projects } from "@/data/projects"
import { WorkGrid } from "@/components/work/WorkGrid"

export function Projects() {
  return (
    <section id="work" className="px-[4vw] pb-[130px] pt-0">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-[18px]">
          <div className="flex w-full flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="text-[clamp(34px,5.5vw,72px)] font-semibold leading-[0.95] tracking-[-0.03em]">
                Built &amp; contributed
              </h2>
            </div>
            <div className="flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[1.5px] text-[var(--muted)]">
              <b className="font-medium text-[var(--ink)]">03</b> / Projects
            </div>
          </div>
        </div>

        <WorkGrid projects={projects} />
      </div>
    </section>
  )
}
