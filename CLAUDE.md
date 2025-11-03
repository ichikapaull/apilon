# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

Apilon is a Next.js 16 application building an API documentation management platform. The primary goal is to convert visitors into trial users through a high-converting landing page that clearly demonstrates the value of faster API documentation creation, management, and publishing.

**Business Context**: The detailed PRD (prd.md) defines target conversion rates (8-12% primary CTA), user personas (developers, team leads, PMs, DevRel, security reviewers), and specific success metrics. Read the PRD for feature requirements and user stories before implementing major components.

**Current Status**: Foundation is complete (Next.js 16, TypeScript, Tailwind v4). The landing page implementation per PRD specifications is the primary development focus.

## Development Commands

```bash
# Development
npm run dev          # Start development server on localhost:3000
npm run lint         # Run ESLint with Next.js rules

# Production
npm run build        # Create optimized production build
npm run start        # Start production server
```

### Testing & Quality
- ESLint configuration: Core Web Vitals + TypeScript rules (`eslint.config.mjs`)
- Linting focuses on accessibility, performance, and security standards
- No test framework currently configured (consider adding for future development)

## Architecture

### Tech Stack
- **Next.js 16** with App Router (not Pages Router) and Turbopack
- **React 19** with TypeScript (strict mode enabled)
- **Tailwind CSS v4** with CSS custom properties for theming
- **Geist fonts** (Sans + Mono) with CSS variables
- **UI Components**: Radix UI primitives with custom component system
- **Analytics**: Custom analytics hook system for conversion tracking
- **Animation**: Framer Motion for interactive elements

### Key Architectural Patterns

**Path Aliases**: Use `@/*` for imports from project root (configured in tsconfig.json)

**Styling System**:
- CSS custom properties defined in `app/globals.css` for theme variables
- Tailwind utilities reference these custom properties
- Dark mode support via `prefers-color-scheme`
- Font variables: `--font-geist-sans`, `--font-geist-mono`

**Component Structure**:
- `app/layout.tsx`: Root layout with comprehensive SEO metadata, analytics integration
- `app/page.tsx`: Complete landing page implementation with PRD features
- `components/analytics.tsx`: Custom analytics hook for conversion tracking
- `components/ui/`: Reusable UI components (Button, BackgroundPaths, etc.)
- All components should use TypeScript interfaces for props

**Analytics Integration**:
- Event tracking for CTA clicks, scroll depth, form interactions
- A/B testing framework with session-based variant assignment
- Conversion funnel tracking for trial/demo signups
- All events include location context and user journey data

### Performance Requirements
From PRD: LCP <2.0s, CLS <0.1, TTI <2.5s on mobile. Use Next.js Image component for all images, implement proper font loading, and optimize bundle size.

## Current Implementation Status

**✅ Completed Milestones**:
- **Hero Section** with BackgroundPaths component and A/B testing
- **Product Highlights** with 4 value pillars and architecture diagram
- **Social Proof** with customer logos and testimonials
- **Interactive Demo** with code examples and language switching
- **Conversion Section** with floating CTAs and analytics tracking
- **Analytics Framework** with comprehensive event tracking

**📋 Implementation Priorities** (for future development):
Based on PRD requirements, remaining P0 items:

1. **Functional Forms** (P0): Trial signup and demo booking with backend integration
2. **Pricing Teaser** (P1): Starting price display with "See Pricing" CTA
3. **Status Integration** (P1): Live status page and uptime badges
4. **Enhanced A/B Testing** (P1): Server-side variant assignment and statistical analysis
5. **Accessibility Enhancements** (P0): WCAG 2.1 AA compliance validation and reduced-motion support

## Important Notes

- **SEO**: Comprehensive metadata already configured in `app/layout.tsx` with OpenGraph, Twitter cards, and structured data
- **Analytics**: Full event tracking implemented for CTA clicks, scroll depth, form interactions, and A/B testing
- **Accessibility**: Skip-to-content links, semantic HTML, and focus management implemented. WCAG 2.1 AA validation needed
- **Mobile-First**: Responsive design implemented with mobile-first approach using Tailwind breakpoints
- **Performance**: Image optimization configured, custom fonts loaded efficiently, critical CSS inlined
- **A/B Testing**: Client-side variant assignment with session persistence and conversion tracking

## Development Patterns

**Component Organization**:
- `components/ui/`: Reusable UI primitives (Button, BackgroundPaths)
- `components/analytics.tsx`: Analytics hook and tracking utilities
- UI components use class-variance-authority and tailwind-merge for consistent styling
- Framer Motion for animations with reduced-motion support

**State Management**:
- React hooks for local state (scroll tracking, active sections)
- Session storage for A/B test variants persistence
- Custom analytics hook for centralized event tracking

**Styling System**:
- Tailwind CSS v4 with custom theme variables via CSS custom properties
- Component variants using class-variance-authority pattern
- Dark mode support via `prefers-color-scheme`
- Gradient backgrounds and modern glass-morphism effects

## File Structure Understanding

```
app/                    # Next.js App Router (all React components here)
├── layout.tsx         # Root layout with SEO metadata and analytics
├── page.tsx           # Complete landing page implementation
└── globals.css        # Global styles with theme variables

components/
├── analytics.tsx      # Analytics hook and event tracking
├── ui/               # Reusable UI components
│   ├── button.tsx    # Custom button component with variants
│   └── background-paths.tsx # Hero section animated background
└── demo-background-paths.tsx # Demo background component

public/                # Static assets (SVGs, images)
├── og-image.png      # OpenGraph preview image
├── favicon.ico       # Favicon
└── apple-touch-icon.png # iOS icon

prd.md                 # Complete product requirements - read before implementing
next.config.ts         # Next.js configuration with image optimization
eslint.config.mjs      # ESLint configuration for quality standards
tsconfig.json          # TypeScript configuration with path aliases
```