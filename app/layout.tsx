import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/header";
import SessionProviders from "@/components/shared/sessionProvider";
import Footer from "@/components/shared/footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'MoldCosts Calculator | Professional Mold Remediation Cost Estimator',
  description:'Get an instant, professional-grade mold remediation cost estimate. Regional pricing, severity analysis, and contractor matching — 100% free.',
  keywords: 'mold remediation cost, mold removal cost, mold estimate, mold calculator',
  openGraph: {
    title: 'MoldCosts Calculator',
    description: 'Professional mold remediation cost estimator — instant & free.',
    type: 'website',
  },
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "apple-mobile-web-app-title": "MoldCosts",  
  },
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
      <SessionProviders>
        <Header/>
        <main className="grow">
        {children}
        </main>
        <Toaster/>

        <Footer/>
      </SessionProviders>
      
      </body>
    </html>
  );
}
