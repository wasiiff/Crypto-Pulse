"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  showInfo?: boolean
}

export function Pagination({ currentPage, totalPages, onPageChange, isLoading, showInfo = true }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5 // Number of page buttons to show

    if (totalPages <= showPages) {
      // Show all pages if total is less than showPages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push("...")
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push("...")
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="default"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="h-10 px-4 rounded-lg border-2 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span className="font-medium">Previous</span>
        </Button>

        <div className="flex items-center gap-1.5 px-2">
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground font-medium">
                  •••
                </span>
              )
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="default"
                onClick={() => onPageChange(page as number)}
                disabled={isLoading}
                className={
                  currentPage === page
                    ? "h-10 w-10 p-0 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 border-0 transition-all duration-200 scale-105"
                    : "h-10 w-10 p-0 rounded-lg border-2 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 hover:scale-105 transition-all duration-200 font-medium shadow-sm"
                }
              >
                {page}
              </Button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="default"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="h-10 px-4 rounded-lg border-2 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span className="font-medium">Next</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {showInfo && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 backdrop-blur-sm border border-border/30">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-sm font-medium text-muted-foreground">
            Page <span className="text-foreground font-semibold">{currentPage}</span> of <span className="text-foreground font-semibold">{totalPages}</span>
          </p>
        </div>
      )}
    </div>
  )
}
