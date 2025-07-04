import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Stoma Tracker | Colostomy Management App",
  description: "A comprehensive colostomy management application with food tracking, stoma output monitoring, and pattern analysis for better health outcomes.",
  keywords: ["colostomy", "stoma", "health", "tracking", "medical", "management"],
  authors: [{ name: "Stoma Tracker Team" }],
  openGraph: {
    title: "Stoma Tracker | Colostomy Management App",
    description: "Your comprehensive colostomy management companion",
    type: "website",
  },
  viewport: "width=device-width, initial-scale=1",
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
      </body>
    </html>
  );
}
