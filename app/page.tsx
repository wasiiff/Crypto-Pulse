import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import MarketOverviewWithFavorites from "@/components/coins/MarketOverviewWithFavorites"
import TrendingSection from "@/components/coins/TrendingSection"
import MarketStats from "@/components/coins/MarketStats"
import { FloatingLines, HeroGlow, ConnectingDots, GlowingOrb } from "@/components/ui/svg-decorations"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030014] relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <HeroGlow className="absolute inset-0 w-full h-full" />
        <FloatingLines className="absolute top-0 left-0 w-full h-[600px] opacity-40" />
        <ConnectingDots className="absolute top-20 right-0 w-[500px] h-[400px] opacity-30" />
        <GlowingOrb className="absolute -top-20 -left-20 w-[400px] h-[400px]" color="blue" />
        <GlowingOrb className="absolute top-1/3 -right-32 w-[500px] h-[500px]" color="purple" />
        <GlowingOrb className="absolute bottom-0 left-1/4 w-[300px] h-[300px]" color="pink" />
      </div>

      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-gray-400">Live Market Data</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1]">
              <span className="text-white">Track Crypto</span>
              <br />
              <span className="text-gradient">Like Never Before</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
              Real-time cryptocurrency tracking with advanced analytics, 
              personalized watchlists, and instant market insights. 
              Stay ahead of the market.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <MarketStats />
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Market Overview</h2>
              <p className="text-gray-500">Top cryptocurrencies by market cap</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <MarketOverviewWithFavorites />
            </div>
            
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <TrendingSection />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
