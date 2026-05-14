import { NextResponse } from "next/server"
import { getDb } from "@/lib/database"

export async function GET() {
  const db = getDb()
  const users = db.prepare("SELECT * FROM users").all()
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "INSERT INTO users (username, email, display_name, timezone, currency) VALUES (?, ?, ?, ?, ?)"
  )
  const result = stmt.run(
    body.username || "",
    body.email || null,
    body.display_name || null,
    body.timezone || "America/New_York",
    body.currency || "USD"
  )
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 })
}

export async function PUT(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "UPDATE users SET username=?, email=?, display_name=?, timezone=?, currency=?, updated_at=datetime('now') WHERE id=?"
  )
  stmt.run(
    body.username,
    body.email,
    body.display_name,
    body.timezone,
    body.currency,
    body.id
  )
  return NextResponse.json({ success: true })
}
