import {
  FlywheelMetrics,
  GlobalState,
  calculateCirculatingSupply,
  calculateSupplyPercentage,
  formatTokenAmount,
  formatBps,
} from "@usd1ball/shared";

/**
 * Compute derived metrics from global state
 */
export class MetricsCalculator {
  /**
   * Calculate burn rate percentage
   */
  static calculateBurnRate(totalSupply: bigint, totalBurned: bigint): number {
    if (totalSupply === BigInt(0)) return 0;
    return Number((totalBurned * BigInt(10000)) / totalSupply) / 100;
  }

  /**
   * Calculate average buyback size
   */
  static calculateAverageBuyback(totalBuybacks: bigint, cycles: bigint): bigint {
    if (cycles === BigInt(0)) return BigInt(0);
    return totalBuybacks / cycles;
  }

  /**
   * Calculate progress to next buyback
   */
  static calculateBuybackProgress(
    currentBalance: bigint,
    threshold: bigint
  ): number {
    if (threshold === BigInt(0)) return 0;
    const progress = Number((currentBalance * BigInt(10000)) / threshold) / 100;
    return Math.min(progress, 100);
  }

  /**
   * Estimate time to next buyback (in days)
   * Based on recent transaction volume
   */
  static estimateTimeToNextBuyback(
    currentBalance: bigint,
    threshold: bigint,
    taxRate: number,
    dailyVolume: bigint
  ): number | null {
    if (currentBalance >= threshold) return 0;

    const remaining = threshold - currentBalance;
    const dailyTaxIncome = (dailyVolume * BigInt(taxRate)) / BigInt(10000);

    if (dailyTaxIncome === BigInt(0)) return null;

    return Math.ceil(Number(remaining / dailyTaxIncome));
  }

  /**
   * Calculate flywheel efficiency
   * (tokens burned per cycle)
   */
  static calculateFlywheelEfficiency(
    totalBurned: bigint,
    cycles: bigint
  ): bigint {
    if (cycles === BigInt(0)) return BigInt(0);
    return totalBurned / cycles;
  }

  /**
   * Format complete metrics summary
   */
  static formatMetricsSummary(
    globalState: GlobalState,
    metrics: FlywheelMetrics
  ): MetricsSummary {
    const circulatingSupply = calculateCirculatingSupply(
      globalState.totalSupply,
      globalState.totalBurned
    );

    const burnRate = this.calculateBurnRate(
      globalState.totalSupply,
      globalState.totalBurned
    );

    const buybackProgress = this.calculateBuybackProgress(
      globalState.buybackPoolBalance,
      globalState.buybackThreshold
    );

    const averageBuyback = this.calculateAverageBuyback(
      metrics.totalBuybacks,
      metrics.flywheelCycles
    );

    return {
      totalSupply: formatTokenAmount(globalState.totalSupply),
      circulatingSupply: formatTokenAmount(circulatingSupply),
      totalBurned: formatTokenAmount(globalState.totalBurned),
      burnRate: `${burnRate.toFixed(2)}%`,
      flywheelCycles: metrics.flywheelCycles.toString(),
      currentPoolBalance: formatTokenAmount(globalState.buybackPoolBalance),
      buybackThreshold: formatTokenAmount(globalState.buybackThreshold),
      buybackProgress: `${buybackProgress.toFixed(2)}%`,
      totalBuybacksUsd1: formatTokenAmount(metrics.totalBuybacks),
      averageBuybackSize: formatTokenAmount(averageBuyback),
      totalLpAdded: formatTokenAmount(metrics.totalLpAdded),
      taxRate: formatBps(globalState.taxRateBps),
      burnRateConfig: formatBps(globalState.burnRateBps),
      lpRateConfig: formatBps(globalState.lpRateBps),
      isPaused: globalState.isPaused,
      lastBuyback: globalState.lastBuybackAt.toString(),
    };
  }

  /**
   * Calculate health metrics
   */
  static calculateHealthMetrics(globalState: GlobalState): HealthMetrics {
    const circulatingSupply = calculateCirculatingSupply(
      globalState.totalSupply,
      globalState.totalBurned
    );

    const supplyReduction = calculateSupplyPercentage(
      globalState.totalBurned,
      globalState.totalSupply
    );

    const flywheelActive =
      !globalState.isPaused &&
      globalState.buybackPoolBalance >= globalState.buybackThreshold;

    const configValid =
      globalState.taxRateBps <= 2000 &&
      globalState.burnRateBps + globalState.lpRateBps <= 10000;

    return {
      circulatingSupply,
      supplyReduction,
      flywheelActive,
      configValid,
      isPaused: globalState.isPaused,
      totalCycles: globalState.flywheelCycles,
    };
  }
}

/**
 * Metrics Summary Interface
 */
export interface MetricsSummary {
  totalSupply: string;
  circulatingSupply: string;
  totalBurned: string;
  burnRate: string;
  flywheelCycles: string;
  currentPoolBalance: string;
  buybackThreshold: string;
  buybackProgress: string;
  totalBuybacksUsd1: string;
  averageBuybackSize: string;
  totalLpAdded: string;
  taxRate: string;
  burnRateConfig: string;
  lpRateConfig: string;
  isPaused: boolean;
  lastBuyback: string;
}

/**
 * Health Metrics Interface
 */
export interface HealthMetrics {
  circulatingSupply: bigint;
  supplyReduction: number;
  flywheelActive: boolean;
  configValid: boolean;
  isPaused: boolean;
  totalCycles: bigint;
}
