import React from 'react';
import type { Metadata, Viewport } from "next";
import "./main.css";
import AuthProvider from "../components/AuthProvider";

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
      { url: "/icon-192.jpg", sizes: "192x192", type: "image/jpeg" },
      { url: "/icon-512.jpg", sizes: "1024x1024", type: "image/jpeg" },
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
        url: "/icon-512.jpg",
        width: 1024,
        height: 1024,
        alt: "Шеф ИИ"
      }
    ]
  },
  twitter: {
    card: "summary",
    title: "Шеф ИИ",
    description: "Умный кулинарный помощник с AI",
    images: ["/icon-512.jpg"],
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
    <html lang="ru" className="light">
      <head>
        {/* Service Worker Registration */}
        <script src="/sw-loader.js" defer />
      </head>
      <body className={`${spaceGrotesk.variable} bg-background-light text-text-main antialiased font-sans min-h-screen flex flex-col`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}