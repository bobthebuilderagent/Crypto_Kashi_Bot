"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CEXSettingsPanel } from "./CEXSettingsPanel"
import { DEXSettingsPanel } from "./DEXSettingsPanel"
import { CEXTradingSettings } from "./CEXTradingSettings"
import { DEXTradingSettings } from "./DEXTradingSettings"
import { CEXAPIKeysSettings } from "./CEXAPIKeysSettings"
import { DEXAPIKeysSettings } from "./DEXAPIKeysSettings"
import { CEXWalletSettings } from "./CEXWalletSettings"
import { DEXWalletSettings } from "./DEXWalletSettings"
import { CEXNotificationSettings } from "./CEXNotificationSettings"
import { DEXNotificationSettings } from "./DEXNotificationSettings"
import { CEXSecuritySettings } from "./CEXSecuritySettings"
import { DEXSecuritySettings } from "./DEXSecuritySettings"

export function SettingsContent({ selectedCategory, platform }: { selectedCategory: string; platform?: string }) {
  const isDEX = platform === "dex"

  switch (selectedCategory) {
    case "general":
      return isDEX ? <DEXSettingsPanel /> : <CEXSettingsPanel />
    case "trading":
      return isDEX ? <DEXTradingSettings /> : <CEXTradingSettings />
    case "api-keys":
      return isDEX ? <DEXAPIKeysSettings /> : <CEXAPIKeysSettings />
    case "wallets":
      return isDEX ? <DEXWalletSettings /> : <CEXWalletSettings />
    case "notifications":
      return isDEX ? <DEXNotificationSettings /> : <CEXNotificationSettings />
    case "security":
      return isDEX ? <DEXSecuritySettings /> : <CEXSecuritySettings />
    default:
      return isDEX ? <DEXSettingsPanel /> : <CEXSettingsPanel />
  }
}
