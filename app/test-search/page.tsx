"use client"

import MarketWithSearch from "@/components/coins/MarketWithSearch"

export default function TestSearchPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Search Test Page</h1>
        <MarketWithSearch />
      </div>
    </div>
  )
}