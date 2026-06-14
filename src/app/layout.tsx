import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { BackgroundProvider } from "@/components/providers/BackgroundProvider";
import { MusicProvider } from "@/components/providers/MusicProvider";
import BackgroundRenderer from "@/components/layout/BackgroundRenderer";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReadingProgress from "@/components/ui/ReadingProgress";
import Sakura from "@/components/effects/Sakura";
import ColorExtractor from "@/components/effects/ColorExtractor";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { siteConfig } from "@/siteConfig";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const notoSerifSC = Noto_Serif_SC({ variable: "--font-noto-serif-sc", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: siteConfig.title, description: siteConfig.bio,
  alternates: { types: { "application/rss+xml": "/feed/" } },
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} ${notoSerifSC.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <BackgroundProvider>
            <MusicProvider>
              <ToastProvider>
                <BackgroundRenderer />
                <ColorExtractor />
                <ReadingProgress />
                <Sakura />
                <Navbar />
                <Breadcrumb />
                <main className="flex-1 pt-4">{children}</main>
                <Footer />
              </ToastProvider>
            </MusicProvider>
          </BackgroundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
