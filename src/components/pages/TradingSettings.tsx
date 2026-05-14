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

// Trading Settings - Strategy, risk management, order types
export function TradingSettings() {
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
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Strategy Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Default Strategy</Label>
                <Select defaultValue="grid">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid Trading</SelectItem>
                    <SelectItem value="dca">Dollar Cost Averaging</SelectItem>
                    <SelectItem value="momentum">Momentum</SelectItem>
                    <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                    <SelectItem value="custom">Custom Strategy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Trading Frequency</Label>
                <Select defaultValue="medium">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (1 trade/hour)</SelectItem>
                    <SelectItem value="medium">Medium (5 trades/hour)</SelectItem>
                    <SelectItem value="high">High (20 trades/hour)</SelectItem>
                    <SelectItem value="ultra">Ultra (50+ trades/hour)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Min Trade Size (USD)</Label>
                <Input defaultValue="10" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Max Trade Size (USD)</Label>
                <Input defaultValue="1000" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">Paper Trading Mode</div>
                  <div className="text-xs text-slate-400">Simulate trades without real funds</div>
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
              Risk Management
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Max Position Size (USD)</Label>
                <Input defaultValue="1000" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Daily Loss Limit (USD)</Label>
                <Input defaultValue="500" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Stop Loss (%)</Label>
                <Input defaultValue="2" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Take Profit (%)</Label>
                <Input defaultValue="5" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Max Leverage</Label>
                <Select defaultValue="1">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1x (Spot Only)</SelectItem>
                    <SelectItem value="3">3x</SelectItem>
                    <SelectItem value="5">5x</SelectItem>
                    <SelectItem value="10">10x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">Auto-Stop on Drawdown</div>
                  <div className="text-xs text-slate-400">Stop trading if loss exceeds threshold</div>
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
              Order Type Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Default Order Type</Label>
                <Select defaultValue="limit">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="limit">Limit</SelectItem>
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="stop-limit">Stop Limit</SelectItem>
                    <SelectItem value="take-profit">Take Profit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Order Execution Mode</Label>
                <Select defaultValue="immediate">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate or Cancel</SelectItem>
                    <SelectItem value="fill-or-kill">Fill or Kill</SelectItem>
                    <SelectItem value="good-til-cancelled">Good Till Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Slippage Tolerance (%)</Label>
                <Input defaultValue="1" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Gas Price Multiplier</Label>
                <Input defaultValue="1.5" className="bg-slate-800 border-slate-700 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
