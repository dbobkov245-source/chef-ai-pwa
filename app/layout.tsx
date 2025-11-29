import React from 'react';
import type { Metadata, Viewport } from "next";
import "./main.css";
import AuthProvider from "../components/AuthProvider";
import ServiceWorkerRegistration from "../components/ServiceWorkerRegistration";

export const metadata: Metadata = {
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
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
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
    <html lang="ru" className="light">
      <head>
        {/* Space Grotesk Font from Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background-light text-text-main antialiased font-sans min-h-screen flex flex-col">
        <ServiceWorkerRegistration />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}