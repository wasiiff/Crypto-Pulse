"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchMarketCoins, searchMarketCoins, fetchFavorites, addFavorite, removeFavorite } from "@/services/queries"
import { useSession } from "next-auth/react"
import { useState, useEffect, useMemo } from "react"
import { Loader2, LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import SearchInput from "@/components/ui/search-input"
import { Pagination } from "@/components/ui/pagination"
import CoinCard from "./CoinCard"
import CoinTable from "./CoinTable"

type ViewMode = "grid" | "table"

export default function MarketDashboard() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage] = useState(20)
  const totalPages = 100 // CoinGecko typically has ~10,000 coins, so 100 pages with 20 per page

  const isSearching = searchQuery.trim().length > 0

  // Fetch regular market coins for browsing
  const { data: marketCoins, isLoading: marketCoinsLoading } = useQuery({
    queryKey: ["market-coins", currentPage, perPage],
    queryFn: () => fetchMarketCoins(currentPage, perPage),
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
    if (favorites) {
      setFavoriteIds(new Set(favorites.map((coin) => coin.id)))
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search coins..."
          className="w-full sm:w-80"
        />
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="h-9"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="h-9"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!coins || coins.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">
            {isSearching 
              ? `No coins found matching "${searchQuery}"` 
              : "No coins available"}
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

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {coins.map((coin) => (
                <CoinCard
                  key={coin.id}
                  coin={coin}
                  isFavorite={favoriteIds.has(coin.id)}
                  onToggleFavorite={session ? handleToggleFavorite : undefined}
                />
              ))}
            </div>
          ) : (
            <CoinTable
              coins={coins}
              favoriteIds={favoriteIds}
              onToggleFavorite={session ? handleToggleFavorite : undefined}
            />
          )}

          {/* Only show pagination when not searching */}
          {!isSearching && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </div>
  )
}
