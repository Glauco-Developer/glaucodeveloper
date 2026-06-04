"use client"

import { motion } from "framer-motion"

const principles = [
  {
    title: "Interface direction",
    text: "I use layout, type, contrast and pacing to make a product look authored, not merely assembled.",
  },
  {
    title: "System thinking",
    text: "Components, states and motion patterns are designed to hold up under scale, not just the first screen.",
  },
  {
    title: "Readable engineering",
    text: "The code should be as intentional as the UI, with structure that survives the next feature wave.",
  },
]

const timeline = [
  {
    year: "2018—2026",
    title: "Senior Engineer at Ebow Digital",
    text: "Led front-end development for major projects in Ireland, including The Spider Awards and content featured in The Guardian and NYT.",
  },
  {
    year: "2017—2018",
    title: "Front-end Developer at Perverte",
    text: "Developed award-winning immersive experiences, including Benoît Nihant, recognized by Awwwards and Communication Arts.",
  },
  {
    year: "2008—2013",
    title: "Founder & Developer at Simbweb",
    text: "Started my journey by founding a digital agency, managing full-stack development and business administration for over 5 years.",
  },
]

export function AboutTimeline() {
  return (
    <section className="grid gap-12 border-b border-[var(--line)] pb-16 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-[var(--muted)]">
          Timeline
        </p>
        <h2 className="mt-5 text-[clamp(34px,4.5vw,64px)] font-semibold leading-[0.95] tracking-[-0.05em]">
          A front-end path shaped by product, pacing and presentation.
        </h2>
      </div>

      <div className="space-y-8">
        {timeline.map((item, index) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: index * 0.08 }}
            className="grid gap-4 border-t border-[var(--line)] pt-6 md:grid-cols-[90px_1fr]"
          >
            <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--muted)]">
              {item.year}
            </div>
            <div>
              <h3 className="text-[24px] font-semibold tracking-[-0.03em]">
                {item.title}
              </h3>
              <p className="mt-3 max-w-[44ch] text-[15px] leading-7 text-[var(--muted)]">
                {item.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export function AboutPrinciples() {
  return (
    <section className="mt-16 grid gap-6 lg:grid-cols-3">
      {principles.map((item, index) => (
        <motion.article
          key={item.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: index * 0.08 }}
          className="group rounded-[22px] border border-[var(--line)] bg-[color:color-mix(in_srgb,var(--card)_88%,transparent)] p-7 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1.5"
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
            0{index + 1}
          </div>
          <h3 className="mt-6 text-[28px] font-semibold tracking-[-0.04em]">
            {item.title}
          </h3>
          <p className="mt-4 text-[15px] leading-7 text-[var(--muted)]">
            {item.text}
          </p>
        </motion.article>
      ))}
    </section>
  )
}
