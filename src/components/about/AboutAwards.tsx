const awards = [
  {
    index: "01",
    title: "Digital for Good Award",
    org: "The Spider Awards",
    year: "2024",
    category: "Impact",
  },
  {
    index: "02",
    title: "Awwwards Honorable Mention",
    org: "Awwwards",
    year: "2023",
    category: "Immersive",
  },
  {
    index: "03",
    title: "Mobile Excellence",
    org: "Awwwards",
    year: "2023",
    category: "Performance",
  },
  {
    index: "04",
    title: "Webpick of the Day",
    org: "Communication Arts",
    year: "2022",
    category: "Creative",
  },
  {
    index: "05",
    title: "Best UX Design",
    org: "CSS Awards",
    year: "2021",
    category: "UX/UI",
  },
]

export function AboutAwards() {
  return (
    <section className="mt-[120px]">
      <div className="mb-10 flex items-end justify-between gap-8 border-b border-[var(--line)] pb-8">
        <h2 className="text-[clamp(32px,5vw,72px)] font-semibold leading-[0.95] tracking-[-0.04em]">
          Recognition
        </h2>
        <p className="mb-1 max-w-[36ch] text-right font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--muted)]">
          Selected awards &amp; industry recognition
        </p>
      </div>

      <ul>
        {awards.map((award) => (
          <li key={award.index}>
            <div className="group grid cursor-default grid-cols-[48px_1fr_auto] items-center gap-x-8 border-b border-[var(--line)] py-7 transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--ink)_4%,transparent)] lg:grid-cols-[48px_120px_1fr_160px_80px]">

              {/* counter */}
              <span className="font-mono text-[11px] tracking-[0.16em] text-[var(--muted)] transition-colors duration-200 group-hover:text-[var(--ink)]">
                {award.index}
              </span>

              {/* category — hidden on mobile */}
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] lg:block">
                {award.category}
              </span>

              {/* title — the hero element */}
              <h3 className="text-[clamp(22px,3.2vw,52px)] font-semibold leading-[1.05] tracking-[-0.03em] transition-[letter-spacing] duration-500 group-hover:tracking-[-0.01em]">
                {award.title}
              </h3>

              {/* org — hidden on mobile */}
              <span className="hidden text-right font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] lg:block">
                {award.org}
              </span>

              {/* year */}
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
