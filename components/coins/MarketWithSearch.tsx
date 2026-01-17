"use client"

import { useState, useCallback } from "react"
import SearchContainer from "./SearchContainer"
import MarketDashboard from "./MarketDashboard"

export default function MarketWithSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchLoading, setIsSearchLoading] = useState(false)

  const handleSearchChange = useCallback((query: string) => {
    setIsSearchLoading(true)
    setSearchQuery(query)
    
    // Reset loading state after a short delay to show the loading indicator
    setTimeout(() => {
      setIsSearchLoading(false)
    }, 300)
  }, [])

  return (
    <div className="space-y-8">
      {/* Search Section - Always visible at the top */}
      <SearchContainer
        onSearchChange={handleSearchChange}
        placeholder="Search cryptocurrencies by name or symbol..."
        isLoading={isSearchLoading}
        debounceMs={500}
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50"
      />
      
      {/* Market Dashboard - Receives search query as prop */}
      <MarketDashboard searchQuery={searchQuery} />
    </div>
  )
}