import { NextResponse } from "next/server"
import { getDb } from "@/lib/database"

export async function GET() {
  const db = getDb()
  const connections = db.prepare("SELECT * FROM dex_connections").all()
  return NextResponse.json(connections)
}

export async function POST(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "INSERT INTO dex_connections (id, asset, symbol, dex, icon, connected, wallet_address, rpc_url, chain_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
  const id = body.id || "dex-" + Date.now()
  stmt.run(id, body.asset || "", body.symbol || "", body.dex || "", body.icon || "🦄", body.connected ? 1 : 0, body.wallet_address || "", body.rpc_url || "", body.chain_id || null)
  return NextResponse.json({ id }, { status: 201 })
}

export async function PUT(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "UPDATE dex_connections SET asset=?, symbol=?, dex=?, icon=?, connected=?, wallet_address=?, rpc_url=?, chain_id=?, updated_at=datetime('now') WHERE id=?"
  )
  stmt.run(body.asset, body.symbol, body.dex, body.icon, body.connected ? 1 : 0, body.wallet_address, body.rpc_url, body.chain_id, body.id)
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const db = getDb()
  db.prepare("DELETE FROM dex_connections WHERE id=?").run(id)
  return NextResponse.json({ success: true })
}
