"use client"

import React, { useState } from "react"
import { useDebounce } from "@/lib/hooks/useDebounce"
import EnhancedSearchInput from "@/components/ui/enhanced-search-input"
import { cn } from "@/lib/utils"

interface SearchContainerProps {
  onSearchChange: (query: string) => void
  placeholder?: string
  className?: string
  size?: "sm" | "md" | "lg"
  debounceMs?: number
  isLoading?: boolean
}

export default function SearchContainer({
  onSearchChange,
  placeholder = "Search cryptocurrencies...",
  className = "",
  size = "lg",
  debounceMs = 500,
  isLoading = false
}: SearchContainerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, debounceMs)

  // Call the parent's search handler when debounced value changes
  React.useEffect(() => {
    onSearchChange(debouncedSearchQuery)
  }, [debouncedSearchQuery, onSearchChange])

  return (
    <div className={cn(
      "w-full max-w-2xl mx-auto",
      "px-4 py-6",
      className
    )}>
      <div className="space-y-2">
        <EnhancedSearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={placeholder}
          size={size}
          isLoading={isLoading}
          className="w-full"
        />
        
        {searchQuery && (
          <div className="text-sm text-muted-foreground text-center">
            {isLoading ? (
              "Searching..."
            ) : debouncedSearchQuery ? (
              `Searching for "${debouncedSearchQuery}"`
            ) : (
              "Type to search cryptocurrencies"
            )}
          </div>
        )}
      </div>
    </div>
  )
}