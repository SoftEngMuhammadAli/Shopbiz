import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/layout/navbar";
import Footer from "@/src/components/layout/footer";
import AppProviders from "@/src/components/providers/app-providers";

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "ShopBiz | Modern Ecommerce Platform",
  description:
    "ShopBiz is a full-stack ecommerce application with Next.js, MongoDB, NextAuth, Stripe checkout, and admin operations.",
  openGraph: {
    title: "ShopBiz | Modern Ecommerce Platform",
    description:
      "ShopBiz is a full-stack ecommerce application with Next.js, MongoDB, NextAuth, Stripe checkout, and admin operations.",
    type: "website",
    siteName: "ShopBiz",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopBiz | Modern Ecommerce Platform",
    description:
      "ShopBiz is a full-stack ecommerce application with Next.js, MongoDB, NextAuth, Stripe checkout, and admin operations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${manrope.variable} app-bg min-h-screen text-slate-100 antialiased`}>
        <AppProviders>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}


