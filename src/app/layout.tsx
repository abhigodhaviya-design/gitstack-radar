import type { Metadata, Viewport } from "next";
import type { ReactNode, JSX } from "react";
import { SplashScreen } from "@/components/shared/SplashScreen";
import { ServiceWorkerRegistration } from "@/components/shared/ServiceWorkerRegistration";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: {
    default: "GitStack Radar - AI-Powered GitHub Repository Analyzer",
    template: "%s | GitStack Radar",
  },
  description: "AI-powered GitHub repository analyzer with repository health scoring, AI summaries, repository comparison, PDF export, and technology stack analysis.",
  keywords: ["GitHub", "Repository Analysis", "Next.js", "AI", "Open Source", "Developer Tools", "Code Quality", "Repository Health", "Tech Stack Analysis"],
  authors: [{ name: "GitStack Radar" }],
  creator: "GitStack Radar",
  publisher: "GitStack Radar",
  manifest: "/manifest.json",
  applicationName: "GitStack Radar",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GitStack Radar",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "GitStack Radar",
    title: "GitStack Radar - AI-Powered GitHub Repository Analyzer",
    description: "AI-powered GitHub repository analyzer with repository health scoring, AI summaries, repository comparison, PDF export, and technology stack analysis.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitStack Radar - AI-Powered GitHub Repository Analyzer",
    description: "AI-powered GitHub repository analyzer with repository health scoring, AI summaries, repository comparison, PDF export, and technology stack analysis.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="dark">
        <ServiceWorkerRegistration />
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
