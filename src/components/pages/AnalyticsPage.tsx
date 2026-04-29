"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, LineChart, PieChart, Calendar, Download, Share2, Filter, ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cryptoAssets, mockBots } from "@/data/mock"

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedBot, setSelectedBot] = useState<string | null>("all")
  const [timeRangeOption, setTimeRangeOption] = useState<string | null>("7d")

  const timeRanges = [
    { label: "24h", value: "24h" },
    { label: "7d", value: "7d" },
    { label: "30d", value: "30d" },
    { label: "90d", value: "90d" },
  ]

  const analytics = {
    totalTrades: 1247,
    winRate: 67.3,
    avgTradeValue: "$3,247",
    totalProfit: "$28,432",
    bestPerforming: "Grid Bot",
    worstPerforming: "Scalper Bot",
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
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-slate-400">Detailed performance metrics and trading statistics</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(analytics).map(([key, value], i) => {
          const label = key.replace(/([A-Z])/g, ' $1').trim().replace('Total', 'Total')
          return (
            <Card key={key} className="bg-slate-900/50 border-slate-700" style={{ transitionDelay: `${i * 100}ms` }}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{value}</div>
                  <div className="text-xs text-slate-400 capitalize">{label}</div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-slate-700 bg-slate-900/50 text-white">
              <LineChart className="w-4 h-4 mr-2" />
              Volume
            </Button>
            <Button variant="outline" className="border-slate-700 bg-slate-900/50 text-white">
              <PieChart className="w-4 h-4 mr-2" />
              Win Rate
            </Button>
            <Button variant="outline" className="border-slate-700 bg-slate-900/50 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Time Range:</span>
            <Select value={timeRangeOption} onValueChange={setTimeRangeOption}>
              <SelectTrigger className="w-32 bg-slate-900/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Bot:</span>
            <Select value={selectedBot} onValueChange={setSelectedBot}>
              <SelectTrigger className="w-32 bg-slate-900/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bots</SelectItem>
                {mockBots.map(bot => (
                  <SelectItem key={bot.id} value={bot.id}>{bot.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-700 bg-slate-900/50 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="border-slate-700 bg-slate-900/50 text-white">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Overview */}
        <Card className="bg-slate-900/50 backdrop-blur border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Performance Overview
            </h3>
            <div className="space-y-4">
              {mockBots.slice(0, 4).map((bot, i) => (
                <div key={bot.id} className="p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{bot.icon}</span>
                      <span className="font-semibold text-white">{bot.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                      {bot.strategy}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Total Trades:</span>
                      <span className="text-white">{Math.floor(Math.random() * 500) + 50}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Win Rate:</span>
                      <span className={`${bot.winRate >= 60 ? "text-green-400" : "text-red-400"}`}>
                        {bot.winRate}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">P&L:</span>
                      <span className={`${bot.totalPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {bot.totalPnl > 0 ? "+" : ""}${bot.totalPnl.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Asset Performance */}
        <Card className="bg-slate-900/50 backdrop-blur border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            </h3>
            <div className="space-y-3">
              {cryptoAssets.slice(0, 5).map((asset, i) => (
                <div key={asset.symbol} className="p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{asset.icon}</span>
                      <span className="font-semibold text-white">{asset.symbol}</span>
                    </div>
                    <span className="text-xs text-slate-400">{asset.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-slate-400">Price:</span>
                      <span className="text-white ml-2">${asset.price.toLocaleString()}</span>
                    </div>
                    <div className={`text-sm ${asset.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {asset.change24h >= 0 ? "+" : ""}{asset.change24h}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Bots Table */}
      <Card className="bg-slate-900/50 backdrop-blur border-slate-700 mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" />
            Top Performing Bots
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-sm text-slate-400">Bot Name</th>
                  <th className="text-right py-3 px-4 text-sm text-slate-400">Trades</th>
                  <th className="text-right py-3 px-4 text-sm text-slate-400">Win Rate</th>
                  <th className="text-right py-3 px-4 text-sm text-slate-400">Total P&L</th>
                  <th className="text-right py-3 px-4 text-sm text-slate-400">ROI</th>
                </tr>
              </thead>
              <tbody>
                {[...mockBots].sort((a, b) => b.totalPnl - a.totalPnl).slice(0, 5).map((bot, i) => (
                  <tr key={bot.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{bot.icon}</span>
                        <span className="text-white">{bot.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-white">{Math.floor(Math.random() * 500) + 50}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`${bot.winRate >= 60 ? "text-green-400" : "text-red-400"}`}>
                        {bot.winRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`${bot.totalPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {bot.totalPnl > 0 ? "+" : ""}${bot.totalPnl.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-semibold ${bot.totalPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {((bot.totalPnl / bot.totalInvestment) * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  )
}