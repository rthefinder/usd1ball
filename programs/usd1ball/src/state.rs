use anchor_lang::prelude::*;

/// Global state for the USD1BALL program
/// 
/// Tracks all flywheel mechanics and configuration
#[account]
pub struct GlobalState {
    /// Program authority (should be renounced or time-locked)
    pub authority: Pubkey,

    /// Mint address of USD1BALL token
    pub mint: Pubkey,

    /// USD1 token mint (for buyback pool)
    pub usd1_mint: Pubkey,

    /// Total supply (fixed, no minting after init)
    pub total_supply: u64,

    /// Total tokens burned
    pub total_burned: u64,

    /// Tax rate in basis points (e.g., 600 = 6%)
    pub tax_rate_bps: u16,

    /// USD1 amount that triggers buyback
    pub buyback_threshold: u64,

    /// Burn rate in basis points (% of buyback)
    pub burn_rate_bps: u16,

    /// LP rate in basis points (% of buyback)
    pub lp_rate_bps: u16,

    /// Total number of flywheel cycles executed
    pub flywheel_cycles: u64,

    /// Total USD1 used for buybacks
    pub total_buyback_usd1: u64,

    /// Total tokens added to LP
    pub total_lp_added: u64,

    /// Current buyback pool balance (USD1)
    pub buyback_pool_balance: u64,

    /// Timestamp of initialization
    pub initialized_at: i64,

    /// Timestamp of last buyback
    pub last_buyback_at: i64,

    /// Emergency pause flag
    pub is_paused: bool,

    /// Bump seed for PDA
    pub bump: u8,
}

impl GlobalState {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        32 + // mint
        32 + // usd1_mint
        8 +  // total_supply
        8 +  // total_burned
        2 +  // tax_rate_bps
        8 +  // buyback_threshold
        2 +  // burn_rate_bps
        2 +  // lp_rate_bps
        8 +  // flywheel_cycles
        8 +  // total_buyback_usd1
        8 +  // total_lp_added
        8 +  // buyback_pool_balance
        8 +  // initialized_at
        8 +  // last_buyback_at
        1 +  // is_paused
        1;   // bump

    pub const SEED_PREFIX: &'static [u8] = b"global-state";

    /// Check if emergency pause is still allowed (within 24h)
    pub fn can_emergency_pause(&self, current_time: i64) -> bool {
        const EMERGENCY_WINDOW: i64 = 24 * 60 * 60; // 24 hours
        current_time - self.initialized_at < EMERGENCY_WINDOW
    }

    /// Calculate circulating supply
    pub fn circulating_supply(&self) -> u64 {
        self.total_supply.saturating_sub(self.total_burned)
    }

    /// Check if buyback can be triggered
    pub fn can_trigger_buyback(&self) -> bool {
        !self.is_paused && self.buyback_pool_balance >= self.buyback_threshold
    }
}

/// Event emitted when buyback is triggered
#[event]
pub struct BuybackExecuted {
    pub cycle_number: u64,
    pub usd1_spent: u64,
    pub tokens_bought: u64,
    pub tokens_burned: u64,
    pub tokens_to_lp: u64,
    pub timestamp: i64,
}

/// Event emitted when tokens are burned
#[event]
pub struct TokensBurned {
    pub amount: u64,
    pub total_burned: u64,
    pub circulating_supply: u64,
    pub timestamp: i64,
}

/// Event emitted when LP is added
#[event]
pub struct LiquidityAdded {
    pub usd1_amount: u64,
    pub token_amount: u64,
    pub timestamp: i64,
}

/// Event emitted when tax is collected
#[event]
pub struct TaxCollected {
    pub from: Pubkey,
    pub to: Pubkey,
    pub amount_transferred: u64,
    pub tax_amount: u64,
    pub timestamp: i64,
}

/// Event emitted when flywheel cycle completes
#[event]
pub struct FlywheelCycleCompleted {
    pub cycle_number: u64,
    pub total_burned: u64,
    pub pool_balance: u64,
    pub circulating_supply: u64,
    pub timestamp: i64,
}
