"use client"

import { motion } from "framer-motion"
import type { Project } from "@/types"

type WorkGridProps = {
  projects: Project[]
}

export function WorkGrid({ projects }: WorkGridProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      className="grid gap-7 md:grid-cols-2"
    >
      {projects.map((project, index) => {
        const isExternal = Boolean(project.demoUrl && project.demoUrl !== "#")
        const CardTag = isExternal ? motion.a : motion.article
        const cardProps = isExternal
          ? {
              href: project.demoUrl,
              target: "_blank",
              rel: "noreferrer",
            }
          : {}

        return (
          <CardTag
            key={project.id}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="group overflow-hidden rounded-[14px] border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] transition-all duration-500 ease-[0.16, 1, 0.3, 1] hover:-translate-y-1.5 hover:border-[var(--ink)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
            data-interactive={isExternal ? "true" : undefined}
            {...cardProps}
          >
            <div className="relative h-60 overflow-hidden border-b border-[var(--line)]">
              <div
                className="absolute inset-0 transition-transform duration-1000 ease-[0.16, 1, 0.3, 1] group-hover:scale-105"
                style={{
                  background:
                    index % 2 === 0
                      ? "linear-gradient(135deg,#2a2a2a,#0a0a0a 60%,#444)"
                      : "linear-gradient(135deg,#fafafa,#bdbdbd 55%,#7a7a7a)",
                }}
              />
              <span className="absolute left-[14px] top-[14px] rounded-[20px] border border-[var(--line)] bg-[var(--bg)] px-[11px] py-[5px] font-mono text-[11px] transition-colors duration-300">
                {index === 0 ? "2026 — Current" : `202${index + 3}`}
              </span>
              {isExternal ? (
                <span className="absolute right-[14px] top-[14px] grid h-[34px] w-[34px] translate-x-2 -translate-y-2 place-items-center rounded-full bg-[var(--inv)] text-[15px] text-[var(--inv-ink)] opacity-0 transition-all duration-500 ease-[0.16, 1, 0.3, 1] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
                  ↗
                </span>
              ) : null}
            </div>

            <div className="p-[26px]">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <h3 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] transition-colors duration-300 group-hover:text-[var(--ink)]">
                    {project.title}
                  </h3>
                  <div className="font-mono text-[13px] text-[var(--muted)]">
                    {project.agency ? (
                      <>
                        Contributed at{" "}
                        <em className="not-italic font-medium text-[var(--ink)]">{project.agency}</em>
                      </>
                    ) : (
                      <em className="not-italic font-medium text-[var(--ink)]">Personal project</em>
                    )}
                  </div>
                </div>
                {isExternal ? (
                  <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                    Opens externally
                  </span>
                ) : null}
              </div>

              <div className="mb-[18px] text-sm leading-[1.7] text-[var(--muted)]">
                <b className="mb-0.5 mt-3 block font-mono text-[11.5px] uppercase tracking-[0.5px] text-[var(--ink)]">
                  Role
                </b>
                {project.role ?? "Front-end Developer"}
                <b className="mb-0.5 mt-3 block font-mono text-[11.5px] uppercase tracking-[0.5px] text-[var(--ink)]">
                  About
                </b>
                {project.description}
              </div>

              <div className="flex flex-wrap gap-[7px]">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-[20px] border border-[var(--line)] px-[11px] py-[5px] font-mono text-[11px] text-[var(--muted)] transition-colors duration-300 group-hover:border-[var(--ink)]/30 group-hover:text-[var(--ink)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </CardTag>
        )
      })}
    </motion.div>
  )
}
