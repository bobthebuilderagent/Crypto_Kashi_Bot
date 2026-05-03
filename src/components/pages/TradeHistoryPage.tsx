"use client"

import React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Download, ChevronDown, ChevronUp, RefreshCw, Eye, Copy, X, Zap, CircleDollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockBots, mockTrades } from "@/data/mock"
import { useAppContext } from "@/lib/providers"

// CEX trades
const cexTrades = [
  { id: 't-1', botId: 'cex-1', symbol: 'BTC/USDT', side: 'buy', price: 65000, volume: 0.5, pnl: 125.50, timestamp: '2026-04-26T14:30:00Z', status: 'closed', exchange: 'Binance', type: 'spot' },
  { id: 't-2', botId: 'cex-2', symbol: 'ETH/USDT', side: 'sell', price: 3600, volume: 2.0, pnl: 345.20, timestamp: '2026-04-26T15:15:00Z', status: 'closed', exchange: 'Coinbase Pro', type: 'futures' },
  { id: 't-3', botId: 'cex-4', symbol: 'SOL/USDT', side: 'buy', price: 170, volume: 10.0, pnl: -23.40, timestamp: '2026-04-26T16:00:00Z', status: 'closed', exchange: 'Kraken', type: 'spot' },
  { id: 't-4', botId: 'cex-1', symbol: 'BTC/USDT', side: 'sell', price: 66500, volume: 0.5, pnl: 775.00, timestamp: '2026-04-26T17:30:00Z', status: 'closed', exchange: 'Binance', type: 'spot' },
  { id: 't-5', botId: 'cex-2', symbol: 'ETH/USDT', side: 'buy', price: 3400, volume: 2.0, pnl: 120.80, timestamp: '2026-04-26T18:00:00Z', status: 'closed', exchange: 'Coinbase Pro', type: 'futures' },
  { id: 't-6', botId: 'cex-4', symbol: 'BTC/USDT', side: 'buy', price: 67000, volume: 0.3, pnl: -45.20, timestamp: '2026-04-26T18:45:00Z', status: 'closed', exchange: 'Binance US', type: 'futures' },
]

// DEX trades
const dexTrades = [
  { id: 'dt-1', botId: 'dex-1', symbol: 'BTC/ETH', side: 'buy', price: 19.45, volume: 2.5, pnl: 89.30, timestamp: '2026-04-26T14:30:00Z', status: 'closed', exchange: 'Uniswap V3', type: 'spot' },
  { id: 'dt-2', botId: 'dex-2', symbol: 'SOL/USDC', side: 'sell', price: 178.50, volume: 15.0, pnl: 234.50, timestamp: '2026-04-26T15:15:00Z', status: 'closed', exchange: 'Raydium', type: 'spot' },
  { id: 'dt-3', botId: 'dex-4', symbol: 'ETH/USDC', side: 'buy', price: 3455.00, volume: 1.0, pnl: -12.30, timestamp: '2026-04-26T16:00:00Z', status: 'closed', exchange: 'Uniswap V3', type: 'spot' },
  { id: 'dt-4', botId: 'dex-1', symbol: 'BTC/ETH', side: 'sell', price: 19.50, volume: 2.5, pnl: 123.40, timestamp: '2026-04-26T17:30:00Z', status: 'closed', exchange: 'Uniswap V3', type: 'spot' },
  { id: 'dt-5', botId: 'dex-2', symbol: 'SOL/USDC', side: 'buy', price: 178.20, volume: 15.0, pnl: 67.80, timestamp: '2026-04-26T18:00:00Z', status: 'closed', exchange: 'Raydium', type: 'spot' },
  { id: 'dt-6', botId: 'dex-3', symbol: 'WBTC/ETH', side: 'sell', price: 19.42, volume: 1.0, pnl: -45.60, timestamp: '2026-04-26T18:45:00Z', status: 'closed', exchange: 'Uniswap V2', type: 'spot' },
]

export function TradeHistoryPage() {
  const { exchangeType, setExchangeType } = useAppContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterExchange, setFilterExchange] = useState<string | null>("all")
  const [filterSide, setFilterSide] = useState<string | null>("all")
  const [filterType, setFilterType] = useState<string | null>("all")
  const [expandedTrades, setExpandedTrades] = useState<Record<string, boolean>>({})
  const [sortBy, setSortBy] = useState<string | null>("date")

  // Select trades based on exchange type
  const trades = exchangeType === "cex" ? cexTrades : dexTrades

  const filterOptions = {
    exchange: [...new Set(trades.map(t => t.exchange))],
    side: ["all", "long", "short"],
    type: ["all", "spot", "futures"],
  }

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesExchange = !filterExchange || filterExchange === "all" || trade.exchange.toLowerCase() === filterExchange.toLowerCase()
    const matchesSide = filterSide === "all" || trade.side === filterSide
    const matchesType = !filterType || filterType === "all" || trade.type === filterType
    return matchesSearch && matchesExchange && matchesSide && matchesType
  })

  const sortTrades = () => {
    return [...filteredTrades].sort((a, b) => {
      switch (sortBy) {
        case "date": return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        case "volume": return b.volume - a.volume
        case "pnl": return b.pnl - a.pnl
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
        <h1 className="text-3xl font-bold text-white mb-2">
          Trade History
          <span className="ml-2 text-sm text-slate-400 font-normal">
            ({exchangeType === "cex" ? "Centralized" : "Decentralized"} Exchanges)
          </span>
        </h1>
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
                  <th className="text-right py-3 px-4 text-sm text-slate-400">P&L</th>
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
                        <td className="py-3 px-4 text-right text-white">{trade.volume}</td>
                        <td className="py-3 px-4 text-right text-white">
                          {exchangeType === "cex" ? `$${trade.price.toLocaleString()}` : `$${trade.price.toFixed(4)}`}
                        </td>
                        <td className={`py-3 px-4 text-right font-semibold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.pnl > 0 ? '+' : ''}${trade.pnl.toLocaleString()}
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
                          <td colSpan={9} className="py-4 px-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-slate-400">Type:</div>
                                <div className="text-white">{trade.type.toUpperCase()}</div>
                              </div>
                              <div>
                                <div className="text-slate-400">Volume:</div>
                                <div className="text-white">{trade.volume}</div>
                              </div>
                              <div>
                                <div className="text-slate-400">Exchange:</div>
                                <div className="text-white">{trade.exchange}</div>
                              </div>
                              <div>
                                <div className="text-slate-400">Status:</div>
                                <div className="text-white">{trade.status}</div>
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
