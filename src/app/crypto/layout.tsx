import type { Metadata } from "next"
import { Sidebar } from "@/components/Sidebar"

export const metadata: Metadata = {
  title: "Crypto Bot - Trading Dashboard",
  description: "Crypto trading bot and analytics dashboard",
}

export default function CryptoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar activeSection="crypto" />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
