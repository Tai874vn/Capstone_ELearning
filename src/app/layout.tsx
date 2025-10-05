"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../context/themecontext";
import { QueryProvider } from "../components/providers/query-provider";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider>
            <div className="min-h-screen transition-colors duration-300">
              {!isAdminPage && <Header />}
              <main>
                {children}
              </main>
              {!isAdminPage && <Footer />}
              <Toaster position="top-right" />
            </div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}