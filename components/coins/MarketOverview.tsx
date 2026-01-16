"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchMarketCoins } from "@/services/queries"
import CoinCard from "./CoinCard"
import { Loader2 } from "lucide-react"

export default function MarketOverview() {
  const { data: coins, isLoading } = useQuery({
    queryKey: ["market-coins"],
    queryFn: fetchMarketCoins,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {coins?.map((coin) => (
        <CoinCard key={coin.id} coin={coin} />
      ))}
    </div>
  )
}
