import { getDb } from "@/lib/database"

// ─── Crypto Assets ────────────────────────────────────────────────────────────
export async function getAssets() {
  const db = getDb()
  return db.prepare("SELECT * FROM crypto_assets ORDER BY price DESC").all()
}

// ─── Bots ─────────────────────────────────────────────────────────────────────
export async function getBots() {
  const db = getDb()
  return db.prepare("SELECT * FROM crypto_bots").all()
}

export async function getBotsByStatus(status: string) {
  const db = getDb()
  return db.prepare("SELECT * FROM crypto_bots WHERE status = ?").all(status)
}

export async function getBotsByExchange(exchange: string) {
  const db = getDb()
  return db.prepare("SELECT * FROM crypto_bots WHERE exchange = ?").all(exchange)
}

// ─── Trades ───────────────────────────────────────────────────────────────────
export async function getTrades(filters?: {
  exchange_type?: string
  status?: string
  bot_id?: string
  limit?: number
  offset?: number
}) {
  const db = getDb()
  let query = "SELECT * FROM trades"
  const conditions: string[] = []
  const params: any[] = []

  if (filters?.exchange_type) { conditions.push("exchange_type = ?"); params.push(filters.exchange_type) }
  if (filters?.status) { conditions.push("status = ?"); params.push(filters.status) }
  if (filters?.bot_id) { conditions.push("bot_id = ?"); params.push(filters.bot_id) }

  if (conditions.length) {
    query += " WHERE " + conditions.join(" AND ")
  }
  query += " ORDER BY timestamp DESC"

  if (filters?.limit) {
    query += " LIMIT ?"
    params.push(filters.limit)
  }

  return db.prepare(query).all(...params)
}

export async function getCEXTrades() {
  const db = getDb()
  return db.prepare("SELECT * FROM trades WHERE exchange_type = 'cex' ORDER BY timestamp DESC").all()
}

export async function getDEXTrades() {
  const db = getDb()
  return db.prepare("SELECT * FROM trades WHERE exchange_type = 'dex' ORDER BY timestamp DESC").all()
}

// ─── CEX Connections ──────────────────────────────────────────────────────────
export async function getCEXConnections() {
  const db = getDb()
  return db.prepare("SELECT * FROM cex_connections").all()
}

// ─── DEX Connections ──────────────────────────────────────────────────────────
export async function getDEXConnections() {
  const db = getDb()
  return db.prepare("SELECT * FROM dex_connections").all()
}

// ─── Prediction Connections ───────────────────────────────────────────────────
export async function getPredictionConnections() {
  const db = getDb()
  return db.prepare("SELECT * FROM prediction_connections").all()
}

// ─── Prediction Markets ───────────────────────────────────────────────────────
export async function getPredictionMarkets() {
  const db = getDb()
  return db.prepare("SELECT * FROM prediction_markets").all()
}

export async function getPredictionMarketsByPlatform(platform: string) {
  const db = getDb()
  return db.prepare("SELECT * FROM prediction_markets WHERE platform = ?").all(platform)
}

export async function getPredictionMarketsByCategory(category: string) {
  const db = getDb()
  return db.prepare("SELECT * FROM prediction_markets WHERE category = ?").all(category)
}

// ─── Prediction Positions ─────────────────────────────────────────────────────
export async function getPredictionPositions() {
  const db = getDb()
  return db.prepare("SELECT * FROM prediction_positions").all()
}

export async function getOpenPredictionPositions() {
  const db = getDb()
  return db.prepare("SELECT * FROM prediction_positions WHERE status = 'open'").all()
}

export async function getPredictionPositionsByPlatform(platform: string) {
  const db = getDb()
  const stmt = db.prepare(`
    SELECT pp.* FROM prediction_positions pp
    JOIN prediction_markets pm ON pp.market_id = pm.id
    WHERE pm.platform = ?
  `)
  return stmt.all(platform)
}

// ─── Bot Logs ─────────────────────────────────────────────────────────────────
export async function getBotLogs() {
  const db = getDb()
  return db.prepare("SELECT * FROM bot_logs ORDER BY timestamp DESC LIMIT 100").all()
}

export async function getBotLogsByBot(botId: string) {
  const db = getDb()
  return db.prepare("SELECT * FROM bot_logs WHERE bot_id = ? ORDER BY timestamp DESC").all(botId)
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export async function getSettings() {
  const db = getDb()
  return db.prepare("SELECT * FROM settings").all()
}

export async function getSettingsBySection(section: string) {
  const db = getDb()
  return db.prepare("SELECT * FROM settings WHERE section = ?").all(section)
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function getUsers() {
  const db = getDb()
  return db.prepare("SELECT * FROM users").all()
}

// ─── Aggregate Stats ──────────────────────────────────────────────────────────
export async function getTradeStats() {
  const db = getDb()
  const total = db.prepare("SELECT COUNT(*) as count FROM trades").get() as { count: number } | undefined
  const cexCount = db.prepare("SELECT COUNT(*) as count FROM trades WHERE exchange_type = 'cex'").get() as { count: number } | undefined
  const dexCount = db.prepare("SELECT COUNT(*) as count FROM trades WHERE exchange_type = 'dex'").get() as { count: number } | undefined
  const totalPnl = db.prepare("SELECT SUM(pnl) as total FROM trades").get() as { total: number | null } | undefined
  const cexPnl = db.prepare("SELECT SUM(pnl) as total FROM trades WHERE exchange_type = 'cex'").get() as { total: number | null } | undefined
  const dexPnl = db.prepare("SELECT SUM(pnl) as total FROM trades WHERE exchange_type = 'dex'").get() as { total: number | null } | undefined

  return {
    total: total?.count ?? 0,
    cexCount: cexCount?.count ?? 0,
    dexCount: dexCount?.count ?? 0,
    totalPnl: totalPnl?.total ?? 0,
    cexPnl: cexPnl?.total ?? 0,
    dexPnl: dexPnl?.total ?? 0,
  }
}

export async function getBotStats() {
  const db = getDb()
  const total = db.prepare("SELECT COUNT(*) as count FROM crypto_bots").get() as { count: number } | undefined
  const active = db.prepare("SELECT COUNT(*) as count FROM crypto_bots WHERE status = 'active'").get() as { count: number } | undefined
  const paused = db.prepare("SELECT COUNT(*) as count FROM crypto_bots WHERE status = 'paused'").get() as { count: number } | undefined
  const stopped = db.prepare("SELECT COUNT(*) as count FROM crypto_bots WHERE status = 'stopped'").get() as { count: number } | undefined

  const totalPnl = db.prepare("SELECT SUM(total_pnl) as total FROM crypto_bots").get() as { total: number | null } | undefined
  const dailyPnl = db.prepare("SELECT SUM(daily_pnl) as total FROM crypto_bots WHERE status = 'active'").get() as { total: number | null } | undefined

  return {
    total: total?.count ?? 0,
    active: active?.count ?? 0,
    paused: paused?.count ?? 0,
    stopped: stopped?.count ?? 0,
    totalPnl: totalPnl?.total ?? 0,
    dailyPnl: dailyPnl?.total ?? 0,
  }
}

export async function getPositionStats() {
  const db = getDb()
  const total = db.prepare("SELECT COUNT(*) as count FROM prediction_positions").get() as { count: number } | undefined
  const open = db.prepare("SELECT COUNT(*) as count FROM prediction_positions WHERE status = 'open'").get() as { count: number } | undefined
  const resolved = db.prepare("SELECT COUNT(*) as count FROM prediction_positions WHERE status = 'resolved'").get() as { count: number } | undefined

  const totalInvested = db.prepare("SELECT SUM(price * shares) as total FROM prediction_positions").get() as { total: number | null } | undefined
  const totalPnl = db.prepare("SELECT SUM(pnl) as total FROM prediction_positions").get() as { total: number | null } | undefined

  return {
    total: total?.count ?? 0,
    open: open?.count ?? 0,
    resolved: resolved?.count ?? 0,
    totalInvested: totalInvested?.total ?? 0,
    totalPnl: totalPnl?.total ?? 0,
  }
}
