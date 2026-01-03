"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTokenAmount, calculateSupplyPercentage } from "@usd1ball/shared";

interface SupplyChartProps {
  totalSupply: bigint;
  totalBurned: bigint;
}

export function SupplyChart({ totalSupply, totalBurned }: SupplyChartProps) {
  const circulatingSupply = totalSupply - totalBurned;
  const burnedPercentage = calculateSupplyPercentage(totalBurned, totalSupply);
  const circulatingPercentage = 100 - burnedPercentage;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supply Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Circulating</span>
              <span className="font-medium">
                {formatTokenAmount(circulatingSupply)} ({circulatingPercentage.toFixed(2)}%)
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${circulatingPercentage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Burned</span>
              <span className="font-medium">
                {formatTokenAmount(totalBurned)} ({burnedPercentage.toFixed(2)}%)
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3">
              <div
                className="bg-orange-500 h-3 rounded-full transition-all"
                style={{ width: `${burnedPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Supply (Fixed)</span>
            <span className="font-medium">{formatTokenAmount(totalSupply)}</span>
          </div>
        </div>

        <div className="p-3 bg-secondary/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            Supply is fixed at initialization. No minting possible. Every flywheel cycle
            burns more tokens, continuously reducing circulating supply.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
