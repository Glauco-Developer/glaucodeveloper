"use client"

import type { Project } from "@/types"

type WorkGridProps = {
  projects: Project[]
}

export function WorkGrid({ projects }: WorkGridProps) {
  return (
    <div className="grid gap-7 md:grid-cols-2">
      {projects.map((project, index) => {
        const siteLabel = project.demoUrl
          ? project.demoUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
          : null

        return (
          <article
            key={project.id}
            className="animate-fade-up group overflow-hidden rounded-[14px] border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--ink)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <div className="relative h-60 overflow-hidden border-b border-[var(--line)]">
              <div
                className="absolute inset-0 transition-transform duration-1000 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
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
            </div>

            <div className="p-[26px]">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <h3 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] transition-colors duration-300">
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

              <div className="mb-[18px] grid gap-4 border-t border-[var(--line)] pt-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div>
                  <b className="mb-2 block font-mono text-[11.5px] uppercase tracking-[0.5px] text-[var(--ink)]">
                    Site
                  </b>
                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                      data-interactive="true"
                    >
                      <span className="truncate">{siteLabel}</span>
                      <span className="font-mono text-[11px]">↗</span>
                    </a>
                  ) : (
                    <span className="text-sm text-[var(--muted)]">Unavailable</span>
                  )}
                </div>

                <div>
                  <b className="mb-2 block font-mono text-[11.5px] uppercase tracking-[0.5px] text-[var(--ink)]">
                    Mentions
                  </b>
                  {project.mentions?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {project.mentions.map((mention) => (
                        <a
                          key={mention.label}
                          href={mention.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-[20px] border border-[var(--line)] px-[11px] py-[5px] font-mono text-[11px] text-[var(--muted)] transition-colors hover:border-[var(--ink)]/30 hover:text-[var(--ink)]"
                          data-interactive="true"
                        >
                          {mention.label} ↗
                        </a>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-[var(--muted)]">No public mentions listed</span>
                  )}
                </div>
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
          </article>
        )
      })}
    </div>
  )
}
