"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchMarketCoins, fetchFavorites, addFavorite, removeFavorite } from "@/services/queries"
import { useSession } from "next-auth/react"
import CoinCard from "./CoinCard"
import { CoinCardSkeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"

export default function MarketOverviewWithFavorites() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())

  const { data: coins, isLoading: coinsLoading } = useQuery({
    queryKey: ["market-coins"],
    queryFn: fetchMarketCoins,
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {coins?.map((coin) => (
        <CoinCard
          key={coin.id}
          coin={coin}
          isFavorite={favoriteIds.has(coin.id)}
          onToggleFavorite={session ? handleToggleFavorite : undefined}
        />
      ))}
    </div>
  )
}
