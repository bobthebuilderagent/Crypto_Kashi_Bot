import type { Metadata } from "next"
import { Sidebar } from "@/components/Sidebar"

export const metadata: Metadata = {
  title: "Kashi Predictions - Market Feed",
  description: "Prediction markets and trading dashboard",
}

export default function PredictionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar activeSection="predictions" />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
