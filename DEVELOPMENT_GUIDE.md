# Development Quick-Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn package manager
- Git for version control

### Setup Steps

1. **Clone and Install**
```bash
git clone <repository-url>
cd apilon
npm install
```

2. **Start Development**
```bash
npm run dev
```

3. **Open Browser**
Navigate to http://localhost:3000

## 🏗 Development Workflow

### Daily Development
```bash
# Start development server
npm run dev

# Check code quality
npm run lint

# Test production build
npm run build
npm run start
```

### File Structure for Development

```
Working Areas:
├── app/page.tsx           # Main landing page - PRIMARY FOCUS
├── app/layout.tsx         # Root layout - metadata and fonts
├── app/globals.css        # Global styles and themes
└── public/               # Static assets (logos, images)
```

### Code Standards

#### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/*` → `./*`
- Modern ES2017+ targets

#### ESLint Rules
- Next.js recommended configuration
- TypeScript specific rules
- Core Web Vitals monitoring

#### Styling Approach
- Tailwind CSS v4 utility classes
- CSS custom properties for theming
- Mobile-first responsive design
- Dark mode support built-in

## 🎯 Implementation Priority

### Phase 1: Core Landing Page (Current)
1. **Update Page Metadata** - SEO titles, descriptions, OpenGraph
2. **Hero Section** - Value proposition, primary CTAs
3. **Product Highlights** - Feature cards and benefits
4. **Trust Signals** - Customer logos, testimonials

### Phase 2: Interactive Elements
1. **Code Snippets** - Language-switchable examples
2. **Demo Integration** - Interactive product preview
3. **Lead Capture** - Trial signup and demo booking
4. **Social Proof** - Extended testimonials and metrics

### Phase 3: Optimization
1. **Performance** - Core Web Vitals optimization
2. **SEO Enhancement** - Structured data, schema markup
3. **Analytics** - Event tracking and conversion metrics
4. **A/B Testing** - Conversion optimization framework

## 🛠 Component Development

### Current Component Structure

#### Root Layout (`app/layout.tsx`)
```typescript
// TODO: Update metadata for SEO
export const metadata: Metadata = {
  title: "Apilon - API Documentation Management",
  description: "Create, manage, and publish world-class API documentation faster.",
};
```

#### Home Page (`app/page.tsx`)
```typescript
// TODO: Replace with comprehensive landing page
// Current: Next.js starter template
// Target: Full landing page per PRD specifications
```

### Development Tips

1. **Use TypeScript interfaces** for all props
2. **Follow React best practices** with functional components
3. **Implement responsive design** from mobile-first approach
4. **Add accessibility attributes** for WCAG 2.1 AA compliance
5. **Optimize images** using Next.js Image component

## 🎨 Styling Guidelines

### CSS Custom Properties
```css
/* Available in globals.css */
--background: #ffffff / #0a0a0a  /* Light/dark backgrounds */
--foreground: #171717 / #ededed  /* Light/dark text */
--font-geist-sans: /* Main font family */
--font-geist-mono: /* Code font family */
```

### Tailwind CSS Usage
- Use utility classes for rapid development
- Leverage responsive prefixes (sm:, md:, lg:, xl:)
- Implement dark mode variants (dark:)
- Follow consistent spacing and color scales

### Theme Development
- Modify CSS custom properties for brand colors
- Update font families in layout.tsx
- Add custom animations and transitions
- Ensure accessibility contrast ratios

## 📊 Performance Optimization

### Current Performance Targets
- **LCP**: <2.0s (Large Contentful Paint)
- **CLS**: <0.1 (Cumulative Layout Shift)
- **TTI**: <2.5s (Time to Interactive)
- **Bundle Size**: <150KB gzipped

### Optimization Techniques
1. **Image Optimization**
   ```typescript
   import Image from "next/image";
   // Use priority for above-the-fold images
   // Implement proper width/height for layout stability
   ```

2. **Font Loading**
   ```typescript
   // Geist fonts configured in layout.tsx
   // Consider font-display: swap for better loading
   ```

3. **CSS Optimization**
   ```css
   /* Critical CSS inlined by Next.js */
   /* Non-critical CSS loaded asynchronously */
   ```

## 🔍 Testing Strategy

### Development Testing
1. **Visual Testing** - Check all viewport sizes
2. **Functionality Testing** - Verify all interactive elements
3. **Performance Testing** - Use Lighthouse in DevTools
4. **Accessibility Testing** - Use axe DevTools extension

### Pre-Deployment Checklist
- [ ] Build completes without errors
- [ ] All pages load correctly in production
- [ ] Images are optimized and loading properly
- [ ] Links are functional and accessible
- [ ] Forms work as expected
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] Dark mode transitions work smoothly
- [ ] Performance targets met (Lighthouse score >90)

## 🚀 Deployment

### Build Process
```bash
# Create production build
npm run build

# Test production server locally
npm run start

# Deploy to Vercel (recommended)
vercel --prod
```

### Environment Variables
Create `.env.local` for local development:
```bash
# Analytics
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_HOTJAR_ID=

# API Endpoints
API_BASE_URL=https://api.apilon.com

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## 🐛 Common Issues & Solutions

### Development Issues
1. **Port 3000 in use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Module resolution errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run dev
   ```

3. **Tailwind CSS not updating**
   ```bash
   # Rebuild Tailwind
   npm run build
   npm run dev
   ```

### Performance Issues
1. **Large bundle size** - Check bundle analyzer
2. **Slow images** - Optimize with Next.js Image
3. **Font loading issues** - Verify font configuration

## 📚 Learning Resources

### Next.js Documentation
- [App Router](https://nextjs.org/docs/app)
- [Layouts and Pages](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [Metadata and SEO](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

### Tailwind CSS Resources
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Dark Mode](https://tailwindcss.com/docs/dark-mode)

### TypeScript Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React with TypeScript](https://react-typescript-cheatsheet.netlify.app/)

---

*Happy coding! 🚀*