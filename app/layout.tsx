import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BackToTop from "@/components/BackToTop";
import { Providers } from "@/components/Providers";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "NordCreative — Visual Production from Greenland",
  description:
    "Video production, photography, and Arctic storytelling for brands and companies working in Greenland and beyond.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <head>
        <link rel="prefetch" href="/mtn-front.json" />
        <link rel="prefetch" href="/mtn-sea.json" />
        <link rel="prefetch" href="/mtn-fjord.json" />
      </head>
      <body className="bg-black text-white"><Providers><Header />{children}<BackToTop /></Providers></body>
    </html>
  );
}
