"use client"

import { MarketCoin } from "@/types/types"
import { TrendingUp, TrendingDown, Star } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

interface CoinTableProps {
  coins: MarketCoin[]
  favoriteIds: Set<string>
  onToggleFavorite?: (coinId: string) => void
}

export default function CoinTable({ coins, favoriteIds, onToggleFavorite }: CoinTableProps) {
  const { data: session } = useSession()

  return (
    <div className="glass-effect rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">#</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Coin</th>
              <th className="text-right py-4 px-4 text-sm font-medium text-gray-400">Price</th>
              <th className="text-right py-4 px-4 text-sm font-medium text-gray-400">24h %</th>
              <th className="text-right py-4 px-4 text-sm font-medium text-gray-400 hidden md:table-cell">Market Cap</th>
              <th className="text-right py-4 px-4 text-sm font-medium text-gray-400 hidden lg:table-cell">Volume</th>
              {session && <th className="text-center py-4 px-4 text-sm font-medium text-gray-400 w-12"></th>}
            </tr>
          </thead>
          <tbody>
            {coins.map((coin, index) => {
              const isPositive = (coin.price_change_percentage_24h ?? 0) >= 0
              const isFavorite = favoriteIds.has(coin.id)

              return (
                <tr
                  key={coin.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {coin.market_cap_rank || index + 1}
                  </td>
                  <td className="py-4 px-4">
                    <Link href={`/coins/${coin.id}`} className="flex items-center gap-3">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-white hover:text-blue-400 transition-colors">
                          {coin.name}
                        </p>
                        <p className="text-xs text-gray-500 uppercase">{coin.symbol}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-white font-medium">
                      ${coin.current_price.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-medium ${
                        isPositive ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right hidden md:table-cell">
                    <span className="text-gray-300">
                      ${((coin.market_cap ?? 0) / 1e9).toFixed(2)}B
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right hidden lg:table-cell">
                    <span className="text-gray-300">
                      ${((coin.total_volume ?? 0) / 1e9).toFixed(2)}B
                    </span>
                  </td>
                  {session && (
                    <td className="py-4 px-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleFavorite?.(coin.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-500"
                          }`}
                        />
                      </Button>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
