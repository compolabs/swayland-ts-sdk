import { beforeEach, describe, expect, it } from "@jest/globals";
import { Provider, Wallet, WalletUnlocked } from "fuels";

import SwayLand, { BETA_CONTRACT_ADDRESSES, BETA_NETWORK, BN } from "../src";

import {
  FAUCET_AMOUNTS,
  PRIVATE_KEY_ALICE,
  TokenAsset,
  TOKENS_BY_SYMBOL,
} from "./constants";

const TIMEOUT_DEADLINE = 60_000; // 1min

describe("Read Tests", () => {
  let wallet: WalletUnlocked;
  let swayLand: SwayLand;

  beforeEach(async () => {
    const provider = await Provider.create(BETA_NETWORK.url);
    wallet = Wallet.fromPrivateKey(PRIVATE_KEY_ALICE, provider);

    swayLand = new SwayLand({
      networkUrl: BETA_NETWORK.url,
      contractAddresses: BETA_CONTRACT_ADDRESSES,
      wallet,
    });
  });

  it("Supply 20", async () => {
    const usdc: TokenAsset = TOKENS_BY_SYMBOL["USDC"];

    const result = await swayLand.supplyBase(usdc, "2000");

    expect(result).toBeDefined();
  });

  it("Check user collateral", async () => {
    const address = wallet.address.toAddress();
    const uni: TokenAsset = TOKENS_BY_SYMBOL["UNI"];
    const result = await swayLand.fetchUserCollateral(address, uni);
    expect(result).not.toBeNull();
  });

  it(
    "fetchUserSupplyBorrow",
    async () => {
      const result = await swayLand.fetchUserSupplyBorrow(
        wallet.address.toAddress(),
      );

      expect(result).not.toBeNull();
    },
    TIMEOUT_DEADLINE,
  );

  it(
    "fetchCollateralConfigurations",
    async () => {
      const result = await swayLand.fetchCollateralConfigurations();
      expect(result).toBeDefined();
    },
    TIMEOUT_DEADLINE,
  );

  it(
    "fetchTotalsCollateral",
    async () => {
      const uni: TokenAsset = TOKENS_BY_SYMBOL["UNI"];
      const result = await swayLand.fetchTotalsCollateral(uni);
      expect(result).toBeDefined();
    },
    TIMEOUT_DEADLINE,
  );

  it(
    "fetchBalanceOfAsset",
    async () => {
      const uni: TokenAsset = TOKENS_BY_SYMBOL["UNI"];
      const result = await swayLand.fetchBalanceOfAsset(uni);
      expect(result).toBeDefined();
    },
    TIMEOUT_DEADLINE,
  );

  it(
    "fetchReserves",
    async () => {
      const uni: TokenAsset = TOKENS_BY_SYMBOL["UNI"];
      const result = await swayLand.fetchReserves(uni);
      expect(result).toBeDefined();
    },
    TIMEOUT_DEADLINE,
  );

  it(
    "fetchUserCollateral",
    async () => {
      const uni: TokenAsset = TOKENS_BY_SYMBOL["UNI"];
      const address = wallet.address.toAddress();
      const result = await swayLand.fetchUserCollateral(address, uni);
      expect(result).toBeDefined();
    },
    TIMEOUT_DEADLINE,
  );

  it(
    "fetchUtilization",
    async () => {
      const result = await swayLand.fetchUtilization();
      expect(result).toBeDefined();
    },
    TIMEOUT_DEADLINE,
  );

  // FuelError: The transaction reverted because a "require" statement has thrown "OutdatedPrice".
  it(
    "fetchAvailableToBorrow",
    async () => {
      const address = wallet.address.toAddress();
      const result = await swayLand.fetchAvailableToBorrow(address);
      expect(result).toBeDefined();
    },
    TIMEOUT_DEADLINE,
  );

  it(
    "fetchBorrowRate",
    async () => {
      const result = await swayLand.fetchBorrowRate("1000");
      expect(result).toBeDefined();
    },
    TIMEOUT_DEADLINE,
  );

  it(
    "fetchSupplyRate",
    async () => {
      const result = await swayLand.fetchSupplyRate("1000");
      expect(result).toBeDefined();
    },
    TIMEOUT_DEADLINE,
  );
});

describe("Write tests", () => {
  let wallet: WalletUnlocked;
  let swayLand: SwayLand;

  beforeEach(async () => {
    const provider = await Provider.create(BETA_NETWORK.url);
    wallet = Wallet.fromPrivateKey(PRIVATE_KEY_ALICE, provider);

    swayLand = new SwayLand({
      networkUrl: BETA_NETWORK.url,
      contractAddresses: BETA_CONTRACT_ADDRESSES,
      wallet,
    });
  });

  it(
    "supplyBase",
    async () => {
      const usdc: TokenAsset = TOKENS_BY_SYMBOL["USDC"];

      const amountToSend = BN.parseUnits(FAUCET_AMOUNTS.USDC, usdc.decimals);
      const result = await swayLand.supplyBase(usdc, amountToSend.toString());
      expect(result).toBeDefined();
    },
    TIMEOUT_DEADLINE,
  );

  it(
    "supplyCollateral",
    async () => {
      const uni: TokenAsset = TOKENS_BY_SYMBOL["UNI"];

      await swayLand.mintToken(uni, FAUCET_AMOUNTS.UNI);

      const uniBalance = await swayLand.fetchWalletBalance(uni);
      const amountToSend = BN.parseUnits(FAUCET_AMOUNTS.UNI, uni.decimals);

      expect(new BN(uniBalance).gte(amountToSend)).toBe(true);

      const result = await swayLand.supplyCollateral(
        uni,
        amountToSend.toString(),
      );
      expect(result).toBeDefined();
    },
    TIMEOUT_DEADLINE,
  );

  it(
    "withdrawBase",
    async () => {
      const usdc: TokenAsset = TOKENS_BY_SYMBOL["USDC"];

      const amountToSend = BN.parseUnits(
        FAUCET_AMOUNTS.USDC,
        usdc.decimals,
      ).dividedBy(2);

      const result = await swayLand.withdrawBase(amountToSend.toString()); // Always USDC
      expect(result).toBeDefined();
    },
    TIMEOUT_DEADLINE,
  );

  it(
    "withdrawCollateral",
    async () => {
      const uni: TokenAsset = TOKENS_BY_SYMBOL["UNI"];

      const amountToSend = BN.parseUnits(
        FAUCET_AMOUNTS.UNI,
        uni.decimals,
      ).dividedBy(2);

      const result = await swayLand.withdrawCollateral(
        uni,
        amountToSend.toString(),
      );
      expect(result).toBeDefined();
    },
    TIMEOUT_DEADLINE,
  );
});
