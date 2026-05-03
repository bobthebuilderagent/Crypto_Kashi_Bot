"use client"

import { motion } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { useAppContext } from "@/lib/providers"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <CEXDEXToggleBar />
      {children}
    </div>
  )
}

function CEXDEXToggleBar() {
  const { exchangeType, setExchangeType } = useAppContext()
  const pathname = usePathname()
  const router = useRouter()

  const titles: Record<string, { title: string; subtitle: string }> = {
    "/crypto": { title: "Bot Dashboard", subtitle: "Manage your trading bots and activity" },
    "/crypto/market-overview": { title: "Market Overview", subtitle: "Real-time market data, volume, and trading activity" },
    "/crypto/analytics": { title: "Analytics", subtitle: "Detailed performance metrics and trading statistics" },
    "/crypto/trade-history": { title: "Trade History", subtitle: "View and analyze all your trading activity" },
    "/crypto/settings": { title: "Settings", subtitle: "Configure your trading bot preferences" },
  }

  const current = titles[pathname] || { title: "Crypto Bot", subtitle: "Trading Dashboard" }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 flex items-center justify-between"
    >
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">{current.title}</h1>
        <p className="text-slate-400">{current.subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setExchangeType("cex")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            exchangeType === "cex"
              ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-500/25"
              : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-slate-700"
          }`}
        >
          CEX
        </button>
        <button
          onClick={() => setExchangeType("dex")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            exchangeType === "dex"
              ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-500/25"
              : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-slate-700"
          }`}
        >
          DEX
        </button>
      </div>
    </motion.div>
  )
}
