// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

const site = process.env.SITE_URL ?? "https://www.swaply.cc";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "Swaply",
  description: "Trade what you have for what you need.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site,
    title: "Swaply — Trade what you have for what you need",
    description: "Simple bartering: post, match, and swap—fast and friendly.",
    siteName: "Swaply",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Swaply" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Swaply — Trade what you have for what you need",
    description: "Simple bartering: post, match, and swap—fast and friendly.",
    images: ["/og.png"],
  },
  // ✅ 修正 icons 结构（apple / icon / shortcut 同级；无多余字符）
  icons: {
    icon: [{ url: "/favicon.ico?v=3" }],
    apple: [{ url: "/apple-touch-icon.png?v=3", sizes: "180x180" }],
    shortcut: ["/favicon.ico?v=3"],
  },
  themeColor: "#2d6fe6",
  manifest: "/site.webmanifest", // 没有该文件可去掉这一行
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
