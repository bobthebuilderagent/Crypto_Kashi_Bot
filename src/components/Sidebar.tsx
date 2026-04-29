"use client"

import { motion } from "framer-motion"
import { Bot, TrendingUp, Target, Settings, BarChart3, History, Clock, Zap, Key, Search, Bell } from "lucide-react"
import { useAppContext } from "@/lib/providers"
import { Badge } from "@/components/ui/badge"
import { SettingsDialog } from "@/components/SettingsDialog"
import { useRouter, usePathname } from "next/navigation"

interface SidebarItem {
  icon: React.ReactNode
  label: string
  badge?: string
  badgeColor?: string
  iconSize?: "h-4 w-4" | "h-5 w-5" | "h-6 w-6"
}

interface SidebarSection {
  title: string
  items: SidebarItem[]
}

const cryptoSection: SidebarSection = {
  title: "Crypto Bot",
  items: [
    { icon: <Bot className="h-5 w-5 text-cyan-400" />, label: "Bot Dashboard", badge: "5", badgeColor: "bg-cyan-500" },
    { icon: <TrendingUp className="h-5 w-5 text-purple-400" />, label: "Market Overview" },
    { icon: <BarChart3 className="h-5 w-5 text-green-400" />, label: "Analytics" },
    { icon: <History className="h-5 w-5 text-orange-400" />, label: "Trade History" },
    { icon: <Key className="h-5 w-5 text-yellow-400" />, label: "Settings" },
  ],
}

const predictionsSection: SidebarSection = {
  title: "Kashi Predictions",
  items: [
    { icon: <Target className="h-5 w-5 text-red-400" />, label: "Market Feed", badge: "12", badgeColor: "bg-purple-500" },
    { icon: <TrendingUp className="h-5 w-5 text-green-500" />, label: "My Positions", badge: "3", badgeColor: "bg-green-500" },
    { icon: <Clock className="h-5 w-5 text-blue-400" />, label: "Upcoming Markets" },
    { icon: <Zap className="h-5 w-5 text-orange-500" />, label: "Hot Markets" },
    { icon: <Settings className="h-5 w-5 text-slate-400" />, label: "Settings" },
  ],
}

export function Sidebar({ activeSection }: { activeSection: 'crypto' | 'predictions' }) {
  const router = useRouter()
  const pathname = usePathname()
  const section = activeSection === 'crypto' ? cryptoSection : predictionsSection

  const handleNavClick = (path: string) => {
    router.push(path)
  }

  // Extract section from URL
  const currentSection = pathname?.startsWith('/crypto') ? 'crypto' :
    pathname?.startsWith('/predictions') ? 'predictions' : 'home'

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
          {section.items.map((item, index) => {
            // Determine if this item is active
            const cryptoActive = currentSection === 'crypto' &&
              (pathname === '/crypto' || pathname?.includes('/crypto')) &&
              ['Bot Dashboard', 'Market Overview', 'Analytics', 'Trade History', 'Settings'].includes(item.label)
            const predictionsActive = currentSection === 'predictions' &&
              (pathname === '/predictions' || pathname?.includes('/predictions')) &&
              ['Market Feed', 'My Positions', 'Upcoming Markets', 'Hot Markets', 'Settings'].includes(item.label)

            const isActive = cryptoActive || predictionsActive

            return (
              <motion.button
                key={item.label}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleNavClick(`/${activeSection}/${item.label.replace(/\s+/g, '')}`)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${isActive
                    ? 'text-white bg-white/10 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <Badge className={`${item.badgeColor || "bg-slate-600"} ml-auto text-xs px-1.5 py-0`}>
                    {item.badge}
                  </Badge>
                )}
              </motion.button>
            )
          })}
        </nav>
      </div>

      {/* Search Bar */}
      <div className="mt-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/50 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4">
        <div className="relative">
          <Bell className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <button className="w-full pl-9 pr-4 py-2 bg-slate-950/50 border border-slate-800 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            Notifications
          </button>
        </div>
      </div>
    </motion.aside>
  )
}
