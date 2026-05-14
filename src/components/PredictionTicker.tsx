"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Star, StarOff } from "lucide-react"
import { useSettings } from "@/context/settings"

interface PredictionMarket {
  id: string
  title: string
  platform: string
  category: string
  yesPrice: number
  noPrice: number
  volume: string
  closeDate: string
  liquidity: string
}

interface TickerItem {
  id: string
  title: string
  platform: string
  price: number
  isFavorite: boolean
}

export function PredictionTicker() {
  const { predictionFavorites, togglePredictionFavorite } = useSettings()
  const [predictionMarkets, setPredictionMarkets] = useState<PredictionMarket[]>([])
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch prediction markets from API
  useEffect(() => {
    let cancelled = false
    const fetchMarkets = async () => {
      try {
        const res = await fetch("/api/prediction-markets")
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!cancelled) {
          setPredictionMarkets(data)
        }
      } catch (error) {
        console.error("Failed to fetch prediction markets:", error)
      }
    }

    fetchMarkets()
    setLoading(false)

    // Refresh every 60 seconds
    const interval = setInterval(() => {
      if (!cancelled) fetchMarkets()
    }, 60000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  // Build ticker items from favorites
  useEffect(() => {
    const items: TickerItem[] = []

    predictionFavorites.forEach((fav) => {
      const market = predictionMarkets.find((m) => m.id === fav.id)
      if (market) {
        items.push({
          id: market.id,
          title: market.title,
          platform: market.platform,
          price: market.yesPrice,
          isFavorite: true,
        })
      }
    })

    setTickerItems(items)
  }, [predictionFavorites, predictionMarkets])

  const handleToggleFavorite = useCallback((item: TickerItem) => {
    togglePredictionFavorite({ id: item.id, title: item.title, platform: item.platform })
  }, [togglePredictionFavorite])

  // Simulate small price updates between API refreshes
  useEffect(() => {
    if (tickerItems.length === 0) return
    const interval = setInterval(() => {
      setTickerItems((prev) =>
        prev.map((item) => ({
          ...item,
          price: item.price * (1 + (Math.random() - 0.5) * 0.001),
        }))
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [tickerItems.length])

  if (loading || tickerItems.length === 0) {
    return (
      <div className="overflow-hidden border-b border-white/5 bg-slate-950/50 py-2">
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          Loading prediction markets...
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
            <span className="text-lg">{item.platform === "polymarket" ? "🎯" : "📊"}</span>
            <span className="font-semibold text-white text-sm">{item.title.substring(0, 30)}...</span>
            <span className="text-slate-300 text-sm">{(item.price * 100).toFixed(0)}%</span>
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
