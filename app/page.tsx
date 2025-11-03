"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAnalytics } from "@/components/analytics";

export default function Home() {
  const { trackCTAClick, trackEvent, trackScrollDepth } = useAnalytics();

  const handleTrialClick = () => {
    trackCTAClick("trial", "hero");
    // TODO: Redirect to trial signup
    console.log("Trial signup clicked");
  };

  const handleDemoClick = () => {
    trackCTAClick("demo", "hero");
    // TODO: Open demo booking modal
    console.log("Demo booking clicked");
  };

  const handleDocsClick = () => {
    trackCTAClick("docs", "hero");
    // TODO: Redirect to documentation
    console.log("Documentation clicked");
  };

  const handleFeatureClick = (feature: string) => {
    trackEvent({
      action: "click",
      category: "feature",
      label: feature,
    });
  };

  const handleTestimonialClick = (company: string) => {
    trackEvent({
      action: "click",
      category: "testimonial",
      label: company,
    });
  };

  const handleLogoClick = (company: string) => {
    trackEvent({
      action: "click",
      category: "logo",
      label: company,
    });
  };

  // Scroll progress tracking
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  // A/B Testing Configuration
  const [abTestVariants, setAbTestVariants] = useState({
    heroHeadline: 'A', // A: "Publish World-Class API Docs", B: "Generate Beautiful API Documentation"
    ctaColor: 'blue', // blue, green, purple
    featureOrder: 'original', // original, reversed
    socialProofPosition: 'before' // before, after demo
  });

  useEffect(() => {
    // Simple A/B test assignment based on user session
    const assignVariant = () => {
      const sessionId = sessionStorage.getItem('ab_test_session') || Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('ab_test_session', sessionId);

      // Use session hash for consistent variant assignment
      const hash = sessionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

      setAbTestVariants({
        heroHeadline: hash % 2 === 0 ? 'A' : 'B',
        ctaColor: ['blue', 'green', 'purple'][hash % 3],
        featureOrder: hash % 2 === 0 ? 'original' : 'reversed',
        socialProofPosition: hash % 2 === 0 ? 'before' : 'after'
      });

      // Track A/B test assignment
      trackEvent({
        action: 'assigned',
        category: 'ab_test',
        label: `session_${sessionId}`,
      });
    };

    assignVariant();
  }, []);

  // A/B Test tracking functions
  const trackABTestConversion = (type: 'trial' | 'demo' | 'docs', variant: string, element: string) => {
    trackEvent({
      action: 'conversion',
      category: 'ab_test',
      label: `${type}_${variant}_${element}`,
    });
  };

  const getCTAColor = () => {
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      green: 'bg-green-600 hover:bg-green-700',
      purple: 'bg-purple-600 hover:bg-purple-700'
    };
    return colors[abTestVariants.ctaColor as keyof typeof colors];
  };

  const getHeroHeadline = () => {
    const headlines = {
      A: "Publish World-Class API Docs In Days, Not Weeks",
      B: "Generate Beautiful API Documentation 80% Faster"
    };
    return headlines[abTestVariants.heroHeadline as keyof typeof headlines];
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));

      // Track scroll depth
      if (progress > 25 && progress < 26) {
        trackScrollDepth(25);
      } else if (progress > 50 && progress < 51) {
        trackScrollDepth(50);
      } else if (progress > 75 && progress < 76) {
        trackScrollDepth(75);
      } else if (progress > 90 && progress < 91) {
        trackScrollDepth(100);
      }

      // Update active section based on scroll position
      const sections = ['hero', 'product', 'social-proof', 'interactive-demo', 'conversion'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      }) || 'hero';

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Progress Navigation */}
      <div className="fixed top-4 left-4 z-40 hidden lg:block">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">Progress</div>
          <div className="space-y-2">
            {[
              { id: 'hero', label: 'Home', icon: '🏠' },
              { id: 'product', label: 'Features', icon: '⚡' },
              { id: 'social-proof', label: 'Trust', icon: '🛡️' },
              { id: 'interactive-demo', label: 'Demo', icon: '🎮' },
              { id: 'conversion', label: 'Start', icon: '🚀' },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                  trackEvent({
                    action: 'click',
                    category: 'navigation',
                    label: `progress_nav_${section.id}`,
                  });
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center gap-2 ${
                  activeSection === section.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-base">{section.icon}</span>
                <span>{section.label}</span>
                {activeSection === section.id && (
                  <svg className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skip to content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Skip to main content
      </a>

      {/* Header/Navigation - Placeholder for Milestone 2 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 dark:bg-black/80 dark:border-gray-800">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Apilon</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#product" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">Product</a>
                <a href="#features" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">Features</a>
                <a href="#security" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">Security</a>
                <a href="#pricing" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
                <a href="#docs" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">Docs</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => trackCTAClick("signin", "header")}
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={handleTrialClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - Milestone 2 Implementation */}
        <section className="relative overflow-hidden py-20 sm:py-32">
          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10"></div>
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239CA3AF' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3Ccircle cx='53' cy='7' r='7'/%3E%3Ccircle cx='30' cy='30' r='7'/%3E%3Ccircle cx='7' cy='53' r='7'/%3E%3Ccircle cx='53' cy='53' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }}></div>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Trust Badges - Above Fold */}
              <div className="flex justify-center items-center gap-6 mb-8 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Trusted by 1,000+ teams</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>SOC 2 Type II Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>5x faster documentation</span>
                </div>
              </div>

              {/* Main Headline */}
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                data-ab-test="headline"
                data-variant={abTestVariants.heroHeadline}
              >
                {abTestVariants.heroHeadline === 'A' ? (
                  <>
                    Publish World-Class API Docs
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 block">
                      In Days, Not Weeks
                    </span>
                  </>
                ) : (
                  <>
                    Generate Beautiful API Documentation
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 block">
                      80% Faster
                    </span>
                  </>
                )}
              </h1>

              {/* Value Proposition */}
              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed font-light">
                Convert OpenAPI specs into beautiful, searchable documentation.
                <span className="block mt-2 text-blue-600 dark:text-blue-400 font-medium">
                  80% faster than traditional methods.
                </span>
              </p>

              {/* Social Proof - Quick */}
              <div className="flex justify-center items-center gap-8 mb-12 text-gray-600 dark:text-gray-400">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">1M+</div>
                  <div className="text-sm">API Endpoints</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">10K+</div>
                  <div className="text-sm">Developers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</div>
                  <div className="text-sm">Uptime</div>
                </div>
              </div>

              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <button
                  onClick={() => {
                    handleTrialClick();
                    trackABTestConversion('trial', abTestVariants.ctaColor, 'hero_primary');
                  }}
                  className={`group relative ${getCTAColor()} text-white px-8 py-4 rounded-xl text-lg font-semibold min-w-[240px] transition-all duration-200 transform hover:scale-105 hover:shadow-xl`}
                  data-ab-test="cta_color"
                  data-variant={abTestVariants.ctaColor}
                >
                  <span className="relative z-10">Start Free Trial</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative z-10">No credit card required</span>
                </button>

                <button
                  onClick={handleDemoClick}
                  className="group border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 px-8 py-4 rounded-xl text-lg font-semibold min-w-[240px] transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Book a Demo
                  </span>
                </button>
              </div>

              {/* Secondary CTA */}
              <div className="text-center">
                <button
                  onClick={handleDocsClick}
                  className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  <span>Or view our documentation</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Visual Element - Placeholder for Product Preview */}
            <div className="mt-16 relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
                <div className="text-center text-gray-500 dark:text-gray-400 italic">
                  [Product preview/animation coming in next iteration]
                </div>
                <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">API Documentation</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">v2.1.0</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                    Last updated: 2 hours ago • Generated from OpenAPI 3.0
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 bg-blue-100 dark:bg-blue-900 rounded-lg p-3 shadow-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="absolute -top-2 -right-4 bg-green-100 dark:bg-green-900 rounded-lg p-3 shadow-lg">
                <span className="text-2xl">🚀</span>
              </div>
              <div className="absolute -bottom-4 -left-8 bg-purple-100 dark:bg-purple-900 rounded-lg p-3 shadow-lg">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="animate-bounce">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </section>

        {/* Product Highlights - Milestone 3 Implementation */}
        <section id="product" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Product Capabilities
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Everything You Need for
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 block">
                  Exceptional API Documentation
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                From OpenAPI specs to beautiful, searchable documentation in minutes.
                <span className="block mt-2 text-blue-600 dark:text-blue-400 font-medium">
                  Trusted by 10,000+ developers worldwide.
                </span>
              </p>
            </div>

            {/* Value Pillars */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {/* Generate Pillar */}
              <div
                onClick={() => handleFeatureClick("generate")}
                className="group bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Generate</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Automatic documentation generation from OpenAPI specs, code comments, and Postman collections.
                </p>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    OpenAPI 3.0/3.1 support
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Code comment parsing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Multi-language SDKs
                  </li>
                </ul>
              </div>

              {/* Publish Pillar */}
              <div
                onClick={() => handleFeatureClick("publish")}
                className="group bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Publish</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Beautiful, responsive documentation sites with custom branding and instant deployment.
                </p>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Custom domains & SSL
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Brand customization
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    CDN global distribution
                  </li>
                </ul>
              </div>

              {/* Version Pillar */}
              <div
                onClick={() => handleFeatureClick("version")}
                className="group bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Version</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Automatic versioning and changelog generation with every release and Git integration.
                </p>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    Semantic versioning
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    Auto changelog generation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    Git repository sync
                  </li>
                </ul>
              </div>

              {/* Collaborate Pillar */}
              <div
                onClick={() => handleFeatureClick("collaborate")}
                className="group bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Collaborate</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Real-time collaboration with review workflows, team permissions, and comments.
                </p>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                    Role-based permissions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                    Review workflows
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                    Real-time comments
                  </li>
                </ul>
              </div>
            </div>

            {/* Architecture Diagram */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  How It Works
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  From specification to published documentation in minutes
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl">
                <div className="grid md:grid-cols-5 gap-8 items-center">
                  {/* Step 1 */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">OpenAPI Spec</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Import your API specification</p>
                  </div>

                  {/* Arrow 1 */}
                  <div className="hidden md:flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>

                  {/* Step 2 */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Auto-Generate</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered content creation</p>
                  </div>

                  {/* Arrow 2 */}
                  <div className="hidden md:flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>

                  {/* Step 3 */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Publish</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Deploy to your custom domain</p>
                  </div>
                </div>

                {/* Time Indicator */}
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Complete in under 5 minutes
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Grid */}
            <div>
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Powerful Features
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Everything you need to create world-class API documentation
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Interactive Code Examples */}
                <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{'</>'}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Interactive Code Examples</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Language-switchable code snippets with syntax highlighting and copy-to-clipboard functionality.
                  </p>
                </div>

                {/* Advanced Search */}
                <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🔍</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Advanced Search</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Full-text search across all documentation with filters for endpoints, parameters, and examples.
                  </p>
                </div>

                {/* Custom Themes */}
                <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🎨</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Custom Themes</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Beautiful themes with dark mode support and full customization to match your brand.
                  </p>
                </div>

              {/* API Testing */}
                <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <span className="text-lg">⚡</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">API Testing</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Built-in API testing interface with request/response history and parameter validation.
                  </p>
                </div>

                {/* Analytics Dashboard */}
                <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📊</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Analytics Dashboard</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Detailed insights into documentation usage, popular endpoints, and user engagement metrics.
                  </p>
                </div>

                {/* SDK Generation */}
                <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📦</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">SDK Generation</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Auto-generate SDKs for 10+ programming languages directly from your OpenAPI specification.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-20 text-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
                <h3 className="text-3xl font-bold mb-4">Ready to Transform Your API Documentation?</h3>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Join thousands of teams already using Apilon to create beautiful, maintainable API documentation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleTrialClick}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
                  >
                    Start Free Trial
                  </button>
                  <button
                    onClick={handleDemoClick}
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
                  >
                    Schedule Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof & Trust Signals - Milestone 4 Implementation */}
        <section id="social-proof" className="py-20 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Trusted by Industry Leaders
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Join the Teams Building
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 block">
                  World-Class API Documentation
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                From startups to enterprises, teams trust Apilon to deliver exceptional developer experiences.
                <span className="block mt-2 text-blue-600 dark:text-blue-400 font-medium">
                  See why 10,000+ developers choose our platform.
                </span>
              </p>
            </div>

            {/* Customer Logos */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Loved by Teams Everywhere
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  From startups to Fortune 500 companies
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-center">
                {/* Logo 1 - Stripe */}
                <div
                  onClick={() => handleLogoClick("stripe")}
                  className="group relative flex items-center justify-center p-4 cursor-pointer transition-all duration-300"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors duration-300">
                    <div className="w-32 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                      Stripe
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Logo 2 - Vercel */}
                <div
                  onClick={() => handleLogoClick("vercel")}
                  className="group relative flex items-center justify-center p-4 cursor-pointer transition-all duration-300"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors duration-300">
                    <div className="w-32 h-8 bg-black dark:bg-white rounded flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                      Vercel
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Logo 3 - GitHub */}
                <div
                  onClick={() => handleLogoClick("github")}
                  className="group relative flex items-center justify-center p-4 cursor-pointer transition-all duration-300"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors duration-300">
                    <div className="w-32 h-8 bg-gray-900 dark:bg-white rounded flex items-center justify-center font-mono text-sm group-hover:scale-110 transition-transform duration-300">
                      GitHub
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Logo 4 - Discord */}
                <div
                  onClick={() => handleLogoClick("discord")}
                  className="group relative flex items-center justify-center p-4 cursor-pointer transition-all duration-300"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors duration-300">
                    <div className="w-32 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                      Discord
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Logo 5 - Shopify */}
                <div
                  onClick={() => handleLogoClick("shopify")}
                  className="group relative flex items-center justify-center p-4 cursor-pointer transition-all duration-300"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors duration-300">
                    <div className="w-32 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                      Shopify
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Logo 6 - Twilio */}
                <div
                  onClick={() => handleLogoClick("twilio")}
                  className="group relative flex items-center justify-center p-4 cursor-pointer transition-all duration-300"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors duration-300">
                    <div className="w-32 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                      Twilio
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  What Our Users Say
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Real stories from teams transforming their API documentation
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Testimonial 1 */}
                <div
                  onClick={() => handleTestimonialClick("airbnb")}
                  className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      AD
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Alex Davidson</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Senior Developer, Airbnb</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588.419l-2.8-2.034a1 1 0 00-1.175-.492v1.056c0 .477.23.938.658 1.291l-2.77 2.77a1 1 0 00-1.414 1.414l2.77-2.77a1 1 0 001.414 0l2.77 2.77a1 1 0 001.414-1.414l-2.77-2.77a1 1 0 00-1.414 0l-2.77 2.77a1 1 0 01-1.414-1.414l2.77-2.77z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    "Apilon transformed our API documentation process completely. What used to take weeks now takes hours, and the quality is outstanding. Our developers love the interactive examples and search functionality."
                  </blockquote>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Reduced documentation time by 80%</span>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div
                  onClick={() => handleTestimonialClick("spotify")}
                  className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      SC
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Sarah Chen</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">API Lead, Spotify</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588.419l-2.8-2.034a1 1 0 00-1.175-.492v1.056c0 .477.23.938.658 1.291l-2.77 2.77a1 1 0 00-1.414 1.414l2.77-2.77a1 1 0 001.414 0l2.77 2.77a1 1 0 001.414-1.414l-2.77-2.77a1 1 0 00-1.414 0l-2.77 2.77a1 1 0 01-1.414-1.414l2.77-2.77z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    "The collaboration features are game-changing. Our entire team can review and contribute to documentation in real-time. The version control integration with Git makes keeping everything up to date effortless."
                  </blockquote>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Improved team collaboration by 60%</span>
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div
                  onClick={() => handleTestimonialClick("netflix")}
                  className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold">
                      MK
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Michael Kim</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Senior Engineer, Netflix</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588.419l-2.8-2.034a1 1 0 00-1.175-.492v1.056c0 .477.23.938.658 1.291l-2.77 2.77a1 1 0 00-1.414 1.414l2.77-2.77a1 1 0 001.414 0l2.77 2.77a1 1 0 001.414-1.414l-2.77-2.77a1 1 0 00-1.414 0l-2.77 2.77a1 1 0 01-1.414-1.414l2.77-2.77z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    "The automatic changelog generation and version management has saved us countless hours. Our developers can now focus on building features instead of maintaining documentation. It's been a huge productivity boost."
                  </blockquote>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>5x faster release documentation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Outcome Metrics & Security Badges */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left Side - Outcome Metrics */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    Proven Results
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">5x</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Faster Documentation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">80%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Time Saved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">99.9%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Uptime SLA</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">10K+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Happy Developers</div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Security & Compliance */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    Enterprise Security
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-700 rounded-xl">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🛡️</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white mb-1">SOC 2 Type II</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Compliant & Audit-Ready</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-700 rounded-xl">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🔐</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white mb-1">GDPR Ready</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Data Protection</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-700 rounded-xl">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🔒</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white mb-1">ISO 27001</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Security Management</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-700 rounded-xl">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                        <span className="text-lg">📊</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white mb-1">End-to-End Encryption</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">256-bit TLS</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Center Link */}
              <div className="mt-8 text-center">
                <button className="group inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                  <span>View Security & Trust Center</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo & Code Examples */}
        <section id="interactive-demo" className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Try It Now
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                See Apilon in Action
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Experience the power of automated API documentation with our live, interactive demo.
                Switch between languages, copy code, and see real-time results.
              </p>
            </div>

            {/* Interactive Demo Area */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Demo Controls */}
              <div className="border-b border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">API Endpoint:</label>
                    <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="petstore">Swagger Petstore</option>
                      <option value="github">GitHub API</option>
                      <option value="openai">OpenAI API</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Generate Docs
                    </button>
                    <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Code Example Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-1 p-2">
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg transition-colors">
                    cURL
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    JavaScript
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    Python
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    Ruby
                  </button>
                </div>
              </div>

              {/* Code Display Area */}
              <div className="relative bg-gray-900 dark:bg-black">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText('curl -X GET "https://api.example.com/pets" -H "accept: application/json"')}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    title="Copy code"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Copy link">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </button>
                </div>
                <pre className="p-6 text-green-400 font-mono text-sm overflow-x-auto">
                  <code>{`curl -X GET "https://petstore.swagger.io/v2/pet/findByStatus?status=available" \\
  -H "accept: application/json" \\
  -H "api_key: special-key"

# Response
{
  "id": 123,
  "name": "doggie",
  "category": {
    "id": 1,
    "name": "Dogs"
  },
  "photoUrls": ["https://example.com/photo.jpg"],
  "tags": [{"id": 1, "name": "friendly"}],
  "status": "available"
}`}</code>
                </pre>
              </div>

              {/* Generated Documentation Preview */}
              <div className="p-6 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generated Documentation</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Generated in 0.8s</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">GET /pet/findByStatus</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Finds Pets by status</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Parameters</h5>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded p-3">
                        <code className="text-sm">status</code>
                        <span className="text-gray-600 dark:text-gray-400 ml-2">Status values to be considered for filter</span>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Response</h5>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Returns array of Pet objects with id, name, category, and status
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Generate comprehensive documentation in under 1 second from any OpenAPI spec</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Customizable Themes</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Match your brand with customizable colors, logos, and styling options</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Deploy Anywhere</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Host on your domain or use our cloud infrastructure with one-click deployment</p>
              </div>
            </div>
          </div>
        </section>

        {/* Conversion Section */}
        <section id="conversion" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Transform Your API Documentation?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of developers who save 80% of their documentation time with Apilon.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="text-6xl font-bold mb-2">80%</div>
                  <div className="text-lg mb-4">Time Saved on Documentation</div>
                  <div className="text-sm text-blue-100">Focus on building great APIs, not writing docs</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="text-6xl font-bold mb-2">5min</div>
                  <div className="text-lg mb-4">Setup Time</div>
                  <div className="text-sm text-blue-100">Go from OpenAPI spec to published docs in minutes</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => trackCTAClick('trial', 'conversion_hero')}
                  className="group px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-lg"
                >
                  Start Free Trial
                  <svg className="w-5 h-5 ml-2 inline-block transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={() => trackCTAClick('demo', 'conversion_hero')}
                  className="group px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 text-lg"
                >
                  Book a Demo
                  <svg className="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-blue-100">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  14-day free trial
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Cancel anytime
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Quick Demo Button */}
        <button
          onClick={() => {
            trackCTAClick('demo', 'floating_button');
            document.getElementById('interactive-demo')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          title="Try Live Demo"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Try Live Demo
          </span>
        </button>

        {/* Chat/Help Button */}
        <button
          onClick={() => trackCTAClick('docs', 'floating_button')}
          className="group w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          title="Get Help"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Chat with us
          </span>
        </button>

        {/* Primary CTA Button */}
        <button
          onClick={() => trackCTAClick('trial', 'floating_button')}
          className="group w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center animate-pulse"
          title="Start Free Trial"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Start Free Trial
          </span>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Features</a></li>
                <li><a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Pricing</a></li>
                <li><a href="#security" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">About</a></li>
                <li><a href="#blog" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Blog</a></li>
                <li><a href="#careers" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#docs" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Documentation</a></li>
                <li><a href="#api" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">API Reference</a></li>
                <li><a href="#status" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#privacy" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</a></li>
                <li><a href="#terms" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</a></li>
                <li><a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              © 2025 Apilon. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
