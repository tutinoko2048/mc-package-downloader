import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import GoogleAnalytics from './GoogleAnalytics';
import { Suspense } from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minecraft Package Downloader",
  description: "Download @minecraft/ packages from npm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Suspense>
        <GoogleAnalytics />
      </Suspense>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
