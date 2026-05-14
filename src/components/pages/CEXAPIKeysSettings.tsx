"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Key, Zap, Plus, Trash2, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface ExchangeKey {
  id: string
  name: string
  icon: string
  apiKey: string
  apiSecret: string
  passphrase?: string
  permissions: { read: boolean; trade: boolean; withdraw: boolean }
  connected: boolean
}

// CEX API Keys Settings - Exchange API keys and permissions
export function CEXAPIKeysSettings() {
  const [activeTab, setActiveTab] = useState("exchange")
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({})
  const [exchanges, setExchanges] = useState<ExchangeKey[]>([])

  useEffect(() => {
    fetch("/api/cex-connections")
      .then((res) => res.json())
      .then((data: Array<{ id: string; name: string; icon: string; api_key: string; api_secret: string; api_key_id: string; connected: number }>) => {
        setExchanges(
          data.map((row) => ({
            id: row.id,
            name: row.name,
            icon: row.icon,
            apiKey: row.api_key,
            apiSecret: row.api_secret,
            passphrase: row.api_key_id,
            permissions: { read: true, trade: false, withdraw: false },
            connected: row.connected === 1,
          }))
        )
      })
      .catch(() => setExchanges([]))
  }, [])

  const updateExchange = (id: string, field: string, value: string | boolean) => {
    setExchanges((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    )
  }

  const togglePermission = (id: string, perm: keyof typeof exchanges[0]["permissions"]) => {
    setExchanges((prev) =>
      prev.map((ex) =>
        ex.id === id
          ? { ...ex, permissions: { ...ex.permissions, [perm]: !ex.permissions[perm] } }
          : ex
      )
    )
  }

  const toggleConnection = (id: string) => {
    setExchanges((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, connected: !ex.connected } : ex))
    )
  }

  const toggleSecretVisibility = (id: string) => {
    setShowSecret((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const testConnection = async (id: string) => {
    // Simulate connection test
    const ex = exchanges.find((e) => e.id === id)
    if (ex && ex.apiKey && ex.apiSecret) {
      setExchanges((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, connected: true } : e
        )
      )
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            CEX Exchange API Keys
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Configure your centralized exchange API credentials and permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-green-500/50 text-green-400 hover:bg-green-500/10"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Test All
          </Button>
        </div>
      </div>

      {/* Exchange Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {exchanges.map((ex) => (
          <motion.div
            key={ex.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50 hover:border-slate-600/50 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-lg">
                      {ex.icon}
                    </div>
                    <div>
                      <CardTitle className="text-white text-base flex items-center gap-2">
                        {ex.name}
                        {ex.connected && (
                          <Badge className="bg-green-500/20 text-green-400 border-0 text-xs ml-1">
                            Connected
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-slate-500">
                        Enter your API credentials to connect
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleConnection(ex.id)}
                    className={`h-8 px-2 text-xs ${
                      ex.connected
                        ? "text-green-400 hover:bg-green-500/10"
                        : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {ex.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* API Key */}
                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 block">API Key</Label>
                  <Input
                    value={ex.apiKey}
                    onChange={(e) => updateExchange(ex.id, "apiKey", e.target.value)}
                    placeholder="Enter your API key"
                    className="bg-slate-800/50 border-slate-700/50 text-white text-xs font-mono focus:ring-amber-500/50 focus:border-amber-500/50"
                  />
                </div>

                {/* API Secret */}
                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 block">API Secret</Label>
                  <div className="relative">
                    <Input
                      value={ex.apiSecret}
                      onChange={(e) => updateExchange(ex.id, "apiSecret", e.target.value)}
                      placeholder="Enter your API secret"
                      type={showSecret[ex.id] ? "text" : "password"}
                      className="bg-slate-800/50 border-slate-700/50 text-white text-xs font-mono pr-16 focus:ring-amber-500/50 focus:border-amber-500/50"
                    />
                    <button
                      onClick={() => toggleSecretVisibility(ex.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      {showSecret[ex.id] ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Passphrase (for Coinbase, OKX, Bybit) */}
                {ex.passphrase !== undefined && (
                  <div>
                    <Label className="text-xs text-slate-400 mb-1.5 block">Passphrase</Label>
                    <Input
                      value={ex.passphrase}
                      onChange={(e) => updateExchange(ex.id, "passphrase", e.target.value)}
                      placeholder="Enter your passphrase"
                      className="bg-slate-800/50 border-slate-700/50 text-white text-xs font-mono focus:ring-amber-500/50 focus:border-amber-500/50"
                    />
                  </div>
                )}

                {/* Permissions */}
                <div className="pt-2 border-t border-slate-700/50">
                  <Label className="text-xs text-slate-400 mb-2 block">Permissions</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                        ex.permissions.read
                          ? "bg-green-500/10 border border-green-500/30"
                          : "bg-slate-800/50 border border-slate-700/50"
                      }`}
                      onClick={() => togglePermission(ex.id, "read")}
                    >
                      <span className="text-xs text-slate-300">Read</span>
                      <Switch
                        checked={ex.permissions.read}
                        onCheckedChange={(checked) => togglePermission(ex.id, "read")}
                        className={ex.permissions.read ? "data-[state=checked]:bg-green-600" : ""}
                      />
                    </div>
                    <div
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                        ex.permissions.trade
                          ? "bg-amber-500/10 border border-amber-500/30"
                          : "bg-slate-800/50 border border-slate-700/50"
                      }`}
                      onClick={() => togglePermission(ex.id, "trade")}
                    >
                      <span className="text-xs text-slate-300">Trade</span>
                      <Switch
                        checked={ex.permissions.trade}
                        onCheckedChange={(checked) => togglePermission(ex.id, "trade")}
                        className={ex.permissions.trade ? "data-[state=checked]:bg-amber-600" : ""}
                      />
                    </div>
                    <div
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                        ex.permissions.withdraw
                          ? "bg-red-500/10 border border-red-500/30"
                          : "bg-slate-800/50 border border-slate-700/50"
                      }`}
                      onClick={() => togglePermission(ex.id, "withdraw")}
                    >
                      <span className="text-xs text-slate-300">Withdraw</span>
                      <Switch
                        checked={ex.permissions.withdraw}
                        onCheckedChange={(checked) => togglePermission(ex.id, "withdraw")}
                        className={ex.permissions.withdraw ? "data-[state=checked]:bg-red-600" : ""}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => testConnection(ex.id)}
                    className={`flex-1 ${
                      ex.connected
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-amber-600 hover:bg-amber-700"
                    }`}
                  >
                    {ex.connected ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Connected
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-1" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white">Security Tips</h4>
              <ul className="text-xs text-slate-400 mt-1 space-y-1">
                <li>• Only enable the permissions your bot actually needs</li>
                <li>• Never enable withdraw permissions unless absolutely required</li>
                <li>• Use IP whitelisting for added security</li>
                <li>• Rotate API keys periodically</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
