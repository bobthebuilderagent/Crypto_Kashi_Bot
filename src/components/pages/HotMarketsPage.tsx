"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown, Flame, Clock, Calendar, Globe, ArrowUpRight, ArrowDownRight, Share2, ExternalLink } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface HotMarket {
  id: string
  title: string
  question: string
  category: string
  platform: string
  yesPercent: number
  noPercent: number
  volume: number
  participants: number
  timeRemaining: number
  trending: boolean
  trendingScore: number
}

export function HotMarketsPage() {
  const [markets, setMarkets] = useState<HotMarket[]>([
    {
      id: "1",
      title: "Bitcoin to $100K by end of 2026",
      question: "Will Bitcoin reach $100,000 USD before December 31, 2026?",
      category: "Bitcoin",
      platform: "CoinGecko",
      yesPercent: 68,
      noPercent: 32,
      volume: 125000,
      participants: 8432,
      timeRemaining: 156,
      trending: true,
      trendingScore: 95,
    },
    {
      id: "2",
      title: "Ethereum ETF approval Q3 2026",
      question: "Will the SEC approve a spot Ethereum ETF in Q3 2026?",
      category: "Ethereum",
      platform: "Kashi",
      yesPercent: 54,
      noPercent: 46,
      volume: 89000,
      participants: 5621,
      timeRemaining: 89,
      trending: true,
      trendingScore: 88,
    },
    {
      id: "3",
      title: "AI bubble burst by 2026",
      question: "Will the AI sector experience a significant bubble burst in 2026?",
      category: "AI & Tech",
      platform: "Polymarket",
      yesPercent: 42,
      noPercent: 58,
      volume: 210000,
      participants: 12543,
      timeRemaining: 203,
      trending: true,
      trendingScore: 92,
    },
    {
      id: "4",
      title: "Solana Firedancer upgrade June 2026",
      question: "Will Solana complete its Firedancer upgrade by June 2026?",
      category: "Solana",
      platform: "Kashi",
      yesPercent: 76,
      noPercent: 24,
      volume: 45000,
      participants: 3245,
      timeRemaining: 45,
      trending: false,
      trendingScore: 65,
    },
    {
      id: "5",
      title: "Tesla stock to $500 by year end",
      question: "Will Tesla (TSLA) reach $500 before December 31, 2026?",
      category: "Stocks",
      platform: "Manifold",
      yesPercent: 38,
      noPercent: 62,
      volume: 67000,
      participants: 4521,
      timeRemaining: 178,
      trending: true,
      trendingScore: 78,
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPlatform, setSelectedPlatform] = useState("All")

  const categories = ["All", "Bitcoin", "Ethereum", "AI & Tech", "Solana", "Stocks", "NFTs", "Crypto"]
  const platforms = ["All", "CoinGecko", "Kashi", "Polymarket", "Manifold"]

  const filteredMarkets = markets.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.question.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || m.category === selectedCategory
    const matchesPlatform = selectedPlatform === "All" || m.platform === selectedPlatform
    return matchesSearch && matchesCategory && matchesPlatform
  })

  const trendingMarkets = markets.filter(m => m.trending).slice(0, 5)

  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets(current => current.map(m => ({
        ...m,
        yesPercent: Math.min(100, Math.max(0, m.yesPercent + (Math.random() - 0.5) * 2)),
        noPercent: Math.min(100, Math.max(0, m.noPercent + (Math.random() - 0.5) * 2)),
        volume: m.volume + Math.floor(Math.random() * 100),
        trending: Math.random() > 0.7,
        trendingScore: Math.floor(Math.random() * 100)
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const formatVolume = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`
    return `$${num}`
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-white">Hot Markets</h1>
          </div>
          <p className="text-slate-400">Trending prediction markets with high activity and engagement</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-orange-500/20 to-red-600/10 border border-orange-500/20 rounded-xl p-4"
          >
            <div className="text-slate-400 text-sm mb-1">Hot Markets</div>
            <div className="text-2xl font-bold text-orange-400">{markets.filter(m => m.trending).length}</div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-500/20 to-cyan-600/10 border border-purple-500/20 rounded-xl p-4"
          >
            <div className="text-slate-400 text-sm mb-1">Total Volume</div>
            <div className="text-2xl font-bold text-white">
              ${(markets.reduce((sum, m) => sum + m.volume, 0) / 1000).toFixed(1)}K
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/20 rounded-xl p-4"
          >
            <div className="text-slate-400 text-sm mb-1">Active Participants</div>
            <div className="text-2xl font-bold text-green-400">
              {markets.reduce((sum, m) => sum + m.participants, 0)}
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/20 rounded-xl p-4"
          >
            <div className="text-slate-400 text-sm mb-1">Avg Volume</div>
            <div className="text-2xl font-bold text-cyan-400">
              ${formatVolume(Math.floor(markets.reduce((sum, m) => sum + m.volume, 0) / markets.length))}
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              {platforms.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-4">
          {/* Trending Markets */}
          {trendingMarkets.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Trending Now
              </h3>
              <div className="grid gap-3">
                {trendingMarkets.map((market, index) => (
                  <motion.div
                    key={market.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-gradient-to-r from-slate-900/80 to-slate-900/40 border-slate-800/60 hover:border-orange-500/40 transition-colors cursor-pointer group">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-orange-400 font-medium text-sm">Trending #{index + 1}</span>
                              <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700">
                                {market.category}
                              </Badge>
                            </div>
                            <h4 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">
                              {market.title}
                            </h4>
                          </div>
                          <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                            <Share2 className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-white">{market.yesPercent.toFixed(0)}%</div>
                              <div className="text-xs text-slate-500">Yes</div>
                            </div>
                            <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                                style={{ width: `${market.yesPercent}%` }}
                                animate={{ width: `${market.yesPercent}%` }}
                              />
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-white">{market.noPercent.toFixed(0)}%</div>
                              <div className="text-xs text-slate-500">No</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-orange-400" />
                              Vol: {formatVolume(market.volume)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="h-4 w-4 text-green-400" />
                              {market.participants.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* All Markets */}
          <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-3">All Markets</h3>
            <div className="grid gap-3">
              {filteredMarkets.map((market, index) => (
                <motion.div
                  key={market.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-slate-400 text-sm">{market.category}</span>
                            <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700">
                              {market.platform}
                            </Badge>
                            {market.trending && (
                              <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                                <Flame className="h-3 w-3 mr-1" />
                                Hot
                              </Badge>
                            )}
                          </div>
                          <h4 className="text-base font-medium text-white group-hover:text-cyan-400 transition-colors">
                            {market.title}
                          </h4>
                        </div>
                        <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                          <Share2 className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">{market.yesPercent.toFixed(1)}%</div>
                            <div className="text-xs text-slate-500">Yes</div>
                          </div>
                          <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                              style={{ width: `${market.yesPercent}%` }}
                              animate={{ width: `${market.yesPercent}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-400">{market.noPercent.toFixed(1)}%</div>
                            <div className="text-xs text-slate-500">No</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {formatVolume(market.volume)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            {market.participants.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="h-4 w-4" />
                            {formatTime(market.timeRemaining)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
