"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface StatCardProps {
  title: string
  value: string
  change?: string
  icon: LucideIcon
  trend?: "up" | "down"
}

export default function StatCard({ title, value, change, icon: Icon, trend }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      <Card className="bg-muted/50 backdrop-blur-sm border-border/30 hover:border-border/50 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{title}</p>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {change && (
                <p
                  className={`text-sm mt-1 font-medium ${
                    trend === "up" 
                      ? "text-green-600 dark:text-green-400" 
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {change}
                </p>
              )}
            </div>
            <div className="p-3 rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
