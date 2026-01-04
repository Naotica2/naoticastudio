import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AOSProvider } from "@/components/AOSProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Naotica Studio | Creative Developer",
  description: "Personal studio website by Naotica featuring creative tools and services",
  keywords: ["developer", "portfolio", "tools", "downloader", "AI"],
  authors: [{ name: "Naotica" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Naotica Studio",
    description: "Creative Developer & Tools",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AOSProvider>
          <Navbar />
          <main className="min-h-screen pt-20 overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </AOSProvider>
      </body>
    </html>
  );
}

