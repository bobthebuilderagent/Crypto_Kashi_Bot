"use client"

import { motion } from "framer-motion"
import { Bot, TrendingUp, Target, Settings, BarChart3, History, Clock, Zap, Key } from "lucide-react"
import { useAppContext } from "@/lib/providers"
import { Badge } from "@/components/ui/badge"
import { SettingsDialog } from "@/components/SettingsDialog"

interface SidebarItem {
  icon: React.ReactNode
  label: string
  badge?: string
  badgeColor?: string
}

interface SidebarSection {
  title: string
  items: SidebarItem[]
}

const cryptoSection: SidebarSection = {
  title: "Crypto Bot",
  items: [
    { icon: <Bot className="h-4 w-4" />, label: "Bot Dashboard", badge: "5", badgeColor: "bg-cyan-500" },
    { icon: <TrendingUp className="h-4 w-4" />, label: "Market Overview" },
    { icon: <BarChart3 className="h-4 w-4" />, label: "Analytics" },
    { icon: <History className="h-4 w-4" />, label: "Trade History" },
    { icon: <Key className="h-4 w-4" />, label: "Settings" },
  ],
}

const predictionsSection: SidebarSection = {
  title: "Kashi Predictions",
  items: [
    { icon: <Target className="h-4 w-4" />, label: "Market Feed", badge: "12", badgeColor: "bg-purple-500" },
    { icon: <TrendingUp className="h-4 w-4" />, label: "My Positions", badge: "3", badgeColor: "bg-green-500" },
    { icon: <Clock className="h-4 w-4" />, label: "Upcoming Markets" },
    { icon: <Zap className="h-4 w-4" />, label: "Hot Markets" },
    { icon: <Settings className="h-4 w-4" />, label: "Settings" },
  ],
}

export function Sidebar({ activeSection }: { activeSection: 'crypto' | 'predictions' }) {
  const section = activeSection === 'crypto' ? cryptoSection : predictionsSection

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden lg:block w-64 border-r border-white/10 bg-slate-900/50 backdrop-blur-sm p-4"
    >
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          {section.title}
        </h2>
        <nav className="space-y-1">
          {section.items.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <Badge className={`${item.badgeColor || "bg-slate-600"} ml-auto text-xs px-1.5 py-0`}>
                  {item.badge}
                </Badge>
              )}
            </motion.button>
          ))}
        </nav>
      </div>
    </motion.aside>
  )
}
