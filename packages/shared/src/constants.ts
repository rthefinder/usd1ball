import { PublicKey } from "@solana/web3.js";

/**
 * USD1BALL Program Constants
 */

// Program ID (must match Anchor.toml after deployment)
export const USD1BALL_PROGRAM_ID = new PublicKey(
  "USD1vV5XrGPULS4qmZmxhSJCx7xKKxHpAKbB7a11BALL"
);

// Global state PDA seed
export const GLOBAL_STATE_SEED = "global-state";

// Token configuration
export const TOKEN_DECIMALS = 9;
export const TOKEN_SYMBOL = "USD1BALL";
export const TOKEN_NAME = "USD1BALL Token";

// Default tokenomics parameters
export const DEFAULT_TAX_RATE_BPS = 600; // 6%
export const DEFAULT_BUYBACK_THRESHOLD = 1000 * 10 ** 6; // 1000 USD1 (assuming 6 decimals)
export const DEFAULT_BURN_RATE_BPS = 5000; // 50% of buyback
export const DEFAULT_LP_RATE_BPS = 3000; // 30% of buyback

// Constraints
export const MAX_TAX_RATE_BPS = 2000; // 20% maximum tax
export const BASIS_POINTS = 10000;

// Time constants
export const EMERGENCY_PAUSE_WINDOW = 24 * 60 * 60; // 24 hours in seconds

// Network endpoints
export const DEVNET_RPC = "https://api.devnet.solana.com";
export const MAINNET_RPC = "https://api.mainnet-beta.solana.com";

// USD1 Mint (replace with actual USD1 mint address)
export const USD1_MINT_DEVNET = new PublicKey(
  "USD1MintDevnetAddressHere111111111111111111"
);
export const USD1_MINT_MAINNET = new PublicKey(
  "USD1MintMainnetAddressHere11111111111111111"
);

// Display constants
export const FLYWHEEL_CYCLE_DISPLAY_LIMIT = 100;
export const METRICS_REFRESH_INTERVAL = 10000; // 10 seconds
