import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Analytics from "@/components/analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Apilon - World-Class API Documentation Management",
    template: "%s | Apilon"
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  description: "Create, manage, and publish world-class API documentation faster. Convert curious visitors into trial users with beautiful docs, powerful collaboration, and enterprise security.",
  keywords: [
    "API documentation",
    "documentation management",
    "OpenAPI",
    "API docs",
    "developer documentation",
    "API platform",
    "documentation generator",
    "technical writing",
    "API reference"
  ],
  authors: [{ name: "Apilon Team" }],
  creator: "Apilon",
  publisher: "Apilon",
  metadataBase: new URL("https://apilon.com"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://apilon.com",
    title: "Apilon - World-Class API Documentation Management",
    description: "Create, manage, and publish world-class API documentation faster. Convert curious visitors into trial users with beautiful docs, powerful collaboration, and enterprise security.",
    siteName: "Apilon",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Apilon - API Documentation Management Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Apilon - World-Class API Documentation Management",
    description: "Create, manage, and publish world-class API documentation faster. Convert curious visitors into trial users.",
    images: ["/og-image.png"],
    creator: "@apilon"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: "verification-code-here",
    yandex: "verification-code-here"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
