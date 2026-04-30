"use client"

import { motion } from "framer-motion"
import { ArrowRight, TrendingUp, Target, Shield, Zap, BarChart3, Globe, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stats = [
  { label: "Active Bots", value: "5", color: "border-cyan-500/50 text-cyan-400" },
  { label: "Market Cap Tracked", value: "$2.4T", color: "border-purple-500/50 text-purple-400" },
  { label: "Prediction Markets", value: "156", color: "border-green-500/50 text-green-400" },
  { label: "Avg. Uptime", value: "99.8%", color: "border-amber-500/50 text-amber-400" },
]

export function HomePage() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-slate-950/0 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-cyan-400 border-0 text-white px-4 py-1 text-sm">
              🚀 New Platform - Full Crypto & Predictions
            </Badge>
            <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-6">
              Crypto+Kalshi Platform
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              Your all-in-one trading dashboard. Manage crypto bots across multiple exchanges
              and trade prediction markets - all from one powerful interface.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => router.push("/crypto")}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:scale-105 cursor-pointer"
              >
                {` `} Launch Crypto Bot
                <ArrowRight className="inline-block ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push("/predictions")}
                className="px-8 py-4 border-2 border-slate-600 rounded-xl font-semibold text-white hover:border-purple-500 hover:bg-purple-500/5 transition-all cursor-pointer"
              >
                Browse Predictions
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Card className={`border-l-4 ${stat.color} bg-slate-900/50 backdrop-blur hover:bg-slate-900/80 transition-colors`}>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">Powerful Features</h2>
        <p className="text-center text-slate-400 mb-12">Everything you need in one platform</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <Zap className="h-8 w-8 text-cyan-400" />, title: "Real-time Trading", desc: "Execute trades instantly with sub-millisecond latency across major exchanges." },
            { icon: <TrendingUp className="h-8 w-8 text-purple-400" />, title: "Advanced Analytics", desc: "Deep insights, performance metrics, and strategy optimization tools." },
            { icon: <Shield className="h-8 w-8 text-green-400" />, title: "Secure & Reliable", desc: "Institutional-grade security with 99.8% uptime guarantee." },
            { icon: <Target className="h-8 w-8 text-pink-400" />, title: "Market Predictions", desc: "Trade on prediction markets with competitive odds from Kalshi & Polymarket." },
            { icon: <BarChart3 className="h-8 w-8 text-amber-400" />, title: "Multi-Exchange", desc: "Unified dashboard for Binance US, Coinbase, Kraken, and more." },
            { icon: <Globe className="h-8 w-8 text-indigo-400" />, title: "Global Markets", desc: "Access crypto and event markets worldwide. Trade anything." },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur border-slate-800 hover:border-purple-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-lg text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Markets Preview */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">Live Markets</h2>
        <p className="text-center text-slate-400 mb-8">Trending prediction markets right now</p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Will BTC hit $100k by Dec 2026?", volume: "$2.3M", odds: "72% Yes", time: "Mar left", color: "from-purple-600 to-pink-500" },
            { title: "Fed rate cut in March?", volume: "$890K", odds: "34% Yes", time: "27 days", color: "from-cyan-600 to-blue-500" },
            { title: "ETH ETF approved by Q2 2026?", volume: "$1.2M", odds: "89% Yes", time: "89 days", color: "from-green-600 to-teal-500" },
          ].map((market, i) => (
            <motion.div
              key={market.title}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${market.color} rounded-xl opacity-10 blur-xl`} />
              <Card className="relative bg-slate-900/80 backdrop-blur border-slate-700 hover:border-white/20 transition-all cursor-pointer hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">{market.time}</Badge>
                    <Badge className={`${market.color.split(" ")[0]} bg-gradient-to-r border-0 text-white text-xs px-2 py-1`}>{market.volume}</Badge>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{market.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{market.odds}</span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="relative p-12 rounded-2xl bg-gradient-to-br from-purple-900/50 to-cyan-900/50 border border-purple-500/20 text-center"
        >
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-slate-300 mb-6">Launch your first trading bot or browse prediction markets</p>
            <button
              onClick={() => router.push("/crypto")}
              className="px-8 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Start Trading Now
            </button>
          </div>
        </motion.div>
      </section>
    </motion.div>
  )
}
