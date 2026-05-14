"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Zap, Target, Shield, TrendingUp, AlertTriangle, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// DEX Trading Settings - Strategy, risk management, order types for decentralized exchanges
export function DEXTradingSettings() {
  const [activeTab, setActiveTab] = useState("strategy")

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Trading Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("strategy")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "strategy"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Strategy
        </button>
        <button
          onClick={() => setActiveTab("risk")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "risk"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Shield className="w-4 h-4 inline mr-2" />
          Risk Management
        </button>
        <button
          onClick={() => setActiveTab("order")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "order"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Target className="w-4 h-4 inline mr-2" />
          Order Types
        </button>
      </div>

      {/* Strategy Settings */}
      {activeTab === "strategy" && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              DEX Strategy Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">DEX Protocol</Label>
                <Select defaultValue="uniswap">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uniswap">Uniswap V3</SelectItem>
                    <SelectItem value="raydium">Raydium</SelectItem>
                    <SelectItem value="pancakeswap">PancakeSwap</SelectItem>
                    <SelectItem value="aave">Aave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Trading Strategy</Label>
                <Select defaultValue="swap">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="swap">Direct Swap</SelectItem>
                    <SelectItem value="limit">Limit Orders</SelectItem>
                    <SelectItem value="lp">Liquidity Provision</SelectItem>
                    <SelectItem value="farm">Yield Farming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Min Trade Size (USD)</Label>
                <Input defaultValue="5" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Max Trade Size (USD)</Label>
                <Input defaultValue="500" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">Auto-Swap Mode</div>
                  <div className="text-xs text-slate-400">Execute trades automatically on-chain</div>
                </div>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Management Settings */}
      {activeTab === "risk" && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              DEX Risk Management
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Max Position Size (USD)</Label>
                <Input defaultValue="500" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Daily Loss Limit (USD)</Label>
                <Input defaultValue="200" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Slippage Tolerance (%)</Label>
                <Input defaultValue="1" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Max Slippage (%)</Label>
                <Input defaultValue="5" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Gas Price Multiplier</Label>
                <Input defaultValue="1.2" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Max Gas Price (Gwei)</Label>
                <Input defaultValue="50" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">Auto-Stop on High Gas</div>
                  <div className="text-xs text-slate-400">Stop trading when gas prices exceed threshold</div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Types Settings */}
      {activeTab === "order" && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-green-400" />
              DEX Order Type Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Default Order Type</Label>
                <Select defaultValue="swap">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="swap">Instant Swap</SelectItem>
                    <SelectItem value="limit">Limit Order</SelectItem>
                    <SelectItem value="swap-router">Swap Router</SelectItem>
                    <SelectItem value="forked-swap">Forked Swap</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Transaction Timeout (seconds)</Label>
                <Input defaultValue="120" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Max Confirmation Blocks</Label>
                <Input defaultValue="3" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Min Liquidity (USD)</Label>
                <Input defaultValue="10000" className="bg-slate-800 border-slate-700 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
