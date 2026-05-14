"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Mail, MessageSquare, Bot, Smartphone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

// Notification Settings - Email/IMAP/SMTP, Discord, Telegram
export function NotificationSettings() {
  const [activeTab, setActiveTab] = useState("email")

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Notification Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("email")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "email"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Mail className="w-4 h-4 inline mr-2" />
          Email
        </button>
        <button
          onClick={() => setActiveTab("discord")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "discord"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Discord
        </button>
        <button
          onClick={() => setActiveTab("telegram")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "telegram"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Bot className="w-4 h-4 inline mr-2" />
          Telegram
        </button>
        <button
          onClick={() => setActiveTab("push")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "push"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Smartphone className="w-4 h-4 inline mr-2" />
          Push
        </button>
      </div>

      {/* Email/SMTP Settings */}
      {activeTab === "email" && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              Email (IMAP/SMTP) Configuration
            </h3>
            <div className="space-y-3">
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">SMTP Host</Label>
                <Input
                  defaultValue="smtp.gmail.com"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">SMTP Port</Label>
                <Input defaultValue="587" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Username</Label>
                <Input
                  defaultValue="your-email@gmail.com"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Password</Label>
                <Input
                  defaultValue="••••••••••"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">Enable Email Notifications</div>
                  <div className="text-xs text-slate-400">Send alerts via email</div>
                </div>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              Test Connection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Discord Settings */}
      {activeTab === "discord" && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              Discord Webhook Settings
            </h3>
            <div className="space-y-3">
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Webhook URL</Label>
                <Input
                  defaultValue="https://discord.com/api/webhooks/..."
                  className="bg-slate-800 border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Bot Token</Label>
                <Input
                  defaultValue="••••••••••"
                  className="bg-slate-800 border-slate-700 text-white font-mono"
                />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">Enable Discord Notifications</div>
                  <div className="text-xs text-slate-400">Send alerts to Discord channel</div>
                </div>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              Test Webhook
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Telegram Settings */}
      {activeTab === "telegram" && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Bot className="w-4 h-4 text-sky-400" />
              Telegram Bot Settings
            </h3>
            <div className="space-y-3">
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Bot Token</Label>
                <Input
                  defaultValue="••••••••••"
                  className="bg-slate-800 border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Chat ID</Label>
                <Input
                  defaultValue="-1001234567890"
                  className="bg-slate-800 border-slate-700 text-white font-mono"
                />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">Enable Telegram Notifications</div>
                  <div className="text-xs text-slate-400">Send alerts via Telegram bot</div>
                </div>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              Test Bot
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Push Notification Settings */}
      {activeTab === "push" && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              Push Notification Settings
            </h3>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Enable Push Notifications</div>
                <div className="text-xs text-slate-400">Browser push alerts</div>
              </div>
              <Switch className="data-[state=checked]:bg-green-600" />
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Price Alerts</div>
                <div className="text-xs text-slate-400">Notify on price changes</div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Trade Execution</div>
                <div className="text-xs text-slate-400">Notify on successful trade execution</div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Error Notifications</div>
                <div className="text-xs text-slate-400">Alert on errors or system issues</div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-red-600" />
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Daily Summary</div>
                <div className="text-xs text-slate-400">End-of-day performance summary</div>
              </div>
              <Switch className="data-[state=checked]:bg-green-600" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
