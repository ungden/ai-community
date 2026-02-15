import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/Toast";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://alexle.ai')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Alex Le AI - Cộng đồng học AI cho người đi làm",
    template: "%s | Alex Le AI",
  },
  description: "Học cách dùng ChatGPT, Claude, Midjourney, Make để tự động hóa công việc. Case study thực tế, không lý thuyết.",
  keywords: ["AI", "ChatGPT", "Claude", "Midjourney", "Make", "automation", "prompt engineering", "học AI", "cộng đồng AI Việt Nam"],
  authors: [{ name: "Alex Le" }],
  creator: "Alex Le",
  openGraph: {
    title: "Alex Le AI - Cộng đồng học AI cho người đi làm",
    description: "Học cách dùng ChatGPT, Claude, Midjourney, Make để tự động hóa công việc. Case study thực tế, không lý thuyết.",
    type: "website",
    locale: "vi_VN",
    siteName: "Alex Le AI",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Alex Le AI - Cộng đồng học AI cho người đi làm",
    description: "Học cách dùng ChatGPT, Claude, Midjourney, Make để tự động hóa công việc.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add Google Search Console verification when ready
    // google: 'your-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
