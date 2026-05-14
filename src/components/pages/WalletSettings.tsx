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

// Wallet Settings - Connected wallets, token approvals
export function WalletSettings() {
  const [activeTab, setActiveTab] = useState("connected")

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Wallet Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("connected")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "connected"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Wallet className="w-4 h-4 inline mr-2" />
          Connected Wallets
        </button>
        <button
          onClick={() => setActiveTab("approvals")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "approvals"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <ShieldCheck className="w-4 h-4 inline mr-2" />
          Token Approvals
        </button>
      </div>

      {/* Connected Wallets */}
      {activeTab === "connected" && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-cyan-400" />
              Connected Wallets
            </h3>
            <div className="space-y-3">
              {/* Ethereum Wallet */}
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🦄</span>
                    <div>
                      <div className="font-medium text-white text-sm">Ethereum Wallet</div>
                      <div className="text-xs text-slate-400 font-mono">0x1234...5678</div>
                    </div>
                  </div>
                  <Badge className="bg-green-600/20 text-green-400 text-xs">Connected</Badge>
                </div>
              </div>
              {/* Solana Wallet */}
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">☀️</span>
                    <div>
                      <div className="font-medium text-white text-sm">Solana Wallet</div>
                      <div className="text-xs text-slate-400 font-mono">7xY3...k9Lm</div>
                    </div>
                  </div>
                  <Badge className="bg-green-600/20 text-green-400 text-xs">Connected</Badge>
                </div>
              </div>
              {/* Polygon Wallet */}
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🟣</span>
                    <div>
                      <div className="font-medium text-white text-sm">Polygon Wallet</div>
                      <div className="text-xs text-slate-400 font-mono">0x9abc...def0</div>
                    </div>
                  </div>
                  <Badge className="bg-slate-600/20 text-slate-400 text-xs">Not Connected</Badge>
                </div>
              </div>
            </div>

            {/* Add New Wallet */}
            <div className="pt-4 border-t border-slate-700/50">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Add New Wallet</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Network</Label>
                  <Input
                    placeholder="Enter network name or select"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Wallet Address</Label>
                  <Input
                    placeholder="0x..."
                    className="bg-slate-800 border-slate-700 text-white font-mono"
                  />
                </div>
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  Connect Wallet
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Token Approvals */}
      {activeTab === "approvals" && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Token Approvals
            </h3>
            <div className="space-y-3">
              {/* Uniswap V3 */}
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white text-sm">Uniswap V3</div>
                    <div className="text-xs text-slate-400">Approved: Unlimited</div>
                  </div>
                  <Button variant="outline" className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-600/50 text-xs">
                    Revoke
                  </Button>
                </div>
              </div>
              {/* Aave */}
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white text-sm">Aave</div>
                    <div className="text-xs text-slate-400">Approved: 1000 USDC</div>
                  </div>
                  <Button variant="outline" className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-600/50 text-xs">
                    Revoke
                  </Button>
                </div>
              </div>
              {/* Curve */}
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white text-sm">Curve</div>
                    <div className="text-xs text-slate-400">Approved: 500 USDT</div>
                  </div>
                  <Button variant="outline" className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-600/50 text-xs">
                    Revoke
                  </Button>
                </div>
              </div>
            </div>

            {/* Set Approval */}
            <div className="pt-4 border-t border-slate-700/50">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Set New Approval</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Token Contract</Label>
                  <Input
                    placeholder="0x..."
                    className="bg-slate-800 border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Approval Amount</Label>
                  <Input
                    defaultValue="unlimited"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Set Approval
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
