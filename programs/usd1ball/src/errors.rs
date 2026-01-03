use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Tax rate must be between 0 and 2000 basis points (20%)")]
    InvalidTaxRate,

    #[msg("Burn rate + LP rate must not exceed 10000 basis points (100%)")]
    InvalidDistributionRates,

    #[msg("Buyback threshold must be greater than zero")]
    InvalidBuybackThreshold,

    #[msg("Total supply must be greater than zero")]
    InvalidTotalSupply,

    #[msg("Insufficient balance for transfer")]
    InsufficientBalance,

    #[msg("Tax calculation overflow")]
    TaxCalculationOverflow,

    #[msg("Buyback threshold not met")]
    BuybackThresholdNotMet,

    #[msg("Buyback pool balance insufficient")]
    InsufficientPoolBalance,

    #[msg("Emergency pause period expired (24h after deployment)")]
    EmergencyPauseExpired,

    #[msg("Program is paused")]
    ProgramPaused,

    #[msg("Unauthorized")]
    Unauthorized,

    #[msg("Numerical overflow")]
    NumericalOverflow,

    #[msg("Invalid account")]
    InvalidAccount,

    #[msg("Slippage tolerance exceeded")]
    SlippageExceeded,
}
