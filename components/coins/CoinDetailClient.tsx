"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchCoinDetails } from "@/services/queries"
import { TrendingUp, TrendingDown, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CircuitDecoration } from "@/components/ui/decorative-svg"
import { CoinDetailSkeleton } from "@/components/ui/skeleton"

interface CoinDetailClientProps {
  coinId: string
}

export default function CoinDetailClient({ coinId }: CoinDetailClientProps) {
  const { data: coin, isLoading } = useQuery({
    queryKey: ["coin", coinId],
    queryFn: () => fetchCoinDetails(coinId),
  })

  if (isLoading) {
    return <CoinDetailSkeleton />
  }

  if (!coin) return null

  const currentPrice = coin.market_data?.current_price?.usd ?? 0
  const priceChange = coin.market_data?.price_change_percentage_24h ?? 0
  const isPositive = priceChange >= 0

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8">
      <div className="absolute -right-20 top-0 pointer-events-none opacity-10">
        <CircuitDecoration className="w-96 h-96" />
      </div>

      <Link href="/">
        <Button variant="ghost" className="mb-6 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Markets
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card-light border border-border">
            <CardHeader>
              <div className="flex items-start gap-4">
                <img
                  src={coin.image?.large}
                  alt={coin.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <CardTitle className="text-3xl card-text mb-1">
                    {coin.name}
                  </CardTitle>
                  <p className="card-text-muted uppercase text-sm">
                    {coin.symbol}
                  </p>
                </div>
                {coin.market_data?.market_cap_rank && (
                  <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
                    Rank #{coin.market_data.market_cap_rank}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold card-text">
                      ${currentPrice.toLocaleString()}
                    </span>
                    <div
                      className={`flex items-center gap-1 text-lg font-medium ${
                        isPositive ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                      {Math.abs(priceChange).toFixed(2)}%
                    </div>
                  </div>
                  <p className="text-sm card-text-muted">24h change</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-sm card-text-muted mb-1">Market Cap</p>
                    <p className="text-lg font-semibold card-text">
                      ${((coin.market_data?.market_cap?.usd ?? 0) / 1e9).toFixed(2)}B
                    </p>
                  </div>
                  <div>
                    <p className="text-sm card-text-muted mb-1">Circulating Supply</p>
                    <p className="text-lg font-semibold card-text">
                      {(coin.market_data?.circulating_supply ?? 0).toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                  {coin.market_data?.total_supply && (
                    <div>
                      <p className="text-sm card-text-muted mb-1">Total Supply</p>
                      <p className="text-lg font-semibold card-text">
                        {coin.market_data.total_supply.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {coin.description?.en && (
            <Card className="glass-card-light border border-border">
              <CardHeader>
                <CardTitle className="card-text">About {coin.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="card-text prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: coin.description.en.split(". ").slice(0, 3).join(". ") + ".",
                  }}
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="glass-card-light border border-border">
            <CardHeader>
              <CardTitle className="card-text">Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {coin.links?.homepage?.[0] && (
                <a
                  href={coin.links.homepage[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="card-text">Website</span>
                  <ExternalLink className="w-4 h-4 card-text-muted" />
                </a>
              )}
              {coin.links?.blockchain_site?.[0] && (
                <a
                  href={coin.links.blockchain_site[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="card-text">Explorer</span>
                  <ExternalLink className="w-4 h-4 card-text-muted" />
                </a>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card-light border border-border">
            <CardHeader>
              <CardTitle className="card-text">Market Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="card-text-muted text-sm">24h High</span>
                <span className="card-text font-medium">
                  ${(coin.market_data?.high_24h?.usd ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="card-text-muted text-sm">24h Low</span>
                <span className="card-text font-medium">
                  ${(coin.market_data?.low_24h?.usd ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="card-text-muted text-sm">All-Time High</span>
                <span className="card-text font-medium">
                  ${(coin.market_data?.ath?.usd ?? 0).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
