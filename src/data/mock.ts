export const cryptoAssets = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67234.50, change24h: 2.34, marketCap: '1.32T', volume: '28.5B', icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', price: 3456.78, change24h: -1.12, marketCap: '415B', volume: '15.2B', icon: 'Ξ' },
  { symbol: 'SOL', name: 'Solana', price: 178.92, change24h: 5.67, marketCap: '82.3B', volume: '4.1B', icon: '◎' },
  { symbol: 'BNB', name: 'BNB', price: 612.45, change24h: 0.89, marketCap: '91.2B', volume: '2.1B', icon: '◆' },
  { symbol: 'XRP', name: 'Ripple', price: 0.6234, change24h: -2.45, marketCap: '34.1B', volume: '1.8B', icon: '✕' },
  { symbol: 'ADA', name: 'Cardano', price: 0.4567, change24h: 1.23, marketCap: '16.2B', volume: '890M', icon: '◇' },
  { symbol: 'AVAX', name: 'Avalanche', price: 38.92, change24h: 3.45, marketCap: '15.1B', volume: '720M', icon: '▲' },
  { symbol: 'DOT', name: 'Polkadot', price: 7.23, change24h: -0.56, marketCap: '9.8B', volume: '340M', icon: '●' },
]

export const mockBots = [
  { id: 'bot-1', name: 'BTC Grid Bot', exchange: 'Binance US', type: 'spot', status: 'active', strategy: 'Grid Trading', dailyPnl: 234.56, totalPnl: 12456.78, tradeCount: 1234, winRate: 67.8 },
  { id: 'bot-2', name: 'ETH Futures Scalper', exchange: 'Coinbase Pro', type: 'futures', status: 'active', strategy: 'Scalping', dailyPnl: -45.23, totalPnl: 3456.12, tradeCount: 4567, winRate: 72.3 },
  { id: 'bot-3', name: 'SOL DCA Bot', exchange: 'Kraken', type: 'spot', status: 'paused', strategy: 'DCA', dailyPnl: 0, totalPnl: 890.45, tradeCount: 89, winRate: 61.2 },
  { id: 'bot-4', name: 'Multi-Asset Arb', exchange: 'Binance US', type: 'futures', status: 'active', strategy: 'Arbitrage', dailyPnl: 567.89, totalPnl: 45678.90, tradeCount: 8901, winRate: 58.9 },
  { id: 'bot-5', name: 'Momentum Runner', exchange: 'FTX US', type: 'spot', status: 'stopped', strategy: 'Momentum', dailyPnl: 0, totalPnl: -1234.56, tradeCount: 234, winRate: 45.6 },
]

export const predictionMarkets = [
  { id: 'mkt-1', title: 'Will BTC hit $100k by EOY 2026?', platform: 'polymarket', category: 'Crypto', yesPrice: 0.72, noPrice: 0.28, volume: '$2.3M', closeDate: 'Dec 31, 2026', liquidity: '$890K' },
  { id: 'mkt-2', title: 'S&P 500 to break 6000 in May?', platform: 'kashi', category: 'Finance', yesPrice: 0.45, noPrice: 0.55, volume: '$567K', closeDate: 'May 31, 2026', liquidity: '$234K' },
  { id: 'mkt-3', title: 'ETH ETF approved in 2026', platform: 'polymarket', category: 'Finance', yesPrice: 0.89, noPrice: 0.11, volume: '$1.2M', closeDate: 'Jun 30, 2026', liquidity: '$456K' },
  { id: 'mkt-4', title: 'Next Fed rate cut in April?', platform: 'kashi', category: 'Finance', yesPrice: 0.34, noPrice: 0.66, volume: '$890K', closeDate: 'Apr 30, 2026', liquidity: '$123K' },
  { id: 'mkt-5', title: 'Bitcoin halving impact positive?', platform: 'kashi', category: 'Crypto', yesPrice: 0.56, noPrice: 0.44, volume: '$345K', closeDate: 'Mar 31, 2026', liquidity: '$67K' },
]

export const mockPositions = [
  { id: 'pos-1', marketId: 'mkt-1', marketTitle: 'BTC to $100k by EOY 2026', side: 'yes', shares: 1000, price: 0.65, currentValue: 720, pnl: 70 },
  { id: 'pos-2', marketId: 'mkt-4', marketTitle: 'Next Fed rate cut in April?', side: 'no', shares: 500, price: 0.60, currentValue: 330, pnl: -170 },
  { id: 'pos-3', marketId: 'mkt-3', marketTitle: 'ETH ETF approved in 2026', side: 'yes', shares: 2000, price: 0.82, currentValue: 1780, pnl: -40 },
]

export const exchanges = [
  { name: 'Binance US', supported: ['spot', 'futures'] as const, icon: '🔶' },
  { name: 'Coinbase Pro', supported: ['spot', 'futures'] as const, icon: '🔵' },
  { name: 'Kraken', supported: ['spot', 'futures'] as const, icon: '🟣' },
  { name: 'FTX US', supported: ['spot'] as const, icon: '🟡' },
]

export const botStrategies = ['Grid Trading', 'DCA', 'Scalping', 'Arbitrage', 'Momentum', 'Mean Reversion', 'Trend Following']

export const predictionCategories = ['All', 'Crypto', 'Finance', 'Politics', 'Sports', 'Tech', 'Entertainment']
