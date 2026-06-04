"use client"

// ThemeProvider: gerencia o tema dark/light do site inteiro.
// Usa Context API para compartilhar o tema com qualquer componente filho.
// Salva a preferência no localStorage para persistir entre visitas.

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

type ThemeContextType = {
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
})

// useTheme: hook customizado para acessar o tema em qualquer componente
export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "dark"
    }

    const saved = localStorage.getItem("theme") as Theme | null
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    return saved ?? (prefersDark ? "dark" : "light")
  })

  // Aplica a classe "dark" no <html> e salva a preferência
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    localStorage.setItem("theme", theme)
  }, [theme])

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
