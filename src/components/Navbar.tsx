"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useTheme } from "./ThemeProvider"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/#work" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export function Navbar() {
  const { toggleTheme } = useTheme()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    if (href === "/#work") return false
    return pathname === href || pathname.startsWith(href + "/")
  }

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > Math.max(window.innerHeight - 100, 120))
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className={`flex w-full items-center justify-between border-b px-[4vw] py-4 text-[var(--nav-ink)] transition-all duration-300 ${
          scrolled
            ? "border-[var(--line)] bg-[color:color-mix(in_srgb,var(--bg)_74%,transparent)] backdrop-blur-2xl"
            : pathname === "/"
              ? "nav-hero border-transparent bg-transparent backdrop-blur-none"
              : "border-transparent bg-transparent backdrop-blur-none"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-3 text-[var(--nav-ink)]"
          data-interactive="true"
        >
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--line)] bg-[var(--card)] shadow-sm transition-transform duration-500 hover:scale-110">
            {/* Stylish SVG Avatar Logo with Beard */}
            <svg
              viewBox="0 0 100 100"
              className="h-8 w-8 text-[var(--ink)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="45" r="22" stroke="currentColor" strokeWidth="2.5" />
              <path
                d="M30 65C30 58 35 52 42 50L50 55L58 50C65 52 70 58 70 65V75C70 82 65 88 58 90H42C35 88 30 82 30 75V65Z"
                fill="currentColor"
                opacity="0.15"
              />
              <path
                d="M32 68C32 68 38 78 50 78C62 78 68 68 68 68V75C68 83 60 88 50 88C40 88 32 83 32 75V68Z"
                fill="currentColor"
              />
              <path
                d="M42 45C42 45 44 48 50 48C56 48 58 45 58 45"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="font-mono text-[15px] font-semibold tracking-[-0.04em]">
            glaucodeveloper<b className="text-violet-500">.</b>
          </span>
        </Link>

        <div className="flex items-center gap-7">
          <ul className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-mono text-[13px] transition-colors duration-200 hover:text-[var(--nav-ink)] ${
                    isActive(link.href)
                      ? "text-[var(--nav-ink)]"
                      : "text-[var(--nav-muted)]"
                  }`}
                  data-interactive="true"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            onClick={toggleTheme}
            className="flex h-7 w-[54px] items-center rounded-full border border-[var(--line)] bg-[color:rgba(127,127,127,0.2)] p-[3px]"
            aria-label="Toggle theme"
            data-interactive="true"
          >
            <span className="h-5 w-5 rounded-full bg-current transition-transform duration-300 dark:translate-x-[26px]" />
          </button>

          <button
            onClick={() => setMenuOpen((value) => !value)}
            className="text-[var(--nav-ink)] md:hidden"
            aria-label="Open menu"
            data-interactive="true"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="border-b border-[var(--line)] bg-[color:color-mix(in_srgb,var(--bg)_88%,transparent)] p-4 backdrop-blur-2xl md:hidden"
          >
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-xl px-3 py-2 font-mono text-[13px] transition-colors duration-200 hover:text-[var(--ink)] ${
                      isActive(link.href)
                        ? "text-[var(--ink)]"
                        : "text-[var(--muted)]"
                    }`}
                    data-interactive="true"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
