import { WorkGrid } from "@/components/work/WorkGrid"
import { projects } from "@/data/projects"

export default function WorkPage() {
  return (
    <div className="px-[4vw] pb-[140px] pt-[140px]">
      <div className="mx-auto max-w-[1600px]">

        <section className="animate-fade-up border-b border-[var(--line)] pb-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-[var(--muted)]">
                Work / Selected
              </p>
              <h1 className="mt-8 text-[clamp(46px,7.5vw,120px)] font-semibold leading-[0.92] tracking-[-0.06em]">
                Work across
                <br />
                product and web.
              </h1>
            </div>
          </div>

          <p className="mt-8 max-w-[58ch] text-[18px] leading-[1.7] text-[var(--muted)]">
            A selection of projects and contributions across agencies, international teams and independent work. External links open the live site when available.
          </p>
        </section>

        <section
          className="animate-fade-up mt-12"
          style={{ animationDelay: "0.1s" }}
        >
          <WorkGrid projects={projects} />
        </section>

      </div>
    </div>
  )
}
