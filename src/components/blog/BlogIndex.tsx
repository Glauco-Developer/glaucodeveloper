"use client"

import Link from "next/link"
import { useMemo, useState, useTransition } from "react"
import { Sparkles, Search, Wand2 } from "lucide-react"
import type { BlogArticle } from "@/types"

type SortMode = "latest" | "reading" | "title"

export function BlogIndex({
  articles,
  categories,
}: {
  articles: BlogArticle[]
  categories: string[]
}) {
  const [inputValue, setInputValue] = useState("")
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [sortMode, setSortMode] = useState<SortMode>("latest")
  const [isAiMode, setIsAiMode] = useState(false)
  const [isPending, startTransition] = useTransition()

  const filteredArticles = useMemo(() => {
    if (isAiMode) return articles

    const normalizedQuery = query.trim().toLowerCase()
    const list = articles.filter((article) => {
      const matchesCategory = category === "All" || article.category === category
      const matchesQuery =
        normalizedQuery.length === 0 ||
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.excerpt.toLowerCase().includes(normalizedQuery) ||
        article.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))

      return matchesCategory && matchesQuery
    })

    return [...list].sort((left, right) => {
      if (sortMode === "title") {
        return left.title.localeCompare(right.title)
      }

      if (sortMode === "reading") {
        return Number.parseInt(right.readTime, 10) - Number.parseInt(left.readTime, 10)
      }

      return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
    })
  }, [articles, category, query, sortMode, isAiMode])

  const featured = articles.find((article) => article.featured) ?? articles[0]

  const aiSuggestions = [
    "Modern web design trends",
    "Frontend optimization tips",
    "DARK UI design systems",
    "Motion in product design",
    "Interface craft techniques",
  ]

  const handleSuggestionClick = (suggestion: string) => {
    startTransition(() => {
      setInputValue(suggestion)
      setQuery(suggestion)
    })
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    startTransition(() => {
      setQuery(inputValue)
    })
  }

  return (
    <div className="mx-auto max-w-[1600px] px-[4vw] pb-[120px] pt-[140px]">

      {/* ── Hero header ───────────────────────────────────────────── */}
      <section className="animate-fade-up grid gap-10 border-b border-[var(--line)] pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-[var(--muted)]">
            Journal / Interface thinking
          </p>
          <h1 className="mt-5 max-w-[12ch] text-[clamp(44px,7vw,108px)] font-semibold leading-[0.92] tracking-[-0.05em]">
            Writing that treats front-end like product design.
          </h1>
        </div>

        <div className="space-y-5">
          <p className="max-w-[44ch] text-[16px] leading-8 text-[var(--muted)]">
            Essays, build notes and interface breakdowns focused on motion, systems,
            dark UI, landing pages and product-facing front-end craft.
          </p>
          <Link
            href={featured.href}
            className="group block overflow-hidden rounded-[22px] border border-[var(--line)] bg-[var(--card)] p-6 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1"
          >
            <div
              className="h-40 rounded-[18px]"
              style={{ background: featured.coverTone }}
            />
            <div className="mt-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
              <span>{featured.category}</span>
              <span>{featured.readTime}</span>
            </div>
            <h2 className="mt-4 text-[26px] font-semibold leading-[1.05] tracking-[-0.04em]">
              {featured.title}
            </h2>
          </Link>
        </div>
      </section>

      {/* ── Sidebar + grid ────────────────────────────────────────── */}
      <section
        className="animate-fade-up mt-12 grid gap-10 lg:grid-cols-[280px_1fr]"
        style={{ animationDelay: "0.1s" }}
      >
        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">

          {/* Search */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                Search
              </label>

              {/* AI Toggle */}
              <button
                onClick={() => setIsAiMode(!isAiMode)}
                className={`relative flex items-center gap-2 rounded-full px-3 py-1 transition-all duration-500 ${
                  isAiMode
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                    : "bg-[var(--line)]/30 text-[var(--muted)] hover:bg-[var(--line)]/50"
                }`}
              >
                <div className="relative flex h-3 w-3 items-center justify-center">
                  <Sparkles size={12} className={isAiMode ? "animate-pulse" : ""} />
                  {isAiMode && (
                    <span className="absolute inset-0 rounded-full bg-white/40 blur-[4px] animate-pulse" />
                  )}
                </div>
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.1em]">
                  AI Search
                </span>
              </button>
            </div>

            <form
              onSubmit={handleSearchSubmit}
              className={`relative overflow-hidden rounded-[18px] border transition-all duration-500 ${
                isAiMode
                  ? "border-violet-500/50 bg-violet-500/5 shadow-[0_0_20px_rgba(124,58,237,0.05)]"
                  : "border-[var(--line)] bg-[color:color-mix(in_srgb,var(--card)_82%,transparent)]"
              }`}
            >
              {isAiMode && (
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-violet-500/10 via-transparent to-indigo-500/10" />
              )}

              <div className="flex items-center px-4 py-3">
                <div
                  className={`mr-3 transition-colors duration-300 ${
                    isAiMode ? "text-violet-500" : "text-[var(--muted)]"
                  }`}
                >
                  {isAiMode ? <Wand2 size={16} /> : <Search size={16} />}
                </div>
                <input
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder={
                    isAiMode
                      ? "Ask AI anything about the blog..."
                      : "Search title, tags or topic"
                  }
                  className="w-full bg-transparent text-[15px] outline-none placeholder:text-[var(--muted)]/60"
                />
                <button
                  type="submit"
                  aria-label={isAiMode ? "Submit AI search" : "Submit search"}
                  className={`ml-3 inline-flex h-9 shrink-0 items-center justify-center gap-2 px-1 transition-all duration-300 ${
                    isAiMode
                      ? "text-violet-400 hover:text-violet-300"
                      : "text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {isAiMode ? <Wand2 size={14} /> : <Search size={15} />}
                  {isAiMode && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em]">
                      Run
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* AI tip — aparece/desaparece com transição CSS */}
            {isAiMode && (
              <p className="px-1 text-[11px] leading-relaxed text-[var(--muted)]">
                <span className="font-medium italic text-violet-500">Tip:</span>{" "}
                Try searching for &quot;modern web design trends&quot; or &quot;frontend optimization tips&quot;.
              </p>
            )}
          </div>

          {/* Categories ou AI Suggestions — troca via renderização condicional */}
          {!isAiMode ? (
            <div className="space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => {
                  const active = item === category
                  return (
                    <button
                      key={item}
                      onClick={() => startTransition(() => setCategory(item))}
                      className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                        active
                          ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--inv-ink)]"
                          : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                      }`}
                    >
                      {item}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet-500/80">
                AI Suggestions
              </p>
              <div className="flex flex-wrap gap-2">
                {aiSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="group flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-2 transition-all duration-300 hover:border-violet-500/50 hover:bg-violet-500/10"
                  >
                    <Sparkles
                      size={10}
                      className="text-violet-500 opacity-50 group-hover:opacity-100"
                    />
                    <span className="font-mono text-[11px] tracking-tight text-[var(--muted)] group-hover:text-violet-400">
                      {suggestion}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort */}
          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
              Sort
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "latest", label: "Latest" },
                { key: "reading", label: "Longest read" },
                { key: "title", label: "A–Z" },
              ].map((item) => {
                const active = item.key === sortMode
                return (
                  <button
                    key={item.key}
                    onClick={() =>
                      startTransition(() => setSortMode(item.key as SortMode))
                    }
                    className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                      active
                        ? "border-[var(--ink)] text-[var(--ink)]"
                        : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        {/* ── Article grid ────────────────────────────────────────── */}
        <div>
          <div className="mb-8 flex items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
              {filteredArticles.length} article{filteredArticles.length === 1 ? "" : "s"}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
              {isPending ? "Updating..." : isAiMode ? "AI-powered results" : "Curated selection"}
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {filteredArticles.map((article) => (
              <Link key={article.id} href={article.href} className="group relative">
                <div
                  className={`relative h-full overflow-hidden rounded-[22px] border p-6 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
                    isAiMode
                      ? "border-violet-500/20 bg-[#0a0a0c] hover:border-violet-500/50 shadow-[inset_0_0_20px_rgba(124,58,237,0.02)]"
                      : "border-[var(--line)] bg-[var(--card)] hover:border-[var(--ink)]"
                  }`}
                >
                  {/* Sweep on hover */}
                  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full" />
                  </div>

                  <div className="relative z-10 flex h-full flex-col">
                    {/* Cover com zoom via CSS */}
                    <div className="overflow-hidden rounded-[18px]">
                      <div
                        className="h-48 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.02]"
                        style={{ background: article.coverTone }}
                      />
                    </div>

                    <div className="mt-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                      <span>{article.category}</span>
                      <span>{article.publishedAt}</span>
                    </div>

                    <h2
                      className={`mt-4 text-[30px] font-semibold leading-[1.04] tracking-[-0.04em] transition-all duration-500 group-hover:translate-x-1 ${
                        isAiMode ? "text-white" : "text-[var(--ink)]"
                      }`}
                    >
                      {article.title}
                    </h2>

                    <p
                      className={`mt-4 flex-1 text-[15px] leading-7 transition-colors duration-500 ${
                        isAiMode ? "text-zinc-400" : "text-[var(--muted)]"
                      }`}
                    >
                      {article.excerpt}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-500 ${
                            isAiMode
                              ? "border-violet-500/20 text-zinc-500 group-hover:border-violet-500/40 group-hover:text-violet-400"
                              : "border-[var(--line)] text-[var(--muted)] group-hover:border-[var(--ink)] group-hover:text-[var(--ink)]"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
