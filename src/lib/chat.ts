import type { BlogArticle } from "@/types"

const OPENAI_CHAT_MODEL = "gpt-4o-mini"
const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions"

function buildArticleContext(article: BlogArticle) {
  const body = article.sections
    .map((section) => `${section.title}\n${section.body.join("\n")}`)
    .join("\n\n")

  return `${article.title}\n${article.intro}\n\n${body}`
}

function buildMessages(question: string, articles: BlogArticle[]) {
  const context = articles
    .map((article, index) => `[${index + 1}] ${buildArticleContext(article)}`)
    .join("\n\n---\n\n")

  return [
    {
      role: "system",
      content:
        "You answer questions about a personal blog using only the full post content given to you below. " +
        "Be concise and direct — 2 to 3 sentences at most, with specifics from the posts, referring to posts by title, " +
        "and never invent information that isn't in the content. If the content doesn't answer the question, say so honestly in one sentence. " +
        "Reply in plain prose with no markdown formatting at all — no asterisks, no bold, no bullet lists, no headers.",
    },
    {
      role: "user",
      content: `Question: ${question}\n\nPost content:\n${context}`,
    },
  ]
}

export async function generateAnswer(
  question: string,
  articles: BlogArticle[]
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey || articles.length === 0) {
    return null
  }

  try {
    const response = await fetch(OPENAI_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_CHAT_MODEL,
        temperature: 0.3,
        max_tokens: 220,
        messages: buildMessages(question, articles),
      }),
    })

    if (!response.ok) {
      console.error("OpenAI chat error:", response.status, await response.text())
      return null
    }

    const json = await response.json()
    const content = json?.choices?.[0]?.message?.content
    return typeof content === "string" ? content.replace(/\*/g, "").trim() : null
  } catch (error) {
    console.error("OpenAI chat request failed:", error)
    return null
  }
}

export async function streamAnswer(
  question: string,
  articles: BlogArticle[]
): Promise<ReadableStream<Uint8Array> | null> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey || articles.length === 0) {
    return null
  }

  const response = await fetch(OPENAI_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_CHAT_MODEL,
      temperature: 0.3,
      stream: true,
      messages: buildMessages(question, articles),
    }),
  })

  if (!response.ok || !response.body) {
    console.error("OpenAI chat stream error:", response.status, await response.text().catch(() => ""))
    return null
  }

  const upstream = response.body
  const decoder = new TextDecoder()
  let buffer = ""

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.getReader()
      const encoder = new TextEncoder()

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() ?? ""

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith("data:")) continue

            const data = trimmed.slice(5).trim()
            if (data === "[DONE]") continue

            try {
              const json = JSON.parse(data)
              const delta = json?.choices?.[0]?.delta?.content
              if (typeof delta === "string" && delta.length > 0) {
                const cleaned = delta.replace(/\*/g, "")
                if (cleaned.length > 0) {
                  controller.enqueue(encoder.encode(JSON.stringify({ type: "token", value: cleaned }) + "\n"))
                }
              }
            } catch {
              // ignore malformed SSE chunks
            }
          }
        }
      } catch (error) {
        console.error("OpenAI chat stream read failed:", error)
      } finally {
        controller.close()
      }
    },
  })
}
