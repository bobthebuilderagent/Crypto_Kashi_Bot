"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, TrendingUp, TrendingDown, BarChart3, Clock, Target, ChevronRight, Wallet, Plus, Activity, ArrowUpRight, ArrowDownRight, RefreshCw, Zap, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { predictionMarkets, mockPositions } from "@/data/mock"

// Platform-specific market data (filtered by active platform)
function getFilteredMarkets(platform: string) {
  if (platform === "all") return predictionMarkets
  return predictionMarkets.filter(m => m.platform === platform)
}

export function PredictionMarketPage() {
  const [platformTab, setPlatformTab] = useState("kalshi")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPlatform, setFilterPlatform] = useState("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [newMarketCategory, setNewMarketCategory] = useState("finance")
  const [newMarketPlatform, setNewMarketPlatform] = useState("kalshi")
  const [startingPrice, setStartingPrice] = useState([50])
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const categories = ["all", "Finance", "Crypto", "Politics", "Sports", "Tech", "Economics", "Entertainment"]

  const filteredMarkets = getFilteredMarkets(platformTab).filter(market => {
    const matchesSearch = market.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          market.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || market.category.toLowerCase() === filterCategory.toLowerCase()
    const matchesPlatform = filterPlatform === "all" || market.platform === filterPlatform.toLowerCase()
    return matchesSearch && matchesCategory && matchesPlatform
  })

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 p-6"
    >
      {/* Platform Toggle - Kalshi vs Polymarket (like CEX/DEX in CryptoBotPage) */}
      <div className="mb-6">
        <div className="flex justify-center">
          <Tabs defaultValue={platformTab} className="w-full max-w-2xl" onValueChange={setPlatformTab}>
            <TabsList className="bg-slate-800/50 border border-slate-700">
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Prediction Market</h1>
        <p className="text-slate-400">
          {platformTab === "kalshi" ? "Trade prediction assets on NFT-backed Kalshi markets" : "Trade prediction assets on Polymarket decentralized markets"}
        </p>
      </div>

      {/* Platform Badge */}
      <div className="mb-4 flex items-center gap-2">
        <Badge variant="outline" className={platformTab === "kalshi" ? "border-pink-500/50 text-pink-400" : "border-blue-500/50 text-blue-400"}>
          {platformTab === "kalshi" ? "🎨 Kalshi" : "🌐 Polymarket"}
        </Badge>
        <span className="text-xs text-slate-500">•</span>
        <span className="text-xs text-slate-400">{filteredMarkets.length} markets</span>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {platformTab === "kalshi" ? "$1.4M" : "$1.0M"}
              </div>
              <div className="text-xs text-slate-400">Total Volume</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {platformTab === "kalshi" ? "28" : "19"}
              </div>
              <div className="text-xs text-slate-400">Active Markets</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {platformTab === "kalshi" ? "8" : "4"}
              </div>
              <div className="text-xs text-slate-400">Settled Today</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <Wallet className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">$847K</div>
              <div className="text-xs text-slate-400">My Holdings</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between mb-4">
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
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <span className="cursor-pointer">
              <Button variant="outline" className="border-slate-700 bg-slate-900/50 text-white">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </span>
            <DialogContent className="bg-slate-950 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Filter Markets</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Category</Label>
                  <Select value={filterCategory} onValueChange={(v: string | null) => setFilterCategory(v ?? "all")}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Platform</Label>
                  <Select value={filterPlatform} onValueChange={(v: string | null) => setFilterPlatform(v ?? "all")}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="kalshi">Kalshi (NFT-backed)</SelectItem>
                    <SelectItem value="polymarket">Polymarket</SelectItem>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" className="border-slate-700" onClick={() => {setFilterCategory("all"); setFilterPlatform("all"); setSearchTerm("");}}>
                  Clear All
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-500" onClick={() => setIsFilterOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <span className="cursor-pointer">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-500 border-0 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Market
              </Button>
            </span>
            <DialogContent className="bg-slate-950 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Create New Prediction Market</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Set up a new market on {platformTab === "kalshi" ? "Kalshi" : "Polymarket"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Market Title</Label>
                  <Input className="bg-slate-800 border-slate-700 text-white" placeholder="Will X happen by Y date?" />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Category</Label>
                  <Select value={newMarketCategory} onValueChange={(v: string | null) => setNewMarketCategory(v ?? "finance")}>
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
                  <Select value={newMarketPlatform} onValueChange={(v: string | null) => setNewMarketPlatform(v ?? "kalshi")}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kalshi">Kalshi (NFT-backed)</SelectItem>
                      <SelectItem value="polymarket">Polymarket</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Closing Date</Label>
                  <Input type="date" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Starting Price</Label>
                  <Slider value={startingPrice} max={100} step={1} onValueChange={(v) => setStartingPrice(v as number[])} />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" className="border-slate-700">Cancel</Button>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-500">Create Market</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Markets List */}
      <Tabs defaultValue="active" className="mb-6 flex flex-col">
        <TabsList className="bg-slate-800/50 border border-slate-700 mb-4">
          <TabsTrigger value="active" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500">
            Active Markets
          </TabsTrigger>
          <TabsTrigger value="positions" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500">
            My Positions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid gap-4">
            {filteredMarkets.length === 0 ? (
              <Card className="bg-slate-900/50 border-slate-700">
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-400 mb-1">No Markets Found</h3>
                  <p className="text-sm text-slate-500">No markets match your current filters.</p>
                </CardContent>
              </Card>
            ) : (
              filteredMarkets.map((market, i) => {
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
                              <Badge variant="outline" className={market.platform === "kalshi" ? "border-pink-500/50 text-pink-400" : "border-blue-500/50 text-blue-400"}>
                                {market.platform === "kalshi" ? "🎨 Kalshi" : "🌐 Polymarket"}
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
                              <div className={`text-2xl font-bold ${yesColor}`}>{(market.yesPrice * 100).toFixed(0)}¢</div>
                              <div className="text-xs text-slate-400">Yes</div>
                            </div>
                            <div className="text-center">
                              <div className={`text-2xl font-bold ${noColor}`}>{(market.noPrice * 100).toFixed(0)}¢</div>
                              <div className="text-xs text-slate-400">No</div>
                            </div>
                            <div className="w-2 h-20 bg-slate-800 rounded-full overflow-hidden relative">
                              <div
                                className="bg-gradient-to-t from-green-500 to-green-400 rounded-full absolute bottom-0 w-full"
                                style={{ height: `${market.yesPrice * 100}%` }}
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
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="positions">
          <div className="grid gap-4">
            {mockPositions.length === 0 ? (
              <Card className="bg-slate-900/50 border-slate-700">
                <CardContent className="p-8 text-center">
                  <Wallet className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-400 mb-1">No Positions Yet</h3>
                  <p className="text-sm text-slate-500">Enter a position from the Markets tab to get started.</p>
                </CardContent>
              </Card>
            ) : (
              mockPositions.map((position, i) => (
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
                        <div className="flex items-center gap-4 ml-4">
                          <div className="text-right">
                            <div className={`text-lg font-bold ${position.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                              {position.pnl > 0 ? "+" : ""}${position.pnl.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-400">P&L</div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            Close
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Progress
                          value={position.pnl !== 0 && position.currentValue !== 0 ? (position.currentValue / Math.abs(position.currentValue - position.pnl)) * 100 : 0}
                          className="h-2 bg-slate-800"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </motion.section>
  )
}
