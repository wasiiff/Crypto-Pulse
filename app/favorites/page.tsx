"use client"

import { Suspense } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import FavoritesClient from "@/components/coins/FavoritesClient"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { BackgroundGrid, LeftDecorativePattern, RightDecorativePattern, VerticalBorderLines } from "@/components/ui/background-patterns"

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background geometric pattern */}
      <BackgroundGrid />

      <div className="relative flex flex-col justify-start items-center w-full">
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:max-w-[1400px] xl:w-[1400px] relative flex flex-col justify-start items-start">
          {/* Left decorative pattern */}
          <LeftDecorativePattern />

          {/* Right decorative pattern */}
          <RightDecorativePattern />

          {/* Vertical border lines */}
          <VerticalBorderLines />

          <div className="self-stretch pt-[9px] overflow-hidden flex flex-col justify-center items-start relative z-10 w-full">
            <Navbar />

            <main className="w-full px-2 sm:px-4 md:px-8 lg:px-12 py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="pt-24 sm:pt-28 md:pt-32 lg:pt-32 pb-8"
              >
                <div className="mb-8">
                  <h1 className="text-[32px] sm:text-[42px] md:text-[48px] font-bold mb-3 leading-[1.1] text-foreground">
                    Your Favorites
                  </h1>
                  <p className="text-muted-foreground text-lg">Track your favorite cryptocurrencies</p>
                </div>

                {/* Horizontal separator */}
                <div className="w-full border-t border-dashed border-border/60 mb-8"></div>

                <Suspense
                  fallback={
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  }
                >
                  <FavoritesClient />
                </Suspense>
              </motion.div>
            </main>

            <Footer />
          </div>
        </div>
      </div>
    </div>
  )
}
