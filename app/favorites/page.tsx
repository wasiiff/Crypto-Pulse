import { Suspense } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import FavoritesClient from "@/components/coins/FavoritesClient"
import { Loader2 } from "lucide-react"

export const metadata = {
  title: "Favorites — CryptoPulse",
}

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Your Favorites</h1>
          <p className="text-gray-400">Track your favorite cryptocurrencies</p>
        </div>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          }
        >
          <FavoritesClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
