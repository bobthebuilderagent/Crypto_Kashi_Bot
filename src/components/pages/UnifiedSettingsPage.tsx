"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Bell, Key, Wallet, Zap, Lock, Globe } from "lucide-react"
import { SettingsSidebar } from "./SettingsSidebar"
import { SettingsContent } from "./SettingsContent"
import { useAppContext } from "@/lib/providers"

// Category definitions
const categories = [
  { id: "general", name: "General", icon: <Globe className="w-4 h-4" /> },
  { id: "trading", name: "Trading", icon: <Zap className="w-4 h-4" /> },
  { id: "api-keys", name: "API Keys", icon: <Key className="w-4 h-4" /> },
  { id: "wallets", name: "Wallets", icon: <Wallet className="w-4 h-4" /> },
  { id: "notifications", name: "Notifications", icon: <Bell className="w-4 h-4" /> },
  { id: "security", name: "Security", icon: <Lock className="w-4 h-4" /> },
]

export function UnifiedSettingsPage() {
  const { exchangeType, setExchangeType } = useAppContext()
  const [selectedTab, setSelectedTab] = useState("general")

  return (
    <div className="flex h-full">
      <SettingsSidebar tabs={categories} selectedTab={selectedTab} onSelect={setSelectedTab} />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-auto py-6"
      >
        <SettingsContent selectedCategory={selectedTab} platform={exchangeType} />
      </motion.div>
    </div>
  )
}
