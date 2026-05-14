"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Wallet, Key, ShieldCheck, ExternalLink, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// CEX Wallet Settings - Exchange accounts and balances
export function CEXWalletSettings() {
  const [activeTab, setActiveTab] = useState("accounts")

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Wallet Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("accounts")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "accounts"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Wallet className="w-4 h-4 inline mr-2" />
          Exchange Accounts
        </button>
        <button
          onClick={() => setActiveTab("balances")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "balances"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <ShieldCheck className="w-4 h-4 inline mr-2" />
          Balances
        </button>
      </div>

      {/* Exchange Accounts */}
      {activeTab === "accounts" && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-cyan-400" />
              CEX Exchange Accounts
            </h3>
            <div className="space-y-3">
              {/* Binance Account */}
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🟢</span>
                    <div>
                      <div className="font-medium text-white text-sm">Binance</div>
                      <div className="text-xs text-slate-400">Connected via API</div>
                    </div>
                  </div>
                  <Badge className="bg-green-600/20 text-green-400 text-xs">Active</Badge>
                </div>
              </div>
              {/* Coinbase Account */}
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🔵</span>
                    <div>
                      <div className="font-medium text-white text-sm">Coinbase</div>
                      <div className="text-xs text-slate-400">Connected via API</div>
                    </div>
                  </div>
                  <Badge className="bg-green-600/20 text-green-400 text-xs">Active</Badge>
                </div>
              </div>
              {/* Kraken Account */}
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">⚫</span>
                    <div>
                      <div className="font-medium text-white text-sm">Kraken</div>
                      <div className="text-xs text-slate-400">Not connected</div>
                    </div>
                  </div>
                  <Badge className="bg-slate-600/20 text-slate-400 text-xs">Inactive</Badge>
                </div>
              </div>
            </div>

            {/* Add New Account */}
            <div className="pt-4 border-t border-slate-700/50">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Add New Exchange Account</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Exchange</Label>
                  <Input
                    placeholder="Enter exchange name"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">API Key</Label>
                  <Input
                    placeholder="Enter API key"
                    className="bg-slate-800 border-slate-700 text-white font-mono"
                  />
                </div>
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  Connect Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Balances */}
      {activeTab === "balances" && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Account Balances
            </h3>
            <div className="space-y-3">
              {/* Total Balance */}
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white text-sm">Total Balance</div>
                    <div className="text-xs text-slate-400">All exchanges combined</div>
                  </div>
                  <div className="text-lg font-bold text-green-400">$12,450.00</div>
                </div>
              </div>
              {/* Per Exchange */}
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🟢</span>
                    <span className="text-sm text-white">Binance</span>
                  </div>
                  <span className="text-sm font-bold text-green-400">$8,200.00</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🔵</span>
                    <span className="text-sm text-white">Coinbase</span>
                  </div>
                  <span className="text-sm font-bold text-green-400">$4,250.00</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
