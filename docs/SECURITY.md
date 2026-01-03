# USD1BALL Security Model

## Threat Model

### Attack Vectors

1. **Rug Pull / Exit Scam**
   - Risk: Owner drains funds
   - Mitigation: No owner drain functions, renounce authority

2. **Mint Exploit**
   - Risk: Infinite token creation
   - Mitigation: Mint authority disabled post-deployment

3. **Tax Manipulation**
   - Risk: Change tax rates arbitrarily
   - Mitigation: Fixed at deployment (or governance-only)

4. **Buyback Manipulation**
   - Risk: Manipulate buyback timing/amounts
   - Mitigation: Deterministic triggers, permissionless execution

5. **Front-Running**
   - Risk: MEV bots front-run buybacks
   - Mitigation: Slippage protection, public trigger

6. **Liquidity Drain**
   - Risk: Remove protocol-owned liquidity
   - Mitigation: LP tokens held by program, no withdrawal

7. **Emergency Abuse**
   - Risk: Abuse emergency pause
   - Mitigation: 24h time lock, then disabled

8. **Oracle Manipulation**
   - Risk: Price oracle exploits
   - Mitigation: Use DEX reserves directly, no external oracles

## Security Properties

### Immutability

**No Mint After Deployment**
```rust
// Mint authority transferred to program PDA
// No mint_to instruction exposed
```

**Fixed Parameters** (recommended)
- Tax rate locked
- Distribution ratios locked
- Threshold locked

Alternative: Governance-controlled updates with timelock

### Transparency

**All State On-Chain**
```rust
pub struct GlobalState {
    // Everything visible
    pub total_supply: u64,
    pub total_burned: u64,
    pub tax_rate_bps: u16,
    // ... etc
}
```

**Event Logging**
```rust
emit!(BuybackExecuted { ... });
emit!(TokensBurned { ... });
// All actions logged
```

### Deterministic Execution

**Buyback Trigger**
```rust
pub fn trigger_buyback(ctx: Context<TriggerBuyback>) -> Result<()> {
    // Anyone can call
    // Executes if threshold met
    // No discretion
}
```

**No Owner Privileges**
- No pause function (except 24h window)
- No drain function
- No parameter updates
- No blacklist

### Access Control

**Authority Lifecycle**
1. **Deployment**: Authority = deployer
2. **Initialization**: Set parameters
3. **24h Window**: Emergency pause available
4. **After 24h**: Emergency pause disabled
5. **Final Step**: Renounce or timelock authority

**Recommended Final State**
```rust
Authority: None (renounced)
Upgrade Authority: None
Emergency Window: Expired
```

## Audit Checklist

### Pre-Deployment Audit

#### Smart Contract
- [ ] No mint authority after init
- [ ] No owner drain functions
- [ ] No arbitrary pauses (after 24h)
- [ ] Tax rate within bounds (≤20%)
- [ ] Distribution rates sum to 100%
- [ ] Buyback threshold > 0
- [ ] Integer overflow protection
- [ ] Reentrancy protection
- [ ] Access control correct
- [ ] Event logging complete

#### Math & Logic
- [ ] Tax calculation correct
- [ ] Burn calculation correct
- [ ] LP calculation correct
- [ ] Supply tracking correct
- [ ] Threshold check correct
- [ ] No division by zero
- [ ] No underflow possible
- [ ] Rounding handled properly

#### Integration
- [ ] SPL Token integration correct
- [ ] DEX integration secure
- [ ] PDA derivation correct
- [ ] Account validation complete
- [ ] CPI calls secured

### Code Review

**Critical Functions**
1. `initialize` - Parameter validation
2. `transfer` - Tax calculation and routing
3. `trigger_buyback` - Buyback and distribution
4. `emergency_pause` - Time window check

**Review Criteria**
- Input validation
- State management
- Error handling
- Gas efficiency
- Edge cases

### Testing

**Unit Tests**
- [ ] Initialize with valid params
- [ ] Reject invalid tax rate
- [ ] Reject invalid distribution
- [ ] Transfer calculates tax correctly
- [ ] Buyback triggers at threshold
- [ ] Buyback fails below threshold
- [ ] Emergency pause within window
- [ ] Emergency pause fails after window
- [ ] Metrics return correctly

**Integration Tests**
- [ ] Full flywheel cycle
- [ ] Multiple consecutive cycles
- [ ] High-volume scenario
- [ ] Edge amounts (0, max)
- [ ] Concurrent transactions

**Fuzzing**
- [ ] Random transaction amounts
- [ ] Random trigger timings
- [ ] Random account states

### Post-Deployment Verification

**On-Chain Checks**
```bash
# Verify program
solana program show <PROGRAM_ID>

# Check authority
solana program show <PROGRAM_ID> | grep "Upgrade Authority"
# Should show: None (final) or timelock address

# Verify token mint
spl-token display <MINT>
# Should show: Mint authority: (None)
```

**State Validation**
```bash
# Fetch global state
anchor account GlobalState <PDA>

# Verify:
# - tax_rate_bps <= 2000
# - burn_rate_bps + lp_rate_bps <= 10000
# - buyback_threshold > 0
# - initialized_at is recent
```

## Known Issues & Limitations

### Intended Behavior (Not Bugs)

1. **Permissionless Trigger**: Anyone can trigger buyback
   - This is intentional for decentralization
   - Small gas cost is barrier to spam

2. **Tax in USD1**: Tax paid in USD1, not USD1BALL
   - Intentional design choice
   - Creates buying pressure
   - Requires users hold USD1

3. **No Refunds**: Once taxed, cannot be reversed
   - Standard for on-chain transactions
   - Users should test with small amounts

4. **Price Impact**: Large buybacks may move price
   - Mitigated by threshold size
   - Consider slippage limits

### Current Limitations

1. **DEX Dependency**: Requires USD1/USD1BALL liquidity
   - Can't buyback if no liquidity
   - Monitoring needed

2. **Fixed Parameters**: Once deployed, parameters fixed
   - Governance can be added for upgrades
   - Or deploy new version

3. **Emergency Window**: Only 24h to pause
   - Short window by design
   - Must act quickly if issues found

4. **Gas Costs**: Trigger cost paid by caller
   - Small cost (~0.000005 SOL)
   - Incentive: potential MEV

## Best Practices

### For Deployers

1. **Test Exhaustively**
   - Full test suite on devnet
   - Simulation with realistic volumes
   - Edge case testing

2. **Gradual Rollout**
   - Start with conservative parameters
   - Monitor first cycles closely
   - Adjust in v2 if needed

3. **Documentation**
   - Complete technical docs
   - User-friendly explanations
   - Risk disclaimers

4. **Transparency**
   - Publish source code
   - Provide verification steps
   - Regular updates

### For Users

1. **Verify Contract**
   - Check program ID
   - Verify on explorer
   - Review source code

2. **Test First**
   - Small transactions first
   - Understand tax implications
   - Check pool balances

3. **Monitor State**
   - Use dashboard
   - Watch for anomalies
   - Community monitoring

4. **Risk Management**
   - Only invest what you can lose
   - Understand mechanisms
   - Exit if uncomfortable

## Incident Response

### If Bug Discovered

**Within 24h of Deployment**
1. Emergency pause immediately
2. Assess impact
3. Communicate to users
4. Plan fix or migration

**After 24h (No Pause)**
1. Assess severity
2. If critical: warn users, halt operations
3. Deploy fix to new program
4. Provide migration path

### Communication Protocol

**Critical Issues**
- Immediate announcement (Twitter, Discord, etc.)
- Detailed explanation
- Proposed solution
- Timeline

**Non-Critical Issues**
- Document in GitHub issues
- Plan fix for next version
- Communicate in updates

## External Audits

**Recommended Auditors** (examples)
- OtterSec
- Neodyme
- Kudelski Security
- Trail of Bits

**Audit Scope**
- Smart contract code
- Tokenomics math
- Integration points
- Access controls
- Economic attack vectors

**Post-Audit**
- Publish audit report
- Address findings
- Re-audit if major changes

## Continuous Monitoring

### Metrics to Watch

1. **Supply Metrics**
   - Total burned trending up
   - Circulating supply trending down
   - Burn rate within expectations

2. **Pool Health**
   - Buyback pool accumulating
   - Cycles triggering regularly
   - LP growing over time

3. **Economic Health**
   - Price stability
   - Volume consistency
   - Liquidity depth

4. **Anomalies**
   - Unexpected pauses
   - Failed buybacks
   - Large single burns
   - State inconsistencies

### Automated Alerts

Set up monitoring for:
```
- Buyback pool > 2x threshold (stuck?)
- No cycles in 48h (broken?)
- Burn amount > expected range
- State changed unexpectedly
```

## Conclusion

USD1BALL security relies on:
1. **Immutable code** (after authority renounced)
2. **Transparent state** (all on-chain)
3. **Deterministic logic** (math-driven)
4. **No privileged access** (permissionless)
5. **Community verification** (open source)

By following this security model, USD1BALL minimizes trust requirements and maximizes transparency.

---

**Always verify, never trust.**
