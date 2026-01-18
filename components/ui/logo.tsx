import Image from "next/image"

export function Logo({ className = "", size = "default" }: { className?: string; size?: "sm" | "default" | "lg" }) {
  const sizes = {
    sm: { width: 40, height: 30 },
    default: { width: 56, height: 42 },
    lg: { width: 80, height: 60 },
  }
  const s = sizes[size]

  return (
    <div className={`relative ${className}`} style={{ width: s.width, height: s.height }}>
      <Image
        src="/blokklens.svg"
        alt="Blokklens Logo"
        width={s.width}
        height={s.height}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  )
}

export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo />
      <div className="flex flex-col">
        <span className="text-xl font-bold text-foreground tracking-tight">BLOKK LENS</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest -mt-0.5">Real-time Tracking</span>
      </div>
    </div>
  )
}
