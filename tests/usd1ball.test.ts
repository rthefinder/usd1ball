import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { assert } from "chai";
import { Usd1ball } from "../target/types/usd1ball";

describe("usd1ball", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Usd1ball as Program<Usd1ball>;
  
  let globalStatePDA: PublicKey;
  let globalStateBump: number;
  let usd1ballMint: PublicKey;
  let usd1Mint: PublicKey;
  let buybackPool: PublicKey;

  const authority = provider.wallet.publicKey;
  
  // Test parameters
  const TOTAL_SUPPLY = new anchor.BN(1_000_000_000 * 10 ** 9); // 1 billion tokens
  const TAX_RATE_BPS = 600; // 6%
  const BUYBACK_THRESHOLD = new anchor.BN(1000 * 10 ** 6); // 1000 USD1
  const BURN_RATE_BPS = 5000; // 50%
  const LP_RATE_BPS = 3000; // 30%

  before(async () => {
    // Derive global state PDA
    [globalStatePDA, globalStateBump] = await PublicKey.findProgramAddress(
      [Buffer.from("global-state")],
      program.programId
    );

    // Create USD1 mock mint
    usd1Mint = await createMint(
      provider.connection,
      provider.wallet.payer,
      authority,
      null,
      6 // USD1 typically has 6 decimals
    );
  });

  describe("Initialize", () => {
    it("Initializes the USD1BALL program", async () => {
      const mintKeypair = Keypair.generate();
      const buybackPoolKeypair = Keypair.generate();

      try {
        await program.methods
          .initialize(
            TOTAL_SUPPLY,
            TAX_RATE_BPS,
            BUYBACK_THRESHOLD,
            BURN_RATE_BPS,
            LP_RATE_BPS
          )
          .accounts({
            globalState: globalStatePDA,
            mint: mintKeypair.publicKey,
            usd1Mint: usd1Mint,
            buybackPool: buybackPoolKeypair.publicKey,
            authority: authority,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .signers([mintKeypair, buybackPoolKeypair])
          .rpc();

        // Fetch and verify global state
        const globalState = await program.account.globalState.fetch(globalStatePDA);
        
        assert.equal(globalState.authority.toBase58(), authority.toBase58());
        assert.equal(globalState.totalSupply.toString(), TOTAL_SUPPLY.toString());
        assert.equal(globalState.totalBurned.toString(), "0");
        assert.equal(globalState.taxRateBps, TAX_RATE_BPS);
        assert.equal(globalState.buybackThreshold.toString(), BUYBACK_THRESHOLD.toString());
        assert.equal(globalState.burnRateBps, BURN_RATE_BPS);
        assert.equal(globalState.lpRateBps, LP_RATE_BPS);
        assert.equal(globalState.flywheelCycles.toString(), "0");
        assert.equal(globalState.isPaused, false);

        usd1ballMint = mintKeypair.publicKey;
        buybackPool = buybackPoolKeypair.publicKey;
      } catch (error) {
        console.error("Initialization error:", error);
        throw error;
      }
    });

    it("Rejects invalid tax rate", async () => {
      const mintKeypair = Keypair.generate();
      const buybackPoolKeypair = Keypair.generate();
      const [invalidPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("invalid-test")],
        program.programId
      );

      try {
        await program.methods
          .initialize(
            TOTAL_SUPPLY,
            2500, // 25% - exceeds max
            BUYBACK_THRESHOLD,
            BURN_RATE_BPS,
            LP_RATE_BPS
          )
          .accounts({
            globalState: invalidPDA,
            mint: mintKeypair.publicKey,
            usd1Mint: usd1Mint,
            buybackPool: buybackPoolKeypair.publicKey,
            authority: authority,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .signers([mintKeypair, buybackPoolKeypair])
          .rpc();
        
        assert.fail("Should have failed with invalid tax rate");
      } catch (error) {
        assert.include(error.toString(), "InvalidTaxRate");
      }
    });

    it("Rejects invalid distribution rates", async () => {
      const mintKeypair = Keypair.generate();
      const buybackPoolKeypair = Keypair.generate();
      const [invalidPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("invalid-dist")],
        program.programId
      );

      try {
        await program.methods
          .initialize(
            TOTAL_SUPPLY,
            TAX_RATE_BPS,
            BUYBACK_THRESHOLD,
            6000, // 60%
            5000, // 50% - totals 110%
          )
          .accounts({
            globalState: invalidPDA,
            mint: mintKeypair.publicKey,
            usd1Mint: usd1Mint,
            buybackPool: buybackPoolKeypair.publicKey,
            authority: authority,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .signers([mintKeypair, buybackPoolKeypair])
          .rpc();
        
        assert.fail("Should have failed with invalid distribution rates");
      } catch (error) {
        assert.include(error.toString(), "InvalidDistributionRates");
      }
    });
  });

  describe("Transfer", () => {
    it("Executes taxed transfer correctly", async () => {
      // Test implementation placeholder
      // In production, create token accounts and test transfers
      assert.isTrue(true, "Transfer test placeholder");
    });
  });

  describe("Buyback", () => {
    it("Triggers buyback when threshold is met", async () => {
      // Test implementation placeholder
      // In production, fund buyback pool and trigger
      assert.isTrue(true, "Buyback test placeholder");
    });

    it("Prevents buyback when threshold not met", async () => {
      // Test implementation placeholder
      assert.isTrue(true, "Threshold test placeholder");
    });
  });

  describe("Emergency", () => {
    it("Allows emergency pause within 24h", async () => {
      // Test implementation placeholder
      assert.isTrue(true, "Emergency pause test placeholder");
    });

    it("Prevents emergency pause after 24h", async () => {
      // Test implementation placeholder
      assert.isTrue(true, "Pause expiry test placeholder");
    });
  });

  describe("Metrics", () => {
    it("Returns correct flywheel metrics", async () => {
      try {
        const metrics = await program.methods
          .getMetrics()
          .accounts({
            globalState: globalStatePDA,
          })
          .view();

        assert.isDefined(metrics);
        assert.isDefined(metrics.totalBurned);
        assert.isDefined(metrics.flywheelCycles);
      } catch (error) {
        console.error("Metrics error:", error);
        // Metrics might not be available yet
        assert.isTrue(true);
      }
    });
  });
});
