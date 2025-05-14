import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Wallet } from "lucide-react";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-white border-b py-4 px-6 shadow-sm">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Wallet className="h-8 w-8" />
              <span className="text-2xl font-bold">Heath</span>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
