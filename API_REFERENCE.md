# Apilon API Reference & Component Documentation

## File Structure API

### Core Application Files

#### `app/layout.tsx` - Root Layout Component
```typescript
// Purpose: Root layout wrapper for entire application
// Exports: Default function wrapping children in HTML structure
// Dependencies: next/font/google, globals.css
// Features: Geist font configuration, dark mode support
```

#### `app/page.tsx` - Home Page Component
```typescript
// Purpose: Main landing page component
// Exports: Default function rendering home page
// Dependencies: next/image
// Features: Responsive design, centered layout, dark mode
```

#### `app/globals.css` - Global Styles
```css
/* Purpose: Global styles and theme configuration */
/* Features: Tailwind CSS v4, CSS custom properties, dark mode */
/* Variables: --background, --foreground, font families */
```

### Configuration Files

#### `next.config.ts` - Next.js Configuration
```typescript
// Purpose: Next.js framework configuration
// Current: Minimal setup, ready for customization
// Potential: SEO, performance, build optimizations
```

#### `tsconfig.json` - TypeScript Configuration
```typescript
// Purpose: TypeScript compiler configuration
// Features: Strict mode, path aliases, modern ES targets
// Paths: "@/*" mapped to project root
```

#### `eslint.config.mjs` - Code Quality
```javascript
// Purpose: ESLint configuration for code quality
// Features: Next.js recommended rules, TypeScript support
// Excludes: Build artifacts, dependencies
```

## Component API

### Layout Component Signature
```typescript
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>): JSX.Element
```

### Page Component Signature
```typescript
export default function Home(): JSX.Element
```

## Styling System

### CSS Custom Properties
```css
:root {
  --background: #ffffff;    /* Light mode background */
  --foreground: #171717;    /* Light mode text */
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;  /* Dark mode background */
    --foreground: #ededed;  /* Dark mode text */
  }
}
```

### Tailwind Theme Configuration
```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

## Development Utilities

### Available npm Scripts
```json
{
  "dev": "next dev",           // Development server
  "build": "next build",       // Production build
  "start": "next start",       // Production server
  "lint": "eslint"            // Code linting
}
```

### Font Configuration
```typescript
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

## Build System

### Next.js Build Process
1. **Development**: `npm run dev` - Hot reload with fast refresh
2. **Production**: `npm run build` - Optimized build with minification
3. **Start**: `npm run start` - Production server

### TypeScript Compilation
- **Target**: ES2017
- **Module**: ESNext with bundler resolution
- **Strict**: Enabled with all type checks
- **JSX**: React-jsx transform

## Static Assets

### Public Directory Structure
```
public/
├── file.svg     # File icon
├── globe.svg    # Globe icon
├── next.svg     # Next.js logo
├── vercel.svg   # Vercel logo
└── window.svg   # Window icon
```

### Image Usage
```typescript
import Image from "next/image";

// Example usage from current implementation
<Image
  className="dark:invert"
  src="/next.svg"
  alt="Next.js logo"
  width={100}
  height={20}
  priority
/>
```

## Environment Configuration

### Environment Variables
Currently no environment variables are configured. Expected additions:
```bash
# Analytics
NEXT_PUBLIC_ANALYTICS_ID=

# API Endpoints
API_BASE_URL=

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=
```

## Performance Configuration

### Current Performance Targets
- **LCP**: <2.0s (Large Contentful Paint)
- **CLS**: <0.1 (Cumulative Layout Shift)
- **TTI**: <2.5s (Time to Interactive)
- **Build Size**: <150KB gzipped JavaScript

### Optimization Ready Areas
- Image optimization with Next.js Image component
- Font loading strategies
- CSS critical path optimization
- Bundle splitting opportunities

---

*API Reference documentation generated from project structure analysis*