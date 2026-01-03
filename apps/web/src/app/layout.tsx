import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "USD1BALL - A USD1-Based Flywheel Meme Coin",
  description:
    "USD1BALL is a deterministic flywheel meme coin with automated buyback and burn mechanics on Solana",
  keywords: ["USD1", "Solana", "meme coin", "flywheel", "buyback", "burn"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
