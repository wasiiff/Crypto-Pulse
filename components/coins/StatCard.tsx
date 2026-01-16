import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change?: string
  icon: LucideIcon
  trend?: "up" | "down"
}

export default function StatCard({ title, value, change, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="glass-effect">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {change && (
              <p
                className={`text-sm mt-1 ${
                  trend === "up" ? "text-green-400" : "text-red-400"
                }`}
              >
                {change}
              </p>
            )}
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10">
            <Icon className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
