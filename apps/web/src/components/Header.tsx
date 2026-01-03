"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Activity } from "lucide-react";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">USD1BALL</h1>
              <p className="text-sm text-muted-foreground">
                A USD1-Based Flywheel Meme Coin
              </p>
            </div>
          </div>
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
}
