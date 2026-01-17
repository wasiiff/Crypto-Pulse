"use client"

import HeroSectionImproved from "@/components/ui/hero-section-improved"
import { useState } from "react"

export default function HeroTestPage() {
  const [isSearchLoading, setIsSearchLoading] = useState(false)

  const handleSearch = (query: string) => {
    console.log("Searching for:", query)
    setIsSearchLoading(true)
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearchLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSectionImproved 
        onSearch={handleSearch}
        isSearchLoading={isSearchLoading}
      />
    </div>
  )
}