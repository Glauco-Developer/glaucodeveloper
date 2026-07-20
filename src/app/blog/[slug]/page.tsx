import Link from "next/link"
import { notFound } from "next/navigation"
import { formatBlogDate } from "@/lib/blog"
import { getPostBySlug } from "@/lib/supabase/queries"
import type { BlogArticle } from "@/types"

function wordCount(article: BlogArticle) {
  const text = [article.intro, ...article.sections.flatMap((s) => s.body)].join(" ")
  return Math.ceil(text.split(/\s+/).length / 10) * 10
}

export const dynamic = "force-dynamic"

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getPostBySlug(slug)
  if (!article) notFound()

  const words = wordCount(article)

  return (
    <article className="min-h-screen px-[4vw] pb-[140px] pt-[100px]">
      <div className="mx-auto max-w-[780px]">

        {/* ── Top bar ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-6 border-b border-[var(--line)] pb-6">
          <Link
            href="/blog"
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
          >
            ← All Posts / {article.category}
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
            {formatBlogDate(article.publishedAt)} / {article.readTime} / {words} words
          </span>
        </div>

        {/* ── Cover image ────────────────────────────────────────── */}
        <img
          src={article.coverImageUrl}
          alt={article.title}
          className="mt-10 w-full rounded-[22px] border border-[var(--line)] h-[280px] object-cover sm:h-[360px]"
        />

        {/* ── Title + intro ──────────────────────────────────────── */}
        <div className="mt-14">
          <h1 className="text-[clamp(42px,6.5vw,88px)] font-semibold leading-[0.96] tracking-[-0.05em]">
            {article.title}
          </h1>
          <p className="mt-7 text-[20px] leading-[1.7] text-[var(--muted)]">
            {article.intro}
          </p>
        </div>

        {/* ── TL;DR ──────────────────────────────────────────────── */}
        <div className="mt-14 border-l-2 border-[var(--accent,#8b5cf6)] pl-6">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em]" style={{ color: "var(--accent,#8b5cf6)" }}>
            TL;DR / Written for skimmers
          </p>
          <p className="text-[16px] leading-[1.8] text-[var(--muted)]">
            {article.sections.map((s) => s.body[0]).join(" ")}
          </p>
        </div>

        {/* ── Table of contents ──────────────────────────────────── */}
        <div className="mt-14 grid grid-cols-[auto_1fr] gap-x-10 gap-y-3 border-t border-[var(--line)] pt-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
            In / this post
          </span>
          <ol className="space-y-2">
            {article.sections.map((section, i) => (
              <li key={section.title} className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] tabular-nums text-[var(--muted)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <a
                  href={`#section-${i}`}
                  className="text-[15px] text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* ── Sections ───────────────────────────────────────────── */}
        <div className="mt-20 space-y-20">
          {article.sections.map((section, i) => (
            <section key={section.title} id={`section-${i}`}>
              <h2 className="text-[clamp(24px,3.2vw,42px)] font-semibold leading-[1.05] tracking-[-0.04em]">
                {section.title}
              </h2>

              <div className="mt-8 space-y-6 text-[17px] leading-[1.85] text-[var(--muted)]">
                {section.body.map((paragraph, pi) =>
                  pi === 0 && i === 0 ? (
                    // pull quote on the very first paragraph
                    <blockquote
                      key={paragraph}
                      className="border-l-2 border-[var(--ink)] pl-6 text-[21px] font-semibold leading-[1.5] tracking-[-0.02em] text-[var(--ink)]"
                    >
                      {paragraph}
                    </blockquote>
                  ) : (
                    <p key={paragraph}>{paragraph}</p>
                  )
                )}
              </div>
            </section>
          ))}
        </div>

        {/* ── Footer nav ─────────────────────────────────────────── */}
        <div className="mt-24 flex items-center justify-between border-t border-[var(--line)] pt-8">
          <Link
            href="/blog"
            className="font-mono text-[12px] uppercase tracking-[0.22em] text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
          >
            ← All Posts
          </Link>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </article>
  )
}
