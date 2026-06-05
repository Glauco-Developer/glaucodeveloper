"use client"

import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { projects } from "@/data/projects"
import { WorkGrid } from "@/components/work/WorkGrid"

export function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 2)

  return (
    <section id="work" className="px-[4vw] pb-[130px] pt-0">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-[18px]">
          <div className="flex flex-wrap items-end justify-between gap-6 w-full">
            <motion.h2
              ref={ref}
              initial={{ opacity: 0, y: 34 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-[clamp(34px,5.5vw,72px)] font-semibold leading-[0.95] tracking-[-0.03em]"
            >
              Built &amp; contributed
            </motion.h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[1.5px] text-[var(--muted)]">
                <b className="font-medium text-[var(--ink)]">03</b> / Projects
              </div>
              <Link
                href="/work"
                className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--ink)] transition-opacity hover:opacity-60"
                data-interactive="true"
              >
                View all work ↗
              </Link>
            </div>
          </div>
        </div>

        <div ref={ref}>
          {isInView ? <WorkGrid projects={featuredProjects} /> : null}
        </div>
      </div>
    </section>
  )
}
