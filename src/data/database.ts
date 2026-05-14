import Database from "better-sqlite3"
import { join } from "path"
import { existsSync, mkdirSync } from "fs"

// ─── Database Path ──────────────────────────────────────────────────────────────
const DATA_DIR = join(process.cwd(), "src", "data")
const DB_PATH = join(DATA_DIR, "crypto_kashi_bot.db")

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true })
}

// ─── Database Instance ─────────────────────────────────────────────────────────
const db = new Database(DB_PATH)

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

// ─── Schema ─────────────────────────────────────────────────────────────────────
db.exec(`
  -- Users & Personal Info
  CREATE TABLE IF NOT EXISTS users (
    id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    username        TEXT NOT NULL,
    email           TEXT,
    display_name    TEXT,
    timezone        TEXT DEFAULT 'America/New_York',
    currency        TEXT DEFAULT 'USD',
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Bot Settings (global key-value)
  CREATE TABLE IF NOT EXISTS settings (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    key             TEXT NOT NULL UNIQUE,
    value           TEXT NOT NULL DEFAULT '{}',
    section         TEXT NOT NULL DEFAULT 'general',
    description     TEXT,
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- CEX Exchange Connections
  CREATE TABLE IF NOT EXISTS cex_connections (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    icon            TEXT DEFAULT '📝',
    type            TEXT NOT NULL DEFAULT 'both', -- spot, futures, both
    api_key         TEXT NOT NULL DEFAULT '',
    api_secret      TEXT NOT NULL DEFAULT '',
    api_key_id      TEXT NOT NULL DEFAULT '',
    connected       INTEGER NOT NULL DEFAULT 0, -- boolean as int
    network         TEXT NOT NULL DEFAULT 'mainnet', -- mainnet, testnet
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- DEX Protocol Connections
  CREATE TABLE IF NOT EXISTS dex_connections (
    id              TEXT PRIMARY KEY,
    asset           TEXT NOT NULL,
    symbol          TEXT NOT NULL,
    dex             TEXT NOT NULL,
    icon            TEXT DEFAULT '🦄',
    connected       INTEGER NOT NULL DEFAULT 0,
    wallet_address  TEXT NOT NULL DEFAULT '',
    rpc_url         TEXT NOT NULL DEFAULT '',
    chain_id        INTEGER,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Prediction Platform Connections
  CREATE TABLE IF NOT EXISTS prediction_connections (
    id              TEXT PRIMARY KEY,
    platform        TEXT NOT NULL, -- kalshi, polymarket
    api_key         TEXT NOT NULL DEFAULT '',
    token           TEXT,
    wallet_address  TEXT NOT NULL DEFAULT '',
    connected       INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Crypto Bot Configurations
  CREATE TABLE IF NOT EXISTS crypto_bots (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    exchange        TEXT NOT NULL, -- exchange name
    type            TEXT NOT NULL DEFAULT 'spot', -- spot, futures
    status          TEXT NOT NULL DEFAULT 'paused', -- active, paused, stopped
    strategy        TEXT NOT NULL DEFAULT '',
    daily_pnl       REAL NOT NULL DEFAULT 0,
    total_pnl       REAL NOT NULL DEFAULT 0,
    trade_count     INTEGER NOT NULL DEFAULT 0,
    win_rate        REAL NOT NULL DEFAULT 0, -- percentage 0-100
    total_investment REAL NOT NULL DEFAULT 0,
    icon            TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Trades (CEX + DEX unified)
  CREATE TABLE IF NOT EXISTS trades (
    id              TEXT PRIMARY KEY,
    bot_id          TEXT NOT NULL,
    exchange_type   TEXT NOT NULL, -- cex, dex
    symbol          TEXT NOT NULL, -- BTC/USDT, ETH/USDC, etc.
    side            TEXT NOT NULL, -- buy, sell
    price           REAL NOT NULL,
    volume          REAL NOT NULL,
    pnl             REAL NOT NULL DEFAULT 0,
    exchange        TEXT NOT NULL, -- Binance, Uniswap, etc.
    status          TEXT NOT NULL DEFAULT 'closed', -- open, closed, failed
    timestamp       TEXT NOT NULL DEFAULT (datetime('now')),
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Prediction Markets
  CREATE TABLE IF NOT EXISTS prediction_markets (
    id              TEXT PRIMARY KEY,
    title           TEXT NOT NULL,
    platform        TEXT NOT NULL, -- kalshi, polymarket
    category        TEXT NOT NULL DEFAULT 'All',
    yes_price       REAL NOT NULL DEFAULT 0,
    no_price        REAL NOT NULL DEFAULT 0,
    volume          TEXT NOT NULL DEFAULT '',
    close_date      TEXT,
    liquidity       TEXT NOT NULL DEFAULT '',
    question        TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Prediction Positions
  CREATE TABLE IF NOT EXISTS prediction_positions (
    id              TEXT PRIMARY KEY,
    market_id       TEXT NOT NULL,
    market_title    TEXT NOT NULL,
    side            TEXT NOT NULL, -- yes, no
    shares          REAL NOT NULL DEFAULT 0,
    price           REAL NOT NULL DEFAULT 0,
    current_value   REAL NOT NULL DEFAULT 0,
    pnl             REAL NOT NULL DEFAULT 0,
    status          TEXT NOT NULL DEFAULT 'open', -- open, resolved
    outcome         TEXT, -- yes, no (when resolved)
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Bot Activity Logs
  CREATE TABLE IF NOT EXISTS bot_logs (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    bot_id          TEXT,
    exchange_type   TEXT, -- cex, dex, prediction
    action          TEXT NOT NULL, -- start, stop, trade, error, etc.
    message         TEXT NOT NULL,
    details         TEXT, -- JSON
    timestamp       TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Crypto Assets (price feed)
  CREATE TABLE IF NOT EXISTS crypto_assets (
    id              TEXT PRIMARY KEY,
    symbol          TEXT NOT NULL UNIQUE,
    name            TEXT NOT NULL,
    price           REAL NOT NULL DEFAULT 0,
    change_24h      REAL NOT NULL DEFAULT 0,
    market_cap      TEXT NOT NULL DEFAULT '',
    volume_24h      TEXT NOT NULL DEFAULT '',
    icon            TEXT,
    category        TEXT NOT NULL DEFAULT 'Large Cap',
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Indexes
  CREATE INDEX IF NOT EXISTS idx_trades_bot_id       ON trades(bot_id);
  CREATE INDEX IF NOT EXISTS idx_trades_exchange_type ON trades(exchange_type);
  CREATE INDEX IF NOT EXISTS idx_trades_timestamp     ON trades(timestamp);
  CREATE INDEX IF NOT EXISTS idx_trades_status        ON trades(status);
  CREATE INDEX IF NOT EXISTS idx_predictions_market   ON prediction_positions(market_id);
  CREATE INDEX IF NOT EXISTS idx_predictions_status   ON prediction_positions(status);
  CREATE INDEX IF NOT EXISTS idx_logs_bot_id          ON bot_logs(bot_id);
  CREATE INDEX IF NOT EXISTS idx_logs_timestamp       ON bot_logs(timestamp);
  CREATE INDEX IF NOT EXISTS idx_bots_status          ON crypto_bots(status);
`)

// ─── Seed Data ────────────────────────────────────────────────────────────────

// Users
db.exec(`INSERT OR IGNORE INTO users (id, username, email, display_name, timezone, currency) VALUES
  ('user-001', 'matthias', 'matthias@example.com', 'Matthias', 'America/New_York', 'USD')`)

// Settings
db.exec(`INSERT OR IGNORE INTO settings (key, value, section, description) VALUES
  ('bot_enabled', '{"enabled": true}', 'general', 'Master switch for all bots'),
  ('risk_level', '{"level": "medium"}', 'risk', 'Overall risk tolerance'),
  ('max_position_size', '{"max_usd": 10000}', 'risk', 'Maximum single position size'),
  ('max_daily_loss', '{"max_loss": 500}', 'risk', 'Max daily loss before stopping'),
  ('notification_email', '{"enabled": true}', 'notifications', 'Email notifications'),
  ('notification_push', '{"enabled": true}', 'notifications', 'Push notifications'),
  ('cex_api_timeout', '{"timeout": 5000}', 'api', 'CEX API timeout in ms'),
  ('dex_rpc_timeout', '{"timeout": 3000}', 'api', 'DEX RPC timeout in ms'),
  ('prediction_poll_interval', '{"interval": 60}', 'api', 'Prediction market poll interval seconds'),
  ('auto_restart', '{"enabled": false}', 'general', 'Auto-restart bots on error')`)

// CEX Connections
db.exec(`INSERT OR IGNORE INTO cex_connections (id, name, icon, type, api_key, api_secret, api_key_id, connected, network) VALUES
  ('cex-coinbase-pro', 'Coinbase Pro', '🔵', 'both', '', '', '', 0, 'mainnet'),
  ('cex-kraken', 'Kraken', '🟣', 'both', '', '', '', 0, 'mainnet'),
  ('cex-binance-us', 'Binance US', '🔶', 'both', '', '', '', 0, 'mainnet'),
  ('cex-bybit-us', 'Bybit (US)', '🟠', 'both', '', '', '', 0, 'mainnet'),
  ('cex-deribit', 'Deribit', '🔴', 'futures', '', '', '', 0, 'mainnet'),
  ('cex-okx-us', 'OKX (US)', '🟢', 'both', '', '', '', 0, 'mainnet')`)

// DEX Connections
db.exec(`INSERT OR IGNORE INTO dex_connections (id, asset, symbol, dex, icon, connected, wallet_address, rpc_url, chain_id) VALUES
  ('dex-eth-uniswap', 'ETH', 'ETH', 'Uniswap V3', '🦄', 0, '', '', 1),
  ('dex-eth-1inch', 'ETH', 'ETH', '1inch', '🔗', 0, '', '', 1),
  ('dex-eth-curve', 'ETH', 'ETH', 'Curve', '💧', 0, '', '', 1),
  ('dex-eth-sushi', 'ETH', 'ETH', 'SushiSwap', '🍣', 0, '', '', 1),
  ('dex-eth-aave', 'ETH', 'ETH', 'Aave', '👻', 0, '', '', 1),
  ('dex-sol-jupiter', 'SOL', 'SOL', 'Jupiter', '🌕', 0, '', '', 101),
  ('dex-sol-raydium', 'SOL', 'SOL', 'Raydium', '☀️', 0, '', '', 101),
  ('dex-sol-orca', 'SOL', 'SOL', 'Orca', '🐋', 0, '', '', 101),
  ('dex-wbtc-uniswap', 'BTC', 'WBTC', 'Uniswap', '🦄', 0, '', '', 1),
  ('dex-usdc-dexes', 'USDC', 'USDC', 'Across DEXes', '💵', 0, '', '', 1)`)

// Prediction Connections
db.exec(`INSERT OR IGNORE INTO prediction_connections (id, platform, api_key, token, wallet_address, connected) VALUES
  ('pred-kalshi', 'kalshi', '', '', '', 0),
  ('pred-polymarket', 'polymarket', '', '', '', 0)`)

// Crypto Bots
db.exec(`INSERT OR IGNORE INTO crypto_bots (id, name, exchange, type, status, strategy, daily_pnl, total_pnl, trade_count, win_rate, total_investment, icon) VALUES
  ('bot-1', 'BTC Grid Bot', 'Binance US', 'spot', 'active', 'Grid Trading', 234.56, 12456.78, 1234, 67.8, 50000, '🤖'),
  ('bot-2', 'ETH Futures Scalper', 'Coinbase Pro', 'futures', 'active', 'Scalping', -45.23, 3456.12, 4567, 72.3, 25000, '⚡'),
  ('bot-3', 'SOL DCA Bot', 'Kraken', 'spot', 'paused', 'DCA', 0, 890.45, 89, 61.2, 10000, '☀️'),
  ('bot-4', 'Multi-Asset Arb', 'Binance US', 'futures', 'active', 'Arbitrage', 567.89, 45678.90, 8901, 58.9, 100000, '🔄'),
  ('bot-5', 'Momentum Runner', 'FTX US', 'spot', 'stopped', 'Momentum', 0, -1234.56, 234, 45.6, 30000, '🚀'),
  ('bot-6', 'ETH Swap Runner', 'Uniswap', 'spot', 'active', 'Swap Arb', 189.34, 8923.45, 2345, 64.2, 40000, '🦄'),
  ('bot-7', 'SOL DEX Scalper', 'Raydium', 'spot', 'active', 'Scalping', 123.45, 5678.90, 3456, 69.5, 30000, '⚡'),
  ('bot-8', 'BNB Grid DEX', 'PancakeSwap', 'spot', 'paused', 'Grid Trading', 0, 456.78, 67, 58.3, 15000, '🥞'),
  ('bot-9', 'ETH Liquidity Provider', 'Uniswap', 'spot', 'active', 'LP Farming', 345.67, 23456.78, 5678, 71.2, 80000, '💧'),
  ('bot-10', 'Multi-DEX Arb', 'Raydium', 'spot', 'active', 'Arbitrage', 456.78, 34567.89, 6789, 66.7, 120000, '🔄')`)

// Trades (CEX)
db.exec(`INSERT OR IGNORE INTO trades (id, bot_id, exchange_type, symbol, side, price, volume, pnl, exchange, status, timestamp) VALUES
  ('t-1', 'bot-1', 'cex', 'BTC/USDT', 'buy', 65000, 0.5, 125.50, 'Binance US', 'closed', '2026-04-26T14:30:00Z'),
  ('t-2', 'bot-2', 'cex', 'ETH/USDT', 'sell', 3600, 2.0, 345.20, 'Coinbase Pro', 'closed', '2026-04-26T15:15:00Z'),
  ('t-3', 'bot-4', 'cex', 'SOL/USDT', 'buy', 170, 10.0, -23.40, 'Kraken', 'closed', '2026-04-26T16:00:00Z'),
  ('t-4', 'bot-1', 'cex', 'BTC/USDT', 'sell', 66500, 0.5, 775.00, 'Binance US', 'closed', '2026-04-26T17:30:00Z'),
  ('t-5', 'bot-2', 'cex', 'ETH/USDT', 'buy', 3400, 2.0, 120.80, 'Coinbase Pro', 'closed', '2026-04-26T18:00:00Z'),
  ('t-6', 'bot-4', 'cex', 'BTC/USDT', 'buy', 67000, 0.3, -45.20, 'Binance US', 'closed', '2026-04-26T18:45:00Z'),
  ('t-7', 'bot-1', 'cex', 'SOL/USDT', 'sell', 185, 10.0, 150.00, 'Binance US', 'closed', '2026-04-26T19:00:00Z'),
  ('t-8', 'bot-2', 'cex', 'BTC/USDT', 'sell', 66000, 0.4, 200.40, 'Coinbase Pro', 'closed', '2026-04-26T19:30:00Z'),
  ('t-9', 'bot-4', 'cex', 'ETH/USDT', 'buy', 3350, 1.5, 89.30, 'Binance US', 'closed', '2026-04-26T20:00:00Z'),
  ('t-10', 'bot-1', 'cex', 'BTC/USDT', 'buy', 67500, 0.2, -12.60, 'Binance US', 'closed', '2026-04-26T20:30:00Z'),
  ('t-11', 'bot-2', 'cex', 'SOL/USDT', 'sell', 180, 10.0, 50.00, 'Coinbase Pro', 'closed', '2026-04-26T21:00:00Z'),
  ('t-12', 'bot-4', 'cex', 'BTC/USDT', 'sell', 66500, 0.3, 150.80, 'Binance US', 'closed', '2026-04-26T21:30:00Z')`)

// Trades (DEX)
db.exec(`INSERT OR IGNORE INTO trades (id, bot_id, exchange_type, symbol, side, price, volume, pnl, exchange, status, timestamp) VALUES
  ('dt-1', 'bot-6', 'dex', 'BTC/ETH', 'buy', 19.45, 2.5, 89.30, 'Uniswap V3', 'closed', '2026-04-26T14:30:00Z'),
  ('dt-2', 'bot-7', 'dex', 'SOL/USDC', 'sell', 178.50, 15.0, 234.50, 'Raydium', 'closed', '2026-04-26T15:15:00Z'),
  ('dt-3', 'bot-6', 'dex', 'ETH/USDC', 'buy', 3455.00, 1.0, -12.30, 'Uniswap V3', 'closed', '2026-04-26T16:00:00Z'),
  ('dt-4', 'bot-6', 'dex', 'BTC/ETH', 'sell', 19.50, 2.5, 123.40, 'Uniswap V3', 'closed', '2026-04-26T17:30:00Z'),
  ('dt-5', 'bot-7', 'dex', 'SOL/USDC', 'buy', 178.20, 15.0, 67.80, 'Raydium', 'closed', '2026-04-26T18:00:00Z'),
  ('dt-6', 'bot-10', 'dex', 'WBTC/ETH', 'sell', 19.42, 1.0, -45.60, 'Uniswap V2', 'closed', '2026-04-26T18:45:00Z')`)

// Prediction Markets
db.exec(`INSERT OR IGNORE INTO prediction_markets (id, title, platform, category, yes_price, no_price, volume, close_date, liquidity, question) VALUES
  ('mkt-1', 'Will BTC hit $100k by EOY 2026?', 'polymarket', 'Crypto', 0.72, 0.28, '$2.3M', 'Dec 31, 2026', '$890K', 'Will Bitcoin reach $100,000 USD before December 31, 2026?'),
  ('mkt-2', 'S&P 500 to break 6000 in May?', 'kalshi', 'Finance', 0.45, 0.55, '$567K', 'May 31, 2026', '$234K', 'Will the S&P 500 index exceed 6000 points by May 31, 2026?'),
  ('mkt-3', 'ETH ETF approved in 2026', 'polymarket', 'Finance', 0.89, 0.11, '$1.2M', 'Jun 30, 2026', '$456K', 'Will the SEC approve a spot Ethereum ETF by June 30, 2026?'),
  ('mkt-4', 'Next Fed rate cut in April?', 'kalshi', 'Finance', 0.34, 0.66, '$890K', 'Apr 30, 2026', '$123K', 'Will the Federal Reserve cut interest rates at the April 2026 meeting?'),
  ('mkt-5', 'Bitcoin halving impact positive?', 'kalshi', 'Crypto', 0.56, 0.44, '$345K', 'Mar 31, 2026', '$67K', 'Will the 2024 Bitcoin halving have a net positive price impact by March 31, 2026?'),
  ('mkt-6', 'Solana hits $1000 in 2026?', 'polymarket', 'Crypto', 0.38, 0.62, '$1.5M', 'Dec 31, 2026', '$678K', 'Will Solana (SOL) reach $1,000 USD before December 31, 2026?')`)

// Prediction Positions
db.exec(`INSERT OR IGNORE INTO prediction_positions (id, market_id, market_title, side, shares, price, current_value, pnl, status, outcome) VALUES
  ('pos-1', 'mkt-1', 'BTC to $100k by EOY 2026', 'yes', 1000, 0.65, 720, 70, 'open', NULL),
  ('pos-2', 'mkt-4', 'Next Fed rate cut in April?', 'no', 500, 0.60, 330, -170, 'open', NULL),
  ('pos-3', 'mkt-3', 'ETH ETF approved in 2026', 'yes', 2000, 0.82, 1780, -40, 'open', NULL),
  ('pos-4', 'mkt-6', 'Solana hits $1000 in 2026?', 'yes', 750, 0.35, 285, -15, 'open', NULL),
  ('pos-5', 'mkt-2', 'S&P 500 to break 6000 in May?', 'no', 300, 0.55, 165, -15, 'open', NULL)`)

// Bot Logs
db.exec(`INSERT INTO bot_logs (bot_id, exchange_type, action, message, details) VALUES
  ('bot-1', 'cex', 'start', 'BTC Grid Bot started on Binance US', '{"strategy": "Grid Trading", "grid_levels": 10}'),
  ('bot-2', 'cex', 'start', 'ETH Futures Scalper started on Coinbase Pro', '{"leverage": 5, "max_risk": "2%"}'),
  ('bot-6', 'dex', 'start', 'ETH Swap Runner started on Uniswap', '{"slippage": 0.5, "route": "direct"}'),
  ('bot-7', 'dex', 'start', 'SOL DEX Scalper started on Raydium', '{"slippage": 1.0, "max_slippage": 2.0}'),
  ('bot-3', 'cex', 'pause', 'SOL DCA Bot paused by user', '{"reason": "manual"}'),
  ('bot-5', 'cex', 'stop', 'Momentum Runner stopped - loss limit reached', '{"daily_loss": -500, "limit": -500}'),
  ('bot-1', 'cex', 'trade', 'BTC Grid Bot executed buy', '{"pair": "BTC/USDT", "price": 65000, "amount": 0.5}'),
  ('bot-2', 'cex', 'trade', 'ETH Futures Scalper executed sell', '{"pair": "ETH/USDT", "price": 3600, "amount": 2.0, "pnl": 345.20}'),
  ('bot-6', 'dex', 'trade', 'ETH Swap Runner executed swap', '{"pair": "BTC/ETH", "price": 19.45, "amount": 2.5, "pnl": 89.30}'),
  ('bot-4', 'cex', 'trade', 'Multi-Asset Arb executed trade', '{"pair": "BTC/USDT", "price": 67000, "amount": 0.3, "exchange": "Binance US"}')`)

// Crypto Assets
db.exec(`INSERT OR IGNORE INTO crypto_assets (id, symbol, name, price, change_24h, market_cap, volume_24h, icon, category) VALUES
  ('asset-btc', 'BTC', 'Bitcoin', 67234.50, 2.34, '$1.32T', '$28.5B', '₿', 'Large Cap'),
  ('asset-eth', 'ETH', 'Ethereum', 3456.78, -1.12, '$415B', '$15.2B', 'Ξ', 'Large Cap'),
  ('asset-sol', 'SOL', 'Solana', 178.92, 5.67, '$82.3B', '$4.1B', '◎', 'Large Cap'),
  ('asset-bnb', 'BNB', 'BNB', 612.45, 0.89, '$91.2B', '$2.1B', '◆', 'Large Cap'),
  ('asset-xrp', 'XRP', 'Ripple', 0.6234, -2.45, '$34.1B', '$1.8B', '✕', 'Large Cap'),
  ('asset-ada', 'ADA', 'Cardano', 0.4567, 1.23, '$16.2B', '$890M', '◇', 'Mid Cap'),
  ('asset-avax', 'AVAX', 'Avalanche', 38.92, 3.45, '$15.1B', '$720M', '▲', 'Mid Cap'),
  ('asset-dot', 'DOT', 'Polkadot', 7.23, -0.56, '$9.8B', '$340M', '●', 'Mid Cap')`)

// ─── Export ───────────────────────────────────────────────────────────────────
export { db }
