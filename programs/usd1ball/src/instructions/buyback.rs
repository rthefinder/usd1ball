use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, Token, TokenAccount};

use crate::{
    BuybackExecuted, ErrorCode, FlywheelCycleCompleted, GlobalState, LiquidityAdded, TokensBurned,
};

#[derive(Accounts)]
pub struct TriggerBuyback<'info> {
    #[account(
        mut,
        seeds = [GlobalState::SEED_PREFIX],
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,

    /// USD1BALL mint
    #[account(mut)]
    pub mint: Account<'info, Mint>,

    /// Buyback pool (holds USD1)
    #[account(
        mut,
        token::authority = global_state,
    )]
    pub buyback_pool: Account<'info, TokenAccount>,

    /// Temporary account to receive bought tokens
    #[account(mut)]
    pub temp_token_account: Account<'info, TokenAccount>,

    /// LP token account (for adding liquidity)
    #[account(mut)]
    pub lp_token_account: Account<'info, TokenAccount>,

    /// LP USD1 account
    #[account(mut)]
    pub lp_usd1_account: Account<'info, TokenAccount>,

    /// Anyone can trigger if threshold met
    pub caller: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<TriggerBuyback>) -> Result<()> {
    let global_state = &mut ctx.accounts.global_state;
    let clock = Clock::get()?;

    // Verify threshold is met
    require!(
        global_state.can_trigger_buyback(),
        ErrorCode::BuybackThresholdNotMet
    );

    let usd1_to_spend = global_state.buyback_pool_balance;

    // SIMULATION: In production, this would interact with a DEX (Raydium/Orca)
    // For MVP, we use a simplified calculation
    // Price discovery would happen via actual swap on-chain
    
    // Simulated token purchase
    // In production: Use Raydium/Orca swap instruction here
    let tokens_bought = simulate_swap_usd1_for_tokens(usd1_to_spend);

    // Calculate distribution
    let tokens_to_burn = tokens_bought
        .checked_mul(global_state.burn_rate_bps as u64)
        .ok_or(ErrorCode::NumericalOverflow)?
        .checked_div(10000)
        .ok_or(ErrorCode::NumericalOverflow)?;

    let tokens_to_lp = tokens_bought
        .checked_mul(global_state.lp_rate_bps as u64)
        .ok_or(ErrorCode::NumericalOverflow)?
        .checked_div(10000)
        .ok_or(ErrorCode::NumericalOverflow)?;

    // Burn tokens
    if tokens_to_burn > 0 {
        let seeds = &[GlobalState::SEED_PREFIX, &[global_state.bump]];
        let signer = &[&seeds[..]];

        let cpi_accounts = Burn {
            mint: ctx.accounts.mint.to_account_info(),
            from: ctx.accounts.temp_token_account.to_account_info(),
            authority: global_state.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::burn(cpi_ctx, tokens_to_burn)?;

        global_state.total_burned = global_state
            .total_burned
            .checked_add(tokens_to_burn)
            .ok_or(ErrorCode::NumericalOverflow)?;

        emit!(TokensBurned {
            amount: tokens_to_burn,
            total_burned: global_state.total_burned,
            circulating_supply: global_state.circulating_supply(),
            timestamp: clock.unix_timestamp,
        });
    }

    // Add to LP
    if tokens_to_lp > 0 {
        // Transfer tokens to LP
        // In production: Add liquidity to Raydium/Orca pool
        global_state.total_lp_added = global_state
            .total_lp_added
            .checked_add(tokens_to_lp)
            .ok_or(ErrorCode::NumericalOverflow)?;

        emit!(LiquidityAdded {
            usd1_amount: 0, // Would be calculated in actual LP add
            token_amount: tokens_to_lp,
            timestamp: clock.unix_timestamp,
        });
    }

    // Update state
    global_state.flywheel_cycles = global_state
        .flywheel_cycles
        .checked_add(1)
        .ok_or(ErrorCode::NumericalOverflow)?;
    global_state.total_buyback_usd1 = global_state
        .total_buyback_usd1
        .checked_add(usd1_to_spend)
        .ok_or(ErrorCode::NumericalOverflow)?;
    global_state.buyback_pool_balance = 0;
    global_state.last_buyback_at = clock.unix_timestamp;

    // Emit events
    emit!(BuybackExecuted {
        cycle_number: global_state.flywheel_cycles,
        usd1_spent: usd1_to_spend,
        tokens_bought,
        tokens_burned: tokens_to_burn,
        tokens_to_lp,
        timestamp: clock.unix_timestamp,
    });

    emit!(FlywheelCycleCompleted {
        cycle_number: global_state.flywheel_cycles,
        total_burned: global_state.total_burned,
        pool_balance: global_state.buyback_pool_balance,
        circulating_supply: global_state.circulating_supply(),
        timestamp: clock.unix_timestamp,
    });

    msg!(
        "Flywheel cycle #{} completed: bought {} tokens, burned {}, LP {}",
        global_state.flywheel_cycles,
        tokens_bought,
        tokens_to_burn,
        tokens_to_lp
    );

    Ok(())
}

/// Simulates a swap from USD1 to USD1BALL tokens
/// In production, replace with actual DEX integration
fn simulate_swap_usd1_for_tokens(usd1_amount: u64) -> u64 {
    // Simplified constant product formula simulation
    // In production: Use actual Raydium/Orca swap
    // This is placeholder logic for testing
    usd1_amount.saturating_mul(100)
}
