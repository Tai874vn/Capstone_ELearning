"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "../context/themecontext";
import { QueryProvider } from "./providers/query-provider";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toaster } from "sonner";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  return (
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
  );
}
