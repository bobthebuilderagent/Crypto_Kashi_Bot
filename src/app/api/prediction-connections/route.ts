import { NextResponse } from "next/server"
import { getDb } from "@/lib/database"

export async function GET() {
  const db = getDb()
  const connections = db.prepare("SELECT * FROM prediction_connections").all()
  return NextResponse.json(connections)
}

export async function POST(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "INSERT INTO prediction_connections (id, platform, api_key, token, wallet_address, connected) VALUES (?, ?, ?, ?, ?, ?)"
  )
  const id = body.id || "pred-" + Date.now()
  stmt.run(id, body.platform || "", body.api_key || "", body.token || "", body.wallet_address || "", body.connected ? 1 : 0)
  return NextResponse.json({ id }, { status: 201 })
}

export async function PUT(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "UPDATE prediction_connections SET platform=?, api_key=?, token=?, wallet_address=?, connected=?, updated_at=datetime('now') WHERE id=?"
  )
  stmt.run(body.platform, body.api_key, body.token, body.wallet_address, body.connected ? 1 : 0, body.id)
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const db = getDb()
  db.prepare("DELETE FROM prediction_connections WHERE id=?").run(id)
  return NextResponse.json({ success: true })
}
