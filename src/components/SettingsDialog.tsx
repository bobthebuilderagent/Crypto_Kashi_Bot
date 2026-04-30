"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings, Key, Wallet, Link, Globe, Save, Loader2, Trash2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useSettings, DEXConnection } from "@/context/settings"
import { ChevronDown, ChevronUp } from "lucide-react"
import { US_DEX_PRESETS } from "@/context/settings"

function CEXCard({ conn, index }: { conn: any; index: number }) {
  const { updateCEX, testCEXConnection, isTesting, addCEX, removeCEX } = useSettings()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group relative border border-white/10 rounded-xl p-4 hover:border-cyan-500/30 transition-all bg-slate-900/40"
    >
      {conn.connected && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-green-500/20 text-green-400 border-0 text-xs px-2 py-0.5">Active</Badge>
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{conn.icon}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-white">{conn.name}</h4>
          <span className="text-xs text-slate-400 capitalize">{conn.type}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={conn.apiKeyId}
            onChange={(e) => updateCEX(conn.id, 'apiKeyId', e.target.value)}
            placeholder="API Key ID"
            className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Net:</span>
            <select
              value={conn.network}
              onChange={(e) => updateCEX(conn.id, 'network', e.target.value)}
              className="bg-slate-800 border border-white/10 rounded-lg px-2 py-2 text-xs text-white focus:outline-none"
            >
              <option value="mainnet">Main</option>
              <option value="testnet">Test</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <div className="flex-1">
          <label className="text-xs text-slate-400 mb-1 block">API Key</label>
          <input
            type="text"
            value={conn.apiKey}
            onChange={(e) => updateCEX(conn.id, 'apiKey', e.target.value)}
            placeholder="API Key"
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-slate-400 mb-1 block">API Secret</label>
          <input
            type="password"
            value={conn.apiSecret}
            onChange={(e) => updateCEX(conn.id, 'apiSecret', e.target.value)}
            placeholder="API Secret"
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-3">
        <Button
          onClick={() => testCEXConnection(conn.id)}
          disabled={isTesting}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 disabled:opacity-50 text-white h-8 text-xs"
        >
          {isTesting && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
          {isTesting ? 'Testing...' : 'Test Connection'}
        </Button>
        {conn.connected && (
          <Button
            onClick={() => removeCEX(conn.id)}
            variant="ghost"
            size="icon"
            className="text-red-400 hover:text-red-300 h-8 w-8"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </motion.div>
  )
}

function DEXCard({ conn, index }: { conn: DEXConnection; index: number }) {
  const { updateDEX, testDEXConnection, isTesting } = useSettings()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group relative border border-white/10 rounded-xl p-4 hover:border-cyan-500/30 transition-all bg-slate-900/40"
    >
      {conn.connected && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-green-500/20 text-green-400 border-0 text-xs px-2 py-0.5">Connected</Badge>
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{conn.icon}</span>
        <div>
          <h4 className="font-semibold text-white">{conn.dex}</h4>
          <span className="text-xs text-slate-400">on {conn.asset}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Wallet Address</label>
          <input
            type="text"
            value={conn.walletAddress}
            onChange={(e) => updateDEX(conn.id, 'walletAddress', e.target.value)}
            placeholder="0x..."
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">RPC URL (Optional)</label>
          <input
            type="text"
            value={conn.rpcUrl}
            onChange={(e) => updateDEX(conn.id, 'rpcUrl', e.target.value)}
            placeholder="https://..."
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
          />
        </div>

        <Button
          onClick={() => testDEXConnection(conn.id)}
          disabled={isTesting}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 disabled:opacity-50 text-white h-8 text-xs"
        >
          {isTesting && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
          {isTesting ? 'Testing...' : 'Test Connection'}
        </Button>
      </div>
    </motion.div>
  )
}

function PredictionCard({ conn, index }: { conn: any; index: number }) {
  const { updatePrediction, testPredictionConnection, isTesting } = useSettings()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group relative border border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition-all bg-slate-900/40"
    >
      {conn.connected && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-green-500/20 text-green-400 border-0 text-xs px-2 py-0.5">Connected</Badge>
        </div>
      )}
      
      <h4 className="font-semibold text-white mb-3">{conn.platform === 'predictions' ? '🌐 Predictions' : '🌐 Polymarket'}</h4>
      
      <div className="space-y-2">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">API Key / Token</label>
          <input
            type="text"
            value={conn.token || conn.apiKey || ''}
            onChange={(e) => updatePrediction(conn.id, 'token', e.target.value)}
            placeholder="API Key / Token"
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Wallet Address (Optional)</label>
          <input
            type="text"
            value={conn.walletAddress || conn.token || ''}
            onChange={(e) => updatePrediction(conn.id, 'walletAddress', e.target.value)}
            placeholder="0x..."
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition"
          />
        </div>

        <Button
          onClick={() => testPredictionConnection(conn.id)}
          disabled={isTesting}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-50 text-white h-8 text-xs"
        >
          {isTesting && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
          {isTesting ? 'Testing...' : 'Link Wallet'}
        </Button>
      </div>
    </motion.div>
  )
}

function DEXGroup({ asset, dexes }: { asset: string; dexes: DEXConnection[] }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">💊</span>
          <span className="font-semibold text-white">{asset}</span>
          <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-slate-300">
            {dexes.length} DEXes
          </span>
        </div>
        {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 pl-3 border-l-2 border-cyan-500/30">
              {dexes.map((dex, i) => (
                <DEXCard key={dex.id} conn={dex} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function SettingsDialog() {
  const {
    cexConnections,
    dexConnections,
    predictionConnections,
    addCEX,
    addDEX,
    testAll,
    saveAll,
    isTesting,
  } = useSettings()

  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'cex' | 'dex' | 'prediction'>('cex')

  // Group DEXes by asset
  const dexByAsset = useMemo(() => {
    return dexConnections.reduce<Record<string, DEXConnection[]>>((acc, dex) => {
      if (!acc[dex.asset]) acc[dex.asset] = []
      acc[dex.asset].push(dex)
      return acc
    }, {})
  }, [dexConnections])

  const connectedCount = [
    ...cexConnections, 
    ...dexConnections, 
    ...predictionConnections
  ].filter(c => c.connected).length
  
  const totalCount = cexConnections.length + dexConnections.length + predictionConnections.length

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-left cursor-pointer">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
          {connectedCount > 0 && (
            <Badge className="bg-green-500/20 text-green-400 border-0 ml-auto text-xs px-1.5 py-0">
              {connectedCount}/{totalCount}
            </Badge>
          )}
        </div>
      </DialogTrigger>
      
      <DialogContent className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Connection Settings
            </DialogTitle>
          </DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="hover:bg-white/10"
          >
            <X className="h-5 w-5 text-slate-400" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {(['cex', 'dex', 'prediction'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 p-4 text-sm font-medium transition ${
                activeTab === tab 
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-white/5' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab === 'cex' ? '🏦 Centralized Exchanges (CEX)' :
               tab === 'dex' ? '📊 Decentralized Exchanges (DEX)' :
               '🎯 Prediction Markets'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* CEX Tab */}
          {activeTab === 'cex' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400 text-sm">
                  Connected US-accessible exchanges for bot operations
                </p>
                <Button
                  onClick={addCEX}
                  variant="outline"
                  className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 h-8 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Exchange
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cexConnections.map((conn, i) => (
                  <CEXCard key={conn.id} conn={conn} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* DEX Tab */}
          {activeTab === 'dex' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400 text-sm">
                  Decentralized exchanges grouped by asset chain
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => addDEX(US_DEX_PRESETS.find(p => p.id === 'eth-uniswap-v3')!)}
                    variant="outline"
                    className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 h-8 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add DEX
                  </Button>
                </div>
              </div>
              {Object.entries(dexByAsset).map(([asset, dexes]) => (
                <DEXGroup key={asset} asset={asset} dexes={dexes} />
              ))}
            </div>
          )}

          {/* Prediction Tab */}
          {activeTab === 'prediction' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400 text-sm">
                  Connect prediction market platforms for bot trading
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictionConnections.map((conn, i) => (
                  <PredictionCard key={conn.id} conn={conn} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            Cancel
          </Button>
          
          <div className="flex gap-3">
            <Button
              onClick={() => testAll()}
              disabled={isTesting}
              variant="outline"
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20 h-8 text-xs"
            >
              {isTesting && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
              {isTesting ? 'Testing...' : 'Test All Connections'}
            </Button>
            
            <Button
              onClick={() => {
                saveAll()
                setOpen(false)
              }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-8 text-xs"
            >
              <Key className="h-3 w-3 mr-1" />
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
