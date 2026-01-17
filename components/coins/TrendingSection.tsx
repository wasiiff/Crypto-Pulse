"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchTrendingCoins, addFavorite, removeFavorite, fetchFavorites } from "@/services/queries"
import { Flame, TrendingUp, Star } from "lucide-react"
import Link from "next/link"
import { TrendingItemSkeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function TrendingSection() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())

  const { data, isLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrendingCoins,
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

  const handleToggleFavorite = (e: React.MouseEvent, coinId: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!session) {
      return
    }

    if (favoriteIds.has(coinId)) {
      removeMutation.mutate(coinId)
    } else {
      addMutation.mutate(coinId)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card-light rounded-xl overflow-hidden border border-border"
    >
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center">
            <Flame className="w-5 h-5 card-text" />
          </div>
          <div>
            <h3 className="font-semibold card-text">Trending</h3>
            <p className="text-xs card-text-muted">Top 7 coins by search</p>
          </div>
        </div>
      </div>

      <div className="p-2">
        {isLoading ? (
          <div className="space-y-1">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <TrendingItemSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {data?.coins.slice(0, 7).map((item, idx) => {
              const isFavorite = favoriteIds.has(item.item.id)
              
              return (
                <div
                  key={item.item.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 group"
                >
                  <Link href={`/coins/${item.item.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      idx === 0 ? "bg-primary/20 text-primary border border-primary/30" :
                      idx === 1 ? "bg-muted card-text border border-border" :
                      idx === 2 ? "bg-muted card-text border border-border" :
                      "bg-muted card-text-muted border border-border"
                    }`}>
                      {idx + 1}
                    </div>
                    
                    <div className="relative">
                      <img
                        src={item.item.thumb}
                        alt={item.item.name}
                        className="w-8 h-8 rounded-full ring-2 ring-border group-hover:ring-primary/40 transition-all"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium card-text truncate group-hover:text-primary transition-all duration-300">
                        {item.item.name}
                      </p>
                      <p className="text-xs card-text-muted uppercase">
                        {item.item.symbol}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <TrendingUp className="w-3 h-3" />
                    </div>
                  </Link>

                  {session && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleToggleFavorite(e, item.item.id)}
                      className="h-8 w-8 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Star
                        className={`w-4 h-4 transition-all duration-300 ${
                          isFavorite 
                            ? "fill-yellow-500 text-yellow-500" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      />
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}
