import { PublicKey } from "@solana/web3.js";
import { GLOBAL_STATE_SEED, USD1BALL_PROGRAM_ID, BASIS_POINTS, TOKEN_DECIMALS } from "./constants";

/**
 * Utility Functions for USD1BALL
 */

/**
 * Derive the global state PDA
 */
export function deriveGlobalStatePDA(): [PublicKey, number] {
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(GLOBAL_STATE_SEED)],
    USD1BALL_PROGRAM_ID
  );
  return [pda, bump];
}

/**
 * Calculate tax amount from transfer amount
 */
export function calculateTax(amount: bigint, taxRateBps: number): bigint {
  return (amount * BigInt(taxRateBps)) / BigInt(BASIS_POINTS);
}

/**
 * Calculate amount after tax
 */
export function calculateAfterTax(amount: bigint, taxRateBps: number): bigint {
  const tax = calculateTax(amount, taxRateBps);
  return amount - tax;
}

/**
 * Calculate burn amount from buyback
 */
export function calculateBurnAmount(buybackAmount: bigint, burnRateBps: number): bigint {
  return (buybackAmount * BigInt(burnRateBps)) / BigInt(BASIS_POINTS);
}

/**
 * Calculate LP amount from buyback
 */
export function calculateLpAmount(buybackAmount: bigint, lpRateBps: number): bigint {
  return (buybackAmount * BigInt(lpRateBps)) / BigInt(BASIS_POINTS);
}

/**
 * Format token amount with decimals
 */
export function formatTokenAmount(amount: bigint, decimals: number = TOKEN_DECIMALS): string {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;
  
  const fractionStr = fraction.toString().padStart(decimals, "0");
  const trimmedFraction = fractionStr.replace(/0+$/, "");
  
  if (trimmedFraction.length === 0) {
    return whole.toString();
  }
  
  return `${whole}.${trimmedFraction}`;
}

/**
 * Parse token amount from string
 */
export function parseTokenAmount(amount: string, decimals: number = TOKEN_DECIMALS): bigint {
  const [whole, fraction = ""] = amount.split(".");
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(whole) * BigInt(10 ** decimals) + BigInt(paddedFraction);
}

/**
 * Calculate circulating supply
 */
export function calculateCirculatingSupply(totalSupply: bigint, totalBurned: bigint): bigint {
  return totalSupply - totalBurned;
}

/**
 * Calculate percentage of total supply
 */
export function calculateSupplyPercentage(amount: bigint, totalSupply: bigint): number {
  if (totalSupply === BigInt(0)) return 0;
  return Number((amount * BigInt(10000)) / totalSupply) / 100;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format basis points to percentage
 */
export function formatBps(bps: number): string {
  return formatPercentage(bps / 100);
}

/**
 * Check if buyback can be triggered
 */
export function canTriggerBuyback(
  poolBalance: bigint,
  threshold: bigint,
  isPaused: boolean
): boolean {
  return !isPaused && poolBalance >= threshold;
}

/**
 * Format timestamp to readable date
 */
export function formatTimestamp(timestamp: bigint | number): string {
  const ts = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  return new Date(ts * 1000).toLocaleString();
}

/**
 * Calculate time until next possible buyback
 */
export function timeUntilBuyback(
  currentPoolBalance: bigint,
  threshold: bigint,
  taxRate: number,
  estimatedDailyVolume: bigint
): number | null {
  if (currentPoolBalance >= threshold) return 0;
  
  const remaining = threshold - currentPoolBalance;
  const dailyTaxIncome = (estimatedDailyVolume * BigInt(taxRate)) / BigInt(BASIS_POINTS);
  
  if (dailyTaxIncome === BigInt(0)) return null;
  
  const daysRemaining = Number(remaining / dailyTaxIncome);
  return Math.ceil(daysRemaining);
}

/**
 * Validate tax rate
 */
export function isValidTaxRate(taxRateBps: number): boolean {
  return taxRateBps >= 0 && taxRateBps <= 2000; // Max 20%
}

/**
 * Validate distribution rates
 */
export function isValidDistributionRates(burnRateBps: number, lpRateBps: number): boolean {
  return burnRateBps + lpRateBps <= BASIS_POINTS;
}

/**
 * Short address format (for display)
 */
export function shortAddress(address: PublicKey | string, chars: number = 4): string {
  const addr = typeof address === "string" ? address : address.toBase58();
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}
