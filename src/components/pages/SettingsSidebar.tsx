"use client"

import { Settings, Bell, Key, Wallet, Zap, Lock, Globe } from "lucide-react"

export interface SettingsTab {
  id: string
  name: string
  icon: React.ReactNode
}

export function SettingsSidebar({
  tabs,
  selectedTab,
  onSelect,
}: {
  tabs: SettingsTab[]
  selectedTab: string
  onSelect: (id: string) => void
}) {
  return (
    <nav className="w-56 shrink-0 py-6 space-y-1">
      <div className="mb-6 px-3">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Settings</h2>
      </div>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
            selectedTab === tab.id
              ? "bg-slate-800 text-white font-medium"
              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
          }`}
        >
          {tab.icon}
          {tab.name}
        </button>
      ))}
    </nav>
  )
}
