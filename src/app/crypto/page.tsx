"use client"

import { useAppContext } from "@/lib/providers"
import { CryptoBotPage } from "@/components/pages/CryptoBotPage"
import { Sidebar } from "@/components/Sidebar"

export default function CryptoPage() {
  const { section } = useAppContext()
  
  if (section !== "crypto") return null
  return (
    <div className="flex">
      <Sidebar activeSection="crypto" />
      <div className="flex-1">
        <CryptoBotPage />
      </div>
    </div>
  )
}
