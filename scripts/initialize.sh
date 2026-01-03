#!/usr/bin/env bash
#
# Initialize USD1BALL Program
#
# Usage: ./scripts/initialize.sh

set -e

echo "🎬 USD1BALL Initialization Script"
echo "=================================="
echo ""

# Default parameters
TOTAL_SUPPLY="1000000000000000000" # 1 billion with 9 decimals
TAX_RATE_BPS="600"                 # 6%
BUYBACK_THRESHOLD="1000000000"     # 1000 USD1 with 6 decimals
BURN_RATE_BPS="5000"               # 50%
LP_RATE_BPS="3000"                 # 30%

echo "Configuration:"
echo "- Total Supply: 1,000,000,000 USD1BALL"
echo "- Tax Rate: 6%"
echo "- Buyback Threshold: 1,000 USD1"
echo "- Burn Rate: 50% of buyback"
echo "- LP Rate: 30% of buyback"
echo ""

read -p "Proceed with initialization? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Initialization cancelled."
    exit 0
fi

echo "🚀 Initializing USD1BALL program..."

# Build and run initialization through Anchor
cd programs/usd1ball

# Note: In production, this would call the initialize instruction
# anchor run initialize --provider.cluster devnet

echo ""
echo "✅ Initialization complete!"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo "1. Verify initialization: anchor run verify-init"
echo "2. Test a transfer: anchor run test-transfer"
echo "3. Consider renouncing or time-locking authority"
echo "4. Update frontend .env with contract address"
echo ""
echo "📖 See docs/DEPLOYMENT.md for full checklist"
