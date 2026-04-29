"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown, Plus, Minus, Trash2, Eye, EyeOff, Edit, ArrowUpRight, ArrowDownRight } from "lucide-react"
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
}

export function MyPositionsPage() {
  const [positions, setPositions] = useState<Position[]>([
    {
      id: "1",
      marketId: "m1",
      marketTitle: "Bitcoin to hit $100K by end of 2026",
      question: "Will Bitcoin reach $100,000 USD before December 31, 2026?",
      type: "YES",
      amount: 50,
      cost: 25.00,
      potentialProfit: 75.00,
      status: "OPEN",
      roi: 200,
    },
    {
      id: "2",
      marketId: "m2",
      marketTitle: "Ethereum ETF approval",
      question: "Will the SEC approve a spot Ethereum ETF in Q3 2026?",
      type: "NO",
      amount: 100,
      cost: 45.00,
      potentialProfit: 55.00,
      status: "OPEN",
      roi: 22,
    },
    {
      id: "3",
      marketId: "m3",
      marketTitle: "Solana network upgrade",
      question: "Will Solana complete its Firedancer upgrade by June 2026?",
      type: "YES",
      amount: 75,
      cost: 30.00,
      potentialProfit: 90.00,
      status: "OPEN",
      roi: 200,
    },
  ])

  const [resolvedPositions, setResolvedPositions] = useState<Position[]>([])
  const [showResolved, setShowResolved] = useState(false)
  const [expandedMarket, setExpandedMarket] = useState<string | null>(null)

  const totalInvested = positions.reduce((sum, p) => sum + p.cost, 0)
  const totalPotentialProfit = positions.reduce((sum, p) => sum + p.potentialProfit, 0)
  const winningPositions = positions.filter(p => p.type === "YES" && p.potentialProfit > 0).length
  const totalPositions = positions.length

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
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
            <button
              onClick={() => setShowResolved(!showResolved)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4" />
              {showResolved ? "Hide Resolved" : "Show Resolved"}
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all">
              <Plus className="h-4 w-4" />
              New Position
            </button>
          </div>
        </div>

        {/* Positions Grid */}
        <div className="grid gap-4">
          {positions.map((position, index) => (
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
                      <span className="text-slate-600 text-sm italic">Click to expand position details...</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Resolved Positions Section */}
        {showResolved && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <EyeOff className="h-5 w-5 text-slate-500" />
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
