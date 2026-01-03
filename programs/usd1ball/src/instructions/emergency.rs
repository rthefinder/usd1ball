use anchor_lang::prelude::*;

use crate::{ErrorCode, GlobalState};

#[derive(Accounts)]
pub struct EmergencyPause<'info> {
    #[account(
        mut,
        seeds = [GlobalState::SEED_PREFIX],
        bump = global_state.bump,
        has_one = authority
    )]
    pub global_state: Account<'info, GlobalState>,

    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<EmergencyPause>) -> Result<()> {
    let global_state = &mut ctx.accounts.global_state;
    let clock = Clock::get()?;

    // Can only pause within 24h of deployment
    require!(
        global_state.can_emergency_pause(clock.unix_timestamp),
        ErrorCode::EmergencyPauseExpired
    );

    global_state.is_paused = true;

    msg!("Emergency pause activated");

    Ok(())
}
