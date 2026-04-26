"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cryptoAssets, mockBots } from "@/data/mock"
import { TrendingUp, Bot, Shield, Activity, Eye, ArrowUpRight, ArrowDownRight, Plus, Search, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

export function CryptoBotPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBot, setSelectedBot] = useState<string | null>(null)

  const filteredBots = mockBots.filter((bot) => {
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || bot.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalBots: mockBots.length,
    activeBots: mockBots.filter(b => b.status === "active").length,
    totalPnl: mockBots.reduce((sum, b) => sum + b.totalPnl, 0),
    activeVolume: `$${(Math.random() * 100 + 50).toFixed(1)}K`,
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-950 text-white"
    >
      {/* Stats Overview */}
      <section className="px-4 pt-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Bots", value: stats.totalBots, icon: <Bot className="h-5 w-5 text-cyan-400" />, trend: "all" },
            { label: "Active", value: stats.activeBots, icon: <Activity className="h-5 w-5 text-green-400" />, trend: "active" },
            { label: "Total P&L", value: `$${stats.totalPnl.toLocaleString()}`, icon: <TrendingUp className={`h-5 w-5 ${stats.totalPnl > 0 ? "text-green-400" : "text-red-400"}`} />, trend: stats.totalPnl > 0 ? "up" : "down" },
            { label: "Active Volume", value: stats.activeVolume, icon: <Shield className="h-5 w-5 text-purple-400" />, trend: "volume" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {stat.icon}
                    <span className="text-sm text-slate-400">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Market Prices */}
        <Card className="mb-6 bg-slate-900/50 backdrop-blur border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-cyan-400" />
              <h3 className="font-semibold">Live Market Prices</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {cryptoAssets.map((asset) => (
                <div key={asset.symbol} className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{asset.icon}</span>
                    <span className="font-semibold text-sm text-white">{asset.symbol}</span>
                  </div>
                  <div className="text-white font-mono">${asset.price.toLocaleString()}</div>
                  <div className={`text-xs ${asset.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {asset.change24h >= 0 ? "+" : ""}{asset.change24h}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bot Control */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white">Bot Dashboard</h2>
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
              {stats.activeBots} Live / {stats.totalBots} Total
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search bots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px] bg-slate-900/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="stopped">Stopped</SelectItem>
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 border-0 text-white hover:underline hover:from-purple-500 hover:to-cyan-400">
                  <Plus className="mr-1 h-4 w-4" /> Create Bot
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Trading Bot</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Configure your automated trading bot. Start with a simple grid or DCA strategy.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-400 mb-1 block">Exchange</label>
                      <Select defaultValue="binance">
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Select exchange" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="binance">Binance US</SelectItem>
                          <SelectItem value="coinbase">Coinbase Pro</SelectItem>
                          <SelectItem value="kraken">Kraken</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400 mb-1 block">Trading Type</label>
                      <Select defaultValue="spot">
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Spot/Futures" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spot">Spot</SelectItem>
                          <SelectItem value="futures">Futures</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Strategy</label>
                    <Select defaultValue="grid">
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Choose strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid Trading</SelectItem>
                        <SelectItem value="dca">DCA (Dollar Cost Averaging)</SelectItem>
                        <SelectItem value="scalping">Scalping</SelectItem>
                        <SelectItem value="arbitrage">Arbitrage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <div>
                      <div className="font-medium text-white">Enable Live Trading</div>
                      <div className="text-sm text-slate-400">Start placing real trades immediately</div>
                    </div>
                    <Switch className="data-[state=checked]:bg-purple-600" />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Bot List */}
        <Tabs defaultValue="all">
          <div className="flex items-center gap-4 mb-4">
            <TabsList className="bg-slate-800/50 border border-slate-700">
              <TabsTrigger value="all" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-500">All Bots</TabsTrigger>
              <TabsTrigger value="active" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-500">Active</TabsTrigger>
              <TabsTrigger value="paused" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-500">Paused</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all">
            <div className="grid gap-4">
              {filteredBots.map((bot, i) => (
                <motion.div
                  key={bot.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={`bg-slate-900/50 backdrop-blur border-slate-700 hover:border-${bot.status === "active" ? "green-500" : bot.status === "paused" ? "amber-500" : "red-500"}/50`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bot.status === "active" ? "bg-green-500/20 text-green-400" : bot.status === "paused" ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"}`}>
                            <Bot className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-white">{bot.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">{bot.exchange}</Badge>
                              <span className="text-xs text-slate-500">•</span>
                              <span className="text-xs text-slate-400">{bot.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-xs text-slate-400">Daily P&L</div>
                            <div className={`font-semibold ${bot.dailyPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                              {bot.dailyPnl > 0 ? "+" : ""}${bot.dailyPnl.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-400">Total P&L</div>
                            <div className={`font-bold ${bot.totalPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                              {bot.totalPnl > 0 ? "+" : ""}${bot.totalPnl.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-400">Win Rate</div>
                            <div className="font-semibold text-white">{bot.winRate}%</div>
                          </div>
                          <Badge variant={bot.status === "active" ? "default" : bot.status === "paused" ? "outline" : "secondary"} 
                                 className={bot.status === "active" ? "bg-green-500/20 text-green-400 border-0" : bot.status === "paused" ? "border-amber-500/50 text-amber-400" : "border-red-500/50 text-red-400"}>
                            {bot.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>{bot.strategy}</span>
                          <span className="flex items-center gap-1">
                            {bot.tradeCount} trades
                          </span>
                          <span>Vol: ${(Math.random() * 100 + 20).toFixed(1)}K</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" 
                                  className={bot.status === "active" ? "text-red-400 hover:text-red-300" : "text-green-400 hover:text-green-300"}>
                            {bot.status === "active" ? "Pause" : "Start"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </motion.div>
  )
}
