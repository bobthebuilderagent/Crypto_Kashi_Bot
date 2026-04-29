"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Bell, Shield, User, Key, Wallet, LogOut, Download, Upload, Moon, Sun, Save, CheckCircle, Clock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface KashiSettings {
  general: {
    platform: string
    profileName: string
    notificationEmail: string
    timezone: string
    autoRefresh: boolean
    refreshInterval: number
  }
  predictions: {
    defaultPredictionAmount: number
    maxPredictionAmount: number
    autoStake: boolean
    riskLevel: number
    useBankroll: boolean
  }
  notifications: {
    newMarkets: boolean
    marketUpdates: boolean
    positionAlerts: boolean
    marketResolution: boolean
    newsletter: boolean
  }
  security: {
    twoFactor: boolean
    sessionTimeout: number
    rememberBrowser: boolean
    secureStorage: boolean
  }
}

const defaultSettings: KashiSettings = {
  general: {
    platform: "Kashi",
    profileName: "User",
    notificationEmail: "",
    timezone: "UTC",
    autoRefresh: true,
    refreshInterval: 30,
  },
  predictions: {
    defaultPredictionAmount: 10,
    maxPredictionAmount: 1000,
    autoStake: false,
    riskLevel: 5,
    useBankroll: true,
  },
  notifications: {
    newMarkets: true,
    marketUpdates: false,
    positionAlerts: true,
    marketResolution: true,
    newsletter: false,
  },
  security: {
    twoFactor: false,
    sessionTimeout: 30,
    rememberBrowser: true,
    secureStorage: true,
  },
}

export function KashiSettingsPage() {
  const [settings, setSettings] = useState<KashiSettings>(defaultSettings)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-slate-400" />
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-slate-400">Configure your Kashi prediction market preferences</p>
        </div>

        {/* Settings Card */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6 bg-slate-950">
                <TabsTrigger value="general" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                  <User className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="predictions" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                  <Bell className="h-4 w-4 mr-2" />
                  Predictions
                </TabsTrigger>
                <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="account" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                  <Wallet className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-6">
                <div className="space-y-6">
                  {/* Platform Selection */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="grid gap-4"
                  >
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Platform</label>
                      <select
                        value={settings.general.platform}
                        onChange={(e) => setSettings({ ...settings, general: { ...settings.general, platform: e.target.value } })}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        <option value="Kashi">Kashi</option>
                        <option value="Polymarket">Polymarket</option>
                        <option value="Manifold">Manifold</option>
                        <option value="Gnosis">Gnosis</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Profile Name</label>
                        <Input
                          value={settings.general.profileName}
                          onChange={(e) => setSettings({ ...settings, general: { ...settings.general, profileName: e.target.value } })}
                          placeholder="Enter your name"
                          className="bg-slate-950 border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Timezone</label>
                        <select
                          value={settings.general.timezone}
                          onChange={(e) => setSettings({ ...settings, general: { ...settings.general, timezone: e.target.value } })}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
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
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Notification Email</label>
                      <Input
                        value={settings.general.notificationEmail}
                        onChange={(e) => setSettings({ ...settings, general: { ...settings.general, notificationEmail: e.target.value } })}
                        placeholder="email@example.com"
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-300">Auto Refresh Market Data</label>
                        <p className="text-xs text-slate-500 mt-1">Automatically refresh market odds and positions</p>
                      </div>
                      <Switch
                        checked={settings.general.autoRefresh}
                        onCheckedChange={(checked) => setSettings({ ...settings, general: { ...settings.general, autoRefresh: checked } })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">
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
                    </div>
                  </motion.div>
                </div>
              </TabsContent>

              {/* Predictions Tab */}
              <TabsContent value="predictions" className="space-y-6">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="grid gap-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                          Default Prediction Amount: ${settings.predictions.defaultPredictionAmount}
                        </label>
                        <Slider
                          value={[settings.predictions.defaultPredictionAmount]}
                          onValueChange={(value: number[] | number | readonly number[]) => setSettings({ ...settings, predictions: { ...settings.predictions, defaultPredictionAmount: (value as number[])[0] } })}
                          min={1}
                          max={100}
                          step={1}
                          className="py-4"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                          Max Prediction Amount: ${settings.predictions.maxPredictionAmount}
                        </label>
                        <Slider
                          value={[settings.predictions.maxPredictionAmount]}
                          onValueChange={(value: number[] | number | readonly number[]) => setSettings({ ...settings, predictions: { ...settings.predictions, maxPredictionAmount: (value as number[])[0] } })}
                          min={100}
                          max={10000}
                          step={100}
                          className="py-4"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-300">Auto-Stake on Entry</label>
                        <p className="text-xs text-slate-500 mt-1">Automatically stake when entering a new position</p>
                      </div>
                      <Switch
                        checked={settings.predictions.autoStake}
                        onCheckedChange={(checked) => setSettings({ ...settings, predictions: { ...settings.predictions, autoStake: checked } })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-300">Use Bankroll</label>
                        <p className="text-xs text-slate-500 mt-1">Use allocated bankroll for predictions</p>
                      </div>
                      <Switch
                        checked={settings.predictions.useBankroll}
                        onCheckedChange={(checked) => setSettings({ ...settings, predictions: { ...settings.predictions, useBankroll: checked } })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">
                        Risk Level: {settings.predictions.riskLevel}/10
                      </label>
                      <Slider
                        value={[settings.predictions.riskLevel]}
                        onValueChange={(value: number[] | number | readonly number[]) => setSettings({ ...settings, predictions: { ...settings.predictions, riskLevel: (value as number[])[0] } })}
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
                  </motion.div>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <label className="text-sm font-medium text-slate-300">
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </label>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) =>
                          setSettings({ ...settings, notifications: { ...settings.notifications, [key]: checked } })
                        }
                      />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="grid gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-300">Two-Factor Authentication</label>
                        <p className="text-xs text-slate-500 mt-1">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        checked={settings.security.twoFactor}
                        onCheckedChange={(checked) => setSettings({ ...settings, security: { ...settings.security, twoFactor: checked } })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                          Session Timeout: {settings.security.sessionTimeout} minutes
                        </label>
                        <Slider
                          value={[settings.security.sessionTimeout]}
                          onValueChange={(value: number[] | number | readonly number[]) => setSettings({ ...settings, security: { ...settings.security, sessionTimeout: (value as number[])[0] } })}
                          min={5}
                          max={120}
                          step={5}
                          className="py-4"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-300">Remember Me</label>
                        <p className="text-xs text-slate-500 mt-1">Stay logged in on this browser</p>
                      </div>
                      <Switch
                        checked={settings.security.rememberBrowser}
                        onCheckedChange={(checked) =>
                          setSettings({ ...settings, security: { ...settings.security, rememberBrowser: checked } })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-300">Secure Storage</label>
                        <p className="text-xs text-slate-500 mt-1">Encrypt your data in browser storage</p>
                      </div>
                      <Switch
                        checked={settings.security.secureStorage}
                        onCheckedChange={(checked) =>
                          setSettings({ ...settings, security: { ...settings.security, secureStorage: checked } })
                        }
                      />
                    </div>
                  </motion.div>
                </div>
              </TabsContent>

              {/* Account Tab */}
              <TabsContent value="account" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid gap-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-slate-300">Connected Wallets</label>
                      <p className="text-xs text-slate-500 mt-1">Manage your connected wallet addresses</p>
                    </div>
                    <Button variant="outline" className="bg-slate-950 border-slate-800">
                      <User className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-slate-300">Bankroll</label>
                      <p className="text-xs text-slate-500 mt-1">Your allocated funds for predictions</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">1000.00 KASH</span>
                      <Button size="sm" variant="outline">Top Up</Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-slate-300">Trading History</label>
                      <p className="text-xs text-slate-500 mt-1">View your past predictions</p>
                    </div>
                    <Button variant="outline" className="bg-slate-950 border-slate-800">
                      <Clock className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-slate-800">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              >
                <Save className="h-4 w-4 mr-2" />
                {saved ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button variant="outline" className="bg-slate-950 border-slate-800">
                <Upload className="h-4 w-4 mr-2" />
                Import Settings
              </Button>
              <Button variant="outline" className="bg-slate-950 border-slate-800">
                <Download className="h-4 w-4 mr-2" />
                Export Settings
              </Button>
              <Button variant="outline" className="bg-slate-950 border-slate-800">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
