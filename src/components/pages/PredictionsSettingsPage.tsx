"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Bell, Shield, User, Key, Wallet, LogOut, Download, Upload, Save, CheckCircle, Clock, TrendingUp, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// --- Interfaces ---

interface PlatformSettings {
  apiKey: string
  network: string
  autoConnect: boolean
  gasLimit: number
  maxSlippage: number
}

interface PlatformPredictionSettings {
  defaultPredictionAmount: number
  maxPredictionAmount: number
  autoStake: boolean
  riskLevel: number
  useBankroll: boolean
}

interface PlatformNotificationSettings {
  newMarkets: boolean
  marketUpdates: boolean
  positionAlerts: boolean
  marketResolution: boolean
  newsletter: boolean
  priceAlerts: boolean
  volumeAlerts: boolean
}

interface PlatformSecuritySettings {
  twoFactor: boolean
  sessionTimeout: number
  rememberBrowser: boolean
  secureStorage: boolean
  withdrawalWhitelist: boolean
  ipFiltering: boolean
}

interface PredictionsSettings {
  general: {
    profileName: string
    notificationEmail: string
    timezone: string
    autoRefresh: boolean
    refreshInterval: number
  }
  kalshi: PlatformSettings
  polymarket: PlatformSettings
  kalshiPredictions: PlatformPredictionSettings
  polymarketPredictions: PlatformPredictionSettings
  kalshiNotifications: PlatformNotificationSettings
  polymarketNotifications: PlatformNotificationSettings
  kalshiSecurity: PlatformSecuritySettings
  polymarketSecurity: PlatformSecuritySettings
}

const defaultSettings: PredictionsSettings = {
  general: {
    profileName: "User",
    notificationEmail: "",
    timezone: "UTC",
    autoRefresh: true,
    refreshInterval: 30,
  },
  kalshi: {
    apiKey: "",
    network: "Polygon",
    autoConnect: false,
    gasLimit: 50000,
    maxSlippage: 2,
  },
  polymarket: {
    apiKey: "",
    network: "Polygon",
    autoConnect: false,
    gasLimit: 50000,
    maxSlippage: 2,
  },
  kalshiPredictions: {
    defaultPredictionAmount: 10,
    maxPredictionAmount: 1000,
    autoStake: false,
    riskLevel: 5,
    useBankroll: true,
  },
  polymarketPredictions: {
    defaultPredictionAmount: 10,
    maxPredictionAmount: 1000,
    autoStake: false,
    riskLevel: 5,
    useBankroll: true,
  },
  kalshiNotifications: {
    newMarkets: true,
    marketUpdates: false,
    positionAlerts: true,
    marketResolution: true,
    newsletter: false,
    priceAlerts: false,
    volumeAlerts: false,
  },
  polymarketNotifications: {
    newMarkets: true,
    marketUpdates: false,
    positionAlerts: true,
    marketResolution: true,
    newsletter: false,
    priceAlerts: false,
    volumeAlerts: false,
  },
  kalshiSecurity: {
    twoFactor: false,
    sessionTimeout: 30,
    rememberBrowser: true,
    secureStorage: true,
    withdrawalWhitelist: false,
    ipFiltering: false,
  },
  polymarketSecurity: {
    twoFactor: false,
    sessionTimeout: 30,
    rememberBrowser: true,
    secureStorage: true,
    withdrawalWhitelist: false,
    ipFiltering: false,
  },
}

// --- Platform Toggle Bar ---

function PlatformToggle({ selectedPlatform, onSelect }: { selectedPlatform: string; onSelect: (id: string) => void }) {
  return (
    <div className="mb-6">
      <div className="flex justify-center">
        <Tabs value={selectedPlatform} className="w-full max-w-2xl" onValueChange={onSelect}>
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="kalshi" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-purple-500">
              <span className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span className="text-base font-semibold">Kalshi</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="polymarket" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-base font-semibold">Polymarket</span>
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}

// --- Sidebar Navigation ---

const tabs = [
  { id: "general", name: "General", icon: <User className="w-4 h-4" /> },
  { id: "predictions", name: "Predictions", icon: <Bell className="w-4 h-4" /> },
  { id: "notifications", name: "Notifications", icon: <Bell className="w-4 h-4" /> },
  { id: "security", name: "Security", icon: <Shield className="w-4 h-4" /> },
  { id: "account", name: "Account", icon: <Wallet className="w-4 h-4" /> },
]

function SettingsSidebar({ selectedTab, onSelect }: { selectedTab: string; onSelect: (id: string) => void }) {
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

// --- Content Panel for Each Tab ---

function SettingsPanel({ tab, settings, setSettings, platform, onPlatformChange, apiDialogOpen, setApiDialogOpen, apiDialogPlatform, setApiDialogPlatform }: {
  tab: string
  settings: PredictionsSettings
  setSettings: (s: PredictionsSettings) => void
  platform: string
  onPlatformChange: (p: string) => void
  apiDialogOpen: boolean
  setApiDialogOpen: (v: boolean) => void
  apiDialogPlatform: "kalshi" | "polymarket"
  setApiDialogPlatform: (v: "kalshi" | "polymarket") => void
}) {
  // Helper: update nested platform-specific settings
  const updatePlatformPredictions = (platform: string, key: string, value: number | boolean) => {
    const prefix = platform === "kalshi" ? "kalshiPredictions" : "polymarketPredictions"
    setSettings({
      ...settings,
      [prefix]: { ...settings[prefix as keyof PredictionsSettings], [key]: value }
    })
  }

  const updatePlatformNotifications = (platform: string, key: string, value: boolean) => {
    const prefix = platform === "kalshi" ? "kalshiNotifications" : "polymarketNotifications"
    setSettings({
      ...settings,
      [prefix]: { ...settings[prefix as keyof PredictionsSettings], [key]: value }
    })
  }

  const updatePlatformSecurity = (platform: string, key: string, value: number | boolean) => {
    const prefix = platform === "kalshi" ? "kalshiSecurity" : "polymarketSecurity"
    setSettings({
      ...settings,
      [prefix]: { ...settings[prefix as keyof PredictionsSettings], [key]: value }
    })
  }

  const platformLabel = platform === "kalshi" ? "Kalshi" : "Polymarket"
  const platformColor = platform === "kalshi" ? "pink" : "blue"

  if (tab === "general") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Platform Toggle */}
        <div className="mb-8">
          <PlatformToggle selectedPlatform={platform} onSelect={onPlatformChange} />
          <div className="text-center mb-2">
            <span className="text-sm text-slate-400">
              {platform === "kalshi" ? "NFT-backed prediction markets with Kalshi" : "Decentralized prediction markets with Polymarket"}
            </span>
          </div>
        </div>

        <Card className="bg-slate-900/50 border-slate-700/50 max-w-2xl">
          <CardContent className="p-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1 block">Profile Name</label>
                <Input
                  value={settings.general.profileName}
                  onChange={(e) => setSettings({ ...settings, general: { ...settings.general, profileName: e.target.value } })}
                  placeholder="Enter your name"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1 block">Timezone</label>
                <select
                  value={settings.general.timezone}
                  onChange={(e) => setSettings({ ...settings, general: { ...settings.general, timezone: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time (EST)</option>
                  <option value="PST">Pacific Time (PST)</option>
                  <option value="GMT+1">Central European (GMT+1)</option>
                  <option value="JST">Japan (JST)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1 block">Notification Email</label>
              <Input
                value={settings.general.notificationEmail}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, notificationEmail: e.target.value } })}
                placeholder="email@example.com"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Auto Refresh Market Data</div>
                <div className="text-xs text-slate-400">Automatically refresh market odds and positions</div>
              </div>
              <Switch
                checked={settings.general.autoRefresh}
                onCheckedChange={(checked) => setSettings({ ...settings, general: { ...settings.general, autoRefresh: checked } })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1 block">
                Refresh Interval: {settings.general.refreshInterval}s
              </label>
              <Slider
                value={[settings.general.refreshInterval]}
                onValueChange={(value: number[] | number | readonly number[]) => setSettings({ ...settings, general: { ...settings.general, refreshInterval: (value as number[])[0] } })}
                min={5}
                max={300}
                step={5}
                className="py-4"
              />
            </div>
          </CardContent>
        </Card>

      </motion.div>
    )
  }

  if (tab === "predictions") {
    const pred = platform === "kalshi" ? settings.kalshiPredictions : settings.polymarketPredictions
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Platform Toggle */}
        <div className="mb-6">
          <PlatformToggle selectedPlatform={platform} onSelect={onPlatformChange} />
          <div className="text-center mb-2">
            <span className="text-sm text-slate-400">
              {platform === "kalshi" ? "Kalshi prediction configuration" : "Polymarket prediction configuration"}
            </span>
          </div>
        </div>

        <Card className="bg-slate-900/50 border-slate-700/50 max-w-2xl">
          <CardContent className="p-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1 block">
                  Default Prediction Amount: ${pred.defaultPredictionAmount}
                </label>
                <Slider
                  value={[pred.defaultPredictionAmount]}
                  onValueChange={(value: number[] | number | readonly number[]) => updatePlatformPredictions(platform, "defaultPredictionAmount", (value as number[])[0])}
                  min={1}
                  max={100}
                  step={1}
                  className="py-4"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1 block">
                  Max Prediction Amount: ${pred.maxPredictionAmount}
                </label>
                <Slider
                  value={[pred.maxPredictionAmount]}
                  onValueChange={(value: number[] | number | readonly number[]) => updatePlatformPredictions(platform, "maxPredictionAmount", (value as number[])[0])}
                  min={100}
                  max={10000}
                  step={100}
                  className="py-4"
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Auto-Stake on Entry</div>
                <div className="text-xs text-slate-400">Automatically stake when entering a new position</div>
              </div>
              <Switch
                checked={pred.autoStake}
                onCheckedChange={(checked) => updatePlatformPredictions(platform, "autoStake", checked)}
              />
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Use Bankroll</div>
                <div className="text-xs text-slate-400">Use allocated bankroll for predictions</div>
              </div>
              <Switch
                checked={pred.useBankroll}
                onCheckedChange={(checked) => updatePlatformPredictions(platform, "useBankroll", checked)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1 block">
                Risk Level: {pred.riskLevel}/10
              </label>
              <Slider
                value={[pred.riskLevel]}
                onValueChange={(value: number[] | number | readonly number[]) => updatePlatformPredictions(platform, "riskLevel", (value as number[])[0])}
                min={1}
                max={10}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (tab === "notifications") {
    const notif = platform === "kalshi" ? settings.kalshiNotifications : settings.polymarketNotifications
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Platform Toggle */}
        <div className="mb-6">
          <PlatformToggle selectedPlatform={platform} onSelect={onPlatformChange} />
          <div className="text-center mb-2">
            <span className="text-sm text-slate-400">
              {platform === "kalshi" ? "Kalshi notification preferences" : "Polymarket notification preferences"}
            </span>
          </div>
        </div>

        <Card className="bg-slate-900/50 border-slate-700/50 max-w-2xl">
          <CardContent className="p-5 space-y-3">
            <h3 className="text-base font-semibold text-white mb-2">Standard Notifications</h3>
            {["newMarkets", "marketUpdates", "positionAlerts", "marketResolution", "newsletter"].map((key) => (
              <div key={key} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </div>
                </div>
                <Switch
                  checked={notif[key as keyof typeof notif] as boolean}
                  onCheckedChange={(checked) => updatePlatformNotifications(platform, key, checked)}
                />
              </div>
            ))}

            <h3 className="text-base font-semibold text-white mt-6 mb-2">Advanced Alerts</h3>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Price Alerts</div>
                <div className="text-xs text-slate-400">Get notified when market prices hit your targets</div>
              </div>
              <Switch
                checked={notif.priceAlerts}
                onCheckedChange={(checked) => updatePlatformNotifications(platform, "priceAlerts", checked)}
              />
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Volume Alerts</div>
                <div className="text-xs text-slate-400">Get notified when trading volume spikes</div>
              </div>
              <Switch
                checked={notif.volumeAlerts}
                onCheckedChange={(checked) => updatePlatformNotifications(platform, "volumeAlerts", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (tab === "security") {
    const sec = platform === "kalshi" ? settings.kalshiSecurity : settings.polymarketSecurity
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Platform Toggle */}
        <div className="mb-6">
          <PlatformToggle selectedPlatform={platform} onSelect={onPlatformChange} />
          <div className="text-center mb-2">
            <span className="text-sm text-slate-400">
              {platform === "kalshi" ? "Kalshi security settings" : "Polymarket security settings"}
            </span>
          </div>
        </div>

        <Card className="bg-slate-900/50 border-slate-700/50 max-w-2xl">
          <CardContent className="p-5 space-y-5">
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Two-Factor Authentication</div>
                <div className="text-xs text-slate-400">Add an extra layer of security to your account</div>
              </div>
              <Switch
                checked={sec.twoFactor}
                onCheckedChange={(checked) => updatePlatformSecurity(platform, "twoFactor", checked)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1 block">
                Session Timeout: {sec.sessionTimeout} minutes
              </label>
              <Slider
                value={[sec.sessionTimeout]}
                onValueChange={(value: number[] | number | readonly number[]) => updatePlatformSecurity(platform, "sessionTimeout", (value as number[])[0])}
                min={5}
                max={120}
                step={5}
                className="py-4"
              />
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Remember Me</div>
                <div className="text-xs text-slate-400">Stay logged in on this browser</div>
              </div>
              <Switch
                checked={sec.rememberBrowser}
                onCheckedChange={(checked) => updatePlatformSecurity(platform, "rememberBrowser", checked)}
              />
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Secure Storage</div>
                <div className="text-xs text-slate-400">Encrypt your data in browser storage</div>
              </div>
              <Switch
                checked={sec.secureStorage}
                onCheckedChange={(checked) => updatePlatformSecurity(platform, "secureStorage", checked)}
              />
            </div>

            <h3 className="text-base font-semibold text-white mt-4">Advanced Security</h3>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Withdrawal Whitelist</div>
                <div className="text-xs text-slate-400">Only allow withdrawals to pre-approved addresses</div>
              </div>
              <Switch
                checked={sec.withdrawalWhitelist}
                onCheckedChange={(checked) => updatePlatformSecurity(platform, "withdrawalWhitelist", checked)}
              />
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">IP Filtering</div>
                <div className="text-xs text-slate-400">Restrict access to known IP addresses</div>
              </div>
              <Switch
                checked={sec.ipFiltering}
                onCheckedChange={(checked) => updatePlatformSecurity(platform, "ipFiltering", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }


if (tab === "account") {
    const isKalshi = platform === "kalshi"
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Platform Toggle */}
        <div className="mb-6">
          <PlatformToggle selectedPlatform={platform} onSelect={onPlatformChange} />
          <div className="text-center mb-2">
            <span className="text-sm text-slate-400">
              {platform === "kalshi" ? "Kalshi account management" : "Polymarket account management"}
            </span>
          </div>
        </div>

        <Card className="bg-slate-900/50 border-slate-700/50 max-w-2xl">
          <CardContent className="p-5 space-y-5">
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Connected Wallets</div>
                <div className="text-xs text-slate-400">Manage your connected wallet addresses</div>
              </div>
              <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700">
                <User className="w-3.5 h-3.5 mr-2" />
                Connect
              </Button>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Bankroll</div>
                <div className="text-xs text-slate-400">Your allocated funds for predictions</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">1000.00 KASH</span>
                <Button size="sm" variant="outline">Top Up</Button>
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Trading History</div>
                <div className="text-xs text-slate-400">View your past predictions</div>
              </div>
              <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700">
                <Clock className="w-3.5 h-3.5 mr-2" />
                View
              </Button>
            </div>

            <h3 className="text-base font-semibold text-white mt-4">Platform-Specific Account</h3>
            {isKalshi ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                  <div>
                    <div className="font-medium text-white text-sm">Kalshi API Credentials</div>
                    <div className="text-xs text-slate-400">Manage your Kalshi API access tokens</div>
                  </div>
                  <Dialog open={apiDialogOpen && apiDialogPlatform === "kalshi"} onOpenChange={(open) => {
                    if (!open) {
                      setApiDialogOpen(false)
                      setApiDialogPlatform("kalshi")
                    } else {
                      setApiDialogPlatform("kalshi")
                      setApiDialogOpen(true)
                    }
                  }}>
                    <DialogTrigger>
                      <Button variant="outline" size="sm" className="bg-slate-800 border-pink-500/30 text-pink-300">
                        <Key className="w-3.5 h-3.5 mr-2" />
                        Manage
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-pink-400" />
                          Kalshi Platform Configuration
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                          Configure your Kalshi API credentials and connection settings.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label className="text-sm text-slate-300 mb-1 block">API Key</Label>
                          <Input
                            value={settings.kalshi.apiKey}
                            onChange={(e) => setSettings({ ...settings, kalshi: { ...settings.kalshi, apiKey: e.target.value } })}
                            placeholder="Enter your Kalshi API key"
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-slate-300 mb-1 block">Network</Label>
                          <select
                            value={settings.kalshi.network}
                            onChange={(e) => setSettings({ ...settings, kalshi: { ...settings.kalshi, network: e.target.value } })}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-sm"
                          >
                            <option value="Polygon">Polygon (Mainnet)</option>
                            <option value="Mumbai">Polygon (Mumbai Testnet)</option>
                            <option value="Amoy">Polygon (Amoy Testnet)</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                          <div>
                            <div className="font-medium text-white text-sm">Auto Connect</div>
                            <div className="text-xs text-slate-400">Automatically connect on page load</div>
                          </div>
                          <Switch
                            checked={settings.kalshi.autoConnect}
                            onCheckedChange={(checked) => setSettings({ ...settings, kalshi: { ...settings.kalshi, autoConnect: checked } })}
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-slate-300 mb-1 block">Max Slippage: {settings.kalshi.maxSlippage}%</Label>
                          <Slider
                            value={[settings.kalshi.maxSlippage]}
                            onValueChange={(value: number[] | number | readonly number[]) => setSettings({ ...settings, kalshi: { ...settings.kalshi, maxSlippage: (value as number[])[0] } })}
                            min={0}
                            max={10}
                            step={0.5}
                            className="py-4"
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                  <div>
                    <div className="font-medium text-white text-sm">Kalshi Position Limits</div>
                    <div className="text-xs text-slate-400">Set daily/weekly position limits</div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-slate-800 border-pink-500/30 text-pink-300">
                    <TrendingUp className="w-3.5 h-3.5 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                  <div>
                    <div className="font-medium text-white text-sm">Polymarket Wallet</div>
                    <div className="text-xs text-slate-400">Connect your Polygon wallet</div>
                  </div>
                  <Dialog open={apiDialogOpen && apiDialogPlatform === "polymarket"} onOpenChange={(open) => {
                    if (!open) {
                      setApiDialogOpen(false)
                      setApiDialogPlatform("polymarket")
                    } else {
                      setApiDialogPlatform("polymarket")
                      setApiDialogOpen(true)
                    }
                  }}>
                    <DialogTrigger>
                      <Button variant="outline" size="sm" className="bg-slate-800 border-blue-500/30 text-blue-300">
                        <Wallet className="w-3.5 h-3.5 mr-2" />
                        Manage
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-400" />
                          Polymarket Platform Configuration
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                          Configure your Polymarket API credentials and connection settings.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label className="text-sm text-slate-300 mb-1 block">API Key</Label>
                          <Input
                            value={settings.polymarket.apiKey}
                            onChange={(e) => setSettings({ ...settings, polymarket: { ...settings.polymarket, apiKey: e.target.value } })}
                            placeholder="Enter your Polymarket API key"
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-slate-300 mb-1 block">Network</Label>
                          <select
                            value={settings.polymarket.network}
                            onChange={(e) => setSettings({ ...settings, polymarket: { ...settings.polymarket, network: e.target.value } })}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                          >
                            <option value="Polygon">Polygon (Mainnet)</option>
                            <option value="Mumbai">Polygon (Mumbai Testnet)</option>
                            <option value="Amoy">Polygon (Amoy Testnet)</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                          <div>
                            <div className="font-medium text-white text-sm">Auto Connect</div>
                            <div className="text-xs text-slate-400">Automatically connect on page load</div>
                          </div>
                          <Switch
                            checked={settings.polymarket.autoConnect}
                            onCheckedChange={(checked) => setSettings({ ...settings, polymarket: { ...settings.polymarket, autoConnect: checked } })}
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-slate-300 mb-1 block">Max Slippage: {settings.polymarket.maxSlippage}%</Label>
                          <Slider
                            value={[settings.polymarket.maxSlippage]}
                            onValueChange={(value: number[] | number | readonly number[]) => setSettings({ ...settings, polymarket: { ...settings.polymarket, maxSlippage: (value as number[])[0] } })}
                            min={0}
                            max={10}
                            step={0.5}
                            className="py-4"
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                  <div>
                    <div className="font-medium text-white text-sm">Polygon Network Settings</div>
                    <div className="text-xs text-slate-400">Configure gas preferences and RPC endpoints</div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-slate-800 border-blue-500/30 text-blue-300">
                    <Zap className="w-3.5 h-3.5 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }
}

// --- Main Component ---

export function PredictionsSettingsPage() {
  const [settings, setSettings] = useState<PredictionsSettings>(defaultSettings)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [activePlatform, setActivePlatform] = useState("kalshi")

  const [apiDialogOpen, setApiDialogOpen] = useState(false)
  const [apiDialogPlatform, setApiDialogPlatform] = useState<"kalshi" | "polymarket">("kalshi")

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex h-full">
      <SettingsSidebar selectedTab={activeTab} onSelect={setActiveTab} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 py-6 px-8"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <Settings className="h-5 w-5 text-slate-400" />
            <h1 className="text-2xl font-bold text-white">
              {tabs.find((t) => t.id === activeTab)?.name}
            </h1>
          </div>
          <p className="text-slate-400 text-sm ml-8">
            {activeTab === "general" && "Platform, profile, timezone, and refresh preferences."}
            {activeTab === "predictions" && "Prediction amounts, auto-stake, and risk level."}
            {activeTab === "notifications" && "Alerts for markets, positions, and system updates."}
            {activeTab === "security" && "Authentication, session, and data security."}
            {activeTab === "account" && "Wallets, bankroll, and trading history."}
          </p>
        </div>

        {/* Content */}
        <SettingsPanel tab={activeTab} settings={settings} setSettings={setSettings} platform={activePlatform} onPlatformChange={setActivePlatform} apiDialogOpen={apiDialogOpen} setApiDialogOpen={setApiDialogOpen} apiDialogPlatform={apiDialogPlatform} setApiDialogPlatform={setApiDialogPlatform} />

        {/* Footer buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" className="border-slate-700">
            <Upload className="w-3.5 h-3.5 mr-2" />
            Import Settings
          </Button>
          <Button variant="outline" size="sm" className="border-slate-700">
            <Download className="w-3.5 h-3.5 mr-2" />
            Export Settings
          </Button>
          <Button size="sm"
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 border-0 text-white"
          >
            {saved ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" className="border-slate-700">
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Log Out
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
