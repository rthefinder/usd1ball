# usaball


<img width="1799" height="598" alt="Capture d’écran 2026-01-03 à 00 58 17" src="https://github.com/user-attachments/assets/3fd79de9-f28d-432f-9c18-f5a5f5cca3f6" />

> **A USD1-based flywheel meme coin with deterministic mechanics on Solana**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/yourusername/usd1ball/workflows/CI/badge.svg)](https://github.com/yourusername/usd1ball/actions)

## ⚠️ Disclaimer

**USD1BALL is a meme coin with deterministic mechanics. This is NOT a financial product.**

- ❌ No guaranteed returns
- ❌ No promises of profit
- ❌ Price can go to zero
- ✅ Transparent mechanics
- ✅ Verifiable on-chain
- ✅ Community-driven experiment

**Not financial advice. Do your own research. Only risk what you can afford to lose.**

---

## What is usaball?

usaball is a **flywheel-based token** that implements a self-reinforcing economic loop:

1. 💸 **Transactions pay a 0.1% tax in USD1** (not in usaball tokens)
2. 📊 **USD1 accumulates in a buyback pool** automatically
3. 🎯 **When threshold is reached**, anyone can trigger a buyback
4. 🔥 **Bought tokens are distributed**: 50% burned, 30% to LP, 20% rewards
5. 🔄 **Cycle repeats** indefinitely

### Core Principles

- **Fixed Supply**: No minting after deployment
- **Deflationary**: Supply only decreases through burns
- **Automated**: No manual intervention needed
- **Transparent**: All mechanics on-chain and verifiable
- **Permissionless**: Anyone can trigger buybacks
- **Deterministic**: Math-driven, not discretionary

---

## How It Works
<img width="1024" height="1024" alt="Gemini_Generated_Image_swe60bswe60bswe6" src="https://github.com/user-attachments/assets/43d6f152-dd4f-4e31-9086-70f91c6b7712" />


### The Flywheel

```
┌─────────────────────────────────────────────┐
│  1. User transfers usaball                │
│     ↓                                       │
│  2. 6% tax paid in USD1                     │
│     ↓                                       │
│  3. USD1 accumulates in buyback pool        │
│     ↓                                       │
│  4. Pool reaches threshold (1000 USD1)      │
│     ↓                                       │
│  5. Anyone triggers buyback                 │
│     ↓                                       │
│  6. Contract swaps USD1 → usaball         │
│     ↓                                       │
│  7. Distribute bought tokens:               │
│     • 50% → BURNED 🔥                       │
│     • 30% → Liquidity Pool 💧               │
│     • 20% → Rewards/Treasury 🎁             │
│     ↓                                       │
│  8. Supply reduced, liquidity increased     │
│     ↓                                       │
│  9. Loop back to step 1 ────────────────────┘
```

### Why USD1-Based?

- **Stable Tax**: Predictable cost in stable terms
- **USD1 Meta**: Aligns with USD1 ecosystem narrative
- **Clear Pricing**: Easy arbitrage calculations
- **Reduced Volatility**: Tax in stablecoin vs volatile token

---

## Repository Structure

This is a **monorepo** containing all usaball components:

```
usaball/
├── programs/usaball/       # Anchor smart contract (Rust)
│   ├── src/
│   │   ├── lib.rs           # Program entry point
│   │   ├── state.rs         # Global state & events
│   │   ├── instructions/    # All instructions
│   │   └── errors.rs        # Error codes
│   └── Cargo.toml
│
├── packages/
│   ├── shared/              # Types, constants, utils
│   └── analytics/           # Metrics & event parsing
│
├── apps/
│   └── web/                 # Next.js dashboard
│       ├── src/
│       │   ├── app/         # Next.js 14 app router
│       │   └── components/  # React components
│       └── package.json
│
├── tests/                   # Anchor test suite
├── scripts/                 # Deployment & utilities
├── docs/                    # Comprehensive documentation
└── .github/workflows/       # CI/CD pipelines
```

---

## Quick Start

### Prerequisites

- **Node.js** v18+
- **pnpm** v8+
- **Rust** 1.70+
- **Solana CLI** 1.17+
- **Anchor** 0.29+

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/usaballl.git
cd usaball

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Build Smart Contract

```bash
cd programs/usaball
anchor build
```

### Run Tests

```bash
# Run Anchor tests
cd programs/usaball
anchor test

# Run frontend in dev mode
cd apps/web
pnpm dev
```

### Local Development

```bash
# Start local Solana validator
solana-test-validator

# Deploy to local (in another terminal)
cd programs/usaball
anchor deploy --provider.cluster localnet

# Run simulation
./scripts/simulate.sh
```

---

## Deployment

### Devnet Deployment

```bash
# Deploy to devnet
./scripts/deploy-devnet.sh

# Initialize program
./scripts/initialize.sh

# Verify deployment
./scripts/verify.sh <PROGRAM_ID>
```

### Mainnet Deployment

⚠️ **Read [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) thoroughly before mainnet deployment!**

```bash
# Set to mainnet
solana config set --url mainnet-beta

# Deploy
cd programs/usaball
anchor deploy --provider.cluster mainnet

# CRITICAL: Verify security checklist
# See docs/SECURITY.md
```

**Post-Deployment Checklist:**
- [ ] Verify no mint authority
- [ ] Renounce or timelock program authority
- [ ] Test with small amounts first
- [ ] Monitor first cycles closely
- [ ] Publish contract address
- [ ] Share verification instructions

---

## Documentation

Comprehensive docs in `/docs`:

- 📖 [**TOKENOMICS.md**](docs/TOKENOMICS.md) - Complete tokenomics explanation
- 🚀 [**DEPLOYMENT.md**](docs/DEPLOYMENT.md) - Step-by-step deployment guide
- 🔒 [**SECURITY.md**](docs/SECURITY.md) - Security model & audit checklist

### Key Concepts

**Flywheel Mechanics**
- Automated buyback and burn system
- Deterministic trigger conditions
- Permissionless execution

**Tax System**
- 0.1% tax paid in USD1
- Creates constant buying pressure
- Accumulates in on-chain pool

**Supply Dynamics**
- Fixed total supply (e.g., 1 billion)
- Continuously deflationary
- No minting possible after deployment

**Security Model**
- No owner privileges (after renounce)
- No hidden backdoors
- All state visible on-chain
- Community verifiable

---

## Frontend Dashboard

Live dashboard shows:

- 📊 **Real-time metrics**: Total supply, burned, circulating
- 🔄 **Flywheel progress**: Pool balance, cycles completed
- 📈 **Supply chart**: Circulating vs burned visualization
- 📜 **Recent events**: Buyback, burn, and LP events
- 💡 **Explainer**: How the flywheel works
- ⚠️ **Disclaimers**: Clear risk warnings

### Run Locally

```bash
cd apps/web
pnpm dev
# Open http://localhost:3000
```

### Deploy

```bash
cd apps/web
pnpm build

# Deploy to Vercel, Netlify, etc.
```

Environment variables needed:
```env
NEXT_PUBLIC_PROGRAM_ID=<your_program_id>
NEXT_PUBLIC_usaball_MINT=<mint_address>
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
```

---

## Smart Contract Overview

### Instructions

1. **`initialize`**
   - Sets up global state
   - Configures parameters (tax, threshold, rates)
   - Mints total supply
   - Called once at deployment

2. **`transfer`**
   - Transfers usaballtokens
   - Deducts USD1 tax from sender
   - Routes tax to buyback pool
   - Updates pool balance

3. **`trigger_buyback`**
   - Permissionless (anyone can call)
   - Checks threshold is met
   - Swaps USD1 for usaball
   - Distributes: burn, LP, rewards
   - Emits events

4. **`emergency_pause`**
   - Only callable within 24h of deployment
   - Pauses operations for critical bugs
   - Disabled after 24h window

5. **`get_metrics`**
   - Read-only view function
   - Returns current flywheel metrics
   - No state changes

### Events

All major actions emit events:

- `BuybackExecuted` - Buyback cycle completed
- `TokensBurned` - Tokens destroyed
- `LiquidityAdded` - LP increased
- `TaxCollected` - Tax payment recorded
- `FlywheelCycleCompleted` - Full cycle done

---

## Testing

### Unit Tests

```bash
cd programs/usaball
anchor test
```

Tests cover:
- ✅ Initialization with valid/invalid params
- ✅ Transfer with tax calculation
- ✅ Buyback trigger conditions
- ✅ Emergency pause time window
- ✅ Metrics calculation

### Integration Tests

```bash
# Full flywheel simulation
./scripts/simulate.sh
```

Simulates:
- Multiple transactions
- Tax accumulation
- Threshold trigger
- Buyback execution
- Burn and LP distribution

---

## CI/CD

GitHub Actions workflows:

- **CI** (`.github/workflows/ci.yml`)
  - Lint all packages
  - TypeScript type checking
  - Build packages and frontend
  - Run Anchor tests
  - Security audit

- **Deploy** (`.github/workflows/deploy.yml`)
  - Auto-deploy frontend to Vercel on push to `main`

Status: [![CI](https://github.com/yourusername/usd1ball/workflows/CI/badge.svg)](https://github.com/yourusername/usd1ball/actions)

---

## Security

### Threat Model

Protected against:
- ✅ Rug pulls (no owner drain)
- ✅ Infinite mint (mint authority disabled)
- ✅ Parameter manipulation (fixed or governed)
- ✅ Liquidity removal (protocol-owned)
- ✅ Emergency abuse (24h timelock)

### Audit Checklist

Before mainnet:
- [ ] Full test coverage (>90%)
- [ ] Security audit by reputable firm
- [ ] Code review by multiple developers
- [ ] Simulation tests successful
- [ ] Emergency procedures documented
- [ ] Community review period

See [docs/SECURITY.md](docs/SECURITY.md) for full checklist.

---

## Contributing

We welcome contributions! Areas to help:

- 🐛 **Bug fixes**: Found an issue? Open a PR
- 📚 **Documentation**: Improve clarity
- 🧪 **Testing**: Add more test coverage
- 🎨 **Frontend**: UI/UX improvements
- 🔍 **Security**: Report vulnerabilities

### Development Setup

```bash
# Fork and clone
git clone https://github.com/yourusername/usaball.git
cd usaball

# Create branch
git checkout -b feature/your-feature

# Make changes and test
pnpm test

# Commit and push
git commit -am "Add feature"
git push origin feature/your-feature

# Open PR on GitHub
```

---

## Roadmap

### ✅ Phase 1: MVP (Current)
- [x] Core flywheel mechanics
- [x] Anchor smart contract
- [x] Frontend dashboard
- [x] Basic tests
- [x] Documentation

### 🚧 Phase 2: Refinement
- [ ] Enhanced testing
- [ ] Security audit
- [ ] Devnet deployment
- [ ] Community feedback
- [ ] Bug fixes

### 🔮 Phase 3: Mainnet
- [ ] Final security review
- [ ] Mainnet deployment
- [ ] Authority renounced
- [ ] Public launch
- [ ] Ongoing monitoring

### 💡 Future Considerations
- Dynamic threshold based on volume
- Governance for parameter updates
- Advanced analytics dashboard
- Cross-chain bridges (if applicable)
- Staking mechanisms

---

## Community

- **Twitter**: [@rthefinder]([https://twitter.com/rthefinder](https://x.com/rthefinder))

- **GitHub**: [Issues & Discussions](https://github.com/yourusername/usaball)

---

## FAQ

**Q: Is usaball a good investment?**  
A: No. usaball is a meme coin experiment. Not financial advice. High risk.

**Q: How do I buy usaball?**  
A: After deployment, available on Solana DEXs with USD1 pairs.

**Q: What happens to the burned tokens?**  
A: Sent to a burn address, permanently removed from circulation.

**Q: Who can trigger buybacks?**  
A: Anyone! It's permissionless once threshold is met.

**Q: Can parameters be changed after deployment?**  
A: Not in MVP. Could add governance in future versions.

**Q: Is the code audited?**  
A: Audit recommended before mainnet. See docs/SECURITY.md.

**Q: What if there's a bug?**  
A: Emergency pause available for 24h post-deployment. After that, deploy new version if needed.

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Acknowledgments

Built with:
- [Anchor](https://www.anchor-lang.com/) - Solana framework
- [Next.js](https://nextjs.org/) - React framework
- [Solana](https://solana.com/) - Blockchain platform
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components

Inspired by:
- Ball coin mechanics
- USD1 ecosystem
- Community-driven experimentation

---

## Final Notes

usaball is an **experiment in deterministic tokenomics**:

✅ **What it IS:**
- A meme coin with transparent mechanics
- An automated flywheel system
- A community experiment
- Verifiable on-chain

❌ **What it's NOT:**
- Financial advice
- An investment vehicle
- A guaranteed profit scheme
- A serious financial product

**Participate responsibly. Understand the risks. Verify everything.**

---

**Built with transparency. Driven by determinism. Powered by community.**

**usaball** - Because sometimes the best strategy is a simple, predictable loop.
<img width="1024" height="1024" alt="Gemini_Generated_Image_qsepfeqsepfeqsep" src="https://github.com/user-attachments/assets/c392d672-b668-4613-93a9-4312eaa9a49a" />
