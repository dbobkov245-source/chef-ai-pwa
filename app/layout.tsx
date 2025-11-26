import React from 'react';
import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "../components/AuthProvider";

export const metadata: Metadata = {
  title: "Шеф ИИ (Chef AI)",
  description: "Умный кулинарный помощник для анализа блюд и создания рецептов.",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
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
        {/* Space Grotesk Font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background-light text-text-main antialiased font-sans min-h-screen flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}