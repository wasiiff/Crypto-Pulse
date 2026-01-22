"use client"

import React, { useState, useCallback, memo } from "react"
import { useDebounce } from "@/lib/hooks/useDebounce"
import EnhancedSearchInput from "@/components/ui/enhanced-search-input"
import { cn } from "@/lib/utils"
import { TrendingUp } from "lucide-react"

interface SearchContainerProps {
  onSearchChange: (query: string) => void
  placeholder?: string
  className?: string
  size?: "sm" | "md" | "lg"
  debounceMs?: number
  isLoading?: boolean
}

const SearchContainer = memo(function SearchContainer({
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

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
  }, [])

  return (
    <div className={cn(
      "w-full max-w-2xl mx-auto",
      "px-2 sm:px-4 py-6",
      className
    )}>
      <div className="space-y-3">
        <EnhancedSearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={placeholder}
          size={size}
          isLoading={isLoading}
          className="w-full"
        />
        
        {searchQuery && (
          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-muted/30 backdrop-blur-sm border border-border/30 w-fit mx-auto">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <div className="text-sm font-medium text-muted-foreground">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                  <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1">Searching</span>
                </span>
              ) : debouncedSearchQuery ? (
                <>Searching for <span className="text-foreground font-semibold">"{debouncedSearchQuery}"</span></>
              ) : (
                "Type to search cryptocurrencies"
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

export default SearchContainer