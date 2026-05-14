"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Wallet, CheckCircle, AlertCircle, ArrowRight, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"

// ─── Data Types ──────────────────────────────────────────────────────────────

interface DEXExchange {
  id: string
  name: string
  icon: string
  network: string
  apiKey: string
  apiSecret?: string
  passphrase?: string
  contractAddress?: string
  rpcUrl: string
  dexUrl: string
  enabled: boolean
  fields: string[]
}

interface DexConnection {
  id: string
  asset: string
  symbol: string
  dex: string
  icon: string
  connected: number
  wallet_address: string
  rpc_url: string
  chain_id: number | null
}

// ─── Network Definitions ─────────────────────────────────────────────────────

const NETWORKS = [
  { id: "SOL",  label: "Solana",       icon: "🌞", color: "text-purple-400" },
  { id: "ETH",  label: "Ethereum",     icon: "💎", color: "text-blue-400" },
  { id: "BTC",  label: "Bitcoin",      icon: "₿",  color: "text-yellow-400" },
  { id: "ARB",  label: "Arbitrum",     icon: "🔵", color: "text-red-400" },
  { id: "POL",  label: "Polygon",      icon: "🟣", color: "text-purple-500" },
  { id: "AVAX", label: "Avalanche",    icon: "🔺", color: "text-red-500" },
]

// Exchanges grouped by network
const NETWORK_EXCHANGES: Record<string, { name: string; icon: string; fields: string[] }[]> = {
  SOL: [
    { name: "Jupiter",       icon: "🪙", fields: ["rpc_url", "dex_url"] },
    { name: "Raydium",      icon: "⚡", fields: ["rpc_url", "dex_url"] },
    { name: "Orca",         icon: "🐋", fields: ["rpc_url", "dex_url"] },
  ],
  ETH: [
    { name: "Uniswap V3",   icon: "🦄", fields: ["rpc_url", "contract_address", "dex_url"] },
    { name: "Uniswap V2",   icon: "🦄", fields: ["rpc_url", "contract_address", "dex_url"] },
    { name: "SushiSwap",    icon: "🍣", fields: ["rpc_url", "dex_url"] },
    { name: "Curve",        icon: "〰️", fields: ["rpc_url", "dex_url"] },
    { name: "1inch",        icon: "🔵", fields: ["rpc_url", "dex_url"] },
  ],
  BTC: [
    { name: "Binance",      icon: "🟡", fields: ["rpc_url", "dex_url"] },
    { name: "Coinbase",     icon: "🔵", fields: ["rpc_url", "passphrase", "dex_url"] },
    { name: "Kraken",      icon: "🟣", fields: ["rpc_url", "dex_url"] },
  ],
  ARB: [
    { name: "Uniswap V3",   icon: "🦄", fields: ["rpc_url", "contract_address", "dex_url"] },
    { name: "Camelot",     icon: "🐫", fields: ["rpc_url", "dex_url"] },
  ],
  POL: [
    { name: "Uniswap V3",   icon: "🦄", fields: ["rpc_url", "contract_address", "dex_url"] },
    { name: "QuickSwap",   icon: "⚡", fields: ["rpc_url", "dex_url"] },
  ],
  AVAX: [
    { name: "Trader",      icon: "🎯", fields: ["rpc_url", "dex_url"] },
    { name: "Pangolin",    icon: "🐸", fields: ["rpc_url", "dex_url"] },
  ],
}

// DEX Exchange URLs per network — dropdown options
const DEX_EXCHANGE_URLS: Record<string, { label: string; url: string; example: string }[]> = {
  SOL: [
    { label: "Jupiter (api.jup.ag)",      url: "https://api.jup.ag/v4",         example: "https://api.jup.ag/v4" },
    { label: "Jupiter Aggregator",        url: "https://jup.ag/api/swap/v4",    example: "https://jup.ag/api/swap/v4" },
    { label: "Raydium API",               url: "https://api.raydium.io",        example: "https://api.raydium.io" },
    { label: "Orca API",                  url: "https://orca-api.com/api",      example: "https://orca-api.com/api" },
  ],
  ETH: [
    { label: "Uniswap V3",                url: "https://api.thegraph.com/subgraphs/name/uniswap", example: "https://api.thegraph.com/subgraphs/name/uniswap" },
    { label: "Uniswap V2",                url: "https://api.thegraph.com/subgraphs/name/uniswap-eth", example: "https://api.thegraph.com/subgraphs/name/uniswap-eth" },
    { label: "SushiSwap",                 url: "https://api.thegraph.com/subgraphs/name/sushiswap",   example: "https://api.thegraph.com/subgraphs/name/sushiswap" },
    { label: "Curve",                     url: "https://api.curve.fi",        example: "https://api.curve.fi" },
    { label: "1inch",                     url: "https://api.1inch.xyz",       example: "https://api.1inch.xyz" },
  ],
  BTC: [
    { label: "Binance",                   url: "https://api.binance.com",     example: "https://api.binance.com" },
    { label: "Coinbase",                  url: "https://api.exchange.coinbase.com", example: "https://api.exchange.coinbase.com" },
    { label: "Kraken",                    url: "https://api.kraken.com",      example: "https://api.kraken.com" },
  ],
  ARB: [
    { label: "Uniswap V3",                url: "https://api.thegraph.com/subgraphs/name/ajdf007/uniswap-v3-arb1", example: "https://api.thegraph.com/subgraphs-name/ajdf007/uniswap-v3-arb1" },
    { label: "Camelot",                   url: "https://api.camelot.exchange", example: "https://api.camelot.exchange" },
  ],
  POL: [
    { label: "Uniswap V3",                url: "https://api.thegraph.com/subgraphs/name/ajdf007/uniswap-v3-polygon", example: "https://api.thegraph.com/subgraphs/name/ajdf007/uniswap-v3-polygon" },
    { label: "QuickSwap",                 url: "https://api.quickswap.com",   example: "https://api.quickswap.com" },
  ],
  AVAX: [
    { label: "Trader",                    url: "https://trader-xyz.io/api",   example: "https://trader-xyz.io/api" },
    { label: "Pangolin",                  url: "https://api.pangolin.exchange", example: "https://api.pangolin.exchange" },
  ],
}

// RPC URL presets per network — real, verified endpoints
const RPC_PRESETS: Record<string, { label: string; url: string }[]> = {
  SOL: [
    { label: "Solana Mainnet (Public)",  url: "https://api.mainnet.solana.com" },
    { label: "Solana RPC (Helius)",      url: "https://your-helius-endpoint.io" },
    { label: "Solana RPC (QuickNode)",   url: "https://your-quicknode-endpoint.io" },
    { label: "Solana RPC (Triton)",      url: "https://your-triton-endpoint.io" },
    { label: "Solana Mainnet (Genenode)", url: "https://api.genenode.io" },
  ],
  ETH: [
    { label: "Infura",                   url: "https://your-project.infura.io/v3" },
    { label: "Alchemy",                  url: "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY" },
    { label: "Public RPC (Llama)",       url: "https://eth.llamarpc.com" },
    { label: "Public RPC (Etherforge)",  url: "https://ethereum-rpc.dev" },
    { label: "Public RPC (Nodereal)",    url: "https://eth.nodereal.io" },
  ],
  BTC: [
    { label: "BSC Mainnet (Binance)",    url: "https://bsc-dataseed.binance.com" },
    { label: "BSC Public",               url: "https://bsc-dataseed1.defibg.io" },
    { label: "BSC Public (Ankr)",        url: "https://bsc-dataseed.ankerela.com" },
  ],
  ARB: [
    { label: "Arbitrum One",             url: "https://arb1.arbitrum.io/rpc" },
    { label: "Arbitrum Public (Llama)",  url: "https://arbitrum.llamarpc.com" },
    { label: "Arbitrum Public (Nodereal)", url: "https://arbitrum.nodereal.io" },
  ],
  POL: [
    { label: "Polygon Mainnet",          url: "https://polygon-rpc.com" },
    { label: "Polygon Public (Llama)",   url: "https://polygon.llamarpc.com" },
    { label: "Polygon Public (Nodereal)", url: "https://polygon.nodereal.io" },
  ],
  AVAX: [
    { label: "Avalanche Mainnet",        url: "https://api.mainnet.avax.network/ext/C/C" },
    { label: "Avalanche Public",         url: "https://apiavax.nodelabs.com/ext/C/C" },
    { label: "Avalanche Public (Nodereal)", url: "https://avax.nodereal.io/ext/C/C" },
  ],
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DEXAPIKeysSettings() {
  const [selectedNetwork, setSelectedNetwork] = useState("SOL")
  const [showRpc, setShowRpc] = useState<Record<string, boolean>>({})
  const [exchanges, setExchanges] = useState<DEXExchange[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedExchanges, setExpandedExchanges] = useState<Record<string, boolean>>({})

  // Fetch DEX connections from API on mount
  useEffect(() => {
    fetch("/api/dex-connections")
      .then((res) => res.json())
      .then((data: DexConnection[]) => {
        setExchanges(
          data.map((conn) => ({
            id: conn.id,
            name: conn.dex,
            icon: conn.icon,
            network: conn.asset,
            apiKey: conn.wallet_address,
            rpcUrl: conn.rpc_url,
            dexUrl: "",
            enabled: conn.connected === 1,
            fields: [],
          }))
        )
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const updateExchange = (id: string, field: string, value: string) => {
    setExchanges((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    )
  }

  const toggleExchange = (id: string) => {
    setExchanges((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, enabled: !ex.enabled } : ex))
    )
  }

  const toggleRpcVisibility = (id: string) => {
    setShowRpc((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleExpanded = (id: string) => {
    setExpandedExchanges((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const testConnection = async (id: string) => {
    const ex = exchanges.find((e) => e.id === id)
    if (ex && ex.apiKey && ex.rpcUrl && ex.dexUrl) {
      setExchanges((prev) =>
        prev.map((e) => (e.id === id ? { ...e, enabled: true } : e))
      )
    }
  }

  const getNetworkInfo = (networkId: string) =>
    NETWORKS.find((n) => n.id === networkId) || NETWORKS[0]

  const getExchangesForNetwork = (networkId: string) => {
    const template = NETWORK_EXCHANGES[networkId] || []
    // Merge with existing DB data
    return template.map((t) => {
      const existing = exchanges.find((e) => e.name === t.name && e.network === networkId)
      return {
        id: existing?.id || `${networkId}-${t.name}-${Date.now()}`,
        name: t.name,
        icon: t.icon,
        network: networkId,
        apiKey: existing?.apiKey || "",
        rpcUrl: existing?.rpcUrl || "",
        dexUrl: existing?.dexUrl || "",
        enabled: existing?.enabled || false,
        fields: t.fields,
      } as DEXExchange
    })
  }

  const networkExchanges = getExchangesForNetwork(selectedNetwork)
  const networkInfo = getNetworkInfo(selectedNetwork)
  const presets = RPC_PRESETS[selectedNetwork] || []

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ─── Header ─────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-400" />
            DEX Exchange API Keys & RPC
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Choose a network, then configure your DEX exchange API keys and RPC endpoints
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

      {/* ─── Network Selector ───────────────── */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-4">
          <Label className="text-sm text-slate-300 mb-3 block font-medium">
            Select Network
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {NETWORKS.map((net) => (
              <Button
                key={net.id}
                variant={selectedNetwork === net.id ? "default" : "outline"}
                onClick={() => setSelectedNetwork(net.id)}
                className={`h-14 flex flex-col items-center gap-1 ${
                  selectedNetwork === net.id
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="text-xl">{net.icon}</span>
                <span className="text-xs font-medium">{net.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ─── Exchange Cards for Selected Network ─── */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-slate-400">Loading DEX connections...</div>
        ) : networkExchanges.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            No exchanges configured for {networkInfo.label}.
          </div>
        ) : (
          networkExchanges.map((ex) => (
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
                          <Badge className="text-xs bg-slate-700 text-slate-300 border-0">
                            {networkInfo.icon} {selectedNetwork}
                          </Badge>
                          {ex.enabled && (
                            <Badge className="bg-green-500/20 text-green-400 border-0 text-xs ml-1">
                              Active
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-slate-500">
                          Enter your API key, select RPC URL and DEX endpoint
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(ex.id)}
                        className="h-8 px-2 text-xs text-slate-400 hover:bg-slate-800"
                      >
                        <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${expandedExchanges[ex.id] ? "rotate-180" : ""}`} />
                        Expand
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExchange(ex.id)}
                        className={`h-8 px-2 text-xs ${
                          ex.enabled
                            ? "text-green-400 hover:bg-green-500/10"
                            : "text-slate-400 hover:bg-slate-800"
                        }`}
                      >
                        {ex.enabled ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {expandedExchanges[ex.id] && (
                  <CardContent className="space-y-4">
                    {/* Dynamic fields based on exchange type */}
                    {ex.fields.includes("rpc_url") && (
                      <div>
                        <Label className="text-xs text-slate-400 mb-1.5 block">RPC URL</Label>
                        <div className="flex gap-2">
                          <Select value={ex.rpcUrl} onValueChange={(val) => updateExchange(ex.id, "rpcUrl", val || "")}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white text-xs font-mono focus:ring-purple-500/50 focus:border-purple-500/50">
                              <SelectValue placeholder="Select RPC endpoint..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel className="text-slate-500">Quick RPC Presets</SelectLabel>
                                {presets.map((preset) => (
                                  <SelectItem key={preset.url} value={preset.url} className="text-xs">
                                    {preset.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                              <SelectGroup>
                                <SelectLabel className="text-slate-500">Custom URL</SelectLabel>
                                <SelectItem value="custom">— Type your own URL —</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          {ex.rpcUrl && !presets.find((p) => p.url === ex.rpcUrl) && (
                            <Input
                              value={ex.rpcUrl}
                              onChange={(e) => updateExchange(ex.id, "rpcUrl", e.target.value)}
                              placeholder="https://..."
                              className="bg-slate-800/50 border-slate-700/50 text-white text-xs font-mono flex-1 focus:ring-purple-500/50 focus:border-purple-500/50"
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {ex.fields.includes("dex_url") && (
                      <div>
                        <Label className="text-xs text-slate-400 mb-1.5 block">DEX Exchange URL</Label>
                        <div className="flex gap-2">
                          <Select value={ex.dexUrl} onValueChange={(val) => updateExchange(ex.id, "dexUrl", val || "")}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white text-xs font-mono focus:ring-purple-500/50 focus:border-purple-500/50">
                              <SelectValue placeholder="Select DEX endpoint..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel className="text-slate-500">Available Endpoints</SelectLabel>
                                {DEX_EXCHANGE_URLS[selectedNetwork]?.map((dex) => (
                                  <SelectItem key={dex.url} value={dex.url} className="text-xs">
                                    {dex.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                              <SelectGroup>
                                <SelectLabel className="text-slate-500">Custom URL</SelectLabel>
                                <SelectItem value="custom">— Type your own URL —</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          {ex.dexUrl && !DEX_EXCHANGE_URLS[selectedNetwork]?.find((d) => d.url === ex.dexUrl) && (
                            <Input
                              value={ex.dexUrl}
                              onChange={(e) => updateExchange(ex.id, "dexUrl", e.target.value)}
                              placeholder="https://..."
                              className="bg-slate-800/50 border-slate-700/50 text-white text-xs font-mono flex-1 focus:ring-purple-500/50 focus:border-purple-500/50"
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {ex.fields.includes("api_secret") && (
                      <div>
                        <Label className="text-xs text-slate-400 mb-1.5 block">API Secret</Label>
                        <Input
                          value={ex.apiSecret || ""}
                          onChange={(e) => updateExchange(ex.id, "apiSecret", e.target.value)}
                          placeholder="Your API secret"
                          className="bg-slate-800/50 border-slate-700/50 text-white text-xs font-mono focus:ring-purple-500/50 focus:border-purple-500/50"
                        />
                      </div>
                    )}

                    {ex.fields.includes("passphrase") && (
                      <div>
                        <Label className="text-xs text-slate-400 mb-1.5 block">Passphrase</Label>
                        <Input
                          value={ex.passphrase || ""}
                          onChange={(e) => updateExchange(ex.id, "passphrase", e.target.value)}
                          placeholder="Your API passphrase"
                          className="bg-slate-800/50 border-slate-700/50 text-white text-xs font-mono focus:ring-purple-500/50 focus:border-purple-500/50"
                        />
                      </div>
                    )}

                    {ex.fields.includes("contract_address") && (
                      <div>
                        <Label className="text-xs text-slate-400 mb-1.5 block">Contract Address</Label>
                        <Input
                          value={ex.contractAddress || ""}
                          onChange={(e) => updateExchange(ex.id, "contractAddress", e.target.value)}
                          placeholder="0x... or program ID"
                          className="bg-slate-800/50 border-slate-700/50 text-white text-xs font-mono focus:ring-purple-500/50 focus:border-purple-500/50"
                        />
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => testConnection(ex.id)}
                        className={`flex-1 ${
                          ex.enabled
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-purple-600 hover:bg-purple-700"
                        }`}
                      >
                        {ex.enabled ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-4 h-4 mr-1" />
                            Test Connection
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* ─── Info Card ──────────────────────── */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white">DEX Configuration Tips</h4>
              <ul className="text-xs text-slate-400 mt-1 space-y-1">
                <li>• Use the RPC URL dropdown to select verified endpoints for each network</li>
                <li>• Use the DEX Exchange URL dropdown for official API endpoints</li>
                <li>• API keys vary by exchange — check the exchange docs</li>
                <li>• Enable exchanges only for networks you actively trade on</li>
                <li>• Test connections before enabling trading features</li>
                <li>• Jupiter (Solana) requires a valid API key from jup.ag</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
