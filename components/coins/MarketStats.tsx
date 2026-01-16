"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchMarketCoins } from "@/services/queries"
import { TrendingUp, DollarSign, BarChart3, Activity } from "lucide-react"
import { StatCardSkeleton } from "@/components/ui/skeleton"

export default function MarketStats() {
  const { data: coins, isLoading } = useQuery({
    queryKey: ["market-coins"],
    queryFn: fetchMarketCoins,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const totalMarketCap = coins?.reduce((acc, coin) => acc + (coin.market_cap || 0), 0) || 0
  const totalVolume = coins?.reduce((acc, coin) => acc + (coin.total_volume || 0), 0) || 0
  const avgChange = coins?.reduce((acc, coin) => acc + (coin.price_change_percentage_24h || 0), 0) / (coins?.length || 1)
  const topGainer = coins?.reduce((max, coin) => 
    (coin.price_change_percentage_24h || 0) > (max.price_change_percentage_24h || 0) ? coin : max
  , coins?.[0] || { price_change_percentage_24h: 0 })

  const stats = [
    {
      label: "Total Market Cap",
      value: `$${(totalMarketCap / 1e12).toFixed(2)}T`,
      change: "+2.4%",
      trend: "up" as const,
      icon: DollarSign,
      color: "blue",
    },
    {
      label: "24h Volume",
      value: `$${(totalVolume / 1e9).toFixed(1)}B`,
      change: "+5.2%",
      trend: "up" as const,
      icon: BarChart3,
      color: "purple",
    },
    {
      label: "Avg. 24h Change",
      value: `${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`,
      change: avgChange >= 0 ? "Bullish" : "Bearish",
      trend: avgChange >= 0 ? "up" as const : "down" as const,
      icon: Activity,
      color: avgChange >= 0 ? "green" : "red",
    },
    {
      label: "Top Gainer",
      value: topGainer?.symbol?.toUpperCase() || "N/A",
      change: `+${(topGainer?.price_change_percentage_24h || 0).toFixed(1)}%`,
      trend: "up" as const,
      icon: TrendingUp,
      color: "cyan",
    },
  ]

  const colorClasses = {
    blue: { bg: "from-blue-500/20 to-blue-600/10", icon: "text-blue-400", glow: "shadow-blue-500/20" },
    purple: { bg: "from-purple-500/20 to-purple-600/10", icon: "text-purple-400", glow: "shadow-purple-500/20" },
    green: { bg: "from-green-500/20 to-green-600/10", icon: "text-green-400", glow: "shadow-green-500/20" },
    red: { bg: "from-red-500/20 to-red-600/10", icon: "text-red-400", glow: "shadow-red-500/20" },
    cyan: { bg: "from-cyan-500/20 to-cyan-600/10", icon: "text-cyan-400", glow: "shadow-cyan-500/20" },
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const colors = colorClasses[stat.color as keyof typeof colorClasses]
        return (
          <div 
            key={idx} 
            className="glass-card p-5 group hover:border-white/[0.12] transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg ${colors.glow}`}>
                <stat.icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                stat.trend === "up" 
                  ? "bg-green-500/10 text-green-400" 
                  : "bg-red-500/10 text-red-400"
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        )
      })}
    </div>
  )
}
