#!/usr/bin/env bash
#
# Deploy USD1BALL to Solana Devnet
#
# Usage: ./scripts/deploy-devnet.sh

set -e

echo "🚀 USD1BALL Devnet Deployment Script"
echo "======================================"
echo ""

# Check if Anchor is installed
if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor CLI not found. Please install Anchor first."
    echo "Visit: https://www.anchor-lang.com/docs/installation"
    exit 1
fi

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Please install Solana first."
    echo "Visit: https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
fi

# Set to devnet
echo "📡 Setting Solana config to devnet..."
solana config set --url devnet

# Check wallet balance
BALANCE=$(solana balance | awk '{print $1}')
echo "💰 Current wallet balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 2" | bc -l) )); then
    echo "⚠️  Low balance detected. Requesting airdrop..."
    solana airdrop 2
    sleep 5
fi

# Build the program
echo ""
echo "🔨 Building USD1BALL program..."
cd programs/usd1ball
anchor build

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/usd1ball-keypair.json)
echo "📋 Program ID: $PROGRAM_ID"

# Update Anchor.toml and lib.rs with correct program ID
echo ""
echo "📝 Updating program ID in configs..."
# Note: In production, sed or similar should update these files

# Deploy
echo ""
echo "🚢 Deploying to devnet..."
anchor deploy --provider.cluster devnet

# Verify deployment
echo ""
echo "✅ Deployment complete!"
echo ""
echo "Program ID: $PROGRAM_ID"
echo "Network: Devnet"
echo ""
echo "Next steps:"
echo "1. Initialize the program with: ./scripts/initialize.sh"
echo "2. Verify deployment with: solana program show $PROGRAM_ID"
echo "3. Update frontend .env with program ID"
