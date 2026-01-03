"use client";

import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { USD1BallClient, MetricsCalculator } from "@usd1ball/analytics";
import { GlobalState, FlywheelMetrics } from "@usd1ball/shared";
import { MetricsGrid } from "./MetricsGrid";
import { FlywheelProgress } from "./FlywheelProgress";
import { RecentEvents } from "./RecentEvents";
import { SupplyChart } from "./SupplyChart";
import { ExplainerSection } from "./ExplainerSection";

export function Dashboard() {
  const { connection } = useConnection();
  const [globalState, setGlobalState] = useState<GlobalState | null>(null);
  const [metrics, setMetrics] = useState<FlywheelMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = new USD1BallClient(connection);

    const fetchData = async () => {
      try {
        const state = await client.getGlobalState();
        const metricsData = await client.getMetrics();

        if (state) setGlobalState(state);
        if (metricsData) setMetrics(metricsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10s

    return () => clearInterval(interval);
  }, [connection]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading USD1BALL data...</p>
        </div>
      </div>
    );
  }

  if (!globalState || !metrics) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            Unable to load USD1BALL data. Is the program deployed?
          </p>
        </div>
      </div>
    );
  }

  const summary = MetricsCalculator.formatMetricsSummary(globalState, metrics);

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <div className="space-y-8">
        <MetricsGrid summary={summary} />
        <FlywheelProgress
          currentBalance={globalState.buybackPoolBalance}
          threshold={globalState.buybackThreshold}
          isPaused={globalState.isPaused}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SupplyChart
            totalSupply={globalState.totalSupply}
            totalBurned={globalState.totalBurned}
          />
          <RecentEvents />
        </div>
        <ExplainerSection />
      </div>
    </div>
  );
}
