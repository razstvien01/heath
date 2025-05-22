import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Wallet } from "lucide-react";
import { ThemeModeToggle } from "@/components/themeModeToggle";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ThemeDataProvider from "@/contexts/theme-data-provider";
import { ThemeColorToggle } from "@/components/themeColorToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Heath",
  description: "Ledger App for auditing Money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased before:dark:to-primary`}
      >
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeDataProvider>
            <header className="border-b py-4 px-6 shadow-sm">
              <div className="container mx-auto flex justify-between items-center">
                {/* Left side: Logo */}
                <div className="flex items-center gap-2">
                  <Wallet className="h-8 w-8" />
                  <span className="text-2xl font-bold">Heath</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeColorToggle />
                  <ThemeModeToggle />
                </div>
              </div>
            </header>
            {children}
          </ThemeDataProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
