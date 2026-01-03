"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Flame, DollarSign, Repeat } from "lucide-react";
import { MetricsSummary } from "@usd1ball/analytics";

interface MetricsGridProps {
  summary: MetricsSummary;
}

export function MetricsGrid({ summary }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Supply</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalSupply}</div>
          <p className="text-xs text-muted-foreground">Fixed supply, no minting</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Burned</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalBurned}</div>
          <p className="text-xs text-muted-foreground">{summary.burnRate} of supply</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Buyback Pool</CardTitle>
          <DollarSign className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.currentPoolBalance}</div>
          <p className="text-xs text-muted-foreground">USD1 accumulated</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Flywheel Cycles</CardTitle>
          <Repeat className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.flywheelCycles}</div>
          <p className="text-xs text-muted-foreground">Completed cycles</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Circulating Supply</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.circulatingSupply}</div>
          <p className="text-xs text-muted-foreground">Total - Burned</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Tax Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Tax Rate:</span>
              <span className="text-sm font-medium">{summary.taxRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Burn Rate:</span>
              <span className="text-sm font-medium">{summary.burnRateConfig}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">LP Rate:</span>
              <span className="text-sm font-medium">{summary.lpRateConfig}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
