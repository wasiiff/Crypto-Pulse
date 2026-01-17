"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchMarketCoins, fetchFavorites, addFavorite, removeFavorite } from "@/services/queries"
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

  // When searching, fetch more coins to show comprehensive results
  const isSearching = searchQuery.trim().length > 0
  const effectivePage = isSearching ? 1 : currentPage
  const effectivePerPage = isSearching ? 250 : perPage

  const { data: coins, isLoading: coinsLoading } = useQuery({
    queryKey: ["market-coins", effectivePage, effectivePerPage],
    queryFn: () => fetchMarketCoins(effectivePage, effectivePerPage),
  })

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (coinsLoading) {
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

      {filteredCoins.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No coins found matching "{searchQuery}"</p>
        </div>
      ) : (
        <>
          {/* Show search results count */}
          {isSearching && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Found {filteredCoins.length} coin{filteredCoins.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </p>
            </div>
          )}

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCoins.map((coin) => (
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
              coins={filteredCoins}
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
              isLoading={coinsLoading}
            />
          )}
        </>
      )}
    </div>
  )
}
