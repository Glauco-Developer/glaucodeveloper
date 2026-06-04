import type { BlogArticle } from "@/types"

export const blogArticles: BlogArticle[] = [
  {
    id: "1",
    slug: "homepage-feel-shipped-not-assembled",
    title: "How I make a homepage feel shipped, not assembled",
    excerpt:
      "A breakdown of hierarchy, pacing, contrast and interaction choices that make a landing page feel deliberate from the first frame.",
    category: "Design Systems",
    readTime: "6 min read",
    publishedAt: "May 2026",
    featured: true,
    coverTone: "linear-gradient(135deg,#7f1d1d 0%,#18181b 52%,#111827 100%)",
    tags: ["Homepage", "UI Systems", "Motion"],
    intro:
      "The difference between a homepage that looks generated and one that feels launched is rarely one dramatic decision. It is usually a stack of quiet decisions that line up.",
    sections: [
      {
        title: "Start with tension, not decoration",
        body: [
          "A modern homepage needs a visual argument. The first screen should immediately establish density, hierarchy and intent instead of opening with evenly weighted blocks.",
          "That usually means one dominant move, one supporting move and a controlled amount of negative space. Anything beyond that starts to feel like assembly rather than authorship.",
        ],
      },
      {
        title: "Motion has to reinforce structure",
        body: [
          "Most weak landing pages animate every block with the same timing and direction. The result is movement without narrative.",
          "I prefer motion that confirms hierarchy: hero first, structural labels second, supporting content last. That gives rhythm instead of choreography for its own sake.",
        ],
      },
      {
        title: "Every surface should belong to the same system",
        body: [
          "Cards, navigation, section labels and calls to action need to feel like they were made by the same hand. Radius, border contrast, type scale and spacing should all rhyme.",
          "Consistency here is what makes even static content feel premium before any backend integration exists.",
        ],
      },
    ],
    href: "/blog/homepage-feel-shipped-not-assembled",
  },
  {
    id: "2",
    slug: "dark-ui-without-muddy-contrast",
    title: "Dark UI without muddy contrast",
    excerpt:
      "Practical ways to keep dark interfaces crisp, readable and premium without falling into neon edges or washed-out typography.",
    category: "UI Craft",
    readTime: "4 min read",
    publishedAt: "April 2026",
    featured: false,
    coverTone: "linear-gradient(135deg,#111827 0%,#09090b 58%,#404040 100%)",
    tags: ["Dark Mode", "Contrast", "Typography"],
    intro:
      "Dark interfaces fail when they become a pile of near-black surfaces fighting for separation. Good dark UI is not about making everything darker. It is about controlling edges.",
    sections: [
      {
        title: "Separation comes from value steps",
        body: [
          "If the page background, navigation and cards all sit too close together in value, users stop reading the interface as layers and start reading it as noise.",
          "Small jumps in brightness and controlled border opacity can create far cleaner separation than hard outlines everywhere.",
        ],
      },
      {
        title: "Muted text still needs conviction",
        body: [
          "Muted copy is useful, but many dark interfaces push secondary text too far into the background. That hurts both clarity and perceived quality.",
          "Muted should feel quieter, not uncertain. When in doubt, lower emphasis with weight and spacing before destroying readability with low contrast.",
        ],
      },
    ],
    href: "/blog/dark-ui-without-muddy-contrast",
  },
  {
    id: "3",
    slug: "motion-systems-that-guide-instead-of-distract",
    title: "Motion systems that guide instead of distract",
    excerpt:
      "Using reveal timing, hover choreography and transitions to support comprehension rather than decorative movement.",
    category: "Motion",
    readTime: "7 min read",
    publishedAt: "March 2026",
    featured: false,
    coverTone: "linear-gradient(135deg,#0f172a 0%,#111827 40%,#7c2d12 100%)",
    tags: ["Motion", "Interaction", "Transitions"],
    intro:
      "Motion is at its best when users barely notice it as animation. They just feel that the interface is easy to follow and strangely hard to get lost in.",
    sections: [
      {
        title: "Motion is wayfinding",
        body: [
          "Transitions should explain where content came from and where it is going. If a hover effect or reveal does not clarify structure, it needs to justify itself in another way.",
          "I use motion most aggressively around hierarchy shifts, section entry and action confirmation. Those are the moments where movement earns its keep.",
        ],
      },
      {
        title: "Limit the vocabulary",
        body: [
          "One reason many product interfaces feel noisy is that every interaction uses a different movement language. Bounce here, fade there, scale somewhere else.",
          "A smaller motion vocabulary usually feels more premium. A few repeated patterns signal intention; too many signal experimentation left unfinished.",
        ],
      },
    ],
    href: "/blog/motion-systems-that-guide-instead-of-distract",
  },
]

export const blogCategories = ["All", ...new Set(blogArticles.map((article) => article.category))]

export function getBlogArticleBySlug(slug: string) {
  return blogArticles.find((article) => article.slug === slug)
}
