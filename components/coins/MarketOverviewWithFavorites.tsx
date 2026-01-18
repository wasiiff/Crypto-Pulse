"use client"

import { useState, useCallback } from "react"
import SearchContainer from "./SearchContainer"
import MarketOverview from "./MarketOverview"

export default function MarketOverviewWithFavorites() {
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
    <div className="space-y-6">
      {/* Search Section */}
      <SearchContainer
        onSearchChange={handleSearchChange}
        placeholder="Search coins by name or symbol..."
        isLoading={isSearchLoading}
        debounceMs={500}
        size="md"
        className="max-w-md"
      />
      
      {/* Market Overview - Receives search query as prop */}
      <MarketOverview searchQuery={searchQuery} />
    </div>
  )
}
