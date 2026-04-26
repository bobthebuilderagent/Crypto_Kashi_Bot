export interface CryptoAsset {
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap: string
  volume: string
  icon: string
}

export interface BotConfig {
  id: string
  name: string
  exchange: string
  type: 'spot' | 'futures'
  status: 'active' | 'paused' | 'stopped'
  strategy: string
  dailyPnl: number
  totalPnl: number
  tradeCount: number
  winRate: number
}

export interface PredictionMarket {
  id: string
  title: string
  platform: 'kashi' | 'polymarket'
  category: string
  yesPrice: number
  noPrice: number
  volume: string
  closeDate: string
  liquidity: string
}

export interface PredictionPosition {
  id: string
  marketId: string
  marketTitle: string
  side: 'yes' | 'no'
  shares: number
  price: number
  currentValue: number
  pnl: number
}
