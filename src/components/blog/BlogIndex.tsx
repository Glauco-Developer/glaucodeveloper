"use client"

import Link from "next/link"
import { useDeferredValue, useMemo, useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [sortMode, setSortMode] = useState<SortMode>("latest")
  const [isAiMode, setIsAiMode] = useState(false)
  const [isPending, startTransition] = useTransition()
  const deferredQuery = useDeferredValue(query)

  const filteredArticles = useMemo(() => {
    if (isAiMode) return articles // In a real scenario, this would be handled by the AI logic

    const normalizedQuery = deferredQuery.trim().toLowerCase()
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
  }, [articles, category, deferredQuery, sortMode, isAiMode])

  const featured = articles.find((article) => article.featured) ?? articles[0]

  const aiSuggestions = [
    "Modern web design trends",
    "Frontend optimization tips",
    "DARK UI design systems",
    "Motion in product design",
    "Interface craft techniques"
  ]

  const handleSuggestionClick = (suggestion: string) => {
    startTransition(() => {
      setQuery(suggestion)
    })
  }

  return (
    <div className="mx-auto max-w-[1600px] px-[4vw] pb-[120px] pt-[140px]">
      <section className="grid gap-10 border-b border-[var(--line)] pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
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

      <section className="mt-12 grid gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                Search
              </label>
              
              {/* AI Toggle Button */}
              <button 
                onClick={() => setIsAiMode(!isAiMode)}
                className={`group relative flex items-center gap-2 rounded-full px-3 py-1 transition-all duration-500 ${
                  isAiMode 
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]" 
                  : "bg-[var(--line)]/30 text-[var(--muted)] hover:bg-[var(--line)]/50"
                }`}
              >
                <div className="relative flex h-3 w-3 items-center justify-center">
                  <Sparkles size={12} className={`${isAiMode ? "animate-pulse" : ""}`} />
                  {isAiMode && (
                    <motion.div 
                      layoutId="sparkle-glow"
                      className="absolute inset-0 rounded-full bg-white/40 blur-[4px]"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1.5 }}
                      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    />
                  )}
                </div>
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.1em]">AI Search</span>
              </button>
            </div>

            <div className={`relative overflow-hidden rounded-[18px] border transition-all duration-500 ${
              isAiMode 
              ? "border-violet-500/50 bg-violet-500/5 shadow-[0_0_20px_rgba(124,58,237,0.05)]" 
              : "border-[var(--line)] bg-[color:color-mix(in_srgb,var(--card)_82%,transparent)]"
            }`}>
              {/* Animated Gradient Border for AI Mode */}
              <AnimatePresence>
                {isAiMode && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 -z-10 bg-gradient-to-r from-violet-500/10 via-transparent to-indigo-500/10"
                  />
                )}
              </AnimatePresence>

              <div className="flex items-center px-4 py-3">
                <div className={`mr-3 transition-colors duration-300 ${isAiMode ? "text-violet-500" : "text-[var(--muted)]"}`}>
                  {isAiMode ? <Wand2 size={16} /> : <Search size={16} />}
                </div>
                <input
                  value={query}
                  onChange={(event) => {
                    const nextValue = event.target.value
                    startTransition(() => setQuery(nextValue))
                  }}
                  placeholder={isAiMode ? "Ask AI anything about the blog..." : "Search title, tags or topic"}
                  className="w-full bg-transparent text-[15px] outline-none placeholder:text-[var(--muted)]/60"
                />
              </div>
            </div>

            {/* AI Mode Tip */}
            <AnimatePresence>
              {isAiMode && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="px-1 text-[11px] leading-relaxed text-[var(--muted)]"
                >
                  <span className="text-violet-500 font-medium italic">Tip:</span> Try searching for &quot;modern web design trends&quot; or &quot;frontend optimization tips&quot;.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {!isAiMode ? (
              <motion.div 
                key="categories"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3"
              >
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
              </motion.div>
            ) : (
              <motion.div 
                key="ai-suggestions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet-500/80">
                  AI Suggestions
                </p>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="group relative flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-2 text-left transition-all duration-300 hover:border-violet-500/50 hover:bg-violet-500/10"
                    >
                      <Sparkles size={10} className="text-violet-500 opacity-50 group-hover:opacity-100" />
                      <span className="font-mono text-[11px] tracking-tight text-[var(--muted)] group-hover:text-violet-400">
                        {suggestion}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                    onClick={() => startTransition(() => setSortMode(item.key as SortMode))}
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
              <Link
                key={article.id}
                href={article.href}
                className="group relative"
              >
                <div className={`relative h-full overflow-hidden rounded-[22px] border p-6 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
                  isAiMode 
                  ? "border-violet-500/20 bg-[#0a0a0c] hover:border-violet-500/50 shadow-[inset_0_0_20px_rgba(124,58,237,0.02)]" 
                  : "border-[var(--line)] bg-[var(--card)] hover:border-[var(--ink)]"
                }`}>
                  {/* Elegant Gradient Sweep on Hover */}
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent translate-x-[-100%] transition-transform duration-1000 ease-in-out group-hover:translate-x-[100%]" />
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="overflow-hidden rounded-[18px]">
                      <motion.div
                        className="h-48"
                        style={{ background: article.coverTone }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                    
                    <div className="mt-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                      <span>{article.category}</span>
                      <span>{article.publishedAt}</span>
                    </div>

                    <h2 className={`mt-4 text-[30px] font-semibold leading-[1.04] tracking-[-0.04em] transition-all duration-500 group-hover:translate-x-1 ${
                      isAiMode ? "text-white group-hover:text-white" : "text-[var(--ink)]"
                    }`}>
                      {article.title}
                    </h2>
                    
                    <p className={`mt-4 flex-1 text-[15px] leading-7 transition-colors duration-500 ${
                      isAiMode ? "text-zinc-400" : "text-[var(--muted)]"
                    }`}>
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

