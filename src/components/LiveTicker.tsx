"use client"

import { cryptoAssets } from "@/data/mock"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function LiveTicker() {
  const [prices, setPrices] = useState(cryptoAssets)

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((asset) => ({
          ...asset,
          price: asset.price * (1 + (Math.random() - 0.5) * 0.002),
          change24h: asset.change24h + (Math.random() - 0.5) * 0.1,
        }))
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="overflow-hidden border-b border-white/5 bg-slate-950/50">
      <motion.div
        animate={{ x: [0, -1500] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap gap-8 py-2"
      >
        {[...prices, ...prices, ...prices].map((asset, i) => (
          <div key={`${asset.symbol}-${i}`} className="flex items-center gap-2 px-4">
            <span className="text-lg">{asset.icon}</span>
            <span className="font-semibold text-white text-sm">{asset.symbol}</span>
            <span className="text-slate-300 text-sm">${asset.price.toLocaleString()}</span>
            <span className={`text-sm font-medium ${asset.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
              {asset.change24h >= 0 ? "+" : ""}{asset.change24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
