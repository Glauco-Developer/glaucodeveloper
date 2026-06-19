'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { buildContentText, parseCommaList, parseSectionsInput, slugify } from "@/lib/blog"
import { createEmbedding } from "@/lib/embeddings"
import { getAdminActionClient } from "@/lib/supabase/admin"

export type PostActionState = {
  error?: string
}

export async function createPost(
  _state: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  const { supabase } = await getAdminActionClient()
  const values = getPostValues(formData)

  if ("error" in values) {
    return { error: values.error }
  }

  const embedding = await createEmbedding(values.data.content_text)

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ ...values.data, embedding })
    .select("id")
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidateBlog(values.data.slug)
  redirect(`/admin/posts/${data.id}`)
}

export async function updatePost(
  id: string,
  _state: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  const { supabase } = await getAdminActionClient()
  const values = getPostValues(formData)

  if ("error" in values) {
    return { error: values.error }
  }

  const embedding = await createEmbedding(values.data.content_text)

  const { error } = await supabase
    .from("blog_posts")
    .update(embedding ? { ...values.data, embedding } : values.data)
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidateBlog(values.data.slug)
  redirect(`/admin/posts/${id}`)
}

export async function deletePost(id: string, slug: string) {
  const { supabase } = await getAdminActionClient()
  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidateBlog(slug)
  redirect("/admin")
}

function getPostValues(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim()
  const rawSlug = String(formData.get("slug") ?? "").trim()
  const excerpt = String(formData.get("excerpt") ?? "").trim()
  const intro = String(formData.get("intro") ?? "").trim()
  const categoryId = String(formData.get("category_id") ?? "").trim()
  const readTime = String(formData.get("read_time") ?? "").trim()
  const coverTone = String(formData.get("cover_tone") ?? "").trim()
  const sections = parseSectionsInput(String(formData.get("sections") ?? "[]"))
  const tags = parseCommaList(String(formData.get("tags") ?? ""))

  if (!title || !excerpt || !intro || !categoryId || !readTime) {
    return { error: "Preencha os campos principais do post." }
  }

  if (sections.length === 0) {
    return { error: "Adicione pelo menos uma secao com titulo e texto." }
  }

  const slug = slugify(rawSlug || title)

  if (!slug) {
    return { error: "Nao foi possivel gerar um slug valido para o post." }
  }

  const published = formData.get("published") === "on"
  const existingPublishedAt = String(formData.get("existing_published_at") ?? "").trim()

  return {
    data: {
      slug,
      title,
      excerpt,
      intro,
      category_id: categoryId,
      tags,
      cover_tone: coverTone || undefined,
      sections,
      content_text: buildContentText(intro, sections, { title, excerpt, tags }),
      read_time: readTime,
      featured: formData.get("featured") === "on",
      published,
      published_at: published ? existingPublishedAt || new Date().toISOString() : null,
    },
  }
}

function revalidateBlog(slug: string) {
  revalidatePath("/")
  revalidatePath("/blog")
  revalidatePath(`/blog/${slug}`)
  revalidatePath("/admin")
}
