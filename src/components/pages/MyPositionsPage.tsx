"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Plus, Minus, Trash2, Eye, EyeOff, Edit, ArrowUpRight, ArrowDownRight, Zap, TrendingUp as TrendingUpIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Position {
  id: string
  marketId: string
  marketTitle: string
  question: string
  type: "YES" | "NO"
  amount: number
  cost: number
  potentialProfit: number
  status: "OPEN" | "RESOLVED"
  outcome?: "YES" | "NO"
  roi: number
  platform: string
}

export function MyPositionsPage() {
  const [platformTab, setPlatformTab] = useState("all")
  const [positions, setPositions] = useState<Position[]>([])
  const [resolvedPositions, setResolvedPositions] = useState<Position[]>([])
  const [expandedMarket, setExpandedMarket] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/prediction-positions")
      .then((r) => r.json())
      .then((data) => {
        // Map database fields to component fields
        const mapped = data.map((p: any) => ({
          id: p.id,
          marketId: p.market_id,
          marketTitle: p.market_title,
          question: p.market_title,
          type: p.side === "yes" ? "YES" : "NO",
          amount: p.shares,
          cost: p.price,
          potentialProfit: p.current_value,
          status: p.status === "resolved" ? "RESOLVED" : "OPEN",
          outcome: p.outcome ? (p.outcome === "yes" ? "YES" : "NO") : undefined,
          roi: p.pnl,
          platform: "",
        }))

        // Separate open and resolved positions
        const open = mapped.filter((p: Position) => p.status === "OPEN")
        const resolved = mapped.filter((p: Position) => p.status === "RESOLVED")
        setPositions(open)
        setResolvedPositions(resolved)
        setLoading(false)
      })
      .catch(() => {
        setPositions([])
        setResolvedPositions([])
        setLoading(false)
      })
  }, [])

  const filteredPositions = platformTab === "all" ? positions : positions.filter(p => p.platform.toLowerCase() === platformTab)

  const totalInvested = filteredPositions.reduce((sum, p) => sum + p.cost, 0)
  const totalPotentialProfit = filteredPositions.reduce((sum, p) => sum + p.potentialProfit, 0)
  const winningPositions = filteredPositions.filter(p => p.type === "YES" && p.potentialProfit > 0).length
  const totalPositions = filteredPositions.length

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
                    <TrendingUpIcon className="h-6 w-6" />
                    <span className="text-lg font-semibold">Polymarket</span>
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Positions</h1>
          <p className="text-slate-400">Track your prediction market investments and P&L</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20 rounded-xl p-4"
          >
            <div className="text-slate-400 text-sm mb-1">Total Invested</div>
            <div className="text-2xl font-bold text-white">${totalInvested.toFixed(2)}</div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/20 rounded-xl p-4"
          >
            <div className="text-slate-400 text-sm mb-1">Potential Profit</div>
            <div className="text-2xl font-bold text-green-400">+${totalPotentialProfit.toFixed(2)}</div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/20 rounded-xl p-4"
          >
            <div className="text-slate-400 text-sm mb-1">Winning Bets</div>
            <div className="text-2xl font-bold text-cyan-400">{winningPositions}</div>
            <div className="text-sm text-slate-500">{totalPositions} total</div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 rounded-xl p-4"
          >
            <div className="text-slate-400 text-sm mb-1">Avg ROI</div>
            <div className="text-2xl font-bold text-orange-400">
              {totalPositions > 0 ? ((totalPotentialProfit / totalInvested) * 100).toFixed(1) : 0}%
            </div>
          </motion.div>
        </div>

        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-400">
              {totalPositions} Active
            </Badge>
            <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400">
              {resolvedPositions.length} Resolved
            </Badge>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all">
              <Plus className="h-4 w-4" />
              New Position
            </button>
          </div>
        </div>

        {/* Positions Grid */}
        <div className="grid gap-4">
          {filteredPositions.map((position, index) => (
            <motion.div
              key={position.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                    onClick={() => setExpandedMarket(expandedMarket === position.id ? null : position.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg text-white">
                          {position.marketTitle}
                        </CardTitle>
                        <Badge className={position.type === "YES" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                          {position.type}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700">
                          {position.status}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700">
                          {position.platform}
                        </Badge>
                      </div>
                      <p className="text-slate-500 text-sm">{position.question}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedMarket(expandedMarket === position.id ? null : position.id)
                      }}
                      className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      {expandedMarket === position.id ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {expandedMarket === position.id ? (
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-950/50 rounded-lg p-3">
                        <div className="text-slate-500 text-xs mb-1">Amount</div>
                        <div className="text-white font-semibold">{position.amount}</div>
                      </div>
                      <div className="bg-slate-950/50 rounded-lg p-3">
                        <div className="text-slate-500 text-xs mb-1">Cost</div>
                        <div className="text-white font-semibold">${position.cost.toFixed(2)}</div>
                      </div>
                      <div className="bg-slate-950/50 rounded-lg p-3">
                        <div className="text-slate-500 text-xs mb-1">Potential Profit</div>
                        <div className="text-green-400 font-semibold">+${position.potentialProfit.toFixed(2)}</div>
                      </div>
                      <div className="bg-slate-950/50 rounded-lg p-3">
                        <div className="text-slate-500 text-xs mb-1">ROI</div>
                        <div className={`font-semibold ${position.roi > 100 ? "text-green-400" : "text-orange-400"}`}>
                          {position.roi > 100 ? "+" : ""}{position.roi}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500/20 to-green-600/10 border border-green-500/30 text-green-400 rounded-lg hover:from-green-500/30 hover:to-green-600/20 transition-all">
                        {position.type === "YES" ? <ArrowUpRight className="h-4 w-4 inline mr-2" /> : <ArrowDownRight className="h-4 w-4 inline mr-2" />}
                        {position.type === "YES" ? "Take Profit" : "Take Loss"}
                      </button>
                      <button className="flex-1 py-2 px-4 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="flex-1 py-2 px-4 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  ) : (
                    <div className="flex items-center py-4">
                      <span className="text-slate-600 text-sm italic">{loading ? "Loading positions..." : "Click to expand position details..."}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Resolved Positions Section */}
        {resolvedPositions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-slate-400">Resolved Positions</h3>
            </div>
            <div className="grid gap-4">
              {resolvedPositions.map((position, index) => (
                <motion.div
                  key={position.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-slate-900/30 border-slate-800/50 opacity-75">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-slate-400 text-sm mb-1">{position.marketTitle}</div>
                          <div className="flex items-center gap-2">
                            <Badge className={position.outcome === "YES" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                              {position.outcome}
                            </Badge>
                            <span className="text-slate-500 text-sm">
                              P&L: {position.outcome === position.type ? "+" : "-"}${(position.potentialProfit * (position.roi / 100)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <button className="text-slate-500 hover:text-white">
                          <EyeOff className="h-5 w-5" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
