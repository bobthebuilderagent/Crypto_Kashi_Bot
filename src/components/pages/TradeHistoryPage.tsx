"use client"

import React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Download, ChevronDown, ChevronUp, RefreshCw, Eye, Copy, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockBots, mockTrades } from "@/data/mock"

export function TradeHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterExchange, setFilterExchange] = useState<string | null>("all")
  const [filterSide, setFilterSide] = useState<string | null>("all")
  const [filterType, setFilterType] = useState<string | null>("all")
  const [expandedTrades, setExpandedTrades] = useState<Record<string, boolean>>({})
  const [sortBy, setSortBy] = useState<string | null>("date")

  const filterOptions = {
    exchange: [...new Set(mockBots.flatMap(b => b.exchange))],
    side: ["all", "long", "short"],
    type: ["all", "spot", "futures"],
  }

  // Get bot data for trade filtering and mapping
  const botMap = new Map(mockBots.map(b => [b.id, b]))

  const filteredTrades = mockTrades.filter(trade => {
    const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.id.toLowerCase().includes(searchTerm.toLowerCase())
    const bot = botMap.get(trade.botId)
    const matchesExchange = !filterExchange || filterExchange === "all" || (bot?.exchange || "").toLowerCase() === filterExchange.toLowerCase()
    const matchesSide = filterSide === "all" || trade.side === filterSide
    const matchesType = !filterType || filterType === "all" || (bot?.type || "").toLowerCase() === filterType.toLowerCase()
    return matchesSearch && matchesExchange && matchesSide && matchesType
  })

  // Map bot data to trades for display
  const tradesWithBotData = filteredTrades.map(trade => ({
    ...trade,
    exchange: botMap.get(trade.botId)?.exchange || "Unknown",
    type: botMap.get(trade.botId)?.type || "unknown",
    size: trade.volume,
    entryPrice: trade.price,
    exitPrice: trade.price, // Using entry price as exit for simplicity
    leverage: 1, // Default leverage
    fee: 0, // Default fee
    roi: botMap.get(trade.botId)?.winRate || 0, // Using win rate as ROI for display
  }))

  const sortTrades = () => {
    return [...tradesWithBotData].sort((a, b) => {
      switch (sortBy) {
        case "date": return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        case "volume": return b.volume - a.volume
        case "pnl": return b.pnl - a.pnl
        case "roi": return b.roi - a.roi
        default: return 0
      }
    })
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
        <h1 className="text-3xl font-bold text-white mb-2">Trade History</h1>
        <p className="text-slate-400">View and analyze all your trading activity</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Eye className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{filteredTrades.length}</div>
              <div className="text-xs text-slate-400">Total Trades</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Badge className="w-5 h-5 text-white" variant="outline" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {filteredTrades.filter(t => t.pnl >= 0).length}
              </div>
              <div className="text-xs text-slate-400">Winning</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <X className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {filteredTrades.filter(t => t.pnl < 0).length}
              </div>
              <div className="text-xs text-slate-400">Losing</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <RefreshCw className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                ${filteredTrades.reduce((sum, t) => sum + Math.abs(t.pnl), 0).toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">Total P&L</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search trades..."
              className="w-full bg-slate-900/50 border-slate-700 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Exchange:</span>
            <Select value={filterExchange} onValueChange={setFilterExchange}>
              <SelectTrigger className="w-36 bg-slate-900/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exchanges</SelectItem>
                {filterOptions.exchange.map(ex => (
                  <SelectItem key={ex} value={ex.toLowerCase()}>{ex.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSide} onValueChange={setFilterSide}>
              <SelectTrigger className="w-32 bg-slate-900/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.side.map(side => (
                  <SelectItem key={side} value={side}>{side.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-36 bg-slate-900/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.type.map(type => (
                  <SelectItem key={type} value={type}>{type.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 bg-slate-900/50 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="pnl">P&L</SelectItem>
              <SelectItem value="roi">ROI</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-slate-700 bg-slate-900/50 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Trade List */}
      <Card className="bg-slate-900/50 backdrop-blur border-slate-700">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-sm text-slate-400">Trade ID</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-400">Pair</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-400">Exchange</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-400">Side</th>
                  <th className="text-right py-3 px-4 text-sm text-slate-400">Size</th>
                  <th className="text-right py-3 px-4 text-sm text-slate-400">Entry</th>
                  <th className="text-right py-3 px-4 text-sm text-slate-400">Exit</th>
                  <th className="text-right py-3 px-4 text-sm text-slate-400">P&L</th>
                  <th className="text-right py-3 px-4 text-sm text-slate-400">ROI</th>
                  <th className="text-right py-3 px-4 text-sm text-slate-400">Time</th>
                  <th className="text-center py-3 px-4 text-sm text-slate-400">Details</th>
                </tr>
              </thead>
              <tbody>
                {sortTrades().map((trade, i) => {
                  const isExpanded = expandedTrades[trade.id]
                  return (
                    <React.Fragment key={trade.id}>
                      <motion.tr
                        key={trade.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer"
                        onClick={() => setExpandedTrades(prev => ({ ...prev, [trade.id]: !isExpanded }))}
                      >
                        <td className="py-3 px-4 text-white font-mono text-sm">{trade.id.slice(0, 8)}</td>
                        <td className="py-3 px-4">
                          <div className="text-white font-semibold">{trade.symbol}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                            {trade.exchange.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-sm ${trade.side === 'long' ? 'text-green-400' : 'text-red-400'}`}>
                            {trade.side.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-white">{trade.size}</td>
                        <td className="py-3 px-4 text-right text-white">${trade.entryPrice.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-white">{trade.exitPrice ? `$${trade.exitPrice.toLocaleString()}` : '-'}</td>
                        <td className={`py-3 px-4 text-right font-semibold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.pnl > 0 ? '+' : ''}${trade.pnl.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`${trade.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {trade.roi.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-white">
                          {new Date(trade.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </motion.tr>
                      {isExpanded && (
                        <motion.tr
                          key={`${trade.id}-detail`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-slate-800/30"
                        >
                          <td colSpan={11} className="py-4 px-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-slate-400">Type:</div>
                                <div className="text-white">{trade.type.toUpperCase()}</div>
                              </div>
                              <div>
                                <div className="text-slate-400">Volume:</div>
                                <div className="text-white">${trade.volume.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-slate-400">Fee:</div>
                                <div className="text-white">${trade.fee.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-slate-400">Leverage:</div>
                                <div className="text-white">{trade.leverage ? `${trade.leverage}x` : '1x'}</div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  )
}