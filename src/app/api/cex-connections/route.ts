import { NextResponse } from "next/server"
import { getDb } from "@/lib/database"

export async function GET() {
  const db = getDb()
  const connections = db.prepare("SELECT * FROM cex_connections").all()
  return NextResponse.json(connections)
}

export async function POST(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "INSERT INTO cex_connections (id, name, icon, type, api_key, api_secret, api_key_id, connected, network) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
  const id = body.id || "cex-" + Date.now()
  stmt.run(id, body.name || "", body.icon || "📝", body.type || "both", body.api_key || "", body.api_secret || "", body.api_key_id || "", body.connected ? 1 : 0, body.network || "mainnet")
  return NextResponse.json({ id }, { status: 201 })
}

export async function PUT(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "UPDATE cex_connections SET name=?, icon=?, type=?, api_key=?, api_secret=?, api_key_id=?, connected=?, network=?, updated_at=datetime('now') WHERE id=?"
  )
  stmt.run(body.name, body.icon, body.type, body.api_key, body.api_secret, body.api_key_id, body.connected ? 1 : 0, body.network, body.id)
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const db = getDb()
  db.prepare("DELETE FROM cex_connections WHERE id=?").run(id)
  return NextResponse.json({ success: true })
}
