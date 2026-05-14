"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, TrendingUp, Search, Filter, Bell, Share2, Plus, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PredMarket {
  id: string
  title: string
  platform: string
  category: string
  yes_price: number
  no_price: number
  volume: string
  close_date: string
  liquidity: string
}

export function UpcomingMarketsPage() {
  const [platformTab, setPlatformTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [markets, setMarkets] = useState<PredMarket[]>([])

  useEffect(() => {
    fetch("/api/prediction-markets")
      .then((res) => res.json())
      .then((data) => setMarkets(data))
      .catch(() => setMarkets([]))
  }, [])

  const categories = ["all", "Finance", "Crypto", "Politics", "Sports", "Tech", "Economics", "Entertainment"]

  const filteredMarkets = markets.filter(market => {
    const matchesSearch = market.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          market.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || market.category.toLowerCase() === filterCategory.toLowerCase()
    const matchesPlatform = platformTab === "all" || market.platform === platformTab
    return matchesSearch && matchesCategory && matchesPlatform
  })

  const filteredCount = markets.filter(m => m.platform === platformTab || platformTab === "all").length

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Platform Toggle */}
        <div className="mb-6">
          <div className="flex justify-center">
            <Tabs value={platformTab} className="w-full max-w-2xl" onValueChange={setPlatformTab}>
              <TabsList className="bg-slate-800/50 border border-slate-700">
                <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500">
                  <span className="flex items-center gap-2">
                    <Zap className="h-6 w-6" />
                    <span className="text-lg font-semibold">All Platforms</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="kalshi" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-purple-500">
                  <span className="flex items-center gap-2">
                    <Zap className="h-6 w-6" />
                    <span className="text-lg font-semibold">Kalshi</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="polymarket" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    <span className="text-lg font-semibold">Polymarket</span>
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Upcoming Markets</h1>
          <p className="text-slate-400">Browse future prediction markets before they launch</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{filteredCount}</div>
                <div className="text-xs text-slate-400">Upcoming</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">$1.2M</div>
                <div className="text-xs text-slate-400">Expected Volume</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Plus className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{markets.length}</div>
                <div className="text-xs text-slate-400">Total Markets</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search markets..."
                className="w-80 bg-slate-900/50 border-slate-700 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-slate-700 bg-slate-900/50 text-white">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </Button>
            <Button variant="outline" className="border-slate-700 bg-slate-900/50 text-white">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMarkets.map((market, i) => (
            <motion.div
              key={market.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur border-slate-700 hover:border-purple-500/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">{market.category}</Badge>
                        <Badge variant="outline" className={market.platform === "kalshi" ? "border-pink-500/50 text-pink-400" : "border-blue-500/50 text-blue-400"}>
                          {market.platform === "kalshi" ? "Kalshi" : "Polymarket"}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-white mb-2">{market.title}</h3>
                      <div className="text-xs text-slate-400">
                        <span className="text-pink-400">Closes: {market.close_date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400 mb-1">Expected Vol</div>
                      <div className="font-semibold text-white">{market.volume}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Calendar View Placeholder */}
        <div className="mt-6">
          <div className="p-8 bg-slate-900/30 rounded-lg border-2 border-dashed border-slate-700 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <Calendar className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p>Calendar view showing upcoming markets by date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
