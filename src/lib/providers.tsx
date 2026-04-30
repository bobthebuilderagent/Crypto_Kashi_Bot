"use client"

import React, { createContext, useContext, useState } from 'react'
import { SettingsProvider } from '@/context/settings'

type Theme = 'dark' | 'light'
type Section = 'home' | 'crypto' | 'predictions'
type ExchangeType = 'cex' | 'dex'

interface AppContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  section: Section
  setSection: (section: Section) => void
  exchangeType: ExchangeType
  setExchangeType: (type: ExchangeType) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [section, setSection] = useState<Section>('home')
  const [exchangeType, setExchangeType] = useState<ExchangeType>('cex')

  return (
    <AppContext.Provider value={{ theme, setTheme, section, setSection, exchangeType, setExchangeType }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </SettingsProvider>
  )
}
