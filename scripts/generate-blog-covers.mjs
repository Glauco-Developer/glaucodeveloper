import fs from "node:fs/promises"
import path from "node:path"

const WIDTH = 1600
const HEIGHT = 900

const posts = [
  {
    slug: "alldashai-launch-on-wordpress-org",
    category: "Product Launch",
    title: "Launching All DashAI on WordPress.org",
    subtitle: "Operational clarity for WordPress teams",
    palette: {
      bg: ["#04130d", "#0f3d2e", "#151b2f"],
      accent: "#8df0c7",
      accentSoft: "#4dd4a8",
      text: "#f4f6f1",
      muted: "#b8c2ba",
      line: "rgba(255,255,255,0.14)",
    },
    motif: "dashboard",
  },
  {
    slug: "building-a-supabase-vector-database-for-rag-in-nextjs",
    category: "AI Engineering",
    title: "Supabase Vector Database for RAG in Next.js",
    subtitle: "From chunking and embeddings to retrieval",
    palette: {
      bg: ["#08111e", "#123a73", "#0a7666"],
      accent: "#95f3e4",
      accentSoft: "#60a5fa",
      text: "#eff6ff",
      muted: "#bfd5e7",
      line: "rgba(255,255,255,0.16)",
    },
    motif: "vector",
  },
  {
    slug: "running-wordpress-with-docker-without-making-local-dev-fragile",
    category: "DevOps for WordPress",
    title: "Running WordPress with Docker Without Fragility",
    subtitle: "A reproducible local stack that stays boring",
    palette: {
      bg: ["#0a2740", "#17263a", "#0d111a"],
      accent: "#88ddff",
      accentSoft: "#5fb6ff",
      text: "#f5f7fb",
      muted: "#c3d0db",
      line: "rgba(255,255,255,0.15)",
    },
    motif: "containers",
  },
]

const outputDir = path.resolve("tmp/blog-covers")

await fs.mkdir(outputDir, { recursive: true })

for (const post of posts) {
  const svg = buildCover(post)
  await fs.writeFile(path.join(outputDir, `${post.slug}.svg`), svg, "utf8")
}

function buildCover(post) {
  const titleLines = wrapText(post.title, 26)
  const subtitleLines = wrapText(post.subtitle, 34)

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${WIDTH}" y2="${HEIGHT}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${post.palette.bg[0]}"/>
      <stop offset="48%" stop-color="${post.palette.bg[1]}"/>
      <stop offset="100%" stop-color="${post.palette.bg[2]}"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1220 160) rotate(122) scale(360 280)">
      <stop offset="0%" stop-color="${post.palette.accent}" stop-opacity="0.36"/>
      <stop offset="100%" stop-color="${post.palette.accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1280 730) rotate(180) scale(420 320)">
      <stop offset="0%" stop-color="${post.palette.accentSoft}" stop-opacity="0.26"/>
      <stop offset="100%" stop-color="${post.palette.accentSoft}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" stroke="${post.palette.line}" stroke-width="1"/>
    </pattern>
    <filter id="blur">
      <feGaussianBlur stdDeviation="32"/>
    </filter>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)" opacity="0.48"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glowA)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glowB)"/>

  <circle cx="1320" cy="184" r="88" fill="${post.palette.accent}" opacity="0.1" filter="url(#blur)"/>
  <circle cx="1160" cy="730" r="120" fill="${post.palette.accentSoft}" opacity="0.12" filter="url(#blur)"/>

  <rect x="78" y="78" width="220" height="38" rx="19" fill="rgba(255,255,255,0.08)" stroke="${post.palette.line}"/>
  <text x="188" y="102" text-anchor="middle" fill="${post.palette.muted}" font-family="IBM Plex Mono, monospace" font-size="15" letter-spacing="3.2">${escapeXml(post.category.toUpperCase())}</text>

  <g transform="translate(76 220)">
    ${renderTitle(titleLines, post.palette.text)}
    ${renderSubtitle(subtitleLines, post.palette.muted, 54 + titleLines.length * 86)}
  </g>

  <g transform="translate(1035 178)">
    ${renderMotif(post)}
  </g>

  <g opacity="0.9">
    <path d="M74 824H1526" stroke="${post.palette.line}" stroke-width="2"/>
    <text x="78" y="860" fill="${post.palette.muted}" font-family="IBM Plex Mono, monospace" font-size="15" letter-spacing="2.6">glaucodeveloper.com</text>
    <text x="1522" y="860" text-anchor="end" fill="${post.palette.muted}" font-family="IBM Plex Mono, monospace" font-size="15" letter-spacing="2.6">EDITORIAL COVER</text>
  </g>
</svg>`
}

function renderTitle(lines, color) {
  return lines
    .map(
      (line, index) =>
        `<text x="0" y="${index * 86}" fill="${color}" font-family="Inter, Segoe UI, sans-serif" font-size="70" font-weight="700" letter-spacing="-2.4">${escapeXml(line)}</text>`
    )
    .join("\n")
}

function renderSubtitle(lines, color, startY) {
  return lines
    .map(
      (line, index) =>
        `<text x="2" y="${startY + index * 36}" fill="${color}" font-family="Inter, Segoe UI, sans-serif" font-size="28" font-weight="500" letter-spacing="-0.4">${escapeXml(line)}</text>`
    )
    .join("\n")
}

function renderMotif(post) {
  if (post.motif === "dashboard") {
    return `
      <rect x="0" y="0" width="410" height="264" rx="30" fill="rgba(255,255,255,0.08)" stroke="${post.palette.line}" />
      <rect x="28" y="28" width="146" height="78" rx="18" fill="rgba(255,255,255,0.05)" stroke="${post.palette.line}" />
      <rect x="194" y="28" width="188" height="78" rx="18" fill="rgba(255,255,255,0.05)" stroke="${post.palette.line}" />
      <rect x="28" y="128" width="248" height="108" rx="22" fill="rgba(255,255,255,0.04)" stroke="${post.palette.line}" />
      <rect x="296" y="128" width="86" height="108" rx="22" fill="rgba(255,255,255,0.04)" stroke="${post.palette.line}" />
      <path d="M48 201C78 177 108 171 138 182C164 191 196 195 224 164C234 153 250 141 260 142" stroke="${post.palette.accent}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="88" cy="68" r="16" fill="${post.palette.accentSoft}" />
      <rect x="214" y="54" width="114" height="14" rx="7" fill="${post.palette.accent}" opacity="0.8"/>
      <rect x="214" y="76" width="88" height="10" rx="5" fill="white" opacity="0.56"/>
      <rect x="318" y="149" width="40" height="16" rx="8" fill="${post.palette.accent}" opacity="0.82"/>
      <rect x="318" y="176" width="32" height="32" rx="10" fill="${post.palette.accentSoft}" opacity="0.72"/>
    `
  }

  if (post.motif === "vector") {
    return `
      <rect x="0" y="0" width="410" height="320" rx="34" fill="rgba(255,255,255,0.05)" stroke="${post.palette.line}" />
      <circle cx="66" cy="54" r="12" fill="${post.palette.accent}" />
      <circle cx="184" cy="88" r="12" fill="${post.palette.accentSoft}" />
      <circle cx="312" cy="54" r="12" fill="${post.palette.accent}" />
      <circle cx="124" cy="170" r="14" fill="${post.palette.accentSoft}" />
      <circle cx="252" cy="182" r="14" fill="${post.palette.accent}" />
      <circle cx="356" cy="254" r="14" fill="${post.palette.accentSoft}" />
      <path d="M66 54L184 88L312 54L252 182L124 170L356 254" stroke="rgba(255,255,255,0.42)" stroke-width="3"/>
      <rect x="38" y="230" width="188" height="52" rx="16" fill="rgba(255,255,255,0.05)" stroke="${post.palette.line}" />
      <rect x="56" y="247" width="72" height="16" rx="8" fill="${post.palette.accent}" opacity="0.82"/>
      <rect x="140" y="247" width="64" height="16" rx="8" fill="${post.palette.accentSoft}" opacity="0.82"/>
      <rect x="248" y="230" width="126" height="52" rx="16" fill="rgba(255,255,255,0.05)" stroke="${post.palette.line}" />
      <path d="M268 262H352" stroke="white" stroke-opacity="0.7" stroke-width="4" stroke-linecap="round"/>
      <path d="M268 246H326" stroke="${post.palette.accent}" stroke-width="6" stroke-linecap="round"/>
    `
  }

  return `
    <rect x="0" y="0" width="410" height="292" rx="34" fill="rgba(255,255,255,0.06)" stroke="${post.palette.line}" />
    <rect x="64" y="82" width="118" height="90" rx="22" fill="rgba(255,255,255,0.05)" stroke="${post.palette.line}" />
    <rect x="228" y="82" width="118" height="90" rx="22" fill="rgba(255,255,255,0.05)" stroke="${post.palette.line}" />
    <rect x="146" y="36" width="118" height="90" rx="22" fill="rgba(255,255,255,0.05)" stroke="${post.palette.line}" />
    <path d="M182 80H228" stroke="${post.palette.accent}" stroke-width="8" stroke-linecap="round"/>
    <path d="M122 126H170" stroke="${post.palette.accentSoft}" stroke-width="8" stroke-linecap="round"/>
    <path d="M286 126H334" stroke="${post.palette.accentSoft}" stroke-width="8" stroke-linecap="round"/>
    <rect x="58" y="210" width="294" height="38" rx="19" fill="rgba(255,255,255,0.05)" stroke="${post.palette.line}" />
    <text x="205" y="234" text-anchor="middle" fill="${post.palette.accent}" font-family="IBM Plex Mono, monospace" font-size="15" letter-spacing="2.4">docker compose up -d</text>
  `
}

function wrapText(text, maxChars) {
  const words = text.split(/\s+/)
  const lines = []
  let current = ""

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length <= maxChars) {
      current = next
    } else {
      if (current) lines.push(current)
      current = word
    }
  }

  if (current) lines.push(current)
  return lines
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}
