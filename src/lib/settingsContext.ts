"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'

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
  id: string
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
  platform: 'kashi' | 'polymarket'
  apiKey: string
  walletAddress?: string
  connected: boolean
}

export const DEFAULT_PREDICTION_PLATFORMS: PredictionConnection[] = [
  { id: 'kashi', platform: 'kashi', apiKey: '', connected: false },
  { id: 'polymarket', platform: 'polymarket', apiKey: '', connected: false },
]

// ─── Context ───────────────────────────────────────────
interface SettingsContextType {
  // CEX
  cexConnections: CEXConnection[]
  setCexConnections: (conns: CEXConnection[]) void
  addCexConnection: (conn: Omit<CEXConnection, 'apiKey' | 'apiSecret' | 'apiKeyId' | 'connected'>) => void
  removeCexConnection: (id: string) => void
  updateCexField: (id: string, field: 'apiKey' | 'apiSecret' | 'apiKeyId' | 'connected', value: string | boolean) => void
  testCexConnection: (id: string) => Promise<boolean>
}
