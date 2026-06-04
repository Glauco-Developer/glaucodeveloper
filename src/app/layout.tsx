import type { Metadata } from "next"
import { IBM_Plex_Mono, Manrope, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-brand",
  weight: ["500", "700"],
})

export const metadata: Metadata = {
  title: "Glauco Developer — Front-end Engineer",
  description:
    "Portfolio for Glauco Developer, focused on premium front-end interfaces with React, Next.js and TypeScript.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // suppressHydrationWarning evita o warning do React quando o tema
    // é aplicado via JS no cliente (dark/light muda a className do <html>)
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={`${manrope.variable} ${ibmPlexMono.variable} ${spaceGrotesk.variable} min-h-screen flex flex-col`}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
