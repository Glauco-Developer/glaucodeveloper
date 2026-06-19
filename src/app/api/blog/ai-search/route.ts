import { NextResponse } from "next/server"
import { streamAnswer } from "@/lib/chat"
import { createEmbedding } from "@/lib/embeddings"
import { searchPostsByEmbedding } from "@/lib/supabase/queries"
import type { BlogArticle } from "@/types"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const query = typeof body?.query === "string" ? body.query.trim() : ""

  if (!query) {
    return NextResponse.json({ error: "Please enter a search query." }, { status: 400 })
  }

  const embedding = await createEmbedding(query)

  if (!embedding) {
    return NextResponse.json(
      { error: "AI search is unavailable right now. Try the regular search." },
      { status: 503 }
    )
  }

  const articles = await searchPostsByEmbedding(embedding)
  const answerStream = await streamAnswer(query, articles)

  return new Response(buildResponseStream(articles, answerStream), {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  })
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
