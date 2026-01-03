use anchor_lang::prelude::*;

declare_id!("USD1vV5XrGPULS4qmZmxhSJCx7xKKxHpAKbB7a11BALL");

pub mod errors;
pub mod instructions;
pub mod state;

pub use errors::*;
pub use instructions::*;
pub use state::*;

/// USD1BALL Program
/// 
/// A flywheel-based meme coin built on the USD1 meta with:
/// - Automated buyback and burn mechanics
/// - Tax-based redistribution
/// - Deterministic triggers
/// - Full transparency
/// 
/// DISCLAIMER: This is a meme coin with deterministic mechanics.
/// Not financial advice. No guaranteed returns.
#[program]
pub mod usd1ball {
    use super::*;

    /// Initialize the USD1BALL program
    /// 
    /// Sets up the global state and configuration for the flywheel
    /// 
    /// # Arguments
    /// * `total_supply` - Total token supply (fixed, no mint after)
    /// * `tax_rate_bps` - Tax rate in basis points (e.g., 600 = 6%)
    /// * `buyback_threshold` - USD1 amount that triggers buyback
    /// * `burn_rate_bps` - Percentage of buyback to burn (e.g., 5000 = 50%)
    /// * `lp_rate_bps` - Percentage to add to LP (e.g., 3000 = 30%)
    pub fn initialize(
        ctx: Context<Initialize>,
        total_supply: u64,
        tax_rate_bps: u16,
        buyback_threshold: u64,
        burn_rate_bps: u16,
        lp_rate_bps: u16,
    ) -> Result<()> {
        instructions::initialize::handler(
            ctx,
            total_supply,
            tax_rate_bps,
            buyback_threshold,
            burn_rate_bps,
            lp_rate_bps,
        )
    }

    /// Execute a taxed transfer
    /// 
    /// Transfers tokens between accounts with automatic tax deduction
    /// Tax is routed to the buyback pool in USD1
    /// 
    /// # Arguments
    /// * `amount` - Amount to transfer (before tax)
    pub fn transfer(ctx: Context<Transfer>, amount: u64) -> Result<()> {
        instructions::transfer::handler(ctx, amount)
    }

    /// Trigger the flywheel buyback cycle
    /// 
    /// Can be called by anyone when threshold is met
    /// - Swaps accumulated USD1 for USD1BALL
    /// - Burns portion of bought tokens
    /// - Adds portion to LP
    /// - Emits flywheel event
    pub fn trigger_buyback(ctx: Context<TriggerBuyback>) -> Result<()> {
        instructions::buyback::handler(ctx)
    }

    /// Emergency pause (only during initialization period)
    /// 
    /// Can only be called by authority within first 24h after deployment
    /// Used to fix critical bugs - ownership should be renounced after
    pub fn emergency_pause(ctx: Context<EmergencyPause>) -> Result<()> {
        instructions::emergency::handler(ctx)
    }

    /// View current flywheel metrics
    /// 
    /// Returns read-only data about the current state
    pub fn get_metrics(ctx: Context<GetMetrics>) -> Result<FlywheelMetrics> {
        instructions::metrics::handler(ctx)
    }
}

/// Flywheel metrics structure returned by get_metrics
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct FlywheelMetrics {
    pub total_burned: u64,
    pub total_buybacks: u64,
    pub current_pool_balance: u64,
    pub flywheel_cycles: u64,
    pub total_lp_added: u64,
}
