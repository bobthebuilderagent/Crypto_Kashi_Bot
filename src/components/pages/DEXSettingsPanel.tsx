"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Wallet, Key, RefreshCw, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSettings, US_DEX_PRESETS } from "@/context/settings"

// DEX Settings Panel - protocol-specific tabs
export function DEXSettingsPanel() {
  const [selectedProtocol, setSelectedProtocol] = useState("jupiter")

  const protocols = [
    { id: "jupiter", name: "Jupiter", icon: "🪙", chain: "Solana" },
    { id: "raydium", name: "Raydium", icon: "⚡", chain: "Solana" },
    { id: "uniswap", name: "Uniswap V3", icon: "🦄", chain: "Ethereum" },
    { id: "pancakeswap", name: "PancakeSwap", icon: "🥞", chain: "BSC" },
    { id: "aave", name: "Aave", icon: "👻", chain: "Ethereum" },
  ]

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Protocol Selection */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-purple-400" />
            DEX Protocol Settings
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {protocols.map((proto) => (
              <button
                key={proto.id}
                onClick={() => setSelectedProtocol(proto.id)}
                className={`p-3 rounded-lg border transition-all text-left ${
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
          {selectedProtocol === "jupiter" && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300">Jupiter (Solana) Configuration</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Network</Label>
                  <Select defaultValue="mainnet">
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mainnet">Solana Mainnet</SelectItem>
                      <SelectItem value="devnet">Solana Devnet</SelectItem>
                      <SelectItem value="testnet">Solana Testnet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">RPC Endpoint</Label>
                  <Input
                    defaultValue="https://api.mainnet.solana.com"
                    className="bg-slate-800 border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Slippage (%)</Label>
                  <Input defaultValue="1" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Max Slippage (%)</Label>
                  <Input defaultValue="5" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Jupiter API Key</Label>
                  <Input
                    placeholder="Your Jupiter API key"
                    className="bg-slate-800 border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

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
                  <Label className="text-sm text-slate-400 mb-1 block">Wallet Address</Label>
                  <Input
                    placeholder="0x..."
                    className="bg-slate-800 border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-400 mb-1 block">Auto-Compound</Label>
                  <Switch className="data-[state=checked]:bg-green-600" />
                </div>
              </div>
            </div>
          )}

          {/* Wallet Connection Section */}
          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Wallet Connection</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">MetaMask</div>
                  <div className="text-xs text-slate-400">Connect via browser extension</div>
                </div>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">WalletConnect</div>
                  <div className="text-xs text-slate-400">Scan QR with mobile wallet</div>
                </div>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
            </div>
          </div>

          {/* Liquidity Pool Settings */}
          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Liquidity Pool Settings</h4>
            <div className="space-y-3">
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Auto-Liquidity Threshold</Label>
                <Input defaultValue="100" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Min Liquidity Amount</Label>
                <Input defaultValue="10" className="bg-slate-800 border-slate-700 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
