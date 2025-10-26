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
  openGraph: {
    title: 'Tarnished',
    description: 'Portfolio for Aryan',
    url: 'https://tarnished-git-loader-aryans-projects-0efed95e.vercel.app',
    siteName: 'Tarnished',
    images: [
      {
        url: 'https://tarnished-git-loader-aryans-projects-0efed95e.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OG',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  title: "Tarnished",
  description: "My Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {children}
      </body>
    </html>
  );
}

