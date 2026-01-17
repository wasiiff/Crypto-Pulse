import React from "react"
import LoginForm from "@/components/auth/LoginForm"
import Link from "next/link"
import { TrendingUp, Shield, Star } from "lucide-react"

export const metadata = {
  title: "Sign in — CryptoPulse",
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background geometric pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="auth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
      </div>

      <div className="relative z-10 min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20">
          <div className="max-w-lg">
            <Link href="/" className="inline-flex items-center gap-3 mb-12 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">CryptoPulse</span>
            </Link>

            <h1 className="text-4xl xl:text-5xl font-bold text-foreground mb-6 leading-tight">
              Track your crypto
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">portfolio in real-time</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              Join thousands of traders who trust CryptoPulse for real-time market data, 
              advanced analytics, and personalized watchlists.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 ring-1 ring-blue-500/20">
                  <TrendingUp className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Real-time Data</h3>
                  <p className="text-sm text-muted-foreground">Live price updates from CoinGecko API</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 ring-1 ring-purple-500/20">
                  <Star className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Custom Watchlists</h3>
                  <p className="text-sm text-muted-foreground">Save and track your favorite coins</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center flex-shrink-0 ring-1 ring-pink-500/20">
                  <Shield className="w-6 h-6 text-pink-500 dark:text-pink-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Secure & Private</h3>
                  <p className="text-sm text-muted-foreground">Your data is encrypted and protected</p>
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
