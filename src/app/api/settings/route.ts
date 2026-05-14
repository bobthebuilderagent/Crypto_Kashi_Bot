import { NextResponse } from "next/server"
import { getDb } from "@/lib/database"

export async function GET() {
  const db = getDb()
  const settings = db.prepare("SELECT * FROM settings").all()
  return NextResponse.json(settings)
}

export async function PUT(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "UPDATE settings SET value=?, updated_at=datetime('now') WHERE key=?"
  )
  stmt.run(JSON.stringify(body.value), body.key)
  return NextResponse.json({ success: true })
}
