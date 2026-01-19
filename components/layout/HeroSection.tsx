"use client"

import { motion } from "framer-motion"
import { Search, TrendingUp, Shield, Zap } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
}

export default function HeroSection() {
  const features = [
    {
      icon: TrendingUp,
      title: "Real-time Data",
      description: "Live market updates"
    },
    {
      icon: Shield,
      title: "Secure",
      description: "Bank-level security"
    },
    {
      icon: Zap,
      title: "Fast",
      description: "Lightning quick"
    }
  ]

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="pt-24 sm:pt-28 md:pt-32 lg:pt-32 pb-12 px-2 sm:px-4 md:px-8 lg:px-12"
    >
      <div className="w-full max-w-[937px] lg:w-[937px] mx-auto flex flex-col justify-center items-center gap-6 mb-12">
        {/* Badge */}
        <motion.div 
          variants={itemVariants} 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-md border border-border/30"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-muted-foreground">Live Market Data</span>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-[700px] text-center flex justify-center flex-col text-foreground text-[32px] xs:text-[36px] sm:text-[42px] md:text-[48px] lg:text-[56px] font-bold leading-[1.1] sm:leading-[1.15] md:leading-[1.2] px-2 sm:px-4 md:px-0 relative"
        >
          <span className="relative">
            Track Crypto Like Never Before
            <svg className="absolute -bottom-2 left-1/2 transform -translate-x-1/2" width="200" height="8" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,4 Q50,2 100,4 T200,4" stroke="hsl(var(--primary))" strokeWidth="1" fill="none" opacity="0.3" />
            </svg>
          </span>
        </motion.div>

        {/* Description */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-[650px] text-center flex justify-center flex-col text-muted-foreground sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-normal font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm"
        >
          Real-time cryptocurrency tracking with advanced analytics, personalized watchlists, and instant market insights. 
          Stay ahead of the market with our comprehensive crypto dashboard.
        </motion.div>

        {/* Feature Pills */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3 mt-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/40 backdrop-blur-md border border-border/20 hover:border-border/40 transition-all duration-300 hover:scale-105"
              >
                <Icon className="w-4 h-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground">{feature.title}</span>
                  <span className="text-[10px] text-muted-foreground">{feature.description}</span>
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* Horizontal separator */}
      <div className="w-full border-t border-dashed border-border/60"></div>
    </motion.section>
  )
}
