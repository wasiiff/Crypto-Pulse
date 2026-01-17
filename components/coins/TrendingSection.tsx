"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchTrendingCoins } from "@/services/queries"
import { Flame, TrendingUp } from "lucide-react"
import Link from "next/link"
import { TrendingItemSkeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

export default function TrendingSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrendingCoins,
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-muted/50 backdrop-blur-sm rounded-xl overflow-hidden border border-border/30"
    >
      <div className="p-5 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center ring-1 ring-orange-500/20">
            <Flame className="w-5 h-5 text-orange-500 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Trending</h3>
            <p className="text-xs text-muted-foreground">Top 7 coins by search</p>
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
            {data?.coins.slice(0, 7).map((item, idx) => (
              <Link
                key={item.item.id}
                href={`/coins/${item.item.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-background/60 transition-all duration-200 group"
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                  idx === 0 ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-black" :
                  idx === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-black" :
                  idx === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white" :
                  "bg-background/60 text-muted-foreground"
                }`}>
                  {idx + 1}
                </div>
                
                <div className="relative">
                  <img
                    src={item.item.thumb}
                    alt={item.item.name}
                    className="w-8 h-8 rounded-full ring-2 ring-border/20 group-hover:ring-primary/40 transition-all"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-all duration-300">
                    {item.item.name}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase">
                    {item.item.symbol}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <TrendingUp className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
