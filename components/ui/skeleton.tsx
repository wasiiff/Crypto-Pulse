import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

function StatCardSkeleton() {
  return (
    <div className="glass-card-light border border-border rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <Skeleton className="w-16 h-6 rounded-md" />
      </div>
      <Skeleton className="w-24 h-4 mb-2" />
      <Skeleton className="w-20 h-8" />
    </div>
  )
}

function CoinCardSkeleton() {
  return (
    <div className="glass-card-light border border-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

function TableRowSkeleton() {
  return (
    <tr className="border-b border-border">
      <td className="py-4 px-4"><Skeleton className="h-4 w-6" /></td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-20 ml-auto" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-16 ml-auto" /></td>
      <td className="py-4 px-4 hidden md:table-cell"><Skeleton className="h-4 w-20 ml-auto" /></td>
      <td className="py-4 px-4 hidden lg:table-cell"><Skeleton className="h-4 w-20 ml-auto" /></td>
    </tr>
  )
}

function TrendingItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl">
      <Skeleton className="w-6 h-6 rounded-lg" />
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-20 mb-1" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  )
}

function CoinDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back button skeleton */}
      <Skeleton className="h-10 w-40 rounded-lg mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - left side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main info card */}
          <div className="glass-card-light border border-border rounded-xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>

            <div className="space-y-6">
              {/* Price section */}
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-6 w-28" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-28" />
                </div>
              </div>
            </div>
          </div>

          {/* Description card */}
          <div className="glass-card-light border border-border rounded-xl p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        {/* Sidebar - right side */}
        <div className="space-y-6">
          {/* Links card */}
          <div className="glass-card-light border border-border rounded-xl p-6">
            <Skeleton className="h-6 w-20 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>

          {/* Market stats card */}
          <div className="glass-card-light border border-border rounded-xl p-6">
            <Skeleton className="h-6 w-28 mb-4" />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Skeleton, StatCardSkeleton, CoinCardSkeleton, TableRowSkeleton, TrendingItemSkeleton, CoinDetailSkeleton }
