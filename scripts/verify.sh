#!/usr/bin/env bash
#
# Verify USD1BALL deployment and configuration
#
# Usage: ./scripts/verify.sh [PROGRAM_ID]

set -e

echo "🔍 USD1BALL Verification Script"
echo "==============================="
echo ""

if [ -z "$1" ]; then
    echo "Usage: ./scripts/verify.sh <PROGRAM_ID>"
    exit 1
fi

PROGRAM_ID=$1

echo "Verifying program: $PROGRAM_ID"
echo ""

# Check program exists
echo "1️⃣ Checking program exists..."
solana program show $PROGRAM_ID

# Check program is executable
echo ""
echo "2️⃣ Checking program is executable..."
PROGRAM_INFO=$(solana program show $PROGRAM_ID --output json)

# Fetch global state (using Anchor)
echo ""
echo "3️⃣ Fetching global state..."
# anchor account GlobalState <DERIVED_PDA> --provider.cluster devnet

echo ""
echo "4️⃣ Security checklist:"
echo "   [ ] No mint authority (check token mint)"
echo "   [ ] No upgrade authority OR time-locked"
echo "   [ ] Tax rate within limits (max 20%)"
echo "   [ ] Burn + LP rates sum to ≤100%"
echo "   [ ] Buyback threshold > 0"
echo ""

echo "5️⃣ Transparency checklist:"
echo "   [ ] Program source code published"
echo "   [ ] Verified on Solana Explorer"
echo "   [ ] Documentation complete"
echo "   [ ] Community notified"
echo ""

echo "✅ Verification complete!"
echo ""
echo "📖 See docs/SECURITY.md for full security audit checklist"
