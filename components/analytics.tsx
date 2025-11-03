"use client";

import { useEffect } from "react";

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
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

      // Initialize dataLayer and gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function(...args: any[]) {
        window.dataLayer!.push(arguments);
      };

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

// Hook for tracking events
export const useAnalytics = () => {
  const trackEvent = ({ action, category, label, value }: AnalyticsEvent) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  const trackPageView = (url: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      });
    }
  };

  const trackCTAClick = (ctaType: "trial" | "demo" | "docs" | "signin", location: string) => {
    trackEvent({
      action: "click",
      category: "cta",
      label: `${ctaType}_${location}`,
    });
  };

  const trackScrollDepth = (depth: number) => {
    trackEvent({
      action: "scroll",
      category: "engagement",
      label: `${depth}%`,
      value: depth,
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackCTAClick,
    trackScrollDepth,
  };
};

export default Analytics;