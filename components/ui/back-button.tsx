"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "./button"

interface BackButtonProps {
  label?: string
  className?: string
}

export function BackButton({ label = "Back", className = "" }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <Button
      variant="outline"
      size="default"
      onClick={handleBack}
      className={`h-10 px-4 rounded-lg border-2 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md group ${className}`}
    >
      <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
      <span className="font-medium">{label}</span>
    </Button>
  )
}
