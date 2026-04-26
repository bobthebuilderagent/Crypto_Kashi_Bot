"use client"

import { PredictionsPage } from "@/components/pages/PredictionsPage"
import { Sidebar } from "@/components/Sidebar"

export default function PredictionsPageRoute() {
  return (
    <div className="flex">
      <Sidebar activeSection="predictions" />
      <div className="flex-1">
        <PredictionsPage />
      </div>
    </div>
  )
}
