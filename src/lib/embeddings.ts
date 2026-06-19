const OPENAI_EMBEDDING_MODEL = "text-embedding-3-small"
const OPENAI_EMBEDDINGS_URL = "https://api.openai.com/v1/embeddings"

export async function createEmbedding(text: string): Promise<number[] | null> {
  const apiKey = process.env.OPENAI_API_KEY
  const input = text.trim().slice(0, 8000)

  if (!apiKey || !input) {
    return null
  }

  try {
    const response = await fetch(OPENAI_EMBEDDINGS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: OPENAI_EMBEDDING_MODEL, input }),
    })

    if (!response.ok) {
      console.error("OpenAI embeddings error:", response.status, await response.text())
      return null
    }

    const json = await response.json()
    const embedding = json?.data?.[0]?.embedding

    return Array.isArray(embedding) ? embedding : null
  } catch (error) {
    console.error("OpenAI embeddings request failed:", error)
    return null
  }
}
