"use client";

import { useEffect } from "react";

// Enhanced type safety with union types
export type AnalyticsAction = "click" | "scroll" | "view" | "submit" | "download" | "sign_up" | "assigned" | "conversion";
export type AnalyticsCategory = "cta" | "engagement" | "navigation" | "conversion" | "feature" | "testimonial" | "logo" | "ab_test";
export type CTAType = "trial" | "demo" | "docs" | "signin";

export interface AnalyticsEvent {
  action: AnalyticsAction;
  category: AnalyticsCategory;
  label?: string;
  value?: number;
}

// Proper typing for gtag function covering all overloads
type GTagFunction = (
  command: "config" | "js" | "event" | "set",
  targetIdOrDate: string | Date,
  config?: Record<string, unknown>
) => void;

type GTagEventFunction = (
  command: "event",
  action: string,
  options?: {
    event_category?: string;
    event_label?: string;
    value?: number;
  }
) => void;

declare global {
  interface Window {
    gtag?: GTagFunction & GTagEventFunction;
    dataLayer?: unknown[];
  }
}

// Basic Google Analytics 4 implementation
export const Analytics = () => {
  useEffect(() => {
    // Initialize Google Analytics 4
    const measurementId = process.env.NEXT_PUBLIC_GA_ID;

    if (measurementId && typeof window !== "undefined") {
      // Load gtag script
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      // Initialize dataLayer and gtag with proper typing
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function(...parameters: Parameters<GTagFunction | GTagEventFunction>) {
        window.dataLayer!.push(parameters);
      } as GTagFunction & GTagEventFunction;

      // Configure GA4
      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, []);

  return null;
};

// Hook for tracking events with error handling
export const useAnalytics = () => {
  const trackEvent = ({ action, category, label, value }: AnalyticsEvent) => {
    try {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", action, {
          event_category: category,
          event_label: label,
          value: value,
        });
      }
    } catch (error) {
      console.warn("Analytics tracking failed:", error);
    }
  };

  const trackPageView = (url: string) => {
    try {
      if (typeof window !== "undefined" && window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
        window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
          page_path: url,
        });
      }
    } catch (error) {
      console.warn("Page view tracking failed:", error);
    }
  };

  const trackCTAClick = (ctaType: CTAType, location: string) => {
    trackEvent({
      action: "click",
      category: "cta",
      label: `${ctaType}_${location}`,
    });
  };

  const trackScrollDepth = (depth: number) => {
    // Validate depth is within reasonable bounds
    if (depth >= 0 && depth <= 100) {
      trackEvent({
        action: "scroll",
        category: "engagement",
        label: `${depth}%`,
        value: depth,
      });
    }
  };

  return {
    trackEvent,
    trackPageView,
    trackCTAClick,
    trackScrollDepth,
  };
};

export default Analytics;