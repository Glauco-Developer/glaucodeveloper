import type { BlogSection } from "@/types"

export const DEFAULT_COVER_TONE =
  "linear-gradient(135deg,#111827 0%,#09090b 58%,#404040 100%)"

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function formatBlogDate(value: string | null) {
  if (!value) {
    return "Draft"
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })
}

export function buildContentText(
  intro: string,
  sections: BlogSection[],
  meta?: { title?: string; excerpt?: string; tags?: string[] }
) {
  return [
    meta?.title,
    meta?.excerpt,
    intro,
    ...sections.map((section) => [section.title, ...section.body].join(" ")),
    meta?.tags?.join(" "),
  ]
    .filter(Boolean)
    .join(" ")
}

export function parseSections(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return []
    }

    const title = "title" in item && typeof item.title === "string" ? item.title.trim() : ""
    const bodyValue = "body" in item ? item.body : []

    if (!title || !Array.isArray(bodyValue)) {
      return []
    }

    const body = bodyValue
      .filter((paragraph): paragraph is string => typeof paragraph === "string")
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)

    if (body.length === 0) {
      return []
    }

    return [{ title, body }]
  })
}

export function parseCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

export function parseSectionsInput(value: string) {
  try {
    return parseSections(JSON.parse(value))
  } catch {
    return []
  }
}
