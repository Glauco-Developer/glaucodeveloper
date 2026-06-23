const awards = [
  {
    index: "01",
    title: "Honors",
    org: "Awwwards",
    category: "Ebow",
  },
  {
    index: "02",
    title: "Mobile Excellence",
    org: "Awwwards",
    category: "Ebow",
  },
  {
    index: "03",
    title: "The Spider Awards",
    org: "Spider Awards",
    category: "Ebow",
  },
  {
    index: "04",
    title: "Best Website",
    org: "Irish Digital Media Awards",
    category: "Ebow",
  },
  {
    index: "05",
    title: "Best in Government & Not for Profit",
    org: "Irish Digital Media Awards",
    category: "Ebow",
  },
  {
    index: "06",
    title: "Honors",
    org: "Awwwards",
    category: "Benoît Nihant",
  },
  {
    index: "07",
    title: "UI Design, UX Design & Innovation",
    org: "CSS Design Awards",
    category: "Benoît Nihant",
  },
  {
    index: "08",
    title: "Webpick of the Day",
    org: "Communication Arts",
    category: "Benoît Nihant",
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
          Recognition tied to projects I contributed to
        </p>
      </div>

      <ul className="px-4 md:px-6">
        {awards.map((award) => (
          <li key={award.index} className="relative">
            <div className="grid grid-cols-[48px_1fr] items-center gap-x-8 border-b border-[var(--line)] py-7 transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--ink)_4%,transparent)] lg:grid-cols-[48px_120px_1fr_160px]">

              <span className="font-mono text-[11px] tracking-[0.16em] text-[var(--muted)]">
                {award.index}
              </span>

              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] lg:block">
                {award.category}
              </span>

              <h3 className="text-[clamp(20px,2.8vw,44px)] font-semibold leading-[1.05] tracking-[-0.03em]">
                {award.title}
              </h3>

              <span className="hidden text-right font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] lg:block">
                {award.org}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
