# 🎯 USD1BALL - Command Reference

Quick reference for all commands you'll need.

---

## 📦 Installation & Setup

```bash
# Clone repository (if from git)
git clone <repo-url>
cd usd1ball

# Install all dependencies
pnpm install

# Build all packages
pnpm build
```

---

## 🔨 Development Commands

### Monorepo Commands (from root)

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run all linters
pnpm lint

# Type check all packages
pnpm typecheck

# Run all tests
pnpm test

# Format all code
pnpm format

# Clean build artifacts
pnpm clean  # (if added to package.json)
```

### Smart Contract (Anchor)

```bash
# Navigate to program
cd programs/usd1ball

# Build program
anchor build

# Run tests
anchor test

# Deploy to localnet
anchor deploy --provider.cluster localnet

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet
anchor deploy --provider.cluster mainnet

# Generate IDL
anchor build  # IDL generated automatically

# Get program ID
solana address -k target/deploy/usd1ball-keypair.json

# Clean build
cargo clean
```

### Frontend (Next.js)

```bash
# Navigate to web app
cd apps/web

# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Type check
pnpm typecheck

# Open on custom port
pnpm dev -- -p 3001
```

### Packages

```bash
# Build shared package
cd packages/shared
pnpm build

# Build analytics package
cd packages/analytics
pnpm build

# Watch mode (auto-rebuild)
pnpm dev
```

---

## 🧪 Testing Commands

```bash
# Run Anchor tests
cd programs/usd1ball
anchor test

# Run tests without starting validator
anchor test --skip-local-validator

# Run specific test file
anchor test tests/specific-test.ts

# Run with verbose output
anchor test --verbose
```

---

## 🚀 Deployment Commands

### Local Development

```bash
# Start local validator
solana-test-validator

# Deploy locally
cd programs/usd1ball
anchor deploy --provider.cluster localnet

# Run simulation
./scripts/simulate.sh
```

### Devnet Deployment

```bash
# Configure for devnet
solana config set --url devnet

# Check wallet balance
solana balance

# Request airdrop (devnet only)
solana airdrop 2

# Deploy using script
./scripts/deploy-devnet.sh

# Initialize program
./scripts/initialize.sh

# Verify deployment
./scripts/verify.sh <PROGRAM_ID>
```

### Mainnet Deployment

```bash
# Configure for mainnet
solana config set --url mainnet-beta

# Check balance (ensure sufficient SOL)
solana balance

# Deploy program
cd programs/usd1ball
anchor deploy --provider.cluster mainnet

# Verify deployment
solana program show <PROGRAM_ID>

# IMPORTANT: Renounce authority
solana program set-upgrade-authority \
  <PROGRAM_ID> \
  --final \
  --url mainnet-beta
```

---

## 🔍 Verification Commands

### Program Info

```bash
# Show program details
solana program show <PROGRAM_ID>

# Get program account info
solana account <PROGRAM_ID>

# Check upgrade authority
solana program show <PROGRAM_ID> | grep "Upgrade Authority"
```

### Token Info

```bash
# Display token info
spl-token display <MINT_ADDRESS>

# Check token supply
spl-token supply <MINT_ADDRESS>

# List token accounts
spl-token accounts <MINT_ADDRESS>
```

### Account Info

```bash
# Get account balance
solana balance <ADDRESS>

# Get account info
solana account <ADDRESS>

# Get token account balance
spl-token balance <MINT_ADDRESS> --owner <OWNER_ADDRESS>
```

---

## 🔧 Utility Commands

### Solana CLI

```bash
# Generate new keypair
solana-keygen new --outfile my-keypair.json

# Get public key from keypair
solana-keygen pubkey my-keypair.json

# Set config URL
solana config set --url <URL>

# Get current config
solana config get

# Check connection
solana cluster-version
```

### SPL Token

```bash
# Create new token
spl-token create-token

# Create token account
spl-token create-account <MINT_ADDRESS>

# Mint tokens (if authority available)
spl-token mint <MINT_ADDRESS> <AMOUNT>

# Transfer tokens
spl-token transfer <MINT_ADDRESS> <AMOUNT> <RECIPIENT>

# Burn tokens
spl-token burn <TOKEN_ACCOUNT> <AMOUNT>
```

### Anchor CLI

```bash
# Initialize new Anchor project
anchor init <project-name>

# Create new program
anchor new <program-name>

# Build program
anchor build

# Test program
anchor test

# Deploy program
anchor deploy

# Upgrade program
anchor upgrade <PROGRAM_ID>

# Get program IDL
anchor idl fetch <PROGRAM_ID>

# Verify program
anchor verify <PROGRAM_ID>
```

---

## 📊 Monitoring Commands

### View Logs

```bash
# Follow program logs
solana logs <PROGRAM_ID>

# View recent logs
solana logs --before <SIGNATURE>

# Filter logs
solana logs <PROGRAM_ID> | grep "Buyback"
```

### Transaction Info

```bash
# Get transaction details
solana transaction <SIGNATURE>

# Confirm transaction
solana confirm <SIGNATURE>

# Get recent block production
solana block-production
```

### Network Status

```bash
# Get cluster info
solana cluster-version

# Check validators
solana validators

# Get recent performance
solana ping
```

---

## 🎮 Script Commands

All scripts are in `/scripts` directory:

```bash
# Make scripts executable (first time only)
chmod +x scripts/*.sh

# Deploy to devnet
./scripts/deploy-devnet.sh

# Initialize program
./scripts/initialize.sh

# Verify deployment
./scripts/verify.sh <PROGRAM_ID>

# Run local simulation
./scripts/simulate.sh

# Trigger manual buyback
./scripts/trigger-buyback.sh
```

---

## 🔑 Wallet Management

```bash
# Set default wallet
solana config set --keypair ~/.config/solana/id.json

# List wallets
ls ~/.config/solana/

# Create wallet backup
cp ~/.config/solana/id.json ~/backup/

# Import wallet
solana-keygen recover -o imported-wallet.json
```

---

## 🌐 Frontend Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
cd apps/web
vercel

# Deploy to production
vercel --prod
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy to Netlify
cd apps/web
pnpm build
netlify deploy --prod --dir=.next
```

### Custom Server

```bash
# Build frontend
cd apps/web
pnpm build

# Start server
pnpm start

# With PM2
pm2 start pnpm --name usd1ball-web -- start
```

---

## 🐛 Debugging Commands

### Anchor Debugging

```bash
# Build with debug symbols
anchor build

# Run with verbose output
RUST_LOG=debug anchor test

# Show expanded macros
cargo expand
```

### Solana Debugging

```bash
# Increase log level
export RUST_LOG=solana=debug

# View program logs
solana logs -v

# Get transaction details
solana transaction <SIGNATURE> --verbose
```

### Frontend Debugging

```bash
# Run with debug output
DEBUG=* pnpm dev

# Check build output
pnpm build --debug

# Analyze bundle
pnpm analyze  # (if configured)
```

---

## 📈 Performance Commands

### Program Size

```bash
# Check program size
ls -lh target/deploy/*.so

# Optimize build
anchor build --release
```

### Transaction Cost

```bash
# Estimate transaction cost
solana rent <DATA_SIZE>

# Get recent fees
solana fees
```

---

## 🔄 Maintenance Commands

### Update Dependencies

```bash
# Update pnpm packages
pnpm update

# Update Anchor
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

# Update Solana CLI
solana-install update
```

### Clean Build

```bash
# Clean Rust build
cd programs/usd1ball
cargo clean

# Clean Next.js build
cd apps/web
rm -rf .next

# Clean all node_modules
pnpm clean  # (if script added)
```

---

## 🎯 Quick Workflows

### Full Local Test

```bash
# 1. Start validator
solana-test-validator

# 2. Build and deploy (new terminal)
cd programs/usd1ball
anchor build
anchor deploy --provider.cluster localnet

# 3. Run tests
anchor test --skip-local-validator

# 4. Start frontend (new terminal)
cd apps/web
pnpm dev
```

### Devnet Deploy & Test

```bash
# 1. Configure devnet
solana config set --url devnet
solana airdrop 2

# 2. Deploy
./scripts/deploy-devnet.sh

# 3. Initialize
./scripts/initialize.sh

# 4. Verify
./scripts/verify.sh <PROGRAM_ID>

# 5. Update frontend env
echo "NEXT_PUBLIC_PROGRAM_ID=<PROGRAM_ID>" > apps/web/.env.local

# 6. Run frontend
cd apps/web
pnpm dev
```

---

## ⚠️ Emergency Commands

### Pause Program (within 24h only)

```bash
# Execute emergency pause
anchor run emergency-pause --provider.cluster <cluster>
```

### Check Program Status

```bash
# Verify if paused
anchor account GlobalState <PDA>
```

### Rollback (if needed)

```bash
# Deploy previous version
anchor deploy --program-keypair backup-keypair.json
```

---

## 📚 Help Commands

```bash
# Solana help
solana --help
solana <command> --help

# Anchor help
anchor --help
anchor <command> --help

# SPL Token help
spl-token --help

# Next.js help
pnpm next --help
```

---

## 🎓 Learning Commands

### Explore Code

```bash
# View program structure
tree programs/usd1ball/src

# View frontend structure
tree apps/web/src

# Count lines of code
find . -name "*.rs" | xargs wc -l
find . -name "*.ts" -o -name "*.tsx" | xargs wc -l
```

### Read Documentation

```bash
# View main README
cat README.md

# View tokenomics
cat docs/TOKENOMICS.md

# View security model
cat docs/SECURITY.md
```

---

## 🚀 Quick Start (New Developer)

```bash
# 1. Clone and install
git clone <repo-url>
cd usd1ball
pnpm install

# 2. Build everything
pnpm build

# 3. Build smart contract
cd programs/usd1ball
anchor build

# 4. Run tests
anchor test

# 5. Start frontend
cd ../../apps/web
pnpm dev

# 6. Open browser
# Visit http://localhost:3000
```

---

**Keep this reference handy for quick command lookups!**

🏀 **USD1BALL** - Command mastery unlocked.
