import { Suspense } from "react"
import CoinDetailClient from "@/components/coins/CoinDetailClient"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Loader2 } from "lucide-react"

export default async function CoinDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          }
        >
          <CoinDetailClient coinId={id} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
