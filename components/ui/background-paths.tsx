"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

function FloatingPaths({ position }: { position: number }) {
    // Generate subtle monochromatic paths
    const paths = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 8 * position} -${189 + i * 6}C-${
            380 - i * 8 * position
        } -${189 + i * 6} -${312 - i * 8 * position} ${216 - i * 6} ${
            152 - i * 8 * position
        } ${343 - i * 6}C${616 - i * 8 * position} ${470 - i * 6} ${
            684 - i * 8 * position
        } ${875 - i * 6} ${684 - i * 8 * position} ${875 - i * 6}`,
        width: 0.5 + i * 0.02,
    }));

    // Subtle animation durations
    const animationDurations = useMemo(() => {
      const baseDuration = 30;
      const maxAdditional = 15;
      return Array.from({ length: 12 }, (_, i) =>
        baseDuration + ((i * 11 + position) % maxAdditional)
      );
    }, [position]);

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full text-gray-300 dark:text-gray-700"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.1 + path.id * 0.02}
                        initial={{ pathLength: 0.3, opacity: 0.3 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.15, 0.4, 0.15],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: animationDurations[path.id],
                            repeat: Number.POSITIVE_INFINITY,
                            ease: [0.4, 0, 0.2, 1], // Apple-like cubic bezier
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths({
    title = "Publish World-Class API Docs",
    subtitle = "Convert OpenAPI specs into beautiful, searchable documentation 80% faster",
    primaryCTA = "Start Free Trial",
    secondaryCTA = "Book a Demo",
    primaryOnClick,
    secondaryOnClick,
}: {
    title?: string;
    subtitle?: string;
    primaryCTA?: string;
    secondaryCTA?: string;
    primaryOnClick?: () => void;
    secondaryOnClick?: () => void;
}) {
    const words = title.split(" ");

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-black">
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            <div className="relative z-10 container mx-auto px-6 md:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Main Headline - Mac-style Typography */}
                    <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light mb-8 leading-tight tracking-tight">
                        {words.map((word, wordIndex) => (
                            <span
                                key={wordIndex}
                                className="inline-block mr-6 last:mr-0"
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay:
                                                wordIndex * 0.1 +
                                                letterIndex * 0.03,
                                            type: "spring",
                                            stiffness: 80,
                                            damping: 12,
                                        }}
                                        className="inline-block text-black dark:text-white"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}

                        {/* Animated Tagline */}
                        <motion.span
                            className="block mt-4 text-3xl sm:text-4xl md:text-5xl text-gray-600 dark:text-gray-400 font-light"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.2, type: "spring", stiffness: 60 }}
                        >
                            In Days, Not Weeks
                        </motion.span>
                    </h1>

                    {/* Value Proposition */}
                    <motion.p
                        className="text-xl sm:text-2xl lg:text-3xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed font-light"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.6, duration: 1, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {subtitle}
                        <span className="block mt-3 text-black dark:text-white font-medium">
                            No credit card required.
                        </span>
                    </motion.p>

                    {/* Social Proof */}
                    <motion.div
                        className="flex justify-center items-center gap-16 mb-16 text-gray-500 dark:text-gray-400"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.9, duration: 1, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <div className="text-center">
                            <div className="text-3xl font-light text-black dark:text-white">1M+</div>
                            <div className="text-sm font-medium">API Endpoints</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-light text-black dark:text-white">10K+</div>
                            <div className="text-sm font-medium">Developers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-light text-black dark:text-white">99.9%</div>
                            <div className="text-sm font-medium">Uptime</div>
                        </div>
                    </motion.div>

                    {/* Primary CTAs - Mac-style */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 2.2, duration: 1, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <Button
                            onClick={primaryOnClick}
                            size="lg"
                            className="group bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-8 py-4 rounded-xl text-lg font-medium min-w-[240px] transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg border-0"
                        >
                            <span className="flex items-center gap-3">
                                {primaryCTA}
                                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={secondaryOnClick}
                            size="lg"
                            className="group border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-gray-900 px-8 py-4 rounded-xl text-lg font-medium min-w-[240px] transition-all duration-300 transform hover:scale-105"
                        >
                            <span className="flex items-center justify-center gap-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {secondaryCTA}
                            </span>
                        </Button>
                    </motion.div>

                    {/* Secondary CTA */}
                    <motion.div
                        className="text-center"
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 2.5, duration: 1, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <Button
                            variant="ghost"
                            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300 font-medium"
                        >
                            <span>Or view our documentation</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}