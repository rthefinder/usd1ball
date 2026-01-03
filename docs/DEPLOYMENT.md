# USD1BALL Deployment Guide

## Prerequisites

### Required Tools
- **Solana CLI** v1.17+
- **Anchor** v0.29+
- **Node.js** v18+
- **pnpm** v8+
- **Rust** 1.70+

### Setup

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

# Verify installations
solana --version
anchor --version
```

### Wallet Setup

```bash
# Generate keypair (if needed)
solana-keygen new --outfile ~/.config/solana/id.json

# Check address
solana address

# Fund wallet (devnet)
solana airdrop 2 --url devnet
```

## Deployment Steps

### 1. Clone & Install

```bash
git clone <repository-url>
cd usd1ball
pnpm install
```

### 2. Configure Parameters

Edit deployment configuration:

```bash
# scripts/deploy-config.json
{
  "totalSupply": "1000000000000000000",  # 1B tokens, 9 decimals
  "taxRateBps": 600,                     # 6%
  "buybackThreshold": "1000000000",      # 1000 USD1
  "burnRateBps": 5000,                   # 50%
  "lpRateBps": 3000                      # 30%
}
```

**Validate**:
- Tax rate ≤ 2000 bps (20%)
- Burn + LP ≤ 10000 bps (100%)
- Threshold > 0

### 3. Build Program

```bash
cd programs/usd1ball
anchor build
```

Get program ID:
```bash
solana address -k target/deploy/usd1ball-keypair.json
```

### 4. Update Program ID

Update in:
- `Anchor.toml`: `[programs.devnet]` section
- `programs/usd1ball/src/lib.rs`: `declare_id!` macro
- `packages/shared/src/constants.ts`: `USD1BALL_PROGRAM_ID`

Rebuild after updates:
```bash
anchor build
```

### 5. Deploy to Devnet

```bash
# Set cluster
solana config set --url devnet

# Deploy
anchor deploy --provider.cluster devnet

# Note the program ID from output
```

### 6. Initialize Program

```bash
./scripts/initialize.sh
```

Or manually:

```bash
anchor run initialize \
  --provider.cluster devnet \
  -- \
  --total-supply 1000000000000000000 \
  --tax-rate 600 \
  --threshold 1000000000 \
  --burn-rate 5000 \
  --lp-rate 3000
```

### 7. Verify Deployment

```bash
./scripts/verify.sh <PROGRAM_ID>
```

Check:
- ✅ Program is deployed
- ✅ Global state is initialized
- ✅ Parameters are correct
- ✅ No mint authority
- ✅ Ownership handled

### 8. Create Token Accounts

```bash
# Create associated token accounts as needed
spl-token create-account <MINT_ADDRESS>
```

### 9. Add Initial Liquidity

If deploying with initial LP:

```bash
# Add liquidity to DEX (Raydium/Orca)
# Follow DEX-specific instructions
```

### 10. Update Frontend

```bash
# apps/web/.env.local
NEXT_PUBLIC_PROGRAM_ID=<YOUR_PROGRAM_ID>
NEXT_PUBLIC_USD1BALL_MINT=<MINT_ADDRESS>
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
```

Build and deploy frontend:

```bash
cd apps/web
pnpm build
# Deploy to Vercel/Netlify/etc
```

## Mainnet Deployment

⚠️ **CRITICAL CHECKLIST BEFORE MAINNET**

### Pre-Deployment
- [ ] Full test coverage passing
- [ ] Simulation tests successful
- [ ] Security audit completed
- [ ] Code review by multiple devs
- [ ] Documentation complete
- [ ] Community announcement prepared
- [ ] Emergency procedures documented

### Deployment Process

Same as devnet but with extra care:

```bash
# Set to mainnet
solana config set --url mainnet-beta

# Ensure sufficient SOL for deployment
solana balance

# Deploy
anchor deploy --provider.cluster mainnet
```

### Post-Deployment Security

#### 1. Verify No Mint Authority

```bash
spl-token display <MINT_ADDRESS>
```

Ensure:
```
Mint authority: (None)
```

#### 2. Handle Program Authority

**Option A: Renounce (Recommended)**
```bash
solana program set-upgrade-authority \
  <PROGRAM_ID> \
  --final \
  --url mainnet-beta
```

**Option B: Time-Lock**
```bash
# Transfer to multisig/timelock contract
solana program set-upgrade-authority \
  <PROGRAM_ID> \
  <TIMELOCK_ADDRESS> \
  --url mainnet-beta
```

#### 3. Verify on Explorer

Check on Solana Explorer:
- Program is deployed
- Authority is renounced/time-locked
- Global state is initialized
- No upgrade capability

### Post-Deployment

1. **Test Transfers**
   ```bash
   # Small test transfer
   spl-token transfer <MINT> <AMOUNT> <RECIPIENT>
   ```

2. **Monitor Events**
   ```bash
   # Watch for tax collection events
   solana logs <PROGRAM_ID>
   ```

3. **Verify Tax Flow**
   - Confirm USD1 accumulates in buyback pool
   - Check tax calculations are correct

4. **Test Buyback Trigger**
   - Fund pool to threshold
   - Trigger first buyback
   - Verify burn and LP additions

5. **Announce Launch**
   - Publish contract address
   - Share documentation
   - Provide verification instructions

## Troubleshooting

### Deployment Fails

**Insufficient funds**:
```bash
solana balance
solana airdrop 2  # devnet only
```

**Program already deployed**:
```bash
# Use existing keypair or generate new one
solana-keygen new -o new-program-keypair.json
```

### Initialization Fails

**Account already exists**:
- Use different program ID
- Or close existing account first

**Invalid parameters**:
- Check parameter constraints
- Verify math (burn + LP ≤ 100%)

### Verification Fails

**Program not found**:
- Wait for chain confirmation
- Check correct cluster
- Verify program ID

## Rollback Procedure

If critical bug discovered:

1. **Emergency Pause** (within 24h only):
   ```bash
   anchor run emergency-pause --provider.cluster <cluster>
   ```

2. **Assess Damage**:
   - Check affected accounts
   - Calculate losses
   - Document issue

3. **Fix & Redeploy**:
   - Fix bug
   - Full test suite
   - Deploy new program
   - Migrate if needed

4. **Communication**:
   - Immediate announcement
   - Explain issue
   - Provide migration path

## Monitoring

### On-Chain Metrics

Monitor continuously:
- Global state values
- Buyback pool balance
- Cycle count
- Total burned

### Dashboard

Deploy monitoring dashboard:
```bash
cd apps/web
pnpm dev
```

### Alerts

Set up alerts for:
- Unexpected burns
- Failed buybacks
- Parameter changes (shouldn't happen)
- Large transfers

## Upgrade Path

If upgrade mechanism enabled:

```bash
# Build new version
anchor build

# Deploy upgrade
anchor upgrade <PROGRAM_ID> \
  --program-keypair <KEYPAIR> \
  --provider.cluster <cluster>
```

⚠️ **Recommendation**: Renounce upgrade authority after confirming stability.

## Appendix

### Network Endpoints

**Devnet**:
- RPC: https://api.devnet.solana.com
- Explorer: https://explorer.solana.com/?cluster=devnet

**Mainnet**:
- RPC: https://api.mainnet-beta.solana.com
- Explorer: https://explorer.solana.com/

### Useful Commands

```bash
# Check program
solana program show <PROGRAM_ID>

# Get account info
solana account <ADDRESS>

# View logs
solana logs <PROGRAM_ID>

# Get token info
spl-token display <MINT>
```

### Cost Estimates

**Devnet** (free via airdrops):
- Program deployment: ~5-10 SOL
- Account creation: ~0.002 SOL each
- Transactions: ~0.000005 SOL each

**Mainnet** (real cost):
- Program deployment: ~5-10 SOL
- Plus gas for initialization
- Keep buffer for operations

## Support

For deployment issues:
1. Check logs: `solana logs`
2. Review documentation
3. Search existing issues
4. Ask in community Discord (if applicable)

---

**Remember**: Mainnet deployment is permanent. Test thoroughly on devnet first.
