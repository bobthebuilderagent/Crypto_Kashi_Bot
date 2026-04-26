"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { predictionMarkets, mockPositions } from "@/data/mock"
import { Target, TrendingUp, Clock, DollarSign, BarChart3, Search, Filter, Fire } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export function PredictionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [marketType, setMarketType] = useState("markets")

  const filteredMarkets = predictionMarkets.filter((market) => {
    const matchesSearch = market.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "All" || market.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalValue = mockPositions.reduce((sum, pos) => sum + pos.currentValue, 0)
  const totalPnl = mockPositions.reduce((sum, pos) => sum + pos.pnl, 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-950 text-white"
    >
      {/* Portfolio Overview */}
      <section className="px-4 pt-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { 
              label: "Portfolio Value", 
              value: `$${totalValue.toLocaleString()}`, 
              icon: <DollarSign className="h-5 w-5 text-purple-400" />,
              color: "from-purple-600 to-pink-500"
            },
            { 
              label: "Total P&L", 
              value: `${totalPnl > 0 ? "+" : ""}$${totalPnl.toLocaleString()}`, 
              icon: <TrendingUp className="h-5 w-5 ${totalPnl >= 0 ? "text-green-400" : "text-red-400"}" />,
              color: totalPnl >= 0 ? "from-green-600 to-emerald-500" : "from-red-600 to-rose-500"
            },
            { 
              label: "Active Positions", 
              value: mockPositions.length.toString(), 
              icon: <BarChart3 className="h-5 w-5 text-cyan-400" />,
              color: "from-cyan-600 to-blue-500"
            },
            { 
              label: "Win Rate", 
              value: `${(75 + Math.random() * 10).toFixed(1)}%`, 
              icon: <Target className="h-5 w-5 text-amber-400" />,
              color: "from-amber-600 to-yellow-500"
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`bg-slate-900/50 backdrop-blur border-slate-700 overflow-hidden relative min-h-[100px]`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-10`} />
                <CardContent className="p-4 relative z-10">
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

        {/* Hot Markets Banner */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <Fire className="h-6 w-6 text-orange-400 animate-pulse" />
              <div>
                <h3 className="font-semibold text-white">🔥 Hot Markets</h3>
                <p className="text-sm text-slate-400">BTC and ETH markets are trending with high volume</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Market Feed Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white">Prediction Markets</h2>
            <Badge variant="outline" className="border-purple-500/50 text-purple-400">
              {filteredMarkets.length} Markets
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[140px] bg-slate-900/50 border-slate-700 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Crypto">Crypto</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Politics">Politics</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Tech">Tech</SelectItem>
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-500 border-0 text-white hover:from-purple-500 hover:to-pink-400">
                  <Fire className="mr-1 h-4 w-4" /> Create Market
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Prediction Market</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Set up a new prediction market for your community or audience.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label className="text-sm text-slate-400 mb-1 block">Market Title</Label>
                    <Input placeholder="Will X happen by date?" className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-slate-400 mb-1 block">Category</Label>
                      <Select defaultValue="finance">
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="crypto">Crypto</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="politics">Politics</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="tech">Tech</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm text-slate-400 mb-1 block">Market Type</Label>
                      <Select defaultValue="kashi">
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kashi">Kashi (NFT-backed)</SelectItem>
                          <SelectItem value="polymarket">Polymarket</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-slate-400 mb-1 block">Closing Date</Label>
                      <Input type="date" className="bg-slate-800 border-slate-700 text-white" />
                    </div>
                    <div>
                      <Label className="text-sm text-slate-400 mb-1 block">Starting Price</Label>
                      <Slider defaultValue={[50]} max={100} step={1} className="bg-slate-800 border-slate-700 text-white" />
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Markets List */}
        <Tabs defaultValue="markets" className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <TabsList className="bg-slate-800/50 border border-slate-700">
              <TabsTrigger value="markets" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500">
                Markets
              </TabsTrigger>
              <TabsTrigger value="positions" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500">
                My Positions
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="markets">
            <div className="grid gap-4">
              {filteredMarkets.map((market, i) => {
                const yesColor = market.yesPrice > 0.5 ? "text-green-400" : "text-amber-400"
                const noColor = market.noPrice > 0.5 ? "text-green-400" : "text-amber-400"

                return (
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
                              <Badge variant="outline" className={`text-xs ${market.platform === "kashi" ? "border-pink-500/50 text-pink-400" : "border-blue-500/50 text-blue-400"}`}>
                                {market.platform === "kashi" ? "🎨 Kashi" : "🌐 Polymarket"}
                              </Badge>
                              <span className="text-xs text-slate-500">•</span>
                              <span className="text-xs text-slate-400">{market.closeDate}</span>
                            </div>
                            <h3 className="font-semibold text-white mb-2">{market.title}</h3>
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                              <span>Vol: {market.volume}</span>
                              <span>Liq: {market.liquidity}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 ml-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-400">{(market.yesPrice * 100).toFixed(0)}¢</div>
                              <div className="text-xs text-slate-400">Yes</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-400">{(market.noPrice * 100).toFixed(0)}¢</div>
                              <div className="text-xs text-slate-400">No</div>
                            </div>
                            <div className="w-2 h-20 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="bg-gradient-to-t from-green-500 to-green-400 rounded-full"
                                style={{ height: `${market.yesPrice * 100}%`, marginTop: 'auto' }}
                              />
                            </div>
                            <Button variant="default" size="sm" className="bg-gradient-to-r from-purple-600 to-pink-500 border-0 text-white">
                              Trade
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="positions">
            <div className="grid gap-4">
              {mockPositions.map((position, i) => (
                <motion.div
                  key={position.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="bg-slate-900/50 backdrop-blur border-slate-700 hover:border-green-500/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={position.side === "yes" ? "default" : "secondary"} 
                                   className={`${position.side === "yes" ? "bg-green-500/20 text-green-400 border-0" : "bg-red-500/20 text-red-400 border-0"}`}>
                              {position.side.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-slate-400">{position.shares} shares @ ${(position.price * 100).toFixed(0)}¢</span>
                          </div>
                          <h3 className="font-semibold text-white mb-1">{position.marketTitle}</h3>
                          <div className="text-xs text-slate-400">Current value: ${position.currentValue.toLocaleString()}</div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-lg font-bold">{position.pnl > 0 ? "+" : ""}${position.pnl.toLocaleString()}</div>
                          <div className="text-xs text-slate-400">P&L</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Progress 
                          value={(position.currentValue / (position.currentValue - position.pnl)) * 100} 
                          className="h-2 bg-slate-800" 
                        />
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
