use anchor_lang::prelude::*;

use crate::{FlywheelMetrics, GlobalState};

#[derive(Accounts)]
pub struct GetMetrics<'info> {
    #[account(
        seeds = [GlobalState::SEED_PREFIX],
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,
}

pub fn handler(ctx: Context<GetMetrics>) -> Result<FlywheelMetrics> {
    let global_state = &ctx.accounts.global_state;

    Ok(FlywheelMetrics {
        total_burned: global_state.total_burned,
        total_buybacks: global_state.total_buyback_usd1,
        current_pool_balance: global_state.buyback_pool_balance,
        flywheel_cycles: global_state.flywheel_cycles,
        total_lp_added: global_state.total_lp_added,
    })
}
