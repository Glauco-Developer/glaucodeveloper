import Link from "next/link"
import Image from "next/image"
import type { BlogArticle } from "@/types"
import { formatBlogDate } from "@/lib/blog"

export function Blog({ posts }: { posts: BlogArticle[] }) {
  if (posts.length === 0) {
    return (
      <section id="blog" className="px-[4vw] py-[130px]">
        <div className="mx-auto max-w-[1600px]">
          <div className="animate-fade-up mb-10 flex flex-wrap items-end justify-between gap-[18px]">
            <h2 className="text-[clamp(34px,5.5vw,72px)] font-semibold leading-[0.95] tracking-[-0.03em]">
            Thoughts on web development
            </h2>
            <div className="flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[1.5px] text-(--muted)">
              <b className="font-medium text-(--ink)">04</b> / Dev Notes
            </div>
          </div>

          <div className="rounded-[24px] border border-(--line) bg-[color-mix(in_srgb,var(--card)_88%,transparent)] px-8 py-12 text-center">
            <p className="text-[15px] text-(--muted)">
              Nenhum post publicado ainda. Quando voce publicar o primeiro no admin,
              ele aparece aqui.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="blog" className="px-[4vw] py-[130px]">
      <div className="mx-auto max-w-[1600px]">

        <div className="animate-fade-up mb-10 flex flex-wrap items-end justify-between gap-[18px]">
          <h2 className="text-[clamp(34px,5.5vw,72px)] font-semibold leading-[0.95] tracking-[-0.03em]">
          Building for the Web
          </h2>
          <div className="flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[1.5px] text-(--muted)">
            <b className="font-medium text-(--ink)">04</b> / Dev Notes
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {posts.map((article, index) => (
            <Link
              key={article.id}
              href={article.href}
              className="contents"
            >
              <div
                className="animate-fade-up group flex flex-col overflow-hidden rounded-[18px] border border-(--line) bg-[color-mix(in_srgb,var(--card)_88%,transparent)] transition-all duration-500 hover:border-(--ink) hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-interactive="true"
              >
                <div className="relative h-[160px] w-full shrink-0 overflow-hidden">
                  <Image
                    src={article.coverImageUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-[filter,transform] duration-700 group-hover:brightness-110 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-(--muted)">
                    <span>{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="mt-5 text-[22px] font-semibold leading-[1.22] tracking-[-0.03em] text-(--ink) transition-colors duration-300">
                    {article.title}
                  </h3>

                  <p className="mt-4 flex-1 text-[14px] leading-[1.9] text-(--muted)">
                    {article.excerpt}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-(--line) pt-5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-(--muted)">
                      {formatBlogDate(article.publishedAt)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-(--line) px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-(--muted) transition-[background-color,color,border-color] duration-300 group-hover:border-(--ink) group-hover:bg-(--ink) group-hover:text-(--inv-ink)">
                      Read
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                        <path d="M1 8L8 1M8 1H2.5M8 1V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
