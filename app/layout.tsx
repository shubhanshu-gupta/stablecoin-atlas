import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Stablecoin Atlas",
    default: "Stablecoin Atlas - Cryptocurrency, Finance & Digital Assets",
  },
  description: "Stablecoin Atlas is your comprehensive guide to understanding, learning, and working within the stablecoin, cryptocurrency, finance, and digital asset ecosystem.",
  keywords: ["stablecoin", "cryptocurrency", "finance", "digital assets", "blockchain", "crypto", "defi", "web3 payments"],
};

import { CSPostHogProvider } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Stablecoin Atlas",
    url: "https://stablecoinatlas.com/",
    description: "Your guide to understanding, learning, and working in the stablecoin and cryptocurrency ecosystem.",
  };

  return (
    <html lang="en">
      <CSPostHogProvider>
        <body className={`${inter.variable} ${outfit.variable} flex flex-col min-h-screen`}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </body>
      </CSPostHogProvider>
    </html>
  );
}
