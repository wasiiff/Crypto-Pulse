"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchMarketCoins, fetchFavorites, addFavorite, removeFavorite } from "@/services/queries"
import { useSession } from "next-auth/react"
import CoinCard from "./CoinCard"
import { CoinCardSkeleton } from "@/components/ui/skeleton"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

const ITEMS_PER_PAGE = 20
const TOTAL_PAGES = 100 // CoinGecko supports up to ~10,000 coins

export default function MarketOverviewWithFavorites() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  const { data: coins, isLoading: coinsLoading } = useQuery({
    queryKey: ["market-coins", currentPage, ITEMS_PER_PAGE],
    queryFn: () => fetchMarketCoins(currentPage, ITEMS_PER_PAGE),
  })

  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
    enabled: !!session,
  })

  useEffect(() => {
    if (favorites && Array.isArray(favorites)) {
      setFavoriteIds(new Set(favorites.map((coin) => coin.id)))
    } else {
      setFavoriteIds(new Set())
    }
  }, [favorites])

  const addMutation = useMutation({
    mutationFn: addFavorite,
    onSuccess: (_, coinId) => {
      setFavoriteIds((prev) => new Set(prev).add(coinId))
      queryClient.invalidateQueries({ queryKey: ["favorites"] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: (_, coinId) => {
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        next.delete(coinId)
        return next
      })
      queryClient.invalidateQueries({ queryKey: ["favorites"] })
    },
  })

  const handleToggleFavorite = (coinId: string) => {
    if (favoriteIds.has(coinId)) {
      removeMutation.mutate(coinId)
    } else {
      addMutation.mutate(coinId)
    }
  }

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, TOTAL_PAGES))
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  // Filter coins based on search query
  const filteredCoins = useMemo(() => {
    if (!coins) return []
    if (!searchQuery.trim()) return coins

    const query = searchQuery.toLowerCase()
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query)
    )
  }, [coins, searchQuery])

  // Reset to page 1 when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setCurrentPage(1)
    }
  }, [searchQuery])

  const clearSearch = () => {
    setSearchQuery("")
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxPagesToShow = 5
    
    if (TOTAL_PAGES <= maxPagesToShow) {
      for (let i = 1; i <= TOTAL_PAGES; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(TOTAL_PAGES)
      } else if (currentPage >= TOTAL_PAGES - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = TOTAL_PAGES - 3; i <= TOTAL_PAGES; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('...')
        pages.push(TOTAL_PAGES)
      }
    }
    
    return pages
  }

  if (coinsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <CoinCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search coins by name or symbol..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 h-11 rounded-lg border-2 border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background focus:border-primary/50 transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Coins Grid */}
      {filteredCoins.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery ? `No coins found matching "${searchQuery}"` : "No coins available"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCoins.map((coin) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              isFavorite={favoriteIds.has(coin.id)}
              onToggleFavorite={session ? handleToggleFavorite : undefined}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls - Only show when not searching */}
      {!searchQuery && (
        <div className="flex flex-col items-center gap-4 pt-8 pb-4">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="default"
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || coinsLoading}
            className="h-10 px-4 rounded-lg border-2 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span className="font-medium">Previous</span>
          </Button>

          <div className="flex items-center gap-1.5 px-2">
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground font-medium">
                  •••
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="default"
                  onClick={() => handlePageClick(page as number)}
                  disabled={coinsLoading}
                  className={
                    currentPage === page
                      ? "h-10 w-10 p-0 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 border-0 transition-all duration-200 scale-105"
                      : "h-10 w-10 p-0 rounded-lg border-2 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 hover:scale-105 transition-all duration-200 font-medium shadow-sm"
                  }
                >
                  {page}
                </Button>
              )
            ))}
          </div>

          <Button
            variant="outline"
            size="default"
            onClick={handleNextPage}
            disabled={currentPage === TOTAL_PAGES || coinsLoading}
            className="h-10 px-4 rounded-lg border-2 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <span className="font-medium">Next</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Page Info */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 backdrop-blur-sm border border-border/30">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-sm font-medium text-muted-foreground">
            Page <span className="text-foreground font-semibold">{currentPage}</span> of <span className="text-foreground font-semibold">{TOTAL_PAGES}</span>
            <span className="hidden sm:inline"> • {ITEMS_PER_PAGE} coins per page</span>
          </p>
        </div>
        </div>
      )}
    </div>
  )
}
