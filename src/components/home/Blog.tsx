"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { blogArticles } from "@/data/blog"

export function Blog() {
  return (
    <section id="blog" className="px-[4vw] py-[130px]">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-[18px]">
          <h2 className="text-[clamp(34px,5.5vw,72px)] font-semibold leading-[0.95] tracking-[-0.03em]">
            Writing on interface craft
          </h2>
          <div className="flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[1.5px] text-(--muted)">
            <b className="font-medium text-(--ink)">04</b> / Blog
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid gap-6 lg:grid-cols-3"
        >
          {blogArticles.map((article) => (
            <Link
              key={article.id}
              href={article.href}
              className="contents"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                  },
                }}
                className="group flex flex-col overflow-hidden rounded-[18px] border border-(--line) bg-[color-mix(in_srgb,var(--card)_88%,transparent)] transition-all duration-500 ease-[0.16, 1, 0.3, 1] hover:border-(--ink) hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
                data-interactive="true"
              >
                <div
                  className="h-[160px] w-full shrink-0 transition-[filter,transform] duration-700 ease-[0.16, 1, 0.3, 1] group-hover:brightness-110 group-hover:scale-[1.02]"
                  style={{ background: article.coverTone }}
                />

                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-(--muted)">
                    <span>{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="mt-5 text-[22px] font-semibold leading-[1.1] tracking-[-0.03em] text-(--ink) transition-colors duration-300 group-hover:text-(--ink)">
                    {article.title}
                  </h3>

                  <p className="mt-4 flex-1 text-[14px] leading-[1.75] text-(--muted)">
                    {article.excerpt}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-(--line) pt-5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-(--muted)">
                      {article.publishedAt}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-(--line) px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-(--muted) transition-[background-color,color,border-color] duration-300 group-hover:border-(--ink) group-hover:bg-(--ink) group-hover:text-(--inv-ink)">
                      Read
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true" className="transition-transform duration-200">
                        <path d="M1 8L8 1M8 1H2.5M8 1V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
