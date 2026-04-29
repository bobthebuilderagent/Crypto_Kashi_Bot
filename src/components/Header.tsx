"use client"

import { useAppContext } from "@/lib/providers"
import { motion } from "framer-motion"
import { TrendingUp, Globe, Moon, Sun, Menu, X, Search, Bell } from "lucide-react"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function Header() {
  const { theme, setTheme } = useAppContext()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  
  // Derive section from URL instead of context state
  const currentSection = pathname === "/" || pathname === "" ? "home" : pathname.slice(1)

  const navigate = (s: string) => {
    router.push(s === "home" ? "/" : `/${s}`)
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Crypto+</h1>
            <p className="-mt-1 text-xs text-slate-400">Kashi Platform</p>
          </div>
        </div>

       {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {([
            { label: "home", name: "🏠 Home" },
            { label: "crypto", name: "₿ Crypto Bot" },
            { label: "predictions", name: "🎯 Predictions" },
          ] as const).map((s) => (
            <button
              key={s.label}
              onClick={() => navigate(s.label)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentSection === s.label
                  ? "text-white bg-white/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {s.name}
              {currentSection === s.label && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-lg border-2 border-purple-500/50"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 bg-slate-950/50 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="md:hidden border-t border-white/10 bg-slate-900/95"
        >
          <nav className="flex flex-col p-4 gap-1">
            {([
              { label: "home", name: "🏠 Home" },
              { label: "crypto", name: "₿ Crypto Bot" },
              { label: "predictions", name: "🎯 Predictions" },
            ] as const).map((s) => (
              <button
                key={s.label}
                onClick={() => {
                  navigate(s.label)
                  setMobileMenuOpen(false)
                }}
                className={`px-4 py-3 rounded-lg text-sm font-medium text-left ${
                  currentSection === s.label
                    ? "text-white bg-white/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {s.name}
              </button>
            ))}
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}
