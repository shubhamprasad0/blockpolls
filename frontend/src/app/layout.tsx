import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ContextProviders from "./providers";
import "./globals.css";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Polls",
  description: "Create and manage polls",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ContextProviders>
          <Header />
          {children}
        </ContextProviders>
      </body>
    </html>
  );
}
