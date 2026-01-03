#!/usr/bin/env bash
#
# Simulate USD1BALL flywheel mechanics locally
#
# Usage: ./scripts/simulate.sh

set -e

echo "🎮 USD1BALL Flywheel Simulation"
echo "==============================="
echo ""

echo "Starting local validator..."
# Start validator in background if not running
if ! pgrep -x "solana-test-validator" > /dev/null; then
    solana-test-validator > /dev/null 2>&1 &
    VALIDATOR_PID=$!
    sleep 5
    echo "✅ Validator started (PID: $VALIDATOR_PID)"
else
    echo "✅ Validator already running"
fi

# Set to localhost
solana config set --url localhost

echo ""
echo "📦 Building program..."
cd programs/usd1ball
anchor build

echo ""
echo "🚀 Deploying to local validator..."
anchor deploy --provider.cluster localnet

echo ""
echo "🧪 Running simulation tests..."
anchor test --skip-local-validator

echo ""
echo "📊 Simulation Results:"
echo "- Check test output above for flywheel cycles"
echo "- View logs for buyback triggers"
echo "- Verify burn amounts and LP additions"
echo ""

echo "✅ Simulation complete!"
echo ""
echo "To stop validator: pkill solana-test-validator"
