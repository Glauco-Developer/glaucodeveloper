// page.tsx é um Server Component por padrão no Next.js App Router.
// Ele apenas compõe as seções — cada seção é um componente separado,
// o que facilita manutenção e aprendizado independente de cada parte.

import { Hero } from "@/components/home/Hero"
import { HomeChrome } from "@/components/home/HomeChrome"
import { Projects } from "@/components/home/Projects"
import { Technologies } from "@/components/home/Technologies"
import { Blog } from "@/components/home/Blog"
import { About } from "@/components/home/About"
import { CallToAction } from "@/components/home/CallToAction"
import { getHomePosts } from "@/lib/supabase/queries"

export default async function HomePage() {
  const posts = await getHomePosts()

  return (
    <>
      <HomeChrome />
      <div className="wrap relative z-[2]">
        <Hero />
        <Technologies />
        <About />
        <Projects />
        <Blog posts={posts} />
        <CallToAction />
      </div>
    </>
  )
}
