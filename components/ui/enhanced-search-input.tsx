"use client"

import { Search, X, Loader2 } from "lucide-react"
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
    sm: "h-9 text-sm pl-9 pr-9",
    md: "h-11 text-base pl-10 pr-10", 
    lg: "h-12 text-base pl-11 pr-11"
  }

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  }

  const iconPositions = {
    sm: "left-2.5",
    md: "left-3",
    lg: "left-3.5"
  }

  const clearPositions = {
    sm: "right-2.5",
    md: "right-3", 
    lg: "right-3.5"
  }

  return (
    <div className={cn("relative group", className)}>
      <div className={cn(
        "absolute top-1/2 -translate-y-1/2 text-muted-foreground transition-colors",
        "group-focus-within:text-foreground/70",
        iconPositions[size]
      )}>
        {isLoading ? (
          <Loader2 className={cn("animate-spin", iconSizes[size])} />
        ) : (
          <Search className={iconSizes[size]} />
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
          "rounded-full",
          "bg-background/50 backdrop-blur-sm",
          "border-border/50",
          "shadow-sm",
          "transition-all duration-200",
          "focus:bg-background",
          "focus:border-border",
          "focus:shadow-md",
          "hover:bg-background/70",
          "placeholder:text-muted-foreground/70",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      />
      
      {value && !disabled && (
        <button
          onClick={() => onChange("")}
          className={cn(
            "absolute top-1/2 -translate-y-1/2",
            "text-muted-foreground hover:text-foreground",
            "transition-colors duration-200",
            "focus:outline-none focus:text-foreground",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            clearPositions[size]
          )}
          disabled={isLoading}
          aria-label="Clear search"
        >
          <X className={iconSizes[size]} />
        </button>
      )}
    </div>
  )
}