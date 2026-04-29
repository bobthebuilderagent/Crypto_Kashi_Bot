"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X, Search, Loader2, CheckCircle2, XCircle, Key, Wallet, Globe, ChevronDown, ChevronUp,
  Plus, Trash2, Lock, Unlock
} from "lucide-react"
import {
  useSettings,
  CEXConnection,
  DEXConnection,
  PredictionConnection,
  US_CEX_PRESETS,
  US_DEX_PRESETS,
  PREDICTION_PRESETS
} from "@/context/settings"

// ─── Reusable Sub-Components ───────────────────────────

function CEXCard({
  conn,
  index,
}: {
  conn: CEXConnection
  index: number
}) {
  const { updateCEX, testCEXConnection, isTesting, removeCEX, addCEX } = useSettings()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group relative border border-white/10 rounded-xl p-4 hover:border-cyan-500/30 transition-all bg-slate-900/40"
    >
      {conn.connected && (
        <div className="absolute top-2 right-2">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{conn.icon}</span>
        <div>
          <h4 className="font-semibold text-white">{conn.name}</h4>
          <span className={`text-xs px-2 py-0.5 rounded-full ${conn.type === 'both' ? 'bg-cyan-500/20 text-cyan-300' :
            conn.type === 'futures' ? 'bg-orange-500/20 text-orange-300' :
              'bg-green-500/20 text-green-300'
            }`}>
            {conn.type}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">API Key ID</label>
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

        <div className="flex gap-2">
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

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => testCEXConnection(conn.id)}
            disabled={isTesting}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center justify-center gap-2"
          >
            {isTesting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>

          {conn.connected && (
            <button
              onClick={() => removeCEX(conn.id)}
              className="px-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function DEXCard({
  conn,
  index,
}: {
  conn: DEXConnection
  index: number
}) {
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
          <CheckCircle2 className="h-4 w-4 text-green-400" />
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

        <button
          onClick={() => testDEXConnection(conn.id)}
          disabled={isTesting}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2"
        >
          {isTesting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isTesting ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
    </motion.div>
  )
}

function PredictionCard({
  conn,
  index,
}: {
  conn: PredictionConnection
  index: number
}) {
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
          <CheckCircle2 className="h-4 w-4 text-green-400" />
        </div>
      )}

      <h4 className="font-semibold text-white mb-3">{conn.platform}</h4>

      <div className="space-y-2">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">API Key / Token</label>
          <input
            type="text"
            value={conn.apiKey}
            onChange={(e) => updatePrediction(conn.id, 'apiKey', e.target.value)}
            placeholder="API Key / Token"
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Wallet Address (Optional)</label>
          <input
            type="text"
            value={conn.walletAddress}
            onChange={(e) => updatePrediction(conn.id, 'walletAddress', e.target.value)}
            placeholder="0x..."
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition"
          />
        </div>

        <button
          onClick={() => testPredictionConnection(conn.id)}
          disabled={isTesting}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium hover:from-purple-400 hover:to-pink-400 transition-all flex items-center justify-center gap-2"
        >
          {isTesting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isTesting ? 'Testing...' : 'Link Wallet'}
        </button>
      </div>
    </motion.div>
  )
}

// ─── Asset DEX Group ───────────────────────────────────

function DEXGroup({ asset, dexes }: { asset: string; dexes: DEXConnection[] }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🪙</span>
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

// ─── Main Dialog ───────────────────────────────────────

export function SettingsDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const {
    cexConnections,
    dexConnections,
    predictionConnections,
    addCEX,
    addDEX,
    addPrediction,
    testAll,
    saveAll,
    isTesting,
  } = useSettings()

  const [activeTab, setActiveTab] = useState<'cex' | 'dex' | 'prediction'>('cex')

  // Group DEXes by asset
  const dexByAsset = useMemo(() => {
    return dexConnections.reduce<Record<string, DEXConnection[]>>((acc, dex) => {
      if (!acc[dex.asset]) acc[dex.asset] = []
      acc[dex.asset].push(dex)
      return acc
    }, {})
  }, [dexConnections])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Connection Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {(['cex', 'dex', 'prediction'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 p-4 text-sm font-medium transition ${activeTab === tab
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
                <div className="flex gap-2">
                  {US_CEX_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => addCEX()}
                      className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm transition flex items-center gap-2"
                    >
                      <span className="text-lg">{preset.icon}</span>
                      <span className="max-w-[100px] truncate">{preset.name}</span>
                    </button>
                  ))}
                  <button
                    onClick={addCEX}
                    className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm transition flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="max-w-[100px] truncate">Custom</span>
                  </button>
                </div>
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
                  <button
                    onClick={() => addDEX(US_DEX_PRESETS.find(p => p.id === 'eth-uniswap-v3')!)}
                    className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm transition flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add DEX
                  </button>
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
                <div className="flex gap-2">
                  <button
                    onClick={() => addPrediction(PREDICTION_PRESETS.find(p => p.id === 'kashi')!)}
                    className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm transition flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Prediction
                  </button>
                </div>
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
          <button
            onClick={() => onClose()}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition"
          >
            Cancel
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => testAll()}
              disabled={isTesting}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium hover:from-cyan-400 hover:to-purple-400 transition-all flex items-center gap-2"
            >
              {isTesting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isTesting ? 'Testing...' : 'Test All Connections'}
            </button>

            <button
              onClick={() => saveAll()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl text-sm font-medium hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center gap-2"
            >
              <Key className="h-4 w-4" />
              Save Settings
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
