"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Key, Globe, Server, Zap, Wallet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// API Keys Settings - Network RPCs, Exchange keys, DEX keys
export function APIKeysSettings() {
  const [activeTab, setActiveTab] = useState("network")

  return (
    <div className="space-y-5 max-w-2xl">
      {/* API Key Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("network")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "network"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Globe className="w-4 h-4 inline mr-2" />
          Network RPCs
        </button>
        <button
          onClick={() => setActiveTab("exchange")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "exchange"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Zap className="w-4 h-4 inline mr-2" />
          Exchange Keys
        </button>
        <button
          onClick={() => setActiveTab("dex")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "dex"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Wallet className="w-4 h-4 inline mr-2" />
          DEX Keys
        </button>
      </div>

      {/* Network RPC URLs */}
      {activeTab === "network" && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-green-400" />
              Network RPC Endpoints
            </h3>
            <div className="space-y-4">
              {/* Ethereum RPC */}
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Ethereum RPC</Label>
                <Input
                  defaultValue="https://eth.llamarpc.com"
                  className="bg-slate-800 border-slate-700 text-white font-mono"
                />
              </div>
              {/* Solana RPC */}
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Solana RPC</Label>
                <Input
                  defaultValue="https://api.mainnet.solana.com"
                  className="bg-slate-800 border-slate-700 text-white font-mono"
                />
              </div>
              {/* Polygon RPC */}
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Polygon RPC</Label>
                <Input
                  defaultValue="https://polygon-rpc.com"
                  className="bg-slate-800 border-slate-700 text-white font-mono"
                />
              </div>
              {/* Arbitrum RPC */}
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Arbitrum RPC</Label>
                <Input
                  defaultValue="https://arb1.arbitrum.io/rpc"
                  className="bg-slate-800 border-slate-700 text-white font-mono"
                />
              </div>
              {/* BSC RPC */}
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">BSC RPC</Label>
                <Input
                  defaultValue="https://bsc-dataseed.binance.com"
                  className="bg-slate-800 border-slate-700 text-white font-mono"
                />
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              Test Connections
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Exchange API Keys */}
      {activeTab === "exchange" && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Exchange API Keys (CEX)
            </h3>
            <div className="space-y-4">
              {/* Binance */}
              <div className="space-y-2">
                <Label className="text-sm text-slate-400">Binance</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">API Key</Label>
                    <Input
                      defaultValue="your-binance-api-key"
                      className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">API Secret</Label>
                    <Input
                      defaultValue="your-binance-api-secret"
                      className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
              {/* Coinbase */}
              <div className="space-y-2">
                <Label className="text-sm text-slate-400">Coinbase</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">API Key</Label>
                    <Input
                      defaultValue="your-coinbase-api-key"
                      className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">API Secret</Label>
                    <Input
                      defaultValue="your-coinbase-api-secret"
                      className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Passphrase</Label>
                    <Input
                      defaultValue="your-passphrase"
                      className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
              {/* Kraken */}
              <div className="space-y-2">
                <Label className="text-sm text-slate-400">Kraken</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">API Key</Label>
                    <Input
                      defaultValue="your-kraken-api-key"
                      className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Private Key</Label>
                    <Input
                      defaultValue="your-kraken-private-key"
                      className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-green-600 hover:bg-green-700">
                Test All Connections
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DEX Protocol Keys */}
      {activeTab === "dex" && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-purple-400" />
              DEX Protocol Keys
            </h3>
            <div className="space-y-4">
              {/* Uniswap */}
              <div className="space-y-2">
                <Label className="text-sm text-slate-400">Uniswap V3</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Contract Address</Label>
                    <Input
                      defaultValue="0xe59247a164bc738eeb5955c2f27b1e8a1a1b0a5a"
                      className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">RPC URL</Label>
                    <Input
                      defaultValue="https://eth.llamarpc.com"
                      className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
              {/* Aave */}
              <div className="space-y-2">
                <Label className="text-sm text-slate-400">Aave</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Lending Pool</Label>
                    <Input
                      defaultValue="0x8e5955d3ae6c0e9c2b5c8c3e4d5f6a7b8c9d0e1f"
                      className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Wallet Address</Label>
                    <Input
                      defaultValue="0x..."
                      className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              Test DEX Connections
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
