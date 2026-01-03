"use client";

import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventParser } from "@usd1ball/analytics";
import { FlywheelEvent, formatTimestamp } from "@usd1ball/shared";
import { Activity, Flame, DollarSign, Repeat } from "lucide-react";

export function RecentEvents() {
  const { connection } = useConnection();
  const [events, setEvents] = useState<FlywheelEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parser = new EventParser(connection);

    const fetchEvents = async () => {
      try {
        const recentEvents = await parser.fetchRecentEvents(20);
        setEvents(recentEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [connection]);

  const getEventIcon = (event: FlywheelEvent) => {
    switch (event.type) {
      case "buyback":
        return <Activity className="h-4 w-4 text-blue-500" />;
      case "burn":
        return <Flame className="h-4 w-4 text-orange-500" />;
      case "liquidity":
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case "cycle":
        return <Repeat className="h-4 w-4 text-purple-500" />;
    }
  };

  const getEventTitle = (event: FlywheelEvent) => {
    switch (event.type) {
      case "buyback":
        return "Buyback Executed";
      case "burn":
        return "Tokens Burned";
      case "liquidity":
        return "Liquidity Added";
      case "cycle":
        return "Flywheel Cycle Completed";
    }
  };

  const getEventDescription = (event: FlywheelEvent) => {
    switch (event.type) {
      case "buyback":
        return `Cycle #${event.data.cycleNumber}: Bought ${event.data.tokensBought} tokens`;
      case "burn":
        return `Burned ${event.data.amount} tokens`;
      case "liquidity":
        return `Added ${event.data.tokenAmount} tokens to LP`;
      case "cycle":
        return `Cycle #${event.data.cycleNumber} completed`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Events</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No events yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {events.map((event, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
              >
                <div className="mt-0.5">{getEventIcon(event)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{getEventTitle(event)}</p>
                  <p className="text-xs text-muted-foreground">
                    {getEventDescription(event)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimestamp(event.data.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
