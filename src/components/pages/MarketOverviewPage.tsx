"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, ArrowRight, Search, RefreshCw, Bell, Settings } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cryptoAssets, exchanges, mockBots } from "@/data/mock"

export function MarketOverviewPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshInterval, setRefreshInterval] = useState(5000)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const marketStats = {
    totalVolume: "$84.2K",
    activeTraders: 127,
    openOrders: 34,
    avgTradingTime: "2.3s",
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Market Overview</h1>
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
          <Button variant="outline" className="border-slate-700 bg-slate-900/50 text-white">
            <Bell className="w-4 h-4 mr-2" />
            Alerts
          </Button>
          <Button variant="outline" className="border-slate-700 bg-slate-900/50 text-white">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-xs text-slate-400">
          Updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* Market Tabs */}
      <Tabs defaultValue="all" className="flex flex-col">
        <TabsList className="bg-slate-800/50 border border-slate-700 mb-4">
          <TabsTrigger value="all" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-500">
            All Markets
          </TabsTrigger>
          <TabsTrigger value="crypto" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-500">
            Crypto
          </TabsTrigger>
          <TabsTrigger value="finance" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-500">
            Finance
          </TabsTrigger>
          <TabsTrigger value="politics" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-500">
            Politics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="grid gap-4">
          {cryptoAssets.map((asset, i) => (
            <motion.div
              key={asset.symbol}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                        <span className="text-2xl">{asset.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white">{asset.symbol}</h3>
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                            {asset.category}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-400">Vol: ${asset.volume.toLocaleString()} | 24h: {asset.change24h}%</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">${asset.price.toLocaleString()}</div>
                      <div className={`text-sm ${asset.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {asset.change24h >= 0 ? "+" : ""}{asset.change24h}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="crypto" className="flex-1">
          <div className="flex items-center justify-center h-64 bg-slate-900/30 rounded-lg border-2 border-dashed border-slate-700">
            <div className="text-center text-slate-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Crypto market content loading...</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="finance" className="flex-1">
          <div className="flex items-center justify-center h-64 bg-slate-900/30 rounded-lg border-2 border-dashed border-slate-700">
            <div className="text-center text-slate-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Finance market content loading...</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="politics" className="flex-1">
          <div className="flex items-center justify-center h-64 bg-slate-900/30 rounded-lg border-2 border-dashed border-slate-700">
            <div className="text-center text-slate-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Politics market content loading...</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Exchange Activity */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-cyan-400" />
          Exchange Activity
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
                      <span className="text-white">${(Math.random() * 1000 + 50).toFixed(1)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Active Bots:</span>
                      <span className="text-white">{Math.floor(Math.random() * 50) + 10}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Trades/min:</span>
                      <span className="text-white">{Math.floor(Math.random() * 20) + 5}</span>
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