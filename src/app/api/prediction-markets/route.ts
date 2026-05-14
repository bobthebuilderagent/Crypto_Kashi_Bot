import { NextResponse } from "next/server"
import { getDb } from "@/lib/database"

export async function GET() {
  const db = getDb()
  const markets = db.prepare("SELECT * FROM prediction_markets").all()
  return NextResponse.json(markets)
}

export async function POST(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "INSERT INTO prediction_markets (id, title, platform, category, yes_price, no_price, volume, close_date, liquidity, question) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
  const id = body.id || "pmkt-" + Date.now()
  stmt.run(id, body.title || "", body.platform || "", body.category || "All", body.yes_price || 0, body.no_price || 0, body.volume || "", body.close_date || "", body.liquidity || "", body.question || "")
  return NextResponse.json({ id }, { status: 201 })
}

export async function PUT(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "UPDATE prediction_markets SET title=?, platform=?, category=?, yes_price=?, no_price=?, volume=?, close_date=?, liquidity=?, question=?, updated_at=datetime('now') WHERE id=?"
  )
  stmt.run(body.title, body.platform, body.category, body.yes_price, body.no_price, body.volume, body.close_date, body.liquidity, body.question, body.id)
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const db = getDb()
  db.prepare("DELETE FROM prediction_markets WHERE id=?").run(id)
  return NextResponse.json({ success: true })
}
