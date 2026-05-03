import type { Metadata } from "next"
import { metadata } from "./seo"
import { Sidebar } from "@/components/Sidebar"
import { ClientLayout } from "./client-layout"

export { metadata }

export default function CryptoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar activeSection="crypto" />
      <main className="flex-1 p-6">
        <ClientLayout children={children} />
      </main>
    </div>
  )
}
