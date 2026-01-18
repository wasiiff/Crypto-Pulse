interface BackgroundGridProps {
  className?: string
  opacity?: number
}

export function BackgroundGrid({ className = "", opacity = 0.2 }: BackgroundGridProps) {
  return (
    <div className={`absolute inset-0 ${className}`} style={{ opacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="background-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#background-grid)" />
      </svg>
    </div>
  )
}

interface LeftPatternProps {
  className?: string
}

export function LeftDecorativePattern({ className = "" }: LeftPatternProps) {
  return (
    <div className={`hidden lg:block absolute left-0 top-0 w-[50px] h-full bg-gradient-to-b from-foreground/5 via-foreground/8 to-foreground/5 border-r border-foreground/20 ${className}`} style={{ zIndex: 1 }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="left-pattern" width="50" height="100" patternUnits="userSpaceOnUse">
            {/* Decorative dots - vertical alignment */}
            <circle cx="25" cy="8" r="2" fill="hsl(var(--primary))" opacity="0.8" />
            <circle cx="25" cy="20" r="1.5" fill="hsl(var(--foreground))" opacity="0.5" />
            <circle cx="25" cy="32" r="2" fill="hsl(var(--primary))" opacity="0.8" />
            
            {/* Horizontal lines with dots */}
            <line x1="10" y1="45" x2="40" y2="45" stroke="hsl(var(--foreground))" strokeWidth="1.5" opacity="0.6" />
            <circle cx="10" cy="45" r="2" fill="hsl(var(--foreground))" opacity="0.7" />
            <circle cx="40" cy="45" r="2" fill="hsl(var(--foreground))" opacity="0.7" />
            
            {/* Diagonal cross pattern */}
            <line x1="15" y1="55" x2="35" y2="65" stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.5" />
            <line x1="35" y1="55" x2="15" y2="65" stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.5" />
            <circle cx="25" cy="60" r="1.5" fill="hsl(var(--primary))" opacity="0.8" />
            
            {/* Bracket-like shapes */}
            <path d="M 12,75 L 12,85 L 18,85" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
            <path d="M 38,75 L 38,85 L 32,85" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
            
            {/* Small accent dots */}
            <circle cx="20" cy="92" r="1" fill="hsl(var(--foreground))" opacity="0.4" />
            <circle cx="30" cy="92" r="1" fill="hsl(var(--foreground))" opacity="0.4" />
            
            {/* Vertical dashed centerline */}
            <line x1="25" y1="0" x2="25" y2="100" stroke="hsl(var(--foreground))" strokeWidth="0.5" strokeDasharray="3,5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#left-pattern)" />
      </svg>
    </div>
  )
}

interface RightPatternProps {
  className?: string
}

export function RightDecorativePattern({ className = "" }: RightPatternProps) {
  return (
    <div className={`hidden lg:block absolute right-0 top-0 w-[50px] h-full bg-gradient-to-b from-foreground/5 via-foreground/8 to-foreground/5 border-l border-foreground/20 ${className}`} style={{ zIndex: 1 }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="right-pattern" width="50" height="100" patternUnits="userSpaceOnUse">
            {/* Decorative dots - vertical alignment */}
            <circle cx="25" cy="8" r="2" fill="hsl(var(--primary))" opacity="0.8" />
            <circle cx="25" cy="20" r="1.5" fill="hsl(var(--foreground))" opacity="0.5" />
            <circle cx="25" cy="32" r="2" fill="hsl(var(--primary))" opacity="0.8" />
            
            {/* Horizontal lines with dots */}
            <line x1="10" y1="45" x2="40" y2="45" stroke="hsl(var(--foreground))" strokeWidth="1.5" opacity="0.6" />
            <circle cx="10" cy="45" r="2" fill="hsl(var(--foreground))" opacity="0.7" />
            <circle cx="40" cy="45" r="2" fill="hsl(var(--foreground))" opacity="0.7" />
            
            {/* Diagonal cross pattern */}
            <line x1="15" y1="55" x2="35" y2="65" stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.5" />
            <line x1="35" y1="55" x2="15" y2="65" stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.5" />
            <circle cx="25" cy="60" r="1.5" fill="hsl(var(--primary))" opacity="0.8" />
            
            {/* Bracket-like shapes */}
            <path d="M 12,75 L 12,85 L 18,85" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
            <path d="M 38,75 L 38,85 L 32,85" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
            
            {/* Small accent dots */}
            <circle cx="20" cy="92" r="1" fill="hsl(var(--foreground))" opacity="0.4" />
            <circle cx="30" cy="92" r="1" fill="hsl(var(--foreground))" opacity="0.4" />
            
            {/* Vertical dashed centerline */}
            <line x1="25" y1="0" x2="25" y2="100" stroke="hsl(var(--foreground))" strokeWidth="0.5" strokeDasharray="3,5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#right-pattern)" />
      </svg>
    </div>
  )
}

interface VerticalBorderLinesProps {
  className?: string
}

export function VerticalBorderLines({ className = "" }: VerticalBorderLinesProps) {
  return (
    <>
      {/* Left vertical line with decorative elements */}
      <div className={`w-px h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-border z-0 ${className}`}>
        {/* Horizontal lines extending from left border */}
        <div className="absolute top-32 left-0 w-8 h-px bg-border opacity-60"></div>
        <div className="absolute top-48 left-0 w-12 h-px bg-border opacity-50"></div>
        <div className="absolute top-64 left-0 w-6 h-px bg-primary opacity-70"></div>
        <div className="absolute top-80 left-0 w-10 h-px bg-border opacity-60"></div>
        <div className="absolute top-96 left-0 w-8 h-px bg-border opacity-50"></div>
        <div className="absolute top-112 left-0 w-12 h-px bg-primary opacity-60"></div>
        <div className="absolute top-128 left-0 w-6 h-px bg-border opacity-50"></div>
        <div className="absolute top-144 left-0 w-10 h-px bg-border opacity-60"></div>
        <div className="absolute top-160 left-0 w-8 h-px bg-primary opacity-70"></div>
      </div>

      {/* Right vertical line with decorative elements */}
      <div className={`w-px h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-border z-0 ${className}`}>
        {/* Horizontal lines extending from right border */}
        <div className="absolute top-32 right-0 w-8 h-px bg-border opacity-60"></div>
        <div className="absolute top-48 right-0 w-12 h-px bg-border opacity-50"></div>
        <div className="absolute top-64 right-0 w-6 h-px bg-primary opacity-70"></div>
        <div className="absolute top-80 right-0 w-10 h-px bg-border opacity-60"></div>
        <div className="absolute top-96 right-0 w-8 h-px bg-border opacity-50"></div>
        <div className="absolute top-112 right-0 w-12 h-px bg-primary opacity-60"></div>
        <div className="absolute top-128 right-0 w-6 h-px bg-border opacity-50"></div>
        <div className="absolute top-144 right-0 w-10 h-px bg-border opacity-60"></div>
        <div className="absolute top-160 right-0 w-8 h-px bg-primary opacity-70"></div>
      </div>
    </>
  )
}