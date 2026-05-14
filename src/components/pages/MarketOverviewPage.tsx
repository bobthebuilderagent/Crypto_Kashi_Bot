"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, ArrowRight, Search, RefreshCw, Bell, Settings, Zap, CircleDollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppContext } from "@/lib/providers"

interface Asset {
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

interface Market {
  symbol: string
  exchange: string
  price: number
  change24h: number
  volume: string
  type: string
}

interface Exchange {
  name: string
  supported: string[]
  icon: string
}

// Exchange definitions derived from database connections
function getExchanges(exchangeType: "cex" | "dex"): Exchange[] {
  if (exchangeType === "cex") {
    return [
      { name: "Binance", supported: ["spot", "futures"], icon: "🔶" },
      { name: "Coinbase", supported: ["spot", "futures"], icon: "🔵" },
      { name: "Kraken", supported: ["spot", "futures"], icon: "🟣" },
    ]
  }
  return [
    { name: "Uniswap", supported: ["spot"], icon: "🦄" },
    { name: "Raydium", supported: ["spot"], icon: "⚡" },
    { name: "PancakeSwap", supported: ["spot"], icon: "🥞" },
  ]
}

// Map database assets to market entries for the given exchange type
function mapAssetsToMarkets(assets: Asset[], exchangeType: "cex" | "dex"): Market[] {
  if (assets.length === 0) return []

  const exchanges = exchangeType === "cex"
    ? ["Binance", "Coinbase", "Kraken"]
    : ["Uniswap", "Raydium", "PancakeSwap"]

  const markets: Market[] = []
  for (const asset of assets) {
    for (const ex of exchanges) {
      markets.push({
        symbol: asset.symbol,
        exchange: ex,
        price: asset.price,
        change24h: asset.change_24h,
        volume: asset.volume_24h,
        type: exchangeType === "cex" ? "spot" : "spot",
      })
    }
  }
  return markets
}

export function MarketOverviewPage() {
  const { exchangeType, setExchangeType } = useAppContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshInterval, setRefreshInterval] = useState(5000)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [markets, setMarkets] = useState<Market[]>([])

  useEffect(() => {
    let cancelled = false
    const fetchAssets = async () => {
      try {
        const res = await fetch("/api/assets")
        if (!res.ok) throw new Error("Failed to fetch assets")
        const data = await res.json()
        if (!cancelled) {
          setAssets(data)
          setMarkets(mapAssetsToMarkets(data, exchangeType))
          setExchanges(getExchanges(exchangeType))
          setLoading(false)
          setLastUpdated(new Date())
        }
      } catch (error) {
        console.error("Failed to fetch assets:", error)
        if (!cancelled) {
          setAssets([])
          setMarkets([])
          setExchanges(getExchanges(exchangeType))
          setLoading(false)
        }
      }
    }

    fetchAssets()

    // Refresh assets every 60 seconds to respect CoinGecko rate limits
    const interval = setInterval(() => {
      fetch("/api/assets")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch assets")
          return res.json()
        })
        .then((data) => {
          setAssets(data)
          setMarkets(mapAssetsToMarkets(data, exchangeType))
          setExchanges(getExchanges(exchangeType))
          setLastUpdated(new Date())
        })
        .catch((error) => console.error("Failed to refresh assets:", error))
    }, 60000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  // Recalculate markets and exchanges when exchange type changes
  useEffect(() => {
    if (assets.length > 0) {
      setMarkets(mapAssetsToMarkets(assets, exchangeType))
      setExchanges(getExchanges(exchangeType))
    }
  }, [exchangeType])

  const marketStats = {
    totalVolume: exchangeType === "cex" ? "$84.2K" : "$12.4K",
    activeTraders: exchangeType === "cex" ? 127 : 89,
    openOrders: exchangeType === "cex" ? 34 : 21,
    avgTradingTime: exchangeType === "cex" ? "2.3s" : "3.1s",
  }

  const filteredMarkets = markets.filter((m) =>
    m.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.exchange.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Market Overview
          <span className="ml-2 text-sm text-slate-400 font-normal">
            ({exchangeType === "cex" ? "Centralized" : "Decentralized"} Exchanges)
          </span>
        </h1>
        <p className="text-slate-400">Real-time market data, volume, and trading activity</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(marketStats).map(([key, value]) => (
          <Card key={key} className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{value}</div>
                <div className="text-xs text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search markets..."
              className="w-64 bg-slate-900/50 border-slate-700 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-slate-700 bg-slate-900/50 text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="border-slate-900/50 text-white">
            <Bell className="w-4 h-4 mr-2" />
            Alerts
          </Button>
        </div>
        <div className="text-xs text-slate-400" suppressHydrationWarning>
          Updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* Markets list */}
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-slate-900/50 backdrop-blur border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 animate-pulse" />
                      <div>
                        <div className="h-5 w-32 bg-slate-700 rounded animate-pulse mb-2" />
                        <div className="h-4 w-48 bg-slate-800 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-7 w-24 bg-slate-700 rounded animate-pulse mb-2" />
                      <div className="h-4 w-16 bg-slate-800 rounded animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          : filteredMarkets.map((market, i) => (
              <motion.div
                key={`${market.symbol}-${market.exchange}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-slate-900/50 backdrop-blur border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                          <span className="text-2xl">{exchangeType === "cex" ? "🏛" : "🔗"}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white">{market.symbol}</h3>
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                              {market.exchange}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                              {market.type}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-400">Vol: ${market.volume} | 24h: {market.change24h}%</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          {exchangeType === "cex" ? `$${market.price.toLocaleString()}` : `$${market.price.toFixed(4)}`}
                        </div>
                        <div className={`text-sm ${market.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {market.change24h >= 0 ? "+" : ""}{market.change24h}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>

      {/* Exchange Activity */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-cyan-400" />
          {exchangeType === "cex" ? "CEX" : "DEX"} Exchange Activity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exchanges.map((exchange, i) => (
            <motion.div
              key={exchange.name}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{exchange.icon}</span>
                    <div>
                      <h3 className="font-semibold text-white">{exchange.name}</h3>
                      <div className="text-xs text-slate-400">{exchange.supported.join(', ')}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">24h Volume:</span>
                      <span className="text-white" suppressHydrationWarning>${(Math.random() * 1000 + 50).toFixed(1)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Active Bots:</span>
                      <span className="text-white" suppressHydrationWarning>{Math.floor(Math.random() * 50) + 10}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Trades/min:</span>
                      <span className="text-white" suppressHydrationWarning>{Math.floor(Math.random() * 20) + 5}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
