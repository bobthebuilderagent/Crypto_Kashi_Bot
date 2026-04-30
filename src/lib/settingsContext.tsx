"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'

// ─── CEX ───────────────────────────────────────────────
// US-accessible centralized exchanges
export interface CEXConnection {
  id: string
  name: string
  icon: string
  type: 'spot' | 'futures' | 'both'
  apiKey: string
  apiSecret: string
  apiKeyId?: string
  connected: boolean
}

export const CEX_TYPES = {
  CRYPTO: 'crypto' as const,
  PREDICTION: 'prediction' as const,
} as const

export const US_ACCESSIBLE_CEX: Omit<CEXConnection, 'apiKey' | 'apiSecret' | 'apiKeyId' | 'connected'>[] = [
  { id: 'coinbase-pro', name: 'Coinbase Pro', icon: '🔵', type: 'both' },
  { id: 'kraken', name: 'Kraken', icon: '🟣', type: 'both' },
  { id: 'binance-us', name: 'Binance US', icon: '🔶', type: 'both' },
  { id: 'kraken-us', name: 'Kraken', icon: '🟣', type: 'both' },
  { id: 'coinbase-pro-wallet', name: 'Coinbase Wallet', icon: '🔷', type: 'both' },
]

// ─── DEX ───────────────────────────────────────────────
export interface DEXConnection {
  id: string
  asset: string
  symbol: string
  dex: string
  icon: string
  connected: boolean
  walletAddress?: string
  rpcUrl?: string
}

export const US_ACCESSIBLE_DEX: Omit<DEXConnection, 'connected' | 'walletAddress' | 'rpcUrl'>[] = [
  // ETH
  { asset: 'ETH', symbol: 'ETH', dex: 'Uniswap', id: 'eth-uniswap', icon: '🦄' },
  { asset: 'ETH', symbol: 'ETH', dex: '1inch', id: 'eth-1inch', icon: '🔗' },
  { asset: 'ETH', symbol: 'ETH', dex: 'Curve', id: 'eth-curve', icon: '🦠' },
  { asset: 'ETH', symbol: 'ETH', dex: 'Balancer', id: 'eth-balancer', icon: '🏗️' },
  { asset: 'ETH', symbol: 'ETH', dex: 'SushiSwap', id: 'eth-sushi', icon: '🍣' },
  // SOL
  { asset: 'SOL', symbol: 'SOL', dex: 'Jupiter', id: 'sol-jupiter', icon: '🌕' },
  { asset: 'SOL', symbol: 'SOL', dex: 'Raydium', id: 'sol-raydium', icon: '☀️' },
  { asset: 'SOL', symbol: 'SOL', dex: 'Orca', id: 'sol-orca', icon: '🐋' },
  // BTC (wrapped)
  { asset: 'BTC', symbol: 'WBTC', dex: 'Uniswap', id: 'btc-uniswap', icon: '🦄' },
  { asset: 'BTC', symbol: 'WBTC', dex: '1inch', id: 'btc-1inch', icon: '🔗' },
  // MATIC
  { asset: 'MATIC', symbol: 'MATIC', dex: 'QuickSwap', id: 'matic-quickswap', icon: '⚡' },
  // AVAX
  { asset: 'AVAX', symbol: 'AVAX', dex: 'Trader Joe', id: 'avax-joe', icon: '☕' },
  // LINK
  { asset: 'LINK', symbol: 'LINK', dex: 'Uniswap', id: 'link-uniswap', icon: '🦄' },
  // OP
  { asset: 'OP', symbol: 'OP', dex: 'Velodrome', id: 'op-velodrome', icon: '🌀' },
  // ARB
  { asset: 'ARB', symbol: 'ARB', dex: 'Unison', id: 'arb-unison', icon: '🦄' },
  // USDC
  { asset: 'USDC', symbol: 'USDC', dex: 'All DEXes', id: 'usdc-dexes', icon: '💵' },
]

// ─── Prediction Platforms (unchanged) ----------
export interface PredictionConnection {
  id: string
  platform: 'kalshi' | 'polymarket'
  apiKey: string
  token?: string
  walletAddress?: string
  connected: boolean
}

export const DEFAULT_PREDICTION_PLATFORMS: PredictionConnection[] = [
  { id: 'kalshi', platform: 'kalshi', apiKey: '', connected: false },
  { id: 'polymarket', platform: 'polymarket', apiKey: '', connected: false },
]

// ─── Context ───────────────────────────────────────────
interface SettingsContextType {
  // CEX
  cexConnections: CEXConnection[]
  setCexConnections: (conns: CEXConnection[]) => void
  addCexConnection: (conn: Omit<CEXConnection, 'apiKey' | 'apiSecret' | 'apiKeyId' | 'connected'>) => void
  removeCexConnection: (id: string) => void
  updateCexField: (id: string, field: 'apiKey' | 'apiSecret' | 'apiKeyId' | 'connected', value: string | boolean) => void
  testCexConnection: (id: string) => Promise<boolean>

  // DEX
  dexConnections: DEXConnection[]
  setDexConnections: (conns: DEXConnection[]) => void
  addDexConnection: (conn: Omit<DEXConnection, 'connected' | 'walletAddress' | 'rpcUrl'>) => void
  removeDexConnection: (id: string) => void
  updateDexField: (id: string, field: 'walletAddress' | 'rpcUrl', value: string) => void

  // Prediction
  predictionPlatforms: PredictionConnection[]
  setPredictionPlatforms: (platforms: PredictionConnection[]) => void
  addPredictionPlatform: (platform: Omit<PredictionConnection, 'connected'>) => void
  removePredictionPlatform: (id: string) => void
  updatePredictionField: (id: string, field: 'apiKey' | 'token' | 'walletAddress', value: string) => void
  testPredictionConnection: (id: string) => Promise<boolean>
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

// ─── Storage Helpers ─────────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  CEX: 'crypto_kalshi_bot_cex_connections',
  DEX: 'crypto_kalshi_bot_dex_connections',
  PREDICTION: 'crypto_kalshi_bot_prediction_platforms',
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : defaultValue
  } catch {
    return defaultValue
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

// ─── Provider ──────────────────────────────────────────────────────────────────────
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // CEX connections - persist to localStorage
  const [cexConnections, setCexConnections] = useState<CEXConnection[]>(
    () => loadFromStorage<CEXConnection[]>(STORAGE_KEYS.CEX, [])
  )

  // DEX connections - persist to localStorage
  const [dexConnections, setDexConnections] = useState<DEXConnection[]>(
    () => loadFromStorage<DEXConnection[]>(STORAGE_KEYS.DEX, [])
  )

  // Prediction platforms - persist to localStorage
  const [predictionPlatforms, setPredictionPlatforms] = useState<PredictionConnection[]>(
    () => loadFromStorage<PredictionConnection[]>(STORAGE_KEYS.PREDICTION, DEFAULT_PREDICTION_PLATFORMS)
  )

  // Persist CEX connections to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CEX, cexConnections)
  }, [cexConnections])

  // Persist DEX connections to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DEX, dexConnections)
  }, [dexConnections])

  // Persist prediction platforms to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PREDICTION, predictionPlatforms)
  }, [predictionPlatforms])

  const addCexConnection = useCallback((conn: Omit<CEXConnection, 'apiKey' | 'apiSecret' | 'apiKeyId' | 'connected'>) => {
    setCexConnections(prev => [...prev, { ...conn, apiKey: '', apiSecret: '', apiKeyId: undefined, connected: false }])
  }, [])

  const removeCexConnection = useCallback((id: string) => {
    setCexConnections(prev => prev.filter(c => c.id !== id))
  }, [])

  const updateCexField = useCallback((id: string, field: 'apiKey' | 'apiSecret' | 'apiKeyId' | 'connected', value: string | boolean) => {
    setCexConnections(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }, [])

  // DEX
  const addDexConnection = useCallback((conn: Omit<DEXConnection, 'connected' | 'walletAddress' | 'rpcUrl'>) => {
    setDexConnections(prev => [...prev, { ...conn, connected: false, walletAddress: '', rpcUrl: '' }])
  }, [])

  const removeDexConnection = useCallback((id: string) => {
    setDexConnections(prev => prev.filter(d => d.id !== id))
  }, [])

  const updateDexField = useCallback((id: string, field: 'walletAddress' | 'rpcUrl', value: string) => {
    setDexConnections(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d))
  }, [])

  // Prediction
  const addPredictionPlatform = useCallback((platform: Omit<PredictionConnection, 'connected'>) => {
    setPredictionPlatforms(prev => [...prev, { ...platform, connected: false, apiKey: '' }])
  }, [])

  const removePredictionPlatform = useCallback((id: string) => {
    setPredictionPlatforms(prev => prev.filter(p => p.id !== id))
  }, [])

  const updatePredictionField = useCallback((id: string, field: 'apiKey' | 'token' | 'walletAddress', value: string) => {
    setPredictionPlatforms(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }, [])

  // Mock connection test
  const testCexConnection = useCallback(async (_id: string): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(true), 1000)
    })
  }, [])

  const testPredictionConnection = useCallback(async (_id: string): Promise<boolean> => {
    return new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 1000))
  }, [])

  return (
    <SettingsContext.Provider value={{
      // CEX
      cexConnections,
      setCexConnections,
      addCexConnection,
      removeCexConnection,
      updateCexField,
      testCexConnection,
      // DEX
      dexConnections,
      setDexConnections,
      addDexConnection,
      removeDexConnection,
      updateDexField,
      // Prediction
      predictionPlatforms,
      setPredictionPlatforms,
      addPredictionPlatform,
      removePredictionPlatform,
      updatePredictionField,
      testPredictionConnection
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettingsContext() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider')
  }
  return context
}
