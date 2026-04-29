"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, Key, Wallet, Globe, Save, Download, Upload, Lock, Unlock, RefreshCw, Bell, Activity, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

// Category definitions
const categories = [
  { id: "general", name: "General", icon: <Globe className="w-5 h-5" /> },
  { id: "trading", name: "Trading", icon: <Zap className="w-5 h-5" /> },
  { id: "api-keys", name: "API Keys", icon: <Key className="w-5 h-5" /> },
  { id: "wallets", name: "Wallets", icon: <Wallet className="w-5 h-5" /> },
  { id: "notifications", name: "Notifications", icon: <Bell className="w-5 h-5" /> },
  { id: "security", name: "Security", icon: <Lock className="w-5 h-5" /> },
]

// Settings navigation component
function SettingsNav({ tabs }: { tabs: Array<{ id: string; name: string; icon: React.ReactNode }> }) {
  const [selectedTab, setSelectedTab] = useState(tabs[0].id)

  return (
    <nav className="flex gap-2 overflow-x-auto pb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setSelectedTab(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            selectedTab === tab.id
              ? "bg-gradient-to-r from-cyan-600 to-purple-500 text-white shadow-lg"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
          }`}
        >
          {tab.icon}
          {tab.name}
        </button>
      ))}
    </nav>
  )
}

// Settings page content component
function SettingsPageContent({ selectedCategory }: { selectedCategory: string }) {
  const [selectedCategoryState, setSelectedCategoryState] = useState("general")

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Configure your Crypto Bot preferences and connections</p>
      </div>

      {/* Category Navigation */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategoryState === category.id ? "default" : "outline"}
              className={`flex items-center gap-2 text-sm ${
                selectedCategoryState === category.id
                  ? "bg-gradient-to-r from-cyan-600 to-purple-500 border-0 text-white"
                  : "border-slate-700 bg-slate-900/50 text-white hover:bg-slate-800"
              }`}
              onClick={() => setSelectedCategoryState(category.id)}
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* General Settings */}
      {selectedCategoryState === "general" && (
        <div className="space-y-6">
          <Card className="bg-slate-900/50 backdrop-blur border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                General Configuration
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Bot Name</Label>
                  <Input
                    defaultValue="My Crypto Bot"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Base Currency</Label>
                  <Select defaultValue="usdt">
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usdt">USDT</SelectItem>
                      <SelectItem value="usdc">USDC</SelectItem>
                      <SelectItem value="btc">BTC</SelectItem>
                      <SelectItem value="eth">ETH</SelectItem>
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
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="JST">Japan Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Default Refresh Interval (ms)</Label>
                  <Slider
                    defaultValue={[5000]}
                    min={1000}
                    max={60000}
                    step={1000}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Performance Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <div className="font-medium text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-amber-400" /> Auto-Scaling
                    </div>
                    <div className="text-sm text-slate-400">Automatically adjust bot resources</div>
                  </div>
                  <Switch className="data-[state=checked]:bg-purple-600" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <div className="font-medium text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-400" /> High Performance Mode
                    </div>
                    <div className="text-sm text-slate-400">Reduce latency for faster trades</div>
                  </div>
                  <Switch className="data-[state=checked]:bg-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" className="border-slate-700">
              <Download className="w-4 h-4 mr-2" />
              Export Settings
            </Button>
            <Button variant="outline" className="border-slate-700">
              <Upload className="w-4 h-4 mr-2" />
              Import Settings
            </Button>
            <Button className="bg-gradient-to-r from-cyan-600 to-purple-500 border-0 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Trading Settings */}
      {selectedCategoryState === "trading" && (
        <div className="space-y-6">
          <Card className="bg-slate-900/50 backdrop-blur border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Trading Strategy
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
                      <SelectItem value="dca">DCA (Dollar Cost Avg)</SelectItem>
                      <SelectItem value="scalping">Scalping</SelectItem>
                      <SelectItem value="arbitrage">Arbitrage</SelectItem>
                      <SelectItem value="momentum">Momentum</SelectItem>
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
                      <SelectItem value="low">Low (Conservative)</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High (Aggressive)</SelectItem>
                      <SelectItem value="ultra">Ultra High (Extreme)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Max Leverage</Label>
                  <Select defaultValue="10">
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1x</SelectItem>
                      <SelectItem value="3">3x</SelectItem>
                      <SelectItem value="5">5x</SelectItem>
                      <SelectItem value="10">10x</SelectItem>
                      <SelectItem value="20">20x</SelectItem>
                      <SelectItem value="50">50x</SelectItem>
                      <SelectItem value="100">100x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Risk Management
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Max Position Size (%)</Label>
                  <Input type="number" defaultValue="10" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Stop Loss (%)</Label>
                  <Input type="number" defaultValue="5" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Take Profit (%)</Label>
                  <Input type="number" defaultValue="10" className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button className="bg-gradient-to-r from-cyan-600 to-purple-500 border-0 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* API Keys Settings */}
      {selectedCategoryState === "api-keys" && (
        <div className="space-y-6">
          <Card className="bg-slate-900/50 backdrop-blur border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                API Key Management
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <div className="font-medium text-white">Binance US API</div>
                    <div className="text-sm text-slate-400">Connected • Last used: 2 hours ago</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-slate-700 text-xs">
                      <Lock className="w-3 h-3 mr-1" />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-700 text-xs">
                      <Key className="w-3 h-3 mr-1" />
                      View Key
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <div className="font-medium text-white">Coinbase Pro API</div>
                    <div className="text-sm text-slate-400">Not connected</div>
                  </div>
                  <Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400">
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <div className="font-medium text-white">Kraken API</div>
                    <div className="text-sm text-slate-400">Not connected</div>
                  </div>
                  <Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400">
                    Connect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" className="border-slate-700">
              <Download className="w-4 h-4 mr-2" />
              Export Keys
            </Button>
            <Button variant="outline" className="border-slate-700">
              <Upload className="w-4 h-4 mr-2" />
              Import Keys
            </Button>
            <Button variant="outline" className="border-red-500/50 text-red-400">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
          </div>
        </div>
      )}

      {/* Wallets Settings */}
      {selectedCategoryState === "wallets" && (
        <div className="space-y-6">
          <Card className="bg-slate-900/50 backdrop-blur border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-green-400" />
                Connected Wallets
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <div className="font-medium text-white">MetaMask</div>
                    <div className="text-sm text-slate-400">0x71C...3A2F</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-400 border-0">Connected</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <div className="font-medium text-white">WalletConnect</div>
                    <div className="text-sm text-slate-400">Not connected</div>
                  </div>
                  <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-400">
                    Connect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button className="bg-gradient-to-r from-cyan-600 to-purple-500 border-0 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Notifications Settings */}
      {selectedCategoryState === "notifications" && (
        <div className="space-y-6">
          <Card className="bg-slate-900/50 backdrop-blur border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-pink-400" />
                Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <div className="font-medium text-white">Trading Alerts</div>
                    <div className="text-sm text-slate-400">Position opened, closed, or modified</div>
                  </div>
                  <Switch className="data-[state=checked]:bg-pink-600" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <div className="font-medium text-white">P&L Notifications</div>
                    <div className="text-sm text-slate-400">When profit/loss thresholds are reached</div>
                  </div>
                  <Switch className="data-[state=checked]:bg-pink-600" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <div className="font-medium text-white">System Messages</div>
                    <div className="text-sm text-slate-400">Updates, maintenance, and announcements</div>
                  </div>
                  <Switch className="data-[state=checked]:bg-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button className="bg-gradient-to-r from-cyan-600 to-purple-500 border-0 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {selectedCategoryState === "security" && (
        <div className="space-y-6">
          <Card className="bg-slate-900/50 backdrop-blur border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-400" />
                Security
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <div className="font-medium text-white">Two-Factor Authentication</div>
                    <div className="text-sm text-slate-400">Add an extra layer of security</div>
                  </div>
                  <Switch className="data-[state=checked]:bg-red-600" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <div className="font-medium text-white">Session Management</div>
                    <div className="text-sm text-slate-400">View and manage active sessions</div>
                  </div>
                  <Button variant="outline" size="sm" className="border-slate-700">
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" className="border-red-500/50 text-red-400">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset All Security
            </Button>
            <Button className="bg-gradient-to-r from-cyan-600 to-purple-500 border-0 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </motion.section>
  )
}

// Main page component
export function CryptoSettingsPage() {
  return (
    <div className="flex h-full">
      {/* Navigation */}
      <SettingsNav
        tabs={categories}
      />

      {/* Page Content */}
      <SettingsPageContent selectedCategory="general" />
    </div>
  )
}
