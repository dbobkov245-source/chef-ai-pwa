import React from 'react';
import type { Metadata, Viewport } from "next";
import "./main.css";
import AuthProvider from "../components/AuthProvider";
import ErrorBoundary from "../components/ui/ErrorBoundary";

import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://chef-ai-pwa.vercel.app'),
  title: "Шеф ИИ",
  description: "Умный кулинарный помощник для анализа блюд и создания рецептов.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Шеф ИИ",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.jpg", sizes: "180x180", type: "image/jpeg" },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "Шеф ИИ",
    title: "Шеф ИИ - Умный кулинарный помощник",
    description: "Анализируйте продукты и создавайте уникальные рецепты с помощью искусственного интеллекта",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Шеф ИИ"
      }
    ]
  },
  twitter: {
    card: "summary",
    title: "Шеф ИИ",
    description: "Умный кулинарный помощник с AI",
    images: ["/icon-512.png"],
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#13ec5b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="light" suppressHydrationWarning>
      <head>
        {/* Service Worker Registration */}
        <script src="/sw-loader.js" defer />
      </head>
      <body className={`${spaceGrotesk.variable} bg-background-light text-text-main antialiased font-sans min-h-screen flex flex-col transition-theme`}>
        <AuthProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}