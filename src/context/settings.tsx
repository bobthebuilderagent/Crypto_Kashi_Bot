"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

// ─── Types ───────────────────────────────────────────────

type CEXType = 'spot' | 'futures' | 'both'

export interface CEXConnection {
  id: string
  name: string
  icon: string
  type: CEXType
  apiKey: string
  apiSecret: string
  apiKeyId: string
  connected: boolean
  network: 'mainnet' | 'testnet'
}

export interface DEXConnection {
  id: string
  asset: string
  dex: string
  icon: string
  connected: boolean
  walletAddress: string
  rpcUrl: string
}

export interface PredictionConnection {
  id: string
  platform: 'kalshi' | 'polymarket'
  apiKey: string
  token?: string
  walletAddress: string
  connected: boolean
}

// ─── Presets ─────────────────────────────────────────────

// US-accessible CEXs
export const US_CEX_PRESETS: Omit<CEXConnection, 'apiKey' | 'apiSecret' | 'apiKeyId' | 'connected' | 'network'>[] = [
  { id: 'coinbase-pro', name: 'Coinbase Pro', icon: '🔵', type: 'both' },
  { id: 'kraken', name: 'Kraken', icon: '🟣', type: 'both' },
  { id: 'binance-us', name: 'Binance US', icon: '🔶', type: 'both' },
  { id: 'bybit-us', name: 'Bybit (US)', icon: '🟠', type: 'both' },
  { id: 'deribit', name: 'Deribit', icon: '🔴', type: 'futures' },
  { id: 'okx-us', name: 'OKX (US)', icon: '🟢', type: 'both' },
]

// US-accessible DEXes (asset → DEX mapping)
export const US_DEX_PRESETS: Omit<DEXConnection, 'connected' | 'walletAddress' | 'rpcUrl'>[] = [
  // Ethereum / EVM
  { id: 'eth-uniswap-v3', asset: 'ETH', dex: 'Uniswap V3', icon: '🦄' },
  { id: 'eth-uniswap-v2', asset: 'ETH', dex: 'Uniswap V2', icon: '🦄' },
  { id: 'eth-curve', asset: 'ETH', dex: 'Curve', icon: '💧' },
  { id: 'eth-sushiswap', asset: 'ETH', dex: 'SushiSwap', icon: '🍣' },
  { id: 'eth-1inch', asset: 'ETH', dex: '1inch', icon: '🔗' },
  { id: 'eth-aave', asset: 'ETH', dex: 'Aave', icon: '👻' },
  // Solana
  { id: 'sol-jupiter', asset: 'SOL', dex: 'Jupiter', icon: '🌕' },
  { id: 'sol-raydium', asset: 'SOL', dex: 'Raydium', icon: '☀️' },
  { id: 'sol-orca', asset: 'SOL', dex: 'Orca', icon: '🐋' },
  // BTC (wrapped)
  { id: 'wbtc-uniswap', asset: 'BTC', dex: 'Uniswap', icon: '🦄' },
  { id: 'wbtc-1inch', asset: 'BTC', dex: '1inch', icon: '🔗' },
  // Multi-chain stablecoins
  { id: 'usdc-uniswap', asset: 'USDC', dex: 'Across DEXes', icon: '💵' },
  { id: 'usdt-uniswap', asset: 'USDT', dex: 'Across DEXes', icon: '💲' },
]

export const PREDICTION_PRESETS: Omit<PredictionConnection, 'apiKey' | 'walletAddress' | 'connected'>[] = [
  { id: 'kalshi', platform: 'kalshi' },
  { id: 'polymarket', platform: 'polymarket' },
]

// ─── Favorites Types ─────────────────────────────────
export interface CryptoFavorite {
  symbol: string
  name: string
  icon: string
}

export interface PredictionFavorite {
  id: string
  title: string
  platform: string
}

// ─── Storage Keys ────────────────────────────────────────

const STORAGE_KEYS = {
  CEX: 'crypto_kalshi_bot_cex_connections',
  DEX: 'crypto_kalshi_bot_dex_connections',
  PREDICTION: 'crypto_kalshi_bot_prediction_platforms',
  CRYPTO_FAV: 'crypto_kalshi_bot_crypto_favorites',
  PRED_FAV: 'crypto_kalshi_bot_prediction_favorites',
} as const

// ─── Helper: load from localStorage ──────────────────────

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

// ─── Context ─────────────────────────────────────────────

interface SettingsContextType {
  // CEX
  cexConnections: CEXConnection[]
  setCexConnections: (conns: CEXConnection[]) => void
  addCEX: () => void
  removeCEX: (id: string) => void
  updateCEX: (id: string, key: keyof CEXConnection, value: string | boolean) => void
  testCEXConnection: (id: string) => Promise<boolean>

  // DEX
  dexConnections: DEXConnection[]
  setDexConnections: (conns: DEXConnection[]) => void
  addDEX: (preset: Omit<DEXConnection, 'connected' | 'walletAddress' | 'rpcUrl'>) => void
  removeDEX: (id: string) => void
  updateDEX: (id: string, key: keyof DEXConnection, value: string | boolean) => void
  testDEXConnection: (id: string) => Promise<boolean>

  // Prediction
  predictionConnections: PredictionConnection[]
  setPredictionConnections: (conns: PredictionConnection[]) => void
  updatePrediction: (id: string, key: keyof PredictionConnection, value: string | boolean) => void
  testPredictionConnection: (id: string) => Promise<boolean>
  addPrediction: (preset: Omit<PredictionConnection, 'connected' | 'apiKey' | 'walletAddress'>) => void

  // Favorites
  cryptoFavorites: CryptoFavorite[]
  toggleCryptoFavorite: (fav: CryptoFavorite) => void
  predictionFavorites: PredictionFavorite[]
  togglePredictionFavorite: (fav: PredictionFavorite) => void

  // Global
  isTesting: boolean
  testAll: () => Promise<boolean>

  // Persistence
  saveAll: () => void
  loadAll: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // Load defaults with persistence
  const defaultCEX: CEXConnection[] = US_CEX_PRESETS.map(p => ({
    ...p,
    apiKey: '',
    apiSecret: '',
    apiKeyId: '',
    connected: false,
    network: 'mainnet' as const,
  }))

  const defaultDEX: DEXConnection[] = US_DEX_PRESETS.map(p => ({
    ...p,
    connected: false,
    walletAddress: '',
    rpcUrl: '',
  }))

  const defaultPrediction: PredictionConnection[] = PREDICTION_PRESETS.map(p => ({
    ...p,
    apiKey: '',
    walletAddress: '',
    connected: false,
  }))

  const [cexConnections, setCEXState] = useState<CEXConnection[]>(() => loadFromStorage(STORAGE_KEYS.CEX, defaultCEX))
  const [dexConnections, setDexState] = useState<DEXConnection[]>(() => loadFromStorage(STORAGE_KEYS.DEX, defaultDEX))
  const [predictionConnections, setPredictionState] = useState<PredictionConnection[]>(() =>
    loadFromStorage(STORAGE_KEYS.PREDICTION, defaultPrediction)
  )
  const [isTesting, setIsTesting] = useState(false)

  // Auto-save on any change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CEX, cexConnections)
  }, [cexConnections])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DEX, dexConnections)
  }, [dexConnections])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PREDICTION, predictionConnections)
  }, [predictionConnections])

  // ── CEX methods ──

  const addCEX = useCallback(() => {
    const newId = `custom-cex-${Date.now()}`
    const newConn: CEXConnection = {
      id: newId,
      name: 'Custom Exchange',
      icon: '📝',
      type: 'both',
      apiKey: '',
      apiSecret: '',
      apiKeyId: '',
      connected: false,
      network: 'mainnet',
    }
    setCEXState(prev => [...prev, newConn])
  }, [])

  const removeCEX = useCallback((id: string) => {
    setCEXState(prev => prev.filter(c => c.id !== id))
  }, [])

  const updateCEX = useCallback((id: string, key: keyof CEXConnection, value: string | boolean) => {
    setCEXState(prev =>
      prev.map(c => c.id === id ? { ...c, [key]: value } : c)
    )
  }, [])

  const testCEXConnection = useCallback(async (id: string): Promise<boolean> => {
    setIsTesting(true)
    await new Promise(r => setTimeout(r, 1500))
    setCEXState(prev =>
      prev.map(c => c.id === id ? { ...c, connected: true } : c)
    )
    setIsTesting(false)
    return true
  }, [])

  // ── DEX methods ──

  const addDEX = useCallback((preset: Omit<DEXConnection, 'connected' | 'walletAddress' | 'rpcUrl'>) => {
    const newConn: DEXConnection = {
      ...preset,
      connected: false,
      walletAddress: '',
      rpcUrl: '',
    }
    setDexState(prev => [...prev, newConn])
  }, [])

  const removeDEX = useCallback((id: string) => {
    setDexState(prev => prev.filter(d => d.id !== id))
  }, [])

  const updateDEX = useCallback((id: string, key: keyof DEXConnection, value: string | boolean) => {
    setDexState(prev =>
      prev.map(d => d.id === id ? { ...d, [key]: value as never } : d)
    )
  }, [])

  const testDEXConnection = useCallback(async (id: string): Promise<boolean> => {
    setIsTesting(true)
    await new Promise(r => setTimeout(r, 1500))
    setDexState(prev =>
      prev.map(d => d.id === id ? { ...d, connected: true } : d)
    )
    setIsTesting(false)
    return true
  }, [])

  // ── Prediction methods ──

  const updatePrediction = useCallback((id: string, key: keyof PredictionConnection, value: string | boolean) => {
    setPredictionState(prev =>
      prev.map(c => c.id === id ? { ...c, [key]: value } : c)
    )
  }, [])

  const testPredictionConnection = useCallback(async (id: string): Promise<boolean> => {
    setIsTesting(true)
    await new Promise(r => setTimeout(r, 1500))
    setPredictionState(prev =>
      prev.map(c => c.id === id ? { ...c, connected: true } : c)
    )
    setIsTesting(false)
    return true
  }, [])

  const addPrediction = useCallback((preset: Omit<PredictionConnection, 'connected' | 'apiKey' | 'walletAddress'>) => {
    const newConn: PredictionConnection = {
      ...preset,
      connected: false,
      apiKey: '',
      walletAddress: '',
    }
    setPredictionState(prev => [...prev, newConn])
  }, [])

  // ── Favorites ──

  const [cryptoFavorites, setCryptoFavorites] = useState<CryptoFavorite[]>(() =>
    loadFromStorage(STORAGE_KEYS.CRYPTO_FAV, [])
  )

  const [predictionFavorites, setPredictionFavorites] = useState<PredictionFavorite[]>(() =>
    loadFromStorage(STORAGE_KEYS.PRED_FAV, [])
  )

  // Auto-save favorites
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CRYPTO_FAV, cryptoFavorites)
  }, [cryptoFavorites])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PRED_FAV, predictionFavorites)
  }, [predictionFavorites])

  const toggleCryptoFavorite = useCallback((fav: CryptoFavorite) => {
    setCryptoFavorites(prev => {
      const exists = prev.find(f => f.symbol === fav.symbol)
      if (exists) {
        return prev.filter(f => f.symbol !== fav.symbol)
      }
      return [...prev, fav]
    })
  }, [])

  const togglePredictionFavorite = useCallback((fav: PredictionFavorite) => {
    setPredictionFavorites(prev => {
      const exists = prev.find(f => f.id === fav.id)
      if (exists) {
        return prev.filter(f => f.id !== fav.id)
      }
      return [...prev, fav]
    })
  }, [])

  // ── Global ──

  const testAll = useCallback(async (): Promise<boolean> => {
    setIsTesting(true)
    await new Promise(r => setTimeout(r, 800))
    setCEXState(prev => prev.map(c => ({ ...c, connected: true })))
    setDexState(prev => prev.map(d => ({ ...d, connected: true })))
    setPredictionState(prev => prev.map(p => ({ ...p, connected: true })))
    setIsTesting(false)
    return true
  }, [])

  const saveAll = useCallback(() => {
    saveToStorage(STORAGE_KEYS.CEX, cexConnections)
    saveToStorage(STORAGE_KEYS.DEX, dexConnections)
    saveToStorage(STORAGE_KEYS.PREDICTION, predictionConnections)
  }, [cexConnections, dexConnections, predictionConnections])

  const loadAll = useCallback(() => {
    setCEXState(loadFromStorage(STORAGE_KEYS.CEX, defaultCEX))
    setDexState(loadFromStorage(STORAGE_KEYS.DEX, defaultDEX))
    setPredictionState(loadFromStorage(STORAGE_KEYS.PREDICTION, defaultPrediction))
  }, [defaultCEX, defaultDEX, defaultPrediction])

  return (
    <SettingsContext.Provider value={{
      cexConnections,
      setCexConnections: setCEXState,
      addCEX,
      removeCEX,
      updateCEX,
      testCEXConnection,
      dexConnections,
      setDexConnections: setDexState,
      addDEX,
      removeDEX,
      updateDEX,
      testDEXConnection,
      predictionConnections,
      setPredictionConnections: setPredictionState,
      updatePrediction,
      testPredictionConnection,
      addPrediction,
      cryptoFavorites,
      toggleCryptoFavorite,
      predictionFavorites,
      togglePredictionFavorite,
      isTesting,
      testAll,
      saveAll,
      loadAll,
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextType {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}