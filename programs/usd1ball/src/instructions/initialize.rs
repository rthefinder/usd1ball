use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::{ErrorCode, GlobalState};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = GlobalState::LEN,
        seeds = [GlobalState::SEED_PREFIX],
        bump
    )]
    pub global_state: Account<'info, GlobalState>,

    /// USD1BALL token mint
    #[account(
        init,
        payer = authority,
        mint::decimals = 9,
        mint::authority = global_state,
    )]
    pub mint: Account<'info, Mint>,

    /// USD1 token mint (for buyback pool)
    pub usd1_mint: Account<'info, Mint>,

    /// Buyback pool token account (holds USD1)
    #[account(
        init,
        payer = authority,
        token::mint = usd1_mint,
        token::authority = global_state,
    )]
    pub buyback_pool: Account<'info, TokenAccount>,

    /// Authority wallet (should renounce after deployment)
    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<Initialize>,
    total_supply: u64,
    tax_rate_bps: u16,
    buyback_threshold: u64,
    burn_rate_bps: u16,
    lp_rate_bps: u16,
) -> Result<()> {
    // Validate parameters
    require!(total_supply > 0, ErrorCode::InvalidTotalSupply);
    require!(tax_rate_bps <= 2000, ErrorCode::InvalidTaxRate); // Max 20% tax
    require!(
        buyback_threshold > 0,
        ErrorCode::InvalidBuybackThreshold
    );
    require!(
        burn_rate_bps.saturating_add(lp_rate_bps) <= 10000,
        ErrorCode::InvalidDistributionRates
    );

    let global_state = &mut ctx.accounts.global_state;
    let clock = Clock::get()?;

    global_state.authority = ctx.accounts.authority.key();
    global_state.mint = ctx.accounts.mint.key();
    global_state.usd1_mint = ctx.accounts.usd1_mint.key();
    global_state.total_supply = total_supply;
    global_state.total_burned = 0;
    global_state.tax_rate_bps = tax_rate_bps;
    global_state.buyback_threshold = buyback_threshold;
    global_state.burn_rate_bps = burn_rate_bps;
    global_state.lp_rate_bps = lp_rate_bps;
    global_state.flywheel_cycles = 0;
    global_state.total_buyback_usd1 = 0;
    global_state.total_lp_added = 0;
    global_state.buyback_pool_balance = 0;
    global_state.initialized_at = clock.unix_timestamp;
    global_state.last_buyback_at = 0;
    global_state.is_paused = false;
    global_state.bump = ctx.bumps.global_state;

    // Mint total supply to authority
    let seeds = &[GlobalState::SEED_PREFIX, &[global_state.bump]];
    let signer = &[&seeds[..]];

    let cpi_accounts = token::MintTo {
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.authority.to_account_info(),
        authority: global_state.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    token::mint_to(cpi_ctx, total_supply)?;

    msg!(
        "USD1BALL initialized: supply={}, tax={}bps, threshold={}, burn={}%, lp={}%",
        total_supply,
        tax_rate_bps,
        buyback_threshold,
        burn_rate_bps / 100,
        lp_rate_bps / 100
    );

    Ok(())
}
