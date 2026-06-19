'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { slugify } from "@/lib/blog"
import { getAdminActionClient } from "@/lib/supabase/admin"

export type CategoryActionState = {
  error?: string
}

export async function createCategory(
  _state: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  const { supabase } = await getAdminActionClient()
  const values = getCategoryValues(formData)

  if ("error" in values) {
    return { error: values.error }
  }

  const { data, error } = await supabase
    .from("blog_categories")
    .insert(values.data)
    .select("id")
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidateAdmin()
  redirect(`/admin/categories/${data.id}`)
}

export async function updateCategory(
  id: string,
  _state: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  const { supabase } = await getAdminActionClient()
  const values = getCategoryValues(formData)

  if ("error" in values) {
    return { error: values.error }
  }

  const { error } = await supabase
    .from("blog_categories")
    .update(values.data)
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidateAdmin()
  redirect(`/admin/categories/${id}`)
}

export async function deleteCategory(id: string) {
  const { supabase } = await getAdminActionClient()
  const { error } = await supabase
    .from("blog_categories")
    .delete()
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidateAdmin()
  redirect("/admin")
}

function getCategoryValues(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  const rawSlug = String(formData.get("slug") ?? "").trim()

  if (!name) {
    return { error: "Informe o nome da categoria." }
  }

  const slug = slugify(rawSlug || name)

  if (!slug) {
    return { error: "Nao foi possivel gerar um slug valido para a categoria." }
  }

  return {
    data: {
      name,
      slug,
    },
  }
}

function revalidateAdmin() {
  revalidatePath("/")
  revalidatePath("/blog")
  revalidatePath("/admin")
}
