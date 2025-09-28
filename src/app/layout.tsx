import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../context/themecontext";
import { QueryProvider } from "../components/providers/query-provider";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Toaster } from "sonner";
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
  title: "CyberSoft",
  description: "Learn without limits - Discover thousands of courses from expert instructors",
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
        <QueryProvider>
          <ThemeProvider>
            <div className="min-h-screen transition-colors duration-300">
              <Header />
              <main>
                {children}
              </main>
              <Footer />
              <Toaster position="top-right" />
            </div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}