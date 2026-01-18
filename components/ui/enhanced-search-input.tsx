"use client"

import { Search, X, Loader2, Sparkles } from "lucide-react"
import { Input } from "./input"
import { cn } from "@/lib/utils"

interface EnhancedSearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  isLoading?: boolean
  disabled?: boolean
  size?: "sm" | "md" | "lg"
}

export default function EnhancedSearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  isLoading = false,
  disabled = false,
  size = "md",
}: EnhancedSearchInputProps) {
  const sizeClasses = {
    sm: "h-10 text-sm pl-10 pr-10",
    md: "h-12 text-base pl-12 pr-12", 
    lg: "h-14 text-lg pl-14 pr-14"
  }

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  }

  const iconPositions = {
    sm: "left-3",
    md: "left-4",
    lg: "left-4"
  }

  const clearPositions = {
    sm: "right-3",
    md: "right-4", 
    lg: "right-4"
  }

  return (
    <div className={cn("relative group", className)}>
      {/* Decorative glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-full opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-500" />
      
      <div className="relative">
        <div className={cn(
          "absolute top-1/2 -translate-y-1/2 z-10 transition-all duration-200",
          "text-muted-foreground",
          "group-focus-within:text-primary group-focus-within:scale-110",
          iconPositions[size]
        )}>
          {isLoading ? (
            <Loader2 className={cn("animate-spin", iconSizes[size])} />
          ) : (
            <Search className={cn(iconSizes[size], "drop-shadow-sm")} />
          )}
        </div>
        
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className={cn(
            sizeClasses[size],
            "rounded-full font-medium",
            "bg-background/60 backdrop-blur-md",
            "border-2 border-border/40",
            "transition-all duration-300",
            "focus:bg-background/80",
            "focus:border-white",
            "hover:bg-background/70 hover:border-border/60",
            "placeholder:text-muted-foreground/60 placeholder:font-normal",
            "focus:ring-0 focus:ring-offset-0",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
        
        {value && !disabled && (
          <button
            onClick={() => onChange("")}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-10",
              "p-1.5 rounded-full",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-muted/50",
              "transition-all duration-200",
              "focus:outline-none focus:text-foreground focus:bg-muted/50",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "hover:scale-110 active:scale-95",
              clearPositions[size]
            )}
            disabled={isLoading}
            aria-label="Clear search"
          >
            <X className={iconSizes[size]} />
          </button>
        )}

        {/* Sparkle decoration when focused */}
        {value && (
          <div className="absolute -top-1 -right-1 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
            <Sparkles className="w-3 h-3 text-primary animate-pulse" />
          </div>
        )}
      </div>
    </div>
  )
}