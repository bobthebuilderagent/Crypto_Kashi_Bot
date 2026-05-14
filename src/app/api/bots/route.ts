import { NextResponse } from "next/server"
import { getDb } from "@/lib/database"

export async function GET() {
  const db = getDb()
  const bots = db.prepare("SELECT * FROM crypto_bots").all()
  return NextResponse.json(bots)
}

export async function POST(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "INSERT INTO crypto_bots (id, name, exchange, type, status, strategy, daily_pnl, total_pnl, trade_count, win_rate, total_investment, icon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
  const id = body.id || "bot-" + Date.now()
  stmt.run(
    id,
    body.name || "",
    body.exchange || "",
    body.type || "spot",
    body.status || "paused",
    body.strategy || "",
    body.daily_pnl || 0,
    body.total_pnl || 0,
    body.trade_count || 0,
    body.win_rate || 0,
    body.total_investment || 0,
    body.icon || null
  )
  return NextResponse.json({ id }, { status: 201 })
}

export async function PUT(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "UPDATE crypto_bots SET name=?, exchange=?, type=?, status=?, strategy=?, daily_pnl=?, total_pnl=?, trade_count=?, win_rate=?, total_investment=?, icon=?, updated_at=datetime('now') WHERE id=?"
  )
  stmt.run(
    body.name, body.exchange, body.type, body.status, body.strategy,
    body.daily_pnl, body.total_pnl, body.trade_count, body.win_rate,
    body.total_investment, body.icon, body.id
  )
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const db = getDb()
  db.prepare("DELETE FROM crypto_bots WHERE id=?").run(id)
  return NextResponse.json({ success: true })
}
