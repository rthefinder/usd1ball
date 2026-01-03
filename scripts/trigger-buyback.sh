#!/usr/bin/env bash
#
# Trigger manual buyback (for testing)
#
# Usage: ./scripts/trigger-buyback.sh

set -e

echo "🔄 Manual Buyback Trigger"
echo "========================="
echo ""

read -p "⚠️  This will trigger a buyback cycle. Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo "🚀 Triggering buyback..."

# Call trigger_buyback instruction
# Note: In production, build proper transaction
cd programs/usd1ball
# anchor run trigger-buyback --provider.cluster devnet

echo ""
echo "✅ Buyback triggered!"
echo ""
echo "Check on-chain events for results:"
echo "- Tokens bought"
echo "- Tokens burned"
echo "- LP added"
echo ""
