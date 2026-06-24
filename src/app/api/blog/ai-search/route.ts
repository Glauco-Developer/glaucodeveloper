import { NextResponse } from "next/server"
import { streamAnswer } from "@/lib/chat"
import { createEmbedding } from "@/lib/embeddings"
import { searchPostsByEmbedding, searchPostsByKeyword } from "@/lib/supabase/queries"
import type { BlogArticle } from "@/types"

const AI_SEARCH_LIMIT = 6
const MIN_SEMANTIC_RESULTS = 3

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const query = typeof body?.query === "string" ? body.query.trim() : ""

  if (!query) {
    return NextResponse.json({ error: "Please enter a search query." }, { status: 400 })
  }

  const embedding = await createEmbedding(query)
  const semanticArticles = embedding
    ? await searchPostsByEmbedding(embedding, AI_SEARCH_LIMIT)
    : []
  const keywordArticles =
    semanticArticles.length >= MIN_SEMANTIC_RESULTS
      ? []
      : await searchPostsByKeyword(query, AI_SEARCH_LIMIT)
  const articles = mergeArticles(semanticArticles, keywordArticles).slice(0, AI_SEARCH_LIMIT)
  const answerStream = await streamAnswer(query, articles)

  return new Response(buildResponseStream(articles, answerStream), {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  })
}

function mergeArticles(primary: BlogArticle[], secondary: BlogArticle[]) {
  const seen = new Set<string>()
  const merged: BlogArticle[] = []

  for (const article of [...primary, ...secondary]) {
    if (seen.has(article.id)) continue
    seen.add(article.id)
    merged.push(article)
  }

  return merged
}

function buildResponseStream(
  articles: BlogArticle[],
  answerStream: ReadableStream<Uint8Array> | null
) {
  const encoder = new TextEncoder()

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(encoder.encode(JSON.stringify({ type: "articles", articles }) + "\n"))

      if (answerStream) {
        const reader = answerStream.getReader()

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            controller.enqueue(value)
          }
        } catch (error) {
          console.error("AI search stream forwarding failed:", error)
        }
      }

      controller.enqueue(encoder.encode(JSON.stringify({ type: "done" }) + "\n"))
      controller.close()
    },
  })
}
