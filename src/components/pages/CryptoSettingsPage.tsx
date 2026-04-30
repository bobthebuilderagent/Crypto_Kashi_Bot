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
          className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
            selectedTab === tab.id
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

// CEX Settings Panel
function CEXSettingsPanel() {
  const [selectedExchange, setSelectedExchange] = useState("binance")

  const exchanges = [
    { id: "binance", name: "Binance", icon: "🔶", status: "connected" },
    { id: "coinbase", name: "Coinbase", icon: "🔵", status: "not_connected" },
    { id: "kraken", name: "Kraken", icon: "🟣", status: "not_connected" },
    { id: "ftx", name: "FTX", icon: "🟡", status: "not_connected" },
  ]

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Exchange Selection */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            Exchange Connections
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {exchanges.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setSelectedExchange(ex.id)}
                className={`p-3 rounded-lg border transition-all text-left ${
                  selectedExchange === ex.id
                    ? "bg-slate-800 border-cyan-500/50 text-white"
                    : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <div className="text-lg mb-1">{ex.icon}</div>
                <div className="text-sm font-medium">{ex.name}</div>
                <div className="text-xs mt-1">
                  {ex.status === "connected" ? (
                    <span className="text-green-400">Connected</span>
                  ) : (
                    <span className="text-slate-500">Not Connected</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Selected Exchange Settings */}
          {selectedExchange === "binance" && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300">Binance Configuration</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">API Key</Label>
                  <Input
                    defaultValue="your-api-key-here"
                    className="bg-slate-800 border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">API Secret</Label>
                  <Input
                    defaultValue="your-api-secret-here"
                    className="bg-slate-800 border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">API Password</Label>
                  <Input
                    defaultValue="••••••••••"
                    className="bg-slate-800 border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedExchange === "coinbase" && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300">Coinbase Configuration</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">API Key</Label>
                  <Input
                    placeholder="Enter your Coinbase API key"
                    className="bg-slate-800 border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">API Secret</Label>
                  <Input
                    placeholder="Enter your Coinbase API secret"
                    className="bg-slate-800 border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Passphrase</Label>
                  <Input
                    placeholder="Enter your passphrase"
                    className="bg-slate-800 border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedExchange === "kraken" && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300">Kraken Configuration</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">API Key</Label>
                  <Input
                    placeholder="Enter your Kraken API key"
                    className="bg-slate-800 border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Private Key</Label>
                  <Input
                    placeholder="Enter your Kraken private key"
                    className="bg-slate-800 border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedExchange === "ftx" && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300">FTX Configuration</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">API Key</Label>
                  <Input
                    placeholder="Enter your FTX API key"
                    className="bg-slate-800 border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Secret</Label>
                  <Input
                    placeholder="Enter your FTX secret"
                    className="bg-slate-800 border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Exchange Permissions */}
          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Exchange Permissions</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <span className="text-sm text-slate-300">Read</span>
                <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <span className="text-sm text-slate-300">Trade</span>
                <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <span className="text-sm text-slate-300">Withdraw</span>
                <Switch className="data-[state=checked]:bg-red-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CEX Trading Settings */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            Trading Preferences
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
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Slippage Tolerance (%)</Label>
              <Input defaultValue="1" className="bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CEX Risk Management */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            Risk Management
          </h3>
          <div className="space-y-4">
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// DEX Settings Panel
function DEXSettingsPanel() {
  const [selectedProtocol, setSelectedProtocol] = useState("uniswap")

  const protocols = [
    { id: "uniswap", name: "Uniswap", icon: "🦄", chain: "Ethereum" },
    { id: "raydium", name: "Raydium", icon: "⚡", chain: "Solana" },
    { id: "pancakeswap", name: "PancakeSwap", icon: "🥞", chain: "BNB Chain" },
    { id: "aave", name: "Aave", icon: "💰", chain: "Multi-chain" },
  ]

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Wallet Connection */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-green-400" />
            Connected Wallets
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

      {/* Protocol Selection */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            DEX Protocols
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {protocols.map((proto) => (
              <button
                key={proto.id}
                onClick={() => setSelectedProtocol(proto.id)}
                className={`p-3 rounded-lg border transition-all text-center ${
                  selectedProtocol === proto.id
                    ? "bg-slate-800 border-cyan-500/50 text-white"
                    : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <div className="text-lg mb-1">{proto.icon}</div>
                <div className="text-sm font-medium">{proto.name}</div>
                <div className="text-xs mt-1 text-slate-500">{proto.chain}</div>
              </button>
            ))}
          </div>

          {/* Selected Protocol Settings */}
          {selectedProtocol === "uniswap" && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300">Uniswap V3 Configuration</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Network</Label>
                  <Select defaultValue="ethereum">
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ethereum">Ethereum Mainnet</SelectItem>
                      <SelectItem value="arbitrum">Arbitrum</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="optimism">Optimism</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Slippage Tolerance (%)</Label>
                  <Input defaultValue="0.5" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Max Slippage (%)</Label>
                  <Input defaultValue="5" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Gas Limit Multiplier</Label>
                  <Input defaultValue="1.2" className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>
            </div>
          )}

          {selectedProtocol === "raydium" && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300">Raydium Configuration</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">RPC Endpoint</Label>
                  <Input
                    defaultValue="https://api.mainnet.solana.com"
                    className="bg-slate-800 border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Priority Fee (SOL)</Label>
                  <Input defaultValue="0.001" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Slippage (%)</Label>
                  <Input defaultValue="1" className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>
            </div>
          )}

          {selectedProtocol === "pancakeswap" && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300">PancakeSwap Configuration</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">RPC Endpoint</Label>
                  <Input
                    defaultValue="https://bsc-dataseed.binance.com"
                    className="bg-slate-800 border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Slippage (%)</Label>
                  <Input defaultValue="0.5" className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>
            </div>
          )}

          {selectedProtocol === "aave" && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300">Aave Configuration</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Network</Label>
                  <Select defaultValue="ethereum">
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="arbitrum">Arbitrum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Max Deposit Amount</Label>
                  <Input placeholder="Enter max deposit amount" className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DEX Liquidity Settings */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            Liquidity Pool Settings
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Auto-Liquidity</Label>
              <div className="text-sm text-slate-400 mb-2">Automatically add liquidity to new pools</div>
              <Switch className="data-[state=checked]:bg-purple-600" />
            </div>
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Min Liquidity Threshold</Label>
              <Input defaultValue="100" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Max Liquidity Threshold</Label>
              <Input defaultValue="10000" className="bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DEX Token Approvals */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            Token Approvals
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div className="text-sm text-white">USDC</div>
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">Approved</Badge>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div className="text-sm text-white">WETH</div>
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">Approved</Badge>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div className="text-sm text-white">DAI</div>
              <Button variant="outline" size="sm" className="border-amber-500/50 text-amber-400 text-xs">
                Approve
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// CEX/DEX Platform Toggle Component
function PlatformToggle({ selectedPlatform, onSelect }: {
  selectedPlatform: "cex" | "dex"
  onSelect: (platform: "cex" | "dex") => void
}) {
  return (
    <div className="mb-6">
      <Tabs defaultValue={selectedPlatform} className="w-full max-w-xl" onValueChange={(v) => onSelect(v as "cex" | "dex")}>
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="cex" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-500">
            <span className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span className="text-sm font-semibold">CEX</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="dex" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-500">
            <span className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="text-sm font-semibold">DEX</span>
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

// Settings page content component — each category has its own toggle behavior
function SettingsPageContent({ selectedCategory }: { selectedCategory: string }) {
  const [platform, setPlatform] = useState<"cex" | "dex">("cex")

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

      {/* CEX/DEX Toggle — only shown for categories that support both platform types */}
      {(selectedCategory === "api-keys" || selectedCategory === "wallets") && (
        <PlatformToggle selectedPlatform={platform} onSelect={setPlatform} />
      )}

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
  const [selectedTab, setSelectedTab] = useState("general")

  return (
    <div className="flex h-full">
      <SettingsSidebar tabs={categories} selectedTab={selectedTab} onSelect={setSelectedTab} />
      <SettingsPageContent selectedCategory={selectedTab} />
    </div>
  )
}
