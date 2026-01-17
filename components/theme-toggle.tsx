"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [showDropdown, setShowDropdown] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDropdown])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-10 w-10 px-0 rounded-xl backdrop-blur-md bg-background/40 border border-border/20"
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const getIcon = () => {
    if (theme === "dark") {
      return <Moon className="h-[1.2rem] w-[1.2rem] text-muted-foreground group-hover:text-foreground transition-colors" />
    } else if (theme === "light") {
      return <Sun className="h-[1.2rem] w-[1.2rem] text-muted-foreground group-hover:text-foreground transition-colors" />
    } else {
      return <Monitor className="h-[1.2rem] w-[1.2rem] text-muted-foreground group-hover:text-foreground transition-colors" />
    }
  }

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        className="h-10 w-10 px-0 rounded-xl backdrop-blur-md bg-background/40 border border-border/20 hover:bg-background/60 hover:border-border/30 transition-all duration-300 group hover:scale-105"
        title={`Current theme: ${theme}`}
      >
        {getIcon()}
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-40 transition-all duration-300 ease-out z-50">
          <div className="p-2 rounded-xl backdrop-blur-2xl bg-background/98 border border-border/60 shadow-xl ring-1 ring-black/5">
            <div className="space-y-1">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon
                const isActive = theme === themeOption.value
                return (
                  <button
                    key={themeOption.value}
                    onClick={() => {
                      setTheme(themeOption.value as "light" | "dark" | "system")
                      setShowDropdown(false)
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{themeOption.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
