"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchMarketCoins, searchMarketCoins, fetchFavorites, addFavorite, removeFavorite } from "@/services/queries"
import { useSession } from "next-auth/react"
import CoinCard from "./CoinCard"
import { CoinCardSkeleton } from "@/components/ui/skeleton"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const ITEMS_PER_PAGE = 20
const TOTAL_PAGES = 100 // CoinGecko supports up to ~10,000 coins

interface MarketOverviewProps {
  searchQuery?: string
}

export default function MarketOverview({ searchQuery = "" }: MarketOverviewProps) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)

  const isSearching = searchQuery.trim().length > 0

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Fetch regular market coins for browsing
  const { data: marketCoins, isLoading: marketCoinsLoading } = useQuery({
    queryKey: ["market-coins", currentPage, ITEMS_PER_PAGE],
    queryFn: () => fetchMarketCoins(currentPage, ITEMS_PER_PAGE),
    enabled: !isSearching,
  })

  // Fetch search results
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["search-coins", searchQuery],
    queryFn: () => searchMarketCoins(searchQuery),
    enabled: isSearching,
  })

  // Fetch detailed market data for search results
  const searchCoinIds = useMemo(() => {
    return searchResults?.coins?.map(coin => coin.id) || []
  }, [searchResults])

  const { data: searchCoinsData, isLoading: searchCoinsDataLoading } = useQuery({
    queryKey: ["search-coins-data", searchCoinIds],
    queryFn: async () => {
      if (searchCoinIds.length === 0) return []
      
      // Fetch market data for all search result coins
      // We'll fetch a large batch and filter by the search result IDs
      const allCoins = await fetchMarketCoins(1, 250)
      return allCoins.filter(coin => searchCoinIds.includes(coin.id))
    },
    enabled: isSearching && searchCoinIds.length > 0,
  })

  const coins = isSearching ? searchCoinsData : marketCoins
  const isLoading = isSearching ? (searchLoading || searchCoinsDataLoading) : marketCoinsLoading

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

  if (isLoading) {
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
      {/* Coins Grid */}
      {!coins || coins.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {isSearching ? `No coins found matching "${searchQuery}"` : "No coins available"}
          </p>
        </div>
      ) : (
        <>
          {/* Show search results count */}
          {isSearching && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Found {coins.length} coin{coins.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {coins.map((coin) => (
              <CoinCard
                key={coin.id}
                coin={coin}
                isFavorite={favoriteIds.has(coin.id)}
                onToggleFavorite={session ? handleToggleFavorite : undefined}
              />
            ))}
          </div>
        </>
      )}

      {/* Pagination Controls - Only show when not searching */}
      {!isSearching && (
        <div className="flex flex-col items-center gap-4 pt-8 pb-4">
          {/* Mobile Pagination */}
          <div className="flex sm:hidden items-center justify-between w-full gap-3 px-2">
            <Button
              variant="outline"
              size="default"
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || isLoading}
              className="flex-1 h-11 rounded-xl border-2 border-border/50 bg-background/60 backdrop-blur-md hover:bg-primary/10 hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Prev
            </Button>

            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-md border-2 border-primary/20 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-bold text-foreground whitespace-nowrap">
                {currentPage} / {TOTAL_PAGES}
              </span>
            </div>

            <Button
              variant="outline"
              size="default"
              onClick={handleNextPage}
              disabled={currentPage === TOTAL_PAGES || isLoading}
              className="flex-1 h-11 rounded-xl border-2 border-border/50 bg-background/60 backdrop-blur-md hover:bg-primary/10 hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>

          {/* Desktop Pagination */}
          <div className="hidden sm:flex items-center justify-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="default"
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || isLoading}
              className="h-11 px-5 rounded-xl border-2 border-border/50 bg-background/60 backdrop-blur-md hover:bg-primary/10 hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
              <ChevronLeft className="w-5 h-5 mr-1.5" />
              <span className="hidden md:inline">Previous</span>
              <span className="md:hidden">Prev</span>
            </Button>

            <div className="flex items-center gap-1.5 px-2">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground font-bold text-lg">
                    •••
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="default"
                    onClick={() => handlePageClick(page as number)}
                    disabled={isLoading}
                    className={
                      currentPage === page
                        ? "h-11 w-11 p-0 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground font-bold border-0 transition-all duration-200 scale-110 hover:scale-115"
                        : "h-11 w-11 p-0 rounded-xl border-2 border-border/50 bg-background/60 backdrop-blur-md hover:bg-primary/10 hover:border-primary/50 hover:scale-110 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
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
              disabled={currentPage === TOTAL_PAGES || isLoading}
              className="h-11 px-5 rounded-xl border-2 border-border/50 bg-background/60 backdrop-blur-md hover:bg-primary/10 hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
              <span className="hidden md:inline">Next</span>
              <span className="md:hidden">Next</span>
              <ChevronRight className="w-5 h-5 ml-1.5" />
            </Button>
          </div>

          {/* Page Info */}
          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-muted/40 backdrop-blur-md border-2 border-border/30 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" />
            <p className="text-sm font-semibold text-muted-foreground">
              Page <span className="text-foreground font-bold text-base">{currentPage}</span> of <span className="text-foreground font-bold text-base">{TOTAL_PAGES}</span>
              <span className="hidden md:inline"> • <span className="text-foreground font-bold">{ITEMS_PER_PAGE}</span> coins per page</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}