use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer as SplTransfer};

use crate::{ErrorCode, GlobalState, TaxCollected};

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(
        mut,
        seeds = [GlobalState::SEED_PREFIX],
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,

    /// From token account
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,

    /// To token account
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,

    /// USD1 account of sender (for tax payment)
    #[account(mut)]
    pub from_usd1_account: Account<'info, TokenAccount>,

    /// Buyback pool (receives tax in USD1)
    #[account(
        mut,
        token::authority = global_state,
    )]
    pub buyback_pool: Account<'info, TokenAccount>,

    /// Signer
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<Transfer>, amount: u64) -> Result<()> {
    let global_state = &mut ctx.accounts.global_state;

    // Check if paused
    require!(!global_state.is_paused, ErrorCode::ProgramPaused);

    // Check balance
    require!(
        ctx.accounts.from.amount >= amount,
        ErrorCode::InsufficientBalance
    );

    // Calculate tax in USD1
    // Tax is paid in USD1, not in USD1BALL tokens
    // This creates constant buying pressure in USD1
    let tax_amount_usd1 = amount
        .checked_mul(global_state.tax_rate_bps as u64)
        .ok_or(ErrorCode::TaxCalculationOverflow)?
        .checked_div(10000)
        .ok_or(ErrorCode::TaxCalculationOverflow)?;

    // Transfer USD1BALL tokens (full amount)
    let cpi_accounts = SplTransfer {
        from: ctx.accounts.from.to_account_info(),
        to: ctx.accounts.to.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, amount)?;

    // Transfer USD1 tax to buyback pool
    if tax_amount_usd1 > 0 {
        let cpi_accounts = SplTransfer {
            from: ctx.accounts.from_usd1_account.to_account_info(),
            to: ctx.accounts.buyback_pool.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, tax_amount_usd1)?;

        // Update pool balance
        global_state.buyback_pool_balance = global_state
            .buyback_pool_balance
            .checked_add(tax_amount_usd1)
            .ok_or(ErrorCode::NumericalOverflow)?;
    }

    // Emit event
    emit!(TaxCollected {
        from: ctx.accounts.from.key(),
        to: ctx.accounts.to.key(),
        amount_transferred: amount,
        tax_amount: tax_amount_usd1,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}
