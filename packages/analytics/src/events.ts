import { Connection, PublicKey } from "@solana/web3.js";
import { USD1BALL_PROGRAM_ID, FlywheelEvent } from "@usd1ball/shared";

/**
 * Event Parser for USD1BALL Program
 * 
 * Listens to and parses on-chain events from the program
 */
export class EventParser {
  private connection: Connection;
  private programId: PublicKey;

  constructor(connection: Connection, programId: PublicKey = USD1BALL_PROGRAM_ID) {
    this.connection = connection;
    this.programId = programId;
  }

  /**
   * Fetch recent events from program logs
   */
  async fetchRecentEvents(limit: number = 100): Promise<FlywheelEvent[]> {
    try {
      // Get recent signatures
      const signatures = await this.connection.getSignaturesForAddress(
        this.programId,
        { limit }
      );

      const events: FlywheelEvent[] = [];

      // Parse transactions for events
      for (const sig of signatures) {
        const tx = await this.connection.getTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
        });

        if (tx && tx.meta && tx.meta.logMessages) {
          const parsedEvents = this.parseLogsForEvents(tx.meta.logMessages);
          events.push(...parsedEvents);
        }
      }

      return events;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }

  /**
   * Parse log messages for Anchor events
   */
  private parseLogsForEvents(logs: string[]): FlywheelEvent[] {
    const events: FlywheelEvent[] = [];

    for (const log of logs) {
      // Look for Anchor event logs
      if (log.includes("Program data:")) {
        try {
          // In production, properly deserialize Anchor events
          // This is simplified parsing
          if (log.includes("BuybackExecuted")) {
            // Parse buyback event
            events.push({
              type: "buyback",
              data: {
                cycleNumber: BigInt(0),
                usd1Spent: BigInt(0),
                tokensBought: BigInt(0),
                tokensBurned: BigInt(0),
                tokensToLp: BigInt(0),
                timestamp: BigInt(Date.now() / 1000),
              },
            });
          } else if (log.includes("TokensBurned")) {
            events.push({
              type: "burn",
              data: {
                amount: BigInt(0),
                totalBurned: BigInt(0),
                circulatingSupply: BigInt(0),
                timestamp: BigInt(Date.now() / 1000),
              },
            });
          } else if (log.includes("LiquidityAdded")) {
            events.push({
              type: "liquidity",
              data: {
                usd1Amount: BigInt(0),
                tokenAmount: BigInt(0),
                timestamp: BigInt(Date.now() / 1000),
              },
            });
          } else if (log.includes("FlywheelCycleCompleted")) {
            events.push({
              type: "cycle",
              data: {
                cycleNumber: BigInt(0),
                totalBurned: BigInt(0),
                poolBalance: BigInt(0),
                circulatingSupply: BigInt(0),
                timestamp: BigInt(Date.now() / 1000),
              },
            });
          }
        } catch (error) {
          console.error("Error parsing event log:", error);
        }
      }
    }

    return events;
  }

  /**
   * Subscribe to real-time events
   */
  subscribeToEvents(callback: (event: FlywheelEvent) => void): number {
    return this.connection.onLogs(
      this.programId,
      (logs) => {
        const events = this.parseLogsForEvents(logs.logs);
        events.forEach(callback);
      },
      "confirmed"
    );
  }

  /**
   * Unsubscribe from events
   */
  async unsubscribeFromEvents(subscriptionId: number): Promise<void> {
    await this.connection.removeOnLogsListener(subscriptionId);
  }
}
