import React from "react"
import LoginForm from "@/components/auth/LoginForm"
import Link from "next/link"
import { FloatingLines, GlowingOrb, ConnectingDots } from "@/components/ui/svg-decorations"
import { TrendingUp, Shield, Star } from "lucide-react"

export const metadata = {
  title: "Sign in — CryptoPulse",
}

export default function Page() {
  return (
    <div className="min-h-screen bg-[#030014] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <FloatingLines className="absolute top-0 left-0 w-full h-full opacity-30" />
        <GlowingOrb className="absolute -top-40 -left-40 w-[600px] h-[600px]" color="blue" />
        <GlowingOrb className="absolute -bottom-40 -right-40 w-[600px] h-[600px]" color="purple" />
        <ConnectingDots className="absolute top-1/4 right-0 w-[400px] h-[300px] opacity-40" />
      </div>

      <div className="relative z-10 min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20">
          <div className="max-w-lg">
            <Link href="/" className="inline-flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">CryptoPulse</span>
            </Link>

            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Track your crypto
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">portfolio in real-time</span>
            </h1>

            <p className="text-lg text-gray-400 mb-12 leading-relaxed">
              Join thousands of traders who trust CryptoPulse for real-time market data, 
              advanced analytics, and personalized watchlists.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Real-time Data</h3>
                  <p className="text-sm text-gray-500">Live price updates from CoinGecko API</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Custom Watchlists</h3>
                  <p className="text-sm text-gray-500">Save and track your favorite coins</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Secure & Private</h3>
                  <p className="text-sm text-gray-500">Your data is encrypted and protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
