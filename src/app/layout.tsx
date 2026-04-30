import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/lib/providers"
import { Header } from "@/components/Header"
import { LiveTicker } from "@/components/LiveTicker"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Crypto+Predictions - Trading Dashboard",
  description: "Unified crypto trading bot and prediction markets dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
          <Providers>
            <div className="min-h-screen bg-slate-950 text-white">
              <Header />
              <LiveTicker />
              <main>{children}</main>
            </div>
          </Providers>
      </body>
    </html>
  )
}
