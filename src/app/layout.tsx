import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import { AppShell } from "@/components/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#09090B" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "VisionCheck | Quick Vision Screening",
  description: "Free, quick vision screening in under 3 minutes. It can help you decide whether an eye exam may be useful.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VisionCheck",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <AccessibilityProvider>
          <AppShell>{children}</AppShell>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
