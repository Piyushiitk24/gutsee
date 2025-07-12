import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
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
  title: "GutSee | Smart Stoma Health Tracking",
  description: "AI-powered health tracking for stoma patients. Monitor diet, symptoms, and get personalized insights with smart recommendations.",
  keywords: ["colostomy", "stoma", "health", "tracking", "medical", "management", "AI", "smart"],
  authors: [{ name: "GutSee Team" }],
  openGraph: {
    title: "GutSee | Smart Stoma Health Tracking",
    description: "AI-powered health tracking for stoma patients with smart insights",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
