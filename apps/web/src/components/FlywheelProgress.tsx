"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTokenAmount } from "@usd1ball/shared";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface FlywheelProgressProps {
  currentBalance: bigint;
  threshold: bigint;
  isPaused: boolean;
}

export function FlywheelProgress({
  currentBalance,
  threshold,
  isPaused,
}: FlywheelProgressProps) {
  const progress = threshold > BigInt(0)
    ? Math.min((Number(currentBalance) / Number(threshold)) * 100, 100)
    : 0;

  const canTrigger = !isPaused && currentBalance >= threshold;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Flywheel Progress
          {isPaused && <AlertCircle className="h-5 w-5 text-yellow-500" />}
          {canTrigger && <CheckCircle className="h-5 w-5 text-green-500" />}
          {!isPaused && !canTrigger && (
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Current Pool Balance</span>
            <span className="font-medium">{formatTokenAmount(currentBalance)} USD1</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                canTrigger
                  ? "bg-green-500"
                  : isPaused
                  ? "bg-yellow-500"
                  : "bg-blue-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm mt-2 text-muted-foreground">
            <span>0</span>
            <span>{formatTokenAmount(threshold)} USD1 threshold</span>
          </div>
        </div>

        <div className="pt-4 border-t">
          {isPaused ? (
            <div className="text-center text-yellow-600">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Flywheel Paused</p>
              <p className="text-sm text-muted-foreground">
                Emergency pause is active
              </p>
            </div>
          ) : canTrigger ? (
            <div className="text-center text-green-600">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Buyback Ready!</p>
              <p className="text-sm text-muted-foreground">
                Anyone can trigger the next cycle
              </p>
            </div>
          ) : (
            <div className="text-center">
              <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-blue-500" />
              <p className="font-medium">Accumulating...</p>
              <p className="text-sm text-muted-foreground">
                {progress.toFixed(2)}% to next buyback
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
