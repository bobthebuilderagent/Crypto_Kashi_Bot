import { NextResponse } from "next/server"
import { getDb } from "@/lib/database"

export async function GET() {
  const db = getDb()
  const logs = db.prepare("SELECT * FROM bot_logs ORDER BY timestamp DESC LIMIT 100").all()
  return NextResponse.json(logs)
}

export async function POST(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "INSERT INTO bot_logs (bot_id, exchange_type, action, message, details) VALUES (?, ?, ?, ?, ?)"
  )
  stmt.run(body.bot_id || null, body.exchange_type || null, body.action || "", body.message || "", body.details || null)
  return NextResponse.json({ success: true }, { status: 201 })
}
