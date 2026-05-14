"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Key, Wallet, Globe, Save, Download, Upload, Lock, Unlock, RefreshCw, Bell, Activity, Zap, Settings as SettingsIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppContext } from "@/lib/providers"

// Category definitions
const categories = [
  { id: "general", name: "General", icon: <Globe className="w-4 h-4" /> },
  { id: "trading", name: "Trading", icon: <Zap className="w-4 h-4" /> },
  { id: "api-keys", name: "API Keys", icon: <Key className="w-4 h-4" /> },
  { id: "wallets", name: "Wallets", icon: <Wallet className="w-4 h-4" /> },
  { id: "notifications", name: "Notifications", icon: <Bell className="w-4 h-4" /> },
  { id: "security", name: "Security", icon: <Lock className="w-4 h-4" /> },
]

// Sidebar navigation component
function SettingsSidebar({ tabs, selectedTab, onSelect }: { tabs: Array<{ id: string; name: string; icon: React.ReactNode }>; selectedTab: string; onSelect: (id: string) => void }) {
  return (
    <nav className="w-56 shrink-0 py-6 space-y-1">
      <div className="mb-6 px-3">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Settings</h2>
      </div>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${selectedTab === tab.id
              ? "bg-slate-800 text-white font-medium"
              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            }`}
        >
          {tab.icon}
          {tab.name}
        </button>
      ))}
    </nav>
  )
}

// CEX Settings Panel (General Tab)
// Note: API Keys are handled in the separate API Keys tab — this panel covers
// bot-level general settings for CEX trading.
function CEXSettingsPanel() {
  return (
    <div className="space-y-5 max-w-2xl">
      {/* Bot Profile */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-cyan-400" />
            Bot Profile
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Bot Name</Label>
              <Input defaultValue="My Trading Bot" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Description</Label>
              <Input placeholder="Describe your trading bot" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Bot Status</div>
                <div className="text-xs text-slate-400">Active / Paused / Stopped</div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display Preferences */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            Display Preferences
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Display Currency</Label>
              <Select defaultValue="USD">
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Timezone</Label>
              <Select defaultValue="UTC">
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                  <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                  <SelectItem value="CET">Central European (CET)</SelectItem>
                  <SelectItem value="JST">Japan Standard (JST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Performance Tracking</div>
                <div className="text-xs text-slate-400">Track P&L and performance metrics</div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Mode */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            Trading Mode
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Trading Mode</Label>
              <Select defaultValue="live">
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paper">Paper Trading (Simulated)</SelectItem>
                  <SelectItem value="live">Live Trading</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Auto-Trading</div>
                <div className="text-xs text-slate-400">Automatically execute trades based on signals</div>
              </div>
              <Switch className="data-[state=checked]:bg-green-600" />
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">DCA (Dollar Cost Averaging)</div>
                <div className="text-xs text-slate-400">Enable dollar cost averaging for entries</div>
              </div>
              <Switch className="data-[state=checked]:bg-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Default Trading Settings */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-purple-400" />
            Default Trading Settings
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
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Default Leverage</Label>
              <Select defaultValue="1">
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1x (Spot)</SelectItem>
                  <SelectItem value="3">3x</SelectItem>
                  <SelectItem value="5">5x</SelectItem>
                  <SelectItem value="10">10x</SelectItem>
                  <SelectItem value="20">20x</SelectItem>
                  <SelectItem value="50">50x</SelectItem>
                  <SelectItem value="100">100x</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Default Slippage Tolerance (%)</Label>
              <Input defaultValue="1" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Default Fee Tier</Label>
              <Select defaultValue="maker">
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maker">Maker</SelectItem>
                  <SelectItem value="taker">Taker</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Default Trading Pairs */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400" />
            Default Trading Pairs
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div className="text-sm text-white font-mono">BTC/USDT</div>
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">Active</Badge>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div className="text-sm text-white font-mono">ETH/USDT</div>
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">Active</Badge>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div className="text-sm text-white font-mono">SOL/USDT</div>
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">Active</Badge>
            </div>
            <Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400 mt-2">
              + Add Trading Pair
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// DEX Settings Panel (General Tab)
// Note: API Keys are handled in the separate API Keys tab — this panel covers
// bot-level general settings for DEX trading.
function DEXSettingsPanel() {
  return (
    <div className="space-y-5 max-w-2xl">
      {/* Bot Profile */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-cyan-400" />
            Bot Profile
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Bot Name</Label>
              <Input defaultValue="My DEX Bot" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Description</Label>
              <Input placeholder="Describe your DEX trading bot" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Bot Status</div>
                <div className="text-xs text-slate-400">Active / Paused / Stopped</div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Connection */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-green-400" />
            Connected Wallet
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm flex items-center gap-2">
                  <span>🦊</span> MetaMask
                </div>
                <div className="text-xs text-slate-400">0x71C...3A2F</div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">Connected</Badge>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm flex items-center gap-2">
                  <span>🔗</span> WalletConnect
                </div>
                <div className="text-xs text-slate-400">Not connected</div>
              </div>
              <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-400">
                Connect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network & Gas Settings */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            Network & Gas Settings
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Primary Network</Label>
              <Select defaultValue="ethereum">
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum Mainnet</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="optimism">Optimism</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Default Gas Price (Gwei)</Label>
              <Input defaultValue="30" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Max Gas Price (Gwei)</Label>
              <Input defaultValue="100" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Auto Gas Price</div>
                <div className="text-xs text-slate-400">Automatically adjust gas based on network congestion</div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Mode */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            Trading Mode
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Trading Mode</Label>
              <Select defaultValue="live">
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paper">Paper Trading (Simulated)</SelectItem>
                  <SelectItem value="live">Live Trading</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Auto-Trading</div>
                <div className="text-xs text-slate-400">Automatically execute swaps based on signals</div>
              </div>
              <Switch className="data-[state=checked]:bg-green-600" />
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">DCA (Dollar Cost Averaging)</div>
                <div className="text-xs text-slate-400">Enable dollar cost averaging for entries</div>
              </div>
              <Switch className="data-[state=checked]:bg-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Default DEX Settings */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-purple-400" />
            Default DEX Settings
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Default DEX Protocol</Label>
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
              <Label className="text-sm text-slate-400 mb-1 block">Default Slippage Tolerance (%)</Label>
              <Input defaultValue="0.5" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Max Slippage Tolerance (%)</Label>
              <Input defaultValue="5" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Transaction Timeout (seconds)</Label>
              <Input defaultValue="120" className="bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Default Trading Tokens */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400" />
            Default Trading Tokens
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div className="text-sm text-white font-mono">WETH</div>
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">Active</Badge>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div className="text-sm text-white font-mono">USDC</div>
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">Active</Badge>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div className="text-sm text-white font-mono">WBTC</div>
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">Active</Badge>
            </div>
            <Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400 mt-2">
              + Add Trading Token
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Settings page content component — each category has its own toggle behavior
function SettingsPageContent({ selectedCategory, platform }: { selectedCategory: string; platform: "cex" | "dex" }) {
  return (
    <motion.div
      key={selectedCategory}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 min-w-0"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          {categories.find((c) => c.id === selectedCategory)?.name}
        </h1>
        <p className="text-slate-400 text-sm">
          {selectedCategory === "general" && "Configure your bot name, currency, timezone, and performance."}
          {selectedCategory === "trading" && "Set your trading strategy, risk level, and leverage."}
          {selectedCategory === "api-keys" && "Manage your exchange API connections."}
          {selectedCategory === "wallets" && "Manage your connected wallets."}
          {selectedCategory === "notifications" && "Configure alerts and system messages."}
          {selectedCategory === "security" && "Manage authentication and session security."}
        </p>
      </div>

      {/* Platform-specific content: CEX vs DEX panels */}
      {platform === "cex" ? (
        <CEXSettingsPanel />
      ) : (
        <DEXSettingsPanel />
      )}

      {/* Non-platform categories: show category-specific content */}
      {selectedCategory === "general" && (
        <div className="space-y-5 max-w-2xl">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                Bot Configuration
              </h3>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Bot Name</Label>
                <Input defaultValue="My Trading Bot" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Display Currency</Label>
                <Select defaultValue="USD">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="BTC">BTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Timezone</Label>
                <Select defaultValue="UTC">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                    <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                    <SelectItem value="CET">Central European (CET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">Enable Performance Tracking</div>
                  <div className="text-xs text-slate-400">Track P&L and performance metrics</div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedCategory === "trading" && (
        <div className="space-y-5 max-w-2xl">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                Trading Strategy
              </h3>
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
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Risk Level</Label>
                <Select defaultValue="medium">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Default Leverage</Label>
                <Select defaultValue="1">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1x (Spot)</SelectItem>
                    <SelectItem value="3">3x</SelectItem>
                    <SelectItem value="5">5x</SelectItem>
                    <SelectItem value="10">10x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                Risk Management
              </h3>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Max Position Size ($)</Label>
                <Input defaultValue="10000" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Daily Loss Limit ($)</Label>
                <Input defaultValue="500" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Max Open Positions</Label>
                <Input defaultValue="5" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">Stop Loss Protection</div>
                  <div className="text-xs text-slate-400">Automatically close positions at loss threshold</div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedCategory === "notifications" && (
        <div className="space-y-5 max-w-2xl">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-5 space-y-3">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                Alert Preferences
              </h3>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">Price Alerts</div>
                  <div className="text-xs text-slate-400">Notify when price hits target levels</div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">Trade Execution</div>
                  <div className="text-xs text-slate-400">Notify on successful trade execution</div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">Error Notifications</div>
                  <div className="text-xs text-slate-400">Alert on errors or system issues</div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-red-600" />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">Daily Summary</div>
                  <div className="text-xs text-slate-400">End-of-day performance summary</div>
                </div>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedCategory === "security" && (
        <div className="space-y-5 max-w-2xl">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-400" />
                Security Settings
              </h3>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">Two-Factor Authentication</div>
                  <div className="text-xs text-slate-400">Add an extra layer of security</div>
                </div>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Session Timeout (minutes)</Label>
                <Input defaultValue="30" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">Remember Browser</div>
                  <div className="text-xs text-slate-400">Don't require re-authentication</div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">Secure Storage</div>
                  <div className="text-xs text-slate-400">Encrypt sensitive data at rest</div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  )
}

// Main page component
export function CryptoSettingsPage() {
  const { exchangeType, setExchangeType } = useAppContext()
  const [selectedTab, setSelectedTab] = useState("general")

  return (
    <div className="flex h-full">
      <SettingsSidebar tabs={categories} selectedTab={selectedTab} onSelect={setSelectedTab} />
      <SettingsPageContent selectedCategory={selectedTab} platform={exchangeType} />
    </div>
  )
}
