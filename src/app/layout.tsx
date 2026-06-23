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
  title: "Glauco Russo — Front-end Developer",
  description:
    "Personal portfolio of Glauco Russo, a Brazilian front-end developer building with React, Next.js and TypeScript, and exploring AI-powered applications.",
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
