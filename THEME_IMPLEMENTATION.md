# Theme Implementation Guide

## Overview
CryptoPulse now has a complete light/dark theme system with local storage persistence, inspired by Shadway's design patterns.

## Features Implemented

### 1. Theme Provider (`components/theme-provider.tsx`)
- Context-based theme management
- Three theme modes: `light`, `dark`, `system`
- Local storage persistence with key: `cryptopulse-theme`
- Automatic system preference detection
- No flash of unstyled content (FOUC)

### 2. Theme Toggle (`components/theme-toggle.tsx`)
- Dropdown menu with three options:
  - ☀️ Light mode
  - 🌙 Dark mode
  - 🖥️ System (follows OS preference)
- Visual indicator for active theme
- Smooth transitions and animations
- Glassmorphism design matching Shadway aesthetic

### 3. Integration Points

#### Layout (`app/layout.tsx`)
```tsx
<html lang="en" suppressHydrationWarning>
  <head>
    {/* Inline script prevents FOUC */}
    <script dangerouslySetInnerHTML={{...}} />
  </head>
  <body>
    <Providers>{children}</Providers>
  </body>
</html>
```

#### Providers (`app/providers/providers.tsx`)
```tsx
<ThemeProvider defaultTheme="system" storageKey="cryptopulse-theme">
  {children}
</ThemeProvider>
```

#### Navbar (`components/layout/Navbar.tsx`)
- Theme toggle button in desktop navigation
- Theme toggle button in mobile navigation
- Positioned next to user actions

## Usage

### For Users
1. Click the theme toggle button (sun/moon/monitor icon)
2. Select preferred theme from dropdown:
   - **Light**: Always light mode
   - **Dark**: Always dark mode
   - **System**: Follows your OS preference
3. Theme preference is saved automatically

### For Developers

#### Using the Theme Hook
```tsx
import { useTheme } from "@/components/theme-provider"

function MyComponent() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme("dark")}>
      Current theme: {theme}
    </button>
  )
}
```

#### Theme-Aware Styling
Use CSS variables that automatically adapt:

```tsx
// ✅ Good - Uses theme variables
<div className="bg-background text-foreground">
  <p className="text-muted-foreground">Description</p>
</div>

// ❌ Bad - Hardcoded colors
<div className="bg-white text-black">
  <p className="text-gray-500">Description</p>
</div>
```

#### Available Theme Variables
- `background` - Main background color
- `foreground` - Main text color
- `muted` - Muted background
- `muted-foreground` - Muted text
- `primary` - Primary brand color
- `primary-foreground` - Text on primary
- `border` - Border color
- `accent` - Accent background
- `accent-foreground` - Accent text

#### Dark Mode Specific Styles
```tsx
// Use dark: prefix for dark mode only styles
<div className="bg-white dark:bg-black">
  <p className="text-gray-900 dark:text-gray-100">Text</p>
</div>
```

## Color System

### Light Mode
- Background: `oklch(1 0 0)` - Pure white
- Foreground: `oklch(0.145 0 0)` - Near black
- Muted: `oklch(0.97 0 0)` - Light gray
- Border: `oklch(0.922 0 0)` - Subtle border

### Dark Mode
- Background: `oklch(0.145 0 0)` - Near black
- Foreground: `oklch(0.985 0 0)` - Near white
- Muted: `oklch(0.269 0 0)` - Dark gray
- Border: `oklch(1 0 0 / 10%)` - Subtle border

## Testing

### Manual Testing Checklist
- [ ] Theme toggle appears in navbar (desktop & mobile)
- [ ] Clicking toggle shows dropdown menu
- [ ] All three theme options work correctly
- [ ] Theme persists after page reload
- [ ] No flash of wrong theme on page load
- [ ] System theme follows OS preference
- [ ] All pages respect theme (home, auth, favorites, coin details)
- [ ] Components use theme variables correctly
- [ ] Smooth transitions between themes

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

## Troubleshooting

### Theme not persisting
- Check browser local storage for `cryptopulse-theme` key
- Ensure cookies/storage are enabled
- Clear cache and try again

### Flash of wrong theme
- Verify inline script in `app/layout.tsx` is present
- Check `suppressHydrationWarning` on `<html>` tag

### Theme not applying to component
- Ensure component uses theme variables (e.g., `bg-background` not `bg-white`)
- Check if component is wrapped in ThemeProvider
- Verify Tailwind CSS is processing the classes

## Future Enhancements

Potential improvements:
- [ ] Add more theme presets (e.g., high contrast, colorblind-friendly)
- [ ] Theme customization panel (custom colors)
- [ ] Smooth theme transition animations
- [ ] Per-page theme preferences
- [ ] Theme-based chart colors
- [ ] Export/import theme settings

## Resources

- [Shadcn UI Theming](https://ui.shadcn.com/docs/theming)
- [Next.js Dark Mode](https://nextjs.org/docs/app/building-your-application/styling/css-in-js#dark-mode)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
