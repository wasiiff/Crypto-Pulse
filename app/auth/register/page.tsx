import React from "react"
import SignupForm from "@/components/auth/SignupForm"
import Link from "next/link"
import { BarChart3, Bell, Globe, Sparkles } from "lucide-react"

export const metadata = {
  title: "Create account — CryptoPulse",
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
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <SignupForm />
        </div>

        {/* Right side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20">
          <div className="max-w-lg">
            <Link href="/" className="inline-flex items-center gap-3 mb-12 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255,255,255,0.2)"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-foreground">CryptoPulse</span>
            </Link>

            <h1 className="text-4xl xl:text-5xl font-bold text-foreground mb-6 leading-tight">
              Start your crypto
              <br />
              <span className="text-gradient">journey today</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              Create your free account and get instant access to real-time market data, 
              trending coins, and personalized watchlists.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-5 border border-border/30 hover:border-border/50 transition-all">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3 ring-1 ring-purple-500/20">
                  <BarChart3 className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">Market Analytics</h3>
                <p className="text-xs text-muted-foreground">Advanced charts & insights</p>
              </div>

              <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-5 border border-border/30 hover:border-border/50 transition-all">
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center mb-3 ring-1 ring-pink-500/20">
                  <Bell className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">Price Alerts</h3>
                <p className="text-xs text-muted-foreground">Never miss a move</p>
              </div>

              <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-5 border border-border/30 hover:border-border/50 transition-all">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-3 ring-1 ring-cyan-500/20">
                  <Globe className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">Global Coverage</h3>
                <p className="text-xs text-muted-foreground">10,000+ cryptocurrencies</p>
              </div>

              <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-5 border border-border/30 hover:border-border/50 transition-all">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3 ring-1 ring-amber-500/20">
                  <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">Free Forever</h3>
                <p className="text-xs text-muted-foreground">No credit card required</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
