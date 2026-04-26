"use client"

import { useAppContext } from "@/lib/providers"
import { HomePage } from "@/components/pages/HomePage"

export default function Home() {
  const { section } = useAppContext()
  
  if (section !== "home") return null
  return <HomePage />
}
