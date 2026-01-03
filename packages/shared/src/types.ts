import { PublicKey } from "@solana/web3.js";

/**
 * Global State Account Structure
 */
export interface GlobalState {
  authority: PublicKey;
  mint: PublicKey;
  usd1Mint: PublicKey;
  totalSupply: bigint;
  totalBurned: bigint;
  taxRateBps: number;
  buybackThreshold: bigint;
  burnRateBps: number;
  lpRateBps: number;
  flywheelCycles: bigint;
  totalBuybackUsd1: bigint;
  totalLpAdded: bigint;
  buybackPoolBalance: bigint;
  initializedAt: bigint;
  lastBuybackAt: bigint;
  isPaused: boolean;
  bump: number;
}

/**
 * Flywheel Metrics
 */
export interface FlywheelMetrics {
  totalBurned: bigint;
  totalBuybacks: bigint;
  currentPoolBalance: bigint;
  flywheelCycles: bigint;
  totalLpAdded: bigint;
}

/**
 * Buyback Event
 */
export interface BuybackEvent {
  cycleNumber: bigint;
  usd1Spent: bigint;
  tokensBought: bigint;
  tokensBurned: bigint;
  tokensToLp: bigint;
  timestamp: bigint;
}

/**
 * Tax Collected Event
 */
export interface TaxCollectedEvent {
  from: PublicKey;
  to: PublicKey;
  amountTransferred: bigint;
  taxAmount: bigint;
  timestamp: bigint;
}

/**
 * Tokens Burned Event
 */
export interface TokensBurnedEvent {
  amount: bigint;
  totalBurned: bigint;
  circulatingSupply: bigint;
  timestamp: bigint;
}

/**
 * Liquidity Added Event
 */
export interface LiquidityAddedEvent {
  usd1Amount: bigint;
  tokenAmount: bigint;
  timestamp: bigint;
}

/**
 * Flywheel Cycle Completed Event
 */
export interface FlywheelCycleCompletedEvent {
  cycleNumber: bigint;
  totalBurned: bigint;
  poolBalance: bigint;
  circulatingSupply: bigint;
  timestamp: bigint;
}

/**
 * Dashboard Data
 */
export interface DashboardData {
  globalState: GlobalState;
  metrics: FlywheelMetrics;
  recentEvents: FlywheelEvent[];
  priceData?: PriceData;
}

/**
 * Flywheel Event Union Type
 */
export type FlywheelEvent =
  | { type: "buyback"; data: BuybackEvent }
  | { type: "burn"; data: TokensBurnedEvent }
  | { type: "liquidity"; data: LiquidityAddedEvent }
  | { type: "cycle"; data: FlywheelCycleCompletedEvent };

/**
 * Price Data (from DEX)
 */
export interface PriceData {
  priceUsd1: number;
  priceUsd: number;
  liquidityUsd1: bigint;
  liquidityToken: bigint;
  volume24h: bigint;
  lastUpdated: number;
}

/**
 * Wallet Holdings
 */
export interface WalletHoldings {
  address: PublicKey;
  balance: bigint;
  balanceUsd1: number;
  percentageOfSupply: number;
}

/**
 * Transaction Parameters
 */
export interface TransferParams {
  from: PublicKey;
  to: PublicKey;
  amount: bigint;
}

export interface InitializeParams {
  totalSupply: bigint;
  taxRateBps: number;
  buybackThreshold: bigint;
  burnRateBps: number;
  lpRateBps: number;
}
