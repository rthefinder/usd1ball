"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, AlertTriangle } from "lucide-react";

export function ExplainerSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            How The Flywheel Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">1. Tax Collection</h4>
            <p className="text-sm text-muted-foreground">
              Every transfer pays a small tax in USD1 (not in USD1BALL tokens). This
              creates constant buying pressure.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">2. Accumulation</h4>
            <p className="text-sm text-muted-foreground">
              USD1 taxes accumulate in the buyback pool until the threshold is reached.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">3. Automatic Buyback</h4>
            <p className="text-sm text-muted-foreground">
              When threshold is met, anyone can trigger a buyback. The contract swaps
              accumulated USD1 for USD1BALL tokens.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">4. Burn & LP</h4>
            <p className="text-sm text-muted-foreground">
              Bought tokens are split: some are burned (reducing supply), some go to LP
              (increasing liquidity).
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">5. Repeat</h4>
            <p className="text-sm text-muted-foreground">
              The cycle repeats automatically. Each cycle reduces supply and reinforces
              price dynamics.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Important Disclaimers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm font-medium mb-1">🎲 This is a Meme Coin</p>
            <p className="text-xs text-muted-foreground">
              USD1BALL is a meme coin with deterministic mechanics. It is NOT a financial
              product or investment vehicle.
            </p>
          </div>

          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm font-medium mb-1">⚠️ No Guarantees</p>
            <p className="text-xs text-muted-foreground">
              No guaranteed returns. No promises of profit. Price can go to zero. Do not
              invest more than you can afford to lose.
            </p>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm font-medium mb-1">🔍 Transparency by Design</p>
            <p className="text-xs text-muted-foreground">
              All mechanics are on-chain and verifiable. No hidden mint authority. No
              upgradeable backdoors. Deterministic triggers only.
            </p>
          </div>

          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <p className="text-sm font-medium mb-1">📖 Not Financial Advice</p>
            <p className="text-xs text-muted-foreground">
              This dashboard provides information only. Do your own research. Understand
              the risks. This is not financial advice.
            </p>
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              USD1BALL is an experiment in deterministic tokenomics. Participate
              responsibly and at your own risk.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
