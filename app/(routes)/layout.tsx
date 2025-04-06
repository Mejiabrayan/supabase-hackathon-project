import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { AI } from "@/app/actions/tool";
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/sonner"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevGenius - AI-Powered Technical Blog Writing",
  description: "Transform your ideas into engaging technical blog posts with AI. Create SEO-optimized content in minutes.",
  keywords: "AI writing, technical blog, content generation, SEO optimization, developer content",
  authors: [{ name: "DevGenius" }],
  creator: "DevGenius",
  publisher: "DevGenius",
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
        <AI>
          {children}
          <Analytics />
          <Toaster />

        </AI>
      </body>
    </html>
  );
}
