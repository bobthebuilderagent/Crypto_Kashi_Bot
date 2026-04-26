"use client"

import { CryptoBotPage } from "@/components/pages/CryptoBotPage"
import { Sidebar } from "@/components/Sidebar"

export default function CryptoPage() {
  return (
    <div className="flex">
      <Sidebar activeSection="crypto" />
      <div className="flex-1">
        <CryptoBotPage />
      </div>
    </div>
  )
}
