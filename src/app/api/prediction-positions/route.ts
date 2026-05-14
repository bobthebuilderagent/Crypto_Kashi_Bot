import { NextResponse } from "next/server"
import { getDb } from "@/lib/database"

export async function GET() {
  const db = getDb()
  const positions = db.prepare("SELECT * FROM prediction_positions").all()
  return NextResponse.json(positions)
}

export async function POST(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "INSERT INTO prediction_positions (id, market_id, market_title, side, shares, price, current_value, pnl, status, outcome) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
  const id = body.id || "pos-" + Date.now()
  stmt.run(id, body.market_id || "", body.market_title || "", body.side || "yes", body.shares || 0, body.price || 0, body.current_value || 0, body.pnl || 0, body.status || "open", body.outcome || null)
  return NextResponse.json({ id }, { status: 201 })
}

export async function PUT(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "UPDATE prediction_positions SET market_id=?, market_title=?, side=?, shares=?, price=?, current_value=?, pnl=?, status=?, outcome=?, updated_at=datetime('now') WHERE id=?"
  )
  stmt.run(body.market_id, body.market_title, body.side, body.shares, body.price, body.current_value, body.pnl, body.status, body.outcome, body.id)
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const db = getDb()
  db.prepare("DELETE FROM prediction_positions WHERE id=?").run(id)
  return NextResponse.json({ success: true })
}
