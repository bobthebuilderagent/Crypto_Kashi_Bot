import { NextResponse } from "next/server"
import { getDb } from "@/lib/database"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const exchangeType = searchParams.get("exchange_type")
  const status = searchParams.get("status")
  const botId = searchParams.get("bot_id")
  const limit = parseInt(searchParams.get("limit") || "100")
  const offset = parseInt(searchParams.get("offset") || "0")

  const db = getDb()
  let query = "SELECT * FROM trades"
  const conditions: string[] = []
  const params: any[] = []

  if (exchangeType) { conditions.push("exchange_type = ?"); params.push(exchangeType) }
  if (status) { conditions.push("status = ?"); params.push(status) }
  if (botId) { conditions.push("bot_id = ?"); params.push(botId) }
  if (conditions.length) query += " WHERE " + conditions.join(" AND ")
  query += " ORDER BY timestamp DESC LIMIT ? OFFSET ?"
  params.push(limit, offset)

  const trades = db.prepare(query).all(...params)
  return NextResponse.json(trades)
}

export async function POST(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "INSERT INTO trades (id, bot_id, exchange_type, symbol, side, price, volume, pnl, exchange, status, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
  const id = body.id || "trade-" + Date.now()
  stmt.run(
    id,
    body.bot_id || "",
    body.exchange_type || "cex",
    body.symbol || "",
    body.side || "buy",
    body.price || 0,
    body.volume || 0,
    body.pnl || 0,
    body.exchange || "",
    body.status || "closed",
    body.timestamp || new Date().toISOString()
  )
  return NextResponse.json({ id }, { status: 201 })
}

export async function PUT(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "UPDATE trades SET bot_id=?, exchange_type=?, symbol=?, side=?, price=?, volume=?, pnl=?, exchange=?, status=?, timestamp=?, updated_at=datetime('now') WHERE id=?"
  )
  stmt.run(
    body.bot_id, body.exchange_type, body.symbol, body.side, body.price,
    body.volume, body.pnl, body.exchange, body.status, body.timestamp, body.id
  )
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const db = getDb()
  db.prepare("DELETE FROM trades WHERE id=?").run(id)
  return NextResponse.json({ success: true })
}
