import { NextResponse } from "next/server"
import { getDb } from "@/lib/database"

// ─── CoinGecko API Configuration ───────────────────────────────────────────────
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3"

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
// Track last successful API call time to avoid hitting rate limits
let lastApiCall: number = 0
const API_CALL_INTERVAL = 60_000 // Minimum 60 seconds between calls (CoinGecko free tier)

// ─── Default crypto assets (fallback if API fails) ─────────────────────────────
const DEFAULT_ASSETS = [
  { id: "asset-btc", symbol: "BTC", name: "Bitcoin", price: 67234.50, change_24h: 2.34, market_cap: "$1.32T", volume_24h: "$28.5B", icon: "₿", category: "Large Cap" },
  { id: "asset-eth", symbol: "ETH", name: "Ethereum", price: 3456.78, change_24h: -1.12, market_cap: "$415B", volume_24h: "$15.2B", icon: "Ξ", category: "Large Cap" },
  { id: "asset-sol", symbol: "SOL", name: "Solana", price: 178.92, change_24h: 5.67, market_cap: "$82.3B", volume_24h: "$4.1B", icon: "◎", category: "Large Cap" },
  { id: "asset-bnb", symbol: "BNB", name: "BNB", price: 612.45, change_24h: 0.89, market_cap: "$91.2B", volume_24h: "$2.1B", icon: "◆", category: "Large Cap" },
  { id: "asset-xrp", symbol: "XRP", name: "Ripple", price: 0.6234, change_24h: -2.45, market_cap: "$34.1B", volume_24h: "$1.8B", icon: "✕", category: "Large Cap" },
  { id: "asset-ada", symbol: "ADA", name: "Cardano", price: 0.4567, change_24h: 1.23, market_cap: "$16.2B", volume_24h: "$890M", icon: "◇", category: "Mid Cap" },
  { id: "asset-avax", symbol: "AVAX", name: "Avalanche", price: 38.92, change_24h: 3.45, market_cap: "$15.1B", volume_24h: "$720M", icon: "▲", category: "Mid Cap" },
  { id: "asset-dot", symbol: "DOT", name: "Polkadot", price: 7.23, change_24h: -0.56, market_cap: "$9.8B", volume_24h: "$340M", icon: "●", category: "Mid Cap" },
]

async function fetchRealPrices(): Promise<any[]> {
  const now = Date.now()
  
  // Rate limiting: respect minimum interval between API calls
  const timeSinceLastCall = now - lastApiCall
  if (timeSinceLastCall < API_CALL_INTERVAL) {
    console.log(`Rate limit: skipping CoinGecko call (${timeSinceLastCall}ms since last call)`)
    return [] // Signal to use fallback
  }

  try {
    const res = await fetch(`${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    // Update last call time regardless of success/failure
    lastApiCall = Date.now()

    if (!res.ok) {
      // Handle rate limiting (429) gracefully
      if (res.status === 429) {
        console.warn("CoinGecko rate limit hit — using fallback data")
        return DEFAULT_ASSETS.slice(0, 8) // Return top 8 defaults
      }
      console.warn(`CoinGecko API error: ${res.status}`)
      return DEFAULT_ASSETS.slice(0, 8) // Return top 8 defaults
    }

    const data = await res.json()
    if (!data || data.length === 0) {
      return DEFAULT_ASSETS.slice(0, 8)
    }

    // Map CoinGecko response to our format
    return data.map((coin: any) => ({
      id: `asset-${coin.id}`,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change_24h: coin.price_change_percentage_24h,
      market_cap: formatMarketCap(coin.market_cap),
      volume_24h: formatVolume(coin.total_volume),
      icon: getCoinIcon(coin.symbol),
      category: coin.market_cap > 1e11 ? "Large Cap" : coin.market_cap > 1e10 ? "Mid Cap" : "Small Cap",
    }))
  } catch (error) {
    console.error("Failed to fetch real prices:", error)
    return DEFAULT_ASSETS.slice(0, 8) // Return top 8 defaults on error
  }
}

// ─── Formatting Helpers ────────────────────────────────────────────────────────
function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`
  return `$${marketCap}`
}

function formatVolume(volume: number): string {
  if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`
  if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`
  return `$${volume}`
}

function getCoinIcon(symbol: string): string {
  const icons: Record<string, string> = {
    "BTC": "₿",
    "ETH": "Ξ",
    "SOL": "◎",
    "BNB": "◆",
    "XRP": "✕",
    "ADA": "◇",
    "AVAX": "▲",
    "DOT": "●",
    "MATIC": "⚡",
    "LINK": "🔗",
    "UNI": "🦄",
    "AAVE": "👻",
    "CRV": "💧",
    "SUSHI": "🍣",
    "MKR": "🔴",
    "COMP": "💿",
    "YFI": "🦟",
    "BAL": "🏗️",
    "RUNE": "🔵",
  }
  return icons[symbol.toUpperCase()] || "🪙"
}

// ─── API Routes ────────────────────────────────────────────────────────────────

export async function GET() {
  // Try real API first
  const realAssets = await fetchRealPrices()

  // If we got real data, update DB and return
  if (realAssets.length > 0) {
    try {
      const db = getDb()
      realAssets.forEach((asset) => {
        db.prepare(
          `INSERT OR REPLACE INTO crypto_assets (id, symbol, name, price, change_24h, market_cap, volume_24h, icon, category, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
        ).run(
          asset.id,
          asset.symbol,
          asset.name,
          asset.price,
          asset.change_24h,
          asset.market_cap,
          asset.volume_24h,
          asset.icon,
          asset.category
        )
      })
    } catch (error) {
      console.error("Failed to update DB with real prices:", error)
    }
    return NextResponse.json(realAssets)
  }

  // Fallback to DB
  const db = getDb()
  const assets = db.prepare("SELECT * FROM crypto_assets").all()
  return NextResponse.json(assets)
}

export async function POST(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "INSERT INTO crypto_assets (id, symbol, name, price, change_24h, market_cap, volume_24h, icon, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
  const id = body.id || "asset-" + (body.symbol || "").toLowerCase()
  stmt.run(id, body.symbol || "", body.name || "", body.price || 0, body.change_24h || 0, body.market_cap || "", body.volume_24h || "", body.icon || "", body.category || "Large Cap")
  return NextResponse.json({ id }, { status: 201 })
}

export async function PUT(request: Request) {
  const db = getDb()
  const body = await request.json()
  const stmt = db.prepare(
    "UPDATE crypto_assets SET symbol=?, name=?, price=?, change_24h=?, market_cap=?, volume_24h=?, icon=?, category=?, updated_at=datetime('now') WHERE id=?"
  )
  stmt.run(body.symbol, body.name, body.price, body.change_24h, body.market_cap, body.volume_24h, body.icon, body.category, body.id)
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const db = getDb()
  db.prepare("DELETE FROM crypto_assets WHERE id=?").run(id)
  return NextResponse.json({ success: true })
}
