"use client"

import { useAppContext } from "@/lib/providers"
import { PredictionsPage as PredictionsContent } from "@/components/pages/PredictionsPage"
import { Sidebar } from "@/components/Sidebar"

export default function PredictionsPage() {
  const { section } = useAppContext()
  
  if (section !== "predictions") return null
  return (
    <div className="flex">
      <Sidebar activeSection="predictions" />
      <div className="flex-1">
        <PredictionsContent />
      </div>
    </div>
  )
}
