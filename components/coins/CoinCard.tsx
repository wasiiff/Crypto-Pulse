"use client"

import { MarketCoin } from "@/types/types"
import { TrendingUp, TrendingDown, Star } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

interface CoinCardProps {
  coin: MarketCoin
  isFavorite?: boolean
  onToggleFavorite?: (coinId: string) => void
}

export default function CoinCard({ coin, isFavorite, onToggleFavorite }: CoinCardProps) {
  const { data: session } = useSession()
  const isPositive = (coin.price_change_percentage_24h ?? 0) >= 0

  return (
    <div className="glass-card-hover p-5 group">
      <div className="flex items-start justify-between mb-4">
        <Link href={`/coins/${coin.id}`} className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src={coin.image}
              alt={coin.name}
              className="relative w-12 h-12 rounded-full ring-2 ring-white/10 group-hover:ring-white/20 transition-all duration-300"
            />
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-gradient transition-all duration-300">
              {coin.name}
            </h3>
            <p className="text-sm text-gray-500 uppercase tracking-wider">{coin.symbol}</p>
          </div>
        </Link>
        
        {session && onToggleFavorite && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(coin.id)}
            className="h-9 w-9 p-0 rounded-lg hover:bg-white/5"
          >
            <Star
              className={`w-4 h-4 transition-all duration-300 ${
                isFavorite 
                  ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
            />
          </Button>
        )}
      </div>

      <Link href={`/coins/${coin.id}`} className="block">
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium ${
                isPositive 
                  ? "bg-green-500/10 text-green-400" 
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {Math.abs(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
            </div>

            {coin.market_cap_rank && (
              <span className="text-xs text-gray-500 px-2 py-1 rounded-md bg-white/[0.03]">
                #{coin.market_cap_rank}
              </span>
            )}
          </div>

          {coin.market_cap && (
            <div className="pt-3 border-t border-white/[0.04]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Market Cap</span>
                <span className="text-sm font-medium text-gray-300">
                  ${(coin.market_cap / 1e9).toFixed(2)}B
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </div>
    </div>
  )
}
