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

## Architecture

### Tech Stack
- **Next.js 16** with App Router (not Pages Router)
- **React 19** with TypeScript (strict mode enabled)
- **Tailwind CSS v4** with CSS custom properties for theming
- **Geist fonts** (Sans + Mono) with CSS variables

### Key Architectural Patterns

**Path Aliases**: Use `@/*` for imports from project root (configured in tsconfig.json)

**Styling System**:
- CSS custom properties defined in `app/globals.css` for theme variables
- Tailwind utilities reference these custom properties
- Dark mode support via `prefers-color-scheme`
- Font variables: `--font-geist-sans`, `--font-geist-mono`

**Component Structure**:
- `app/layout.tsx`: Root layout with font configuration and metadata
- `app/page.tsx`: Main landing page (currently starter template, needs PRD implementation)
- All components should use TypeScript interfaces for props

### Performance Requirements
From PRD: LCP <2.0s, CLS <0.1, TTI <2.5s on mobile. Use Next.js Image component for all images, implement proper font loading, and optimize bundle size.

## Implementation Priorities

Based on PRD requirements, implement in this order:

1. **Hero Section** (P0): Value proposition, primary CTAs (Start Free Trial, Book Demo)
2. **Product Highlights** (P0): 3-4 value pillars with feature grid
3. **Social Proof** (P0): Customer logos, testimonials, trust badges
4. **Interactive Demo** (P1): Code snippets with language switching, quickstart content
5. **Conversion Forms** (P0): Trial signup, demo booking with analytics tracking

## Important Notes

- **SEO**: Update metadata in `app/layout.tsx` from generic Next.js defaults
- **Analytics**: Event tracking required for CTA clicks, scroll depth, form completions (PRD specifies detailed tracking plan)
- **Accessibility**: WCAG 2.1 AA compliance required with reduced-motion support
- **Mobile-First**: Responsive design with mobile-first approach using Tailwind breakpoints

## File Structure Understanding

```
app/                    # Next.js App Router (all React components here)
├── layout.tsx         # Root layout - update metadata for SEO
├── page.tsx           # Landing page - main implementation target
└── globals.css        # Global styles with theme variables

public/                # Static assets (SVGs, images)
prd.md                 # Complete product requirements - read before implementing
```