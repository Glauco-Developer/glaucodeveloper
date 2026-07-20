"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { Sparkles, Search, Wand2 } from "lucide-react"
import { formatBlogDate } from "@/lib/blog"
import type { BlogArticle } from "@/types"

type SortMode = "latest" | "reading" | "title"

const AI_SUGGESTION_LIMIT = 5

function isSuggestionWorthyArticle(article: BlogArticle) {
  const title = article.title.trim().toLowerCase()
  const excerpt = article.excerpt.trim().toLowerCase()

  return title.length > 8 && title !== "test" && excerpt !== "test"
}

function buildSuggestionLabel(article: BlogArticle) {
  const title = article.title.toLowerCase()
  const tags = article.tags.map((tag) => tag.toLowerCase())

  if (title.includes("rag")) {
    return "RAG with Next.js and Supabase"
  }

  if (title.includes("semantic search")) {
    return "Semantic search with Supabase embeddings"
  }

  if (title.includes("full-text search")) {
    return "Full-text search in Supabase with Postgres"
  }

  if (title.includes("server actions")) {
    return "Next.js Server Actions CRUD with Supabase"
  }

  if (title.includes("server components") && title.includes("client components")) {
    return "Server vs Client Components in Next.js"
  }

  if (title.includes("dark mode") && tags.includes("react")) {
    return "Dark mode with React Context and CSS variables"
  }

  if (title.includes("dark mode") || tags.includes("dark mode")) {
    return "Dark mode with CSS variables"
  }

  if (title.includes("typescript")) {
    return "TypeScript types for real projects"
  }

  if (title.includes("tailwind")) {
    return "Tailwind CSS patterns that scale"
  }

  if (title.includes("wordpress") && title.includes("docker")) {
    return "Running WordPress with Docker locally"
  }

  if (title.includes("wordpress.org") || tags.includes("wordpress plugin")) {
    return "WordPress plugin launch lessons from All DashAI"
  }

  if (title.includes("supabase") && title.includes("cms")) {
    return "Why this blog moved from static files to Supabase"
  }

  return article.title
}

function getSuggestionPriority(article: BlogArticle) {
  const title = article.title.toLowerCase()

  if (title.includes("rag")) return 100
  if (title.includes("semantic search")) return 95
  if (title.includes("server actions")) return 90
  if (title.includes("server components") && title.includes("client components")) return 85
  if (title.includes("dark mode")) return 80
  if (title.includes("typescript")) return 75
  if (title.includes("full-text search")) return 70
  if (title.includes("tailwind")) return 65
  if (title.includes("wordpress") && title.includes("docker")) return 60
  if (title.includes("wordpress.org")) return 55
  if (title.includes("supabase") && title.includes("cms")) return 50

  return 10
}

function buildAiSuggestions(articles: BlogArticle[]) {
  const suggestions = new Set<string>()
  const rankedArticles = [...articles]
    .filter(isSuggestionWorthyArticle)
    .sort((left, right) => getSuggestionPriority(right) - getSuggestionPriority(left))

  for (const article of rankedArticles) {
    suggestions.add(buildSuggestionLabel(article))

    if (suggestions.size >= AI_SUGGESTION_LIMIT) {
      break
    }
  }

  return Array.from(suggestions)
}

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
  const [aiArticles, setAiArticles] = useState<BlogArticle[] | null>(null)
  const [aiAnswer, setAiAnswer] = useState<string | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  const [isAiSearching, setIsAiSearching] = useState(false)
  const [isAiStreaming, setIsAiStreaming] = useState(false)
  const [isPending, startTransition] = useTransition()
  const abortRef = useRef<AbortController | null>(null)
  const pendingTextRef = useRef("")
  const networkDoneRef = useRef(true)
  const revealTimerRef = useRef<number | null>(null)
  const featured = articles.find((article) => article.featured) ?? articles[0] ?? null

  function stopReveal() {
    if (revealTimerRef.current !== null) {
      window.clearInterval(revealTimerRef.current)
      revealTimerRef.current = null
    }
  }

  function startReveal() {
    if (revealTimerRef.current !== null) return
    revealTimerRef.current = window.setInterval(() => {
      if (pendingTextRef.current.length > 0) {
        const chunk = pendingTextRef.current.slice(0, 2)
        pendingTextRef.current = pendingTextRef.current.slice(2)
        setAiAnswer((current) => (current ?? "") + chunk)
      } else if (networkDoneRef.current) {
        setIsAiStreaming(false)
        stopReveal()
      }
    }, 20)
  }

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      stopReveal()
    }
  }, [])

  const filteredArticles = useMemo(() => {
    if (isAiMode) return isAiSearching ? [] : aiArticles ?? articles

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

      return getPublishedTime(right.publishedAt) - getPublishedTime(left.publishedAt)
    })
  }, [articles, category, query, sortMode, isAiMode, aiArticles, isAiSearching])

  const aiSuggestions = useMemo(() => buildAiSuggestions(articles), [articles])

  const runAiSearch = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    stopReveal()
    pendingTextRef.current = ""
    networkDoneRef.current = false

    setIsAiSearching(true)
    setIsAiStreaming(false)
    setAiError(null)
    setAiArticles(null)
    setAiAnswer(null)

    try {
      const response = await fetch("/api/blog/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        setAiError(payload?.error ?? "AI search is unavailable right now.")
        return
      }

      if (!response.body) {
        setAiError("AI search is unavailable right now. Try the regular search.")
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let answerStarted = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          if (!line.trim()) continue
          const event = JSON.parse(line) as
            | { type: "articles"; articles: BlogArticle[] }
            | { type: "token"; value: string }
            | { type: "done" }

          if (event.type === "articles") {
            setIsAiSearching(false)
            setAiArticles(event.articles)
          } else if (event.type === "token") {
            if (!answerStarted) {
              answerStarted = true
              setAiAnswer("")
              setIsAiStreaming(true)
            }
            pendingTextRef.current += event.value
            startReveal()
          }
        }
      }

      networkDoneRef.current = true
    } catch (error) {
      networkDoneRef.current = true
      if ((error as Error)?.name === "AbortError") return
      setAiError("AI search is unavailable right now. Try the regular search.")
    } finally {
      setIsAiSearching(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    setQuery(suggestion)
    void runAiSearch(suggestion)
  }

  const aiTipText =
    aiSuggestions.length >= 2
      ? `Try searching for "${aiSuggestions[0]}" or "${aiSuggestions[1]}".`
      : 'Try searching for "RAG with Next.js and Supabase".'

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isAiMode) {
      setQuery(inputValue)
      void runAiSearch(inputValue)
      return
    }

    startTransition(() => {
      setQuery(inputValue)
    })
  }

  const toggleAiMode = () => {
    abortRef.current?.abort()
    stopReveal()
    setIsAiMode((current) => !current)
    setAiArticles(null)
    setAiAnswer(null)
    setAiError(null)
    setIsAiSearching(false)
    setIsAiStreaming(false)
    setInputValue("")
    setQuery("")
  }

  if (!featured) {
    return (
      <div className="mx-auto max-w-[1600px] px-[4vw] pb-[120px] pt-[140px]">
        <section className="rounded-[28px] border border-[var(--line)] bg-[var(--card)] px-8 py-16 text-center">
          <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-[var(--muted)]">
            Dev Notes
          </p>
          <h1 className="mt-5 text-[clamp(34px,6vw,72px)] font-semibold leading-[0.94] tracking-[-0.05em]">
            Nenhum artigo publicado ainda.
          </h1>
          <p className="mx-auto mt-4 max-w-[44ch] text-[16px] leading-8 text-[var(--muted)]">
            Crie categorias e publique seu primeiro post no admin para alimentar esta pagina.
          </p>
        </section>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1600px] px-[4vw] pb-[120px] pt-[140px]">

      {/* ── Hero header ───────────────────────────────────────────── */}
      <section className="animate-fade-up grid gap-10 border-b border-[var(--line)] pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-[var(--muted)]">
            Dev Notes / Interface thinking
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
            <div className="relative h-40 w-full overflow-hidden rounded-[18px]">
              <Image
                src={featured.coverImageUrl}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="mt-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
              <span>{featured.category}</span>
              <span>{featured.readTime}</span>
            </div>
            <h2 className="mt-4 text-[26px] font-semibold leading-[1.18] tracking-[-0.04em]">
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
                onClick={toggleAiMode}
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

            {/* AI tip or error — fades in/out via CSS transition */}
            {isAiMode && (
              <p
                className={`px-1 text-[11px] leading-relaxed ${
                  aiError ? "text-red-500" : "text-[var(--muted)]"
                }`}
              >
                {aiError ?? (
                  <>
                    <span className="font-medium italic text-violet-500">Tip:</span>{" "}
                    {aiTipText}
                  </>
                )}
              </p>
            )}
          </div>

          {/* Categories or AI Suggestions — swapped via conditional rendering */}
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
                    className="group flex items-start gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-2 text-left transition-all duration-300 hover:border-violet-500/50 hover:bg-violet-500/10"
                  >
                    <Sparkles
                      size={10}
                      className="mt-0.5 shrink-0 text-violet-500 opacity-50 group-hover:opacity-100"
                    />
                    <span className="text-left font-mono text-[11px] tracking-tight text-[var(--muted)] group-hover:text-violet-400">
                      {suggestion}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort — doesn't apply to AI-ranked results */}
          {!isAiMode && (
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
          )}
        </aside>

        {/* ── Article grid ────────────────────────────────────────── */}
        <div>
          <div className="mb-8 flex items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
              {filteredArticles.length} article{filteredArticles.length === 1 ? "" : "s"}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
              {isPending || isAiSearching
                ? "Updating..."
                : isAiMode
                  ? "AI-powered results"
                  : "Curated selection"}
            </p>
          </div>

          {isAiMode ? (
            <>
              {(isAiSearching || aiAnswer !== null) && (
                <div className="mb-8 rounded-[18px] border border-violet-500/20 bg-violet-500/5 p-6">
                  <div className="mb-3 flex items-center gap-2 text-violet-500">
                    <Sparkles size={14} className={isAiSearching || isAiStreaming ? "animate-pulse" : ""} />
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em]">
                      AI answer
                    </span>
                  </div>

                  {!aiAnswer ? (
                    <div className="space-y-2">
                      <div className="animate-shimmer h-4 w-full rounded-full bg-[var(--line)]/30" />
                      <div className="animate-shimmer h-4 w-5/6 rounded-full bg-[var(--line)]/30" />
                      <div className="animate-shimmer h-4 w-2/3 rounded-full bg-[var(--line)]/30" />
                    </div>
                  ) : (
                    <p className="text-[17px] leading-[1.85] text-[var(--ink)]">
                      {aiAnswer}
                      {isAiStreaming && (
                        <span className="ml-0.5 inline-block h-4 w-[2px] -translate-y-[2px] animate-pulse bg-violet-400" />
                      )}
                    </p>
                  )}

                  {!isAiStreaming && aiArticles && aiArticles.length > 0 && (
                    <div className="animate-fade-in-up mt-6 border-t border-violet-500/10 pt-5">
                      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                        Sources
                      </p>
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {aiArticles.map((article) => (
                          <Link
                            key={article.id}
                            href={article.href}
                            className="group flex items-center gap-3 overflow-hidden rounded-[14px] border border-violet-500/15 bg-[var(--card)] p-2.5 transition-all duration-300 hover:border-violet-500/50 hover:bg-violet-500/5"
                          >
                            <Image
                              src={article.coverImageUrl}
                              alt={article.title}
                              width={48}
                              height={48}
                              className="h-12 w-12 shrink-0 rounded-[10px] object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[13px] font-medium text-[var(--ink)] transition-colors duration-300 group-hover:text-violet-400">
                                {article.title}
                              </p>
                              <div className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                                <span className="truncate">{article.category}</span>
                                <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-[var(--muted)]/50" />
                                <span className="shrink-0">{article.readTime}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!isAiSearching && aiArticles !== null && aiArticles.length === 0 && (
                <div className="rounded-[18px] border border-violet-500/20 bg-violet-500/5 p-10 text-center">
                  <Sparkles size={18} className="mx-auto text-violet-500/60" />
                  <p className="mt-4 text-[15px] text-[var(--muted)]">
                    No relevant posts found for that question.
                  </p>
                </div>
              )}
            </>
          ) : isPending ? (
            <div className="grid gap-6 xl:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="relative h-full overflow-hidden rounded-[22px] border border-[var(--line)] bg-[var(--card)] p-6"
                >
                  <div className="animate-shimmer h-48 rounded-[18px] bg-[var(--line)]/40" />
                  <div className="animate-shimmer mt-5 h-3 w-1/3 rounded-full bg-[var(--line)]/40" />
                  <div className="animate-shimmer mt-4 h-7 w-3/4 rounded-full bg-[var(--line)]/40" />
                  <div className="animate-shimmer mt-4 h-4 w-full rounded-full bg-[var(--line)]/30" />
                  <div className="animate-shimmer mt-2 h-4 w-2/3 rounded-full bg-[var(--line)]/30" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-2">
              {filteredArticles.map((article) => (
                <Link key={article.id} href={article.href} className="group relative">
                  <div className="relative h-full overflow-hidden rounded-[22px] border border-[var(--line)] bg-[var(--card)] p-6 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:border-[var(--ink)]">
                    {/* Sweep on hover */}
                    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full" />
                    </div>

                    <div className="relative z-10 flex h-full flex-col">
                      {/* Cover zoom via CSS */}
                      <div className="relative h-48 w-full overflow-hidden rounded-[18px]">
                        <Image
                          src={article.coverImageUrl}
                          alt={article.title}
                          fill
                          sizes="(max-width: 1280px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.02]"
                        />
                      </div>

                      <div className="mt-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                        <span>{article.category}</span>
                        <span>{formatBlogDate(article.publishedAt)}</span>
                      </div>

                      <h2 className="mt-4 text-[30px] font-semibold leading-[1.28] tracking-[-0.04em] text-[var(--ink)] transition-all duration-500 group-hover:translate-x-1">
                        {article.title}
                      </h2>

                      <p className="mt-4 flex-1 text-[15px] leading-[2.1] text-[var(--muted)] transition-colors duration-500">
                        {article.excerpt}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] transition-all duration-500 group-hover:border-[var(--ink)] group-hover:text-[var(--ink)]"
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
          )}
        </div>
      </section>
    </div>
  )
}

function getPublishedTime(value: string | null) {
  return value ? new Date(value).getTime() : 0
}
