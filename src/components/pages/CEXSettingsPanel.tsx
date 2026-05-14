"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Key, Zap, Save, Download, Upload, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useSettings, US_CEX_PRESETS } from "@/context/settings"

// CEX Settings Panel - wired to SettingsProvider
export function CEXSettingsPanel() {
  const { cexConnections, setCexConnections, updateCEX, testCEXConnection } = useSettings()

  const handleSave = () => {
    console.log("CEX settings saved")
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Trading Preferences */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            Trading Preferences
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Default Order Type</Label>
              <Select defaultValue="limit">
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="limit">Limit</SelectItem>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="stop-limit">Stop Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Default Leverage</Label>
              <Select defaultValue="1">
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1x (Spot)</SelectItem>
                  <SelectItem value="3">3x</SelectItem>
                  <SelectItem value="5">5x</SelectItem>
                  <SelectItem value="10">10x</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Max Position Size (USD)</Label>
              <Input defaultValue="1000" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Daily Loss Limit (USD)</Label>
              <Input defaultValue="500" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <Label className="text-sm text-slate-400 mb-1 block">Stop Loss (%)</Label>
              <Input defaultValue="2" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white text-sm">Paper Trading</div>
                <div className="text-xs text-slate-400">Simulate trades without real funds</div>
              </div>
              <Switch className="data-[state=checked]:bg-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save/Load Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
        <Button variant="outline" className="bg-slate-800 border-slate-700 text-slate-300">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" className="bg-slate-800 border-slate-700 text-slate-300">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
      </div>
    </div>
  )
}
