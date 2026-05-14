"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Star, StarOff } from "lucide-react"
import { useSettings } from "@/context/settings"

interface CryptoAsset {
  id: string
  symbol: string
  name: string
  price: number
  change_24h: number
  market_cap: string
  volume_24h: string
  icon: string
  category: string
}

interface TickerItem {
  id: string
  symbol: string
  icon: string
  price: number
  change_24h: number
  isFavorite: boolean
}

export function LiveTicker() {
  const { cryptoFavorites, toggleCryptoFavorite } = useSettings()
  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>([])
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch crypto assets from API (real-time with fallback)
  useEffect(() => {
    let cancelled = false
    const fetchAssets = async () => {
      try {
        const res = await fetch("/api/assets")
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!cancelled) {
          setCryptoAssets(data)
        }
      } catch (error) {
        console.error("Failed to fetch crypto assets:", error)
      }
    }

    fetchAssets()
    setLoading(false)

    // Refresh every 60 seconds to respect CoinGecko rate limits
    const interval = setInterval(() => {
      if (!cancelled) fetchAssets()
    }, 60000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  // Build ticker items from crypto favorites
  useEffect(() => {
    const items: TickerItem[] = []

    cryptoFavorites.forEach((fav) => {
      const asset = cryptoAssets.find((a) => a.symbol === fav.symbol)
      if (asset) {
        items.push({
          id: asset.id,
          symbol: asset.symbol,
          icon: asset.icon,
          price: asset.price,
          change_24h: asset.change_24h,
          isFavorite: true,
        })
      }
    })

    setTickerItems(items)
  }, [cryptoFavorites, cryptoAssets])

  // Simulate small price updates between API refreshes
  useEffect(() => {
    if (tickerItems.length === 0) return
    const interval = setInterval(() => {
      setTickerItems((prev) =>
        prev.map((item) => ({
          ...item,
          price: item.price * (1 + (Math.random() - 0.5) * 0.001),
          change_24h: item.change_24h + (Math.random() - 0.5) * 0.05,
        }))
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [tickerItems.length])

  const handleToggleFavorite = useCallback((item: TickerItem) => {
    const asset = cryptoAssets.find((a) => a.symbol === item.symbol)
    if (asset) {
      toggleCryptoFavorite({ symbol: asset.symbol, name: asset.name, icon: asset.icon })
    }
  }, [cryptoAssets, toggleCryptoFavorite])

  if (loading || tickerItems.length === 0) {
    return (
      <div className="overflow-hidden border-b border-white/5 bg-slate-950/50 py-2">
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
          Loading crypto prices...
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden border-b border-white/5 bg-slate-950/50">
      <motion.div
        animate={{ x: [0, -1500] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap gap-8 py-2"
      >
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
          <div key={`${item.id}-${i}`} className="flex items-center gap-2 px-4 group relative">
            <span className="text-lg">{item.icon}</span>
            <span className="font-semibold text-white text-sm">{item.symbol}</span>
            {item.price && (
              <span className="text-slate-300 text-sm">${item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            )}
            {item.change_24h !== undefined && (
              <span className={`text-sm font-medium ${item.change_24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                {item.change_24h >= 0 ? "+" : ""}{item.change_24h.toFixed(2)}%
              </span>
            )}
            <button
              onClick={() => handleToggleFavorite(item)}
              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
              title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {item.isFavorite ? (
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              ) : (
                <StarOff className="w-3 h-3 text-slate-400" />
              )}
            </button>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
