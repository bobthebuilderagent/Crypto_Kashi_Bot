"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, Key, Shield, ShieldCheck, ShieldAlert, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Security Settings - 2FA, session timeout, IP filtering
export function SecuritySettings() {
  return (
    <div className="space-y-5 max-w-2xl">
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5 space-y-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-400" />
            Security Settings
          </h3>

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
            <div>
              <div className="font-medium text-white text-sm">Two-Factor Authentication</div>
              <div className="text-xs text-slate-400">Add an extra layer of security</div>
            </div>
            <Switch className="data-[state=checked]:bg-green-600" />
          </div>

          {/* Session Timeout */}
          <div>
            <Label className="text-sm text-slate-400 mb-1 block">Session Timeout (minutes)</Label>
            <Input defaultValue="30" className="bg-slate-800 border-slate-700 text-white" />
          </div>

          {/* Remember Browser */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
            <div>
              <div className="font-medium text-white text-sm">Remember Browser</div>
              <div className="text-xs text-slate-400">Don't require re-authentication</div>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
          </div>

          {/* Secure Storage */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
            <div>
              <div className="font-medium text-white text-sm">Secure Storage</div>
              <div className="text-xs text-slate-400">Encrypt sensitive data at rest</div>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
          </div>

          {/* IP Filtering */}
          <div className="pt-4 border-t border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">IP Filtering</h4>
            <div className="space-y-3">
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Allowed IP Addresses</Label>
                <Input
                  defaultValue="192.168.1.1, 10.0.0.1"
                  className="bg-slate-800 border-slate-700 text-white font-mono"
                  placeholder="Comma-separated IP addresses"
                />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">Enable IP Whitelisting</div>
                  <div className="text-xs text-slate-400">Only allow connections from specified IPs</div>
                </div>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
            </div>
          </div>

          {/* API Key Rotation */}
          <div className="pt-4 border-t border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">API Key Management</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">Auto-Rotate Keys</div>
                  <div className="text-xs text-slate-400">Rotate API keys every 30 days</div>
                </div>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
              <div>
                <Label className="text-sm text-slate-400 mb-1 block">Rotation Interval (days)</Label>
                <Input defaultValue="30" className="bg-slate-800 border-slate-700 text-white" />
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="pt-4 border-t border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Activity Log</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/30">
                <span className="text-sm text-slate-300">Login from new device</span>
                <Badge variant="secondary" className="text-xs">2 hours ago</Badge>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/30">
                <span className="text-sm text-slate-300">API key rotated</span>
                <Badge variant="secondary" className="text-xs">1 day ago</Badge>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/30">
                <span className="text-sm text-slate-300">Session timeout</span>
                <Badge variant="secondary" className="text-xs">3 days ago</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
