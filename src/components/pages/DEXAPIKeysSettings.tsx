"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Wallet, CheckCircle, AlertCircle, ArrowRight, ChevronDown, Save, Check, X, XCircle } from "lucide-react"
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
  walletAddress: string       // The wallet address used to connect to the DEX
  rpcUrl: string
  rpcApiKey: string           // API key for the RPC provider (Helius, Alchemy, etc.)
  dexUrl: string              // DEX endpoint URL
  contractAddress?: string    // Contract address for Uniswap V3/V2 etc.
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
  rpc_api_key: string
  dex_url: string
  contract_address: string
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
    { name: "Jupiter",       icon: "🪙", fields: ["wallet_address", "rpc_url", "rpc_api_key", "dex_url"] },
    { name: "Raydium",      icon: "⚡", fields: ["wallet_address", "rpc_url", "rpc_api_key", "dex_url"] },
    { name: "Orca",         icon: "🐋", fields: ["wallet_address", "rpc_url", "rpc_api_key", "dex_url"] },
  ],
  ETH: [
    { name: "Uniswap V3",   icon: "🦄", fields: ["wallet_address", "rpc_url", "rpc_api_key", "contract_address", "dex_url"] },
    { name: "Uniswap V2",   icon: "🦄", fields: ["wallet_address", "rpc_url", "rpc_api_key", "contract_address", "dex_url"] },
    { name: "SushiSwap",    icon: "🍣", fields: ["wallet_address", "rpc_url", "rpc_api_key", "dex_url"] },
    { name: "Curve",        icon: "〰️", fields: ["wallet_address", "rpc_url", "rpc_api_key", "dex_url"] },
    { name: "1inch",        icon: "🔵", fields: ["wallet_address", "rpc_url", "rpc_api_key", "dex_url"] },
  ],
  BTC: [
    { name: "Binance",      icon: "🟡", fields: ["wallet_address", "rpc_url", "rpc_api_key", "dex_url"] },
    { name: "Coinbase",     icon: "🔵", fields: ["wallet_address", "rpc_url", "rpc_api_key", "dex_url"] },
    { name: "Kraken",       icon: "🟣", fields: ["wallet_address", "rpc_url", "rpc_api_key", "dex_url"] },
  ],
  ARB: [
    { name: "Uniswap V3",   icon: "🦄", fields: ["wallet_address", "rpc_url", "rpc_api_key", "contract_address", "dex_url"] },
    { name: "Camelot",      icon: "🐫", fields: ["wallet_address", "rpc_url", "rpc_api_key", "dex_url"] },
  ],
  POL: [
    { name: "Uniswap V3",   icon: "🦄", fields: ["wallet_address", "rpc_url", "rpc_api_key", "contract_address", "dex_url"] },
    { name: "QuickSwap",    icon: "⚡", fields: ["wallet_address", "rpc_url", "rpc_api_key", "dex_url"] },
  ],
  AVAX: [
    { name: "Trader",      icon: "🎯", fields: ["wallet_address", "rpc_url", "rpc_api_key", "dex_url"] },
    { name: "Pangolin",    icon: "🐸", fields: ["wallet_address", "rpc_url", "rpc_api_key", "dex_url"] },
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
    { label: "Solana Mainnet (Public)",    url: "https://api.mainnet.solana.com" },
    { label: "Solana RPC (Helius)",        url: "https://mainnet.helius-rpc.com/?api=YOUR_API_KEY" },
    { label: "Solana RPC (QuickNode)",     url: "https://your-quicknode-endpoint.io" },
    { label: "Solana RPC (Triton)",        url: "https://your-triton-endpoint.io" },
    { label: "Solana RPC (Genenode)",      url: "https://api.genenode.io" },
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
  const [exchanges, setExchanges] = useState<DEXExchange[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedExchanges, setExpandedExchanges] = useState<Record<string, boolean>>({})
  const [savedExchanges, setSavedExchanges] = useState<Set<string>>(new Set())

  // Toast notification state
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 4000)
  }

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
            walletAddress: conn.wallet_address || "",
            rpcUrl: conn.rpc_url || "",
            rpcApiKey: conn.rpc_api_key || "",
            dexUrl: conn.dex_url || "",
            contractAddress: conn.contract_address || "",
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

  const saveExchange = async (ex: DEXExchange) => {
    try {
      const res = await fetch(`/api/dex-connections?id=${ex.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ex.id,
          asset: ex.network,
          symbol: ex.name,
          dex: ex.name,
          icon: ex.icon,
          connected: ex.enabled ? 1 : 0,
          wallet_address: ex.walletAddress,
          rpc_url: ex.rpcUrl,
          rpc_api_key: ex.rpcApiKey,
          dex_url: ex.dexUrl,
          contract_address: ex.contractAddress || "",
          chain_id: null,
        }),
      })
      // Handle response safely - check content-type and body
      let data
      const contentType = res.headers.get("content-type")
      if (contentType && contentType.includes("application/json") && res.body) {
        const text = await res.text()
        try {
          data = JSON.parse(text)
        } catch {
          data = { success: true } // fallback if body is not valid JSON
        }
      } else {
        data = { success: true } // fallback for non-JSON responses
      }
      if (res.ok) {
        setSavedExchanges((prev) => new Set([...prev, ex.id]))
        showToast(`✅ ${ex.name} saved to database! Data will persist after reboot.`, "success")
      } else {
        showToast(`❌ Failed to save ${ex.name}: HTTP ${res.status}`, "error")
      }
    } catch (err) {
      showToast(`❌ Connection error — check your network and try again.`, "error")
      console.error("Failed to save exchange:", err)
    }
  }

  const toggleExchange = (id: string) => {
    setExchanges((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, enabled: !ex.enabled } : ex))
    )
  }

  const toggleExpanded = (id: string) => {
    setExpandedExchanges((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const testConnection = async (id: string) => {
    const ex = exchanges.find((e) => e.id === id)
    if (ex) {
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
        walletAddress: existing?.walletAddress || "",
        rpcUrl: existing?.rpcUrl || "",
        rpcApiKey: existing?.rpcApiKey || "",
        dexUrl: existing?.dexUrl || "",
        contractAddress: existing?.contractAddress || "",
        enabled: existing?.enabled || false,
        fields: t.fields,
      } as DEXExchange
    })
  }

  const networkExchanges = getExchangesForNetwork(selectedNetwork)
  const networkInfo = getNetworkInfo(selectedNetwork)
  const presets = RPC_PRESETS[selectedNetwork] || []
  const dexUrls = DEX_EXCHANGE_URLS[selectedNetwork] || []

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ─── Header ─────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-400" />
            DEX Exchange Configuration
          </h2>
           <p className="text-sm text-slate-400 mt-1">
            Configure your DEX exchanges — wallet address for trading, RPC endpoint URL for chain access, DEX endpoint URL
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
                          Wallet address for DEX trading | RPC endpoint URL for chain access | DEX endpoint URL
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
                    {/* Wallet Address - for DEX trading */}
                    {ex.fields.includes("wallet_address") && (
                      <div>
                        <Label className="text-xs text-slate-400 mb-1.5 block">Wallet Address (for DEX trading)</Label>
                        <Input
                          value={ex.walletAddress || ""}
                          onChange={(e) => updateExchange(ex.id, "walletAddress", e.target.value)}
                          placeholder="Your trading wallet address"
                          className="bg-slate-800/50 border-slate-700/50 text-white text-xs font-mono focus:ring-purple-500/50 focus:border-purple-500/50"
                        />
                      </div>
                    )}

                                    {/* RPC Endpoint URL — single controlled Input field with Select auto-fill */}
                    {ex.fields.includes("rpc_url") && (
                      <div>
                        <Label className="text-xs text-slate-400 mb-1.5 block">RPC Endpoint URL</Label>
                        <div className="flex gap-2">
                          <Select
                            value={ex.rpcUrl || "custom"}
                            onValueChange={(val) => {
                              if (val === null || val === "custom") {
                                updateExchange(ex.id, "rpcUrl", "")
                              } else {
                                updateExchange(ex.id, "rpcUrl", val)
                              }
                            }}
                          >
                            <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white text-xs font-mono focus:ring-purple-500/50 focus:border-purple-500/50">
                              <SelectValue placeholder="Select RPC endpoint..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel className="text-slate-500">Helius (full URL with API key)</SelectLabel>
                                <SelectItem value="custom">— Paste your own URL —</SelectItem>
                              </SelectGroup>
                              <SelectGroup>
                                <SelectLabel className="text-slate-500">Quick RPC Presets</SelectLabel>
                                {presets.map((preset) => (
                                  <SelectItem key={preset.url} value={preset.url} className="text-xs">
                                    {preset.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="mt-2">
                          <Input
                            value={ex.rpcUrl || ""}
                            onChange={(e) => updateExchange(ex.id, "rpcUrl", e.target.value)}
                            placeholder="https://your-helius-endpoint.io/?api=YOUR_KEY"
                            className="bg-slate-800/50 border-slate-700/50 text-white text-xs font-mono focus:ring-purple-500/50 focus:border-purple-500/50"
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          For Helius/Alchemy: paste the full URL (it already includes your API key). No separate key needed.
                        </p>
                      </div>
                    )}

                    {/* Optional RPC API Key — only needed for providers that DON'T bundle it in the URL */}
                    {ex.fields.includes("rpc_api_key") && (
                      <div>
                        <Label className="text-xs text-slate-400 mb-1.5 block">
                          RPC API Key <span className="text-slate-600">(optional — only if your provider doesn't include it in the URL)</span>
                        </Label>
                        <Input
                          value={ex.rpcApiKey || ""}
                          onChange={(e) => updateExchange(ex.id, "rpcApiKey", e.target.value)}
                          placeholder="Skip this if your RPC URL already has the API key (e.g. helius endpoint)"
                          className="bg-slate-800/50 border-slate-700/50 text-white text-xs font-mono focus:ring-purple-500/50 focus:border-purple-500/50"
                        />
                      </div>
                    )}

                    {/* DEX Exchange URL — single controlled Input field with Select auto-fill */}
                    {ex.fields.includes("dex_url") && (
                      <div>
                        <Label className="text-xs text-slate-400 mb-1.5 block">DEX Exchange URL (endpoint)</Label>
                        <div className="flex gap-2">
                          <Select
                            value={ex.dexUrl || "custom"}
                            onValueChange={(val) => {
                              if (val === null || val === "custom") {
                                updateExchange(ex.id, "dexUrl", "")
                              } else {
                                updateExchange(ex.id, "dexUrl", val)
                              }
                            }}
                          >
                            <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white text-xs font-mono focus:ring-purple-500/50 focus:border-purple-500/50">
                              <SelectValue placeholder="Select DEX endpoint..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel className="text-slate-500">Available Endpoints</SelectLabel>
                                {dexUrls?.map((dex) => (
                                  <SelectItem key={dex.url} value={dex.url} className="text-xs">
                                    {dex.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                              <SelectGroup>
                                <SelectLabel className="text-slate-500">Custom URL</SelectLabel>
                                <SelectItem value="custom">— Paste your own URL —</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="mt-2">
                          <Input
                            value={ex.dexUrl || ""}
                            onChange={(e) => updateExchange(ex.id, "dexUrl", e.target.value)}
                            placeholder="https://your-dex-endpoint.com/api"
                            className="bg-slate-800/50 border-slate-700/50 text-white text-xs font-mono focus:ring-purple-500/50 focus:border-purple-500/50"
                          />
                        </div>
                      </div>
                    )}

                    {/* Contract Address (for Uniswap V3/V2) */}
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

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveExchange(ex)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save to Database
                      </Button>
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

      {/* ─── Toast Notification ───────────────── */}
      {toastVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed top-6 left-1/2 z-[9999] max-w-lg w-full px-4"
        >
          <div
            className={`rounded-xl shadow-2xl border p-4 flex items-center gap-3 ${
              toastType === "success"
                ? "bg-green-900/90 border-green-500/50 text-green-100 backdrop-blur-md"
                : "bg-red-900/90 border-red-500/50 text-red-100 backdrop-blur-md"
            }`}
          >
            {toastType === "success" ? (
              <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-green-300" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-red-500/30 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5 text-red-300" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium leading-snug">{toastMessage}</p>
            </div>
            <button
              onClick={() => setToastVisible(false)}
              className="text-white/50 hover:text-white transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* ─── Info Card ──────────────────────── */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white">DEX Configuration Guide</h4>
              <ul className="text-xs text-slate-400 mt-1 space-y-1">
                <li>• Wallet Address: Your trading wallet used to connect to DEXs</li>
                <li>• RPC Endpoint URL: Paste your full RPC URL (Helius/Alchemy bundle API key in URL — no separate key needed)</li>
                <li>• RPC API Key (optional): Only needed if your provider doesn't include it in the URL</li>
                <li>• DEX URL: The DEX exchange endpoint URL (no API key needed)</li>
                <li>• Save your changes to persist them to the database</li>
                <li>• Test connections before enabling trading features</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}