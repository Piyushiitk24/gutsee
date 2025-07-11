import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

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
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
