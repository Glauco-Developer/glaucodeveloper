"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export function CallToAction() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="contact" className="px-[4vw] pb-[110px] pt-[150px] text-center">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-[46px] flex items-center justify-center gap-[10px] font-mono text-[12px] uppercase tracking-[1.5px] text-[var(--muted)]">
          <span className="h-px w-8 bg-[var(--line)]" />
          <b className="font-medium text-[var(--ink)]">05</b> / Contact
        </div>

        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-[clamp(36px,7vw,110px)] font-semibold leading-none tracking-[-0.04em]"
        >
          Let&apos;s build
          <br />
          something strong.
        </motion.h2>

        <motion.a
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          href="mailto:glauco.developer@gmail.com"
          className="cta-shape cta-shape-ghost inline-flex items-center justify-center rounded-[40px] px-8 py-5 font-mono text-[clamp(16px,2.4vw,22px)] text-[var(--ink)]"
          data-interactive="true"
        >
          <span className="cta-shape-fill" />
          <span className="relative z-[1]">glauco.developer@gmail.com</span>
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-[60px] flex flex-wrap justify-center gap-8"
        >
          {["GitHub", "LinkedIn", "Resume ↗"].map((label) => (
            <a
              key={label}
              href="#"
              className="font-mono text-[13px] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--ink)]"
              data-interactive="true"
            >
              {label}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
