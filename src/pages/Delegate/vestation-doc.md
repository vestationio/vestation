# VeStation

## Constants

``` typescript
const VEDELEGATE_CONTRACT_ADDRESS = "0x90e594903df44171c62e93969c576c109f949ee5";

const TOKEN_B3TR = {
  symbol: "B3TR",
  decimals: 18,
  address: "0x5ef79995FE8a89e0812330E4378eB2660ceDe699"
}
```

## React Integration

All examples in this document are for React environments. You'll need to use the `connex` instance from the `useConnex()` hook, and the user `account` address from the `useWallet()` hook:

``` typescript
import { useConnex, useWallet } from "@vechain/dapp-kit-react";

const connex = useConnex();
const { account } = useWallet();
```

## Helper functions

### Poll for transaction receipt

``` typescript
type PollOptions = {
  timeout?: number;
  interval?: number;
};

export default async function poll<T>(fn: () => Promise<T>, options: PollOptions = {}): Promise<T> {
  const timeout = options.timeout ?? 1000 * 60 * 5;
  const interval = options.interval ?? 3000;

  const endTime = Date.now() + timeout;

  return new Promise<T>((resolve, reject) => {
    const waitForConfirmation = async () => {
      if (Date.now() > endTime) {
        return reject(new Error("Timeout"));
      }

      try {
        const result = await fn();
        if (result) {
          resolve(result);
        } else {
          setTimeout(waitForConfirmation, interval);
        }
      } catch (error) {
        reject(error);
      }
    };

    waitForConfirmation();
  });
}
```

### Fetch round data

``` typescript
async function fetchRoundData() {
  const response = await fetch(`https://graph.vet/subgraphs/name/vebetter/dao`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: `{rounds(orderBy: voteStart, orderDirection: desc, first: 2) { id }}`
    })
  });

  const { data } = await response.json();

  return {
    currentRoundId: data.rounds[0].id,
    lastEndedRoundId: data.rounds[1].id
  };
}
```

## Contract Read Operations

### User B3TR balance

``` typescript
import find from "lodash.find";
import ABI_ERC20 from "path/to/erc20.json";

async function getUserB3trBalance(account: string) {
  const b3trContract = connex.thor.account(TOKEN_B3TR.address);
  const rawData = await b3trContract.method(find(ABI_ERC20, { name: "balanceOf" })).call(account);
  const balance = rawData.decoded[0];
  return BigInt(balance),
}
```

### User staked B3TR amount

``` typescript
import find from "lodash.find";
import ABI_VEDELEGATE from "path/to/VeDelegate.json";

async function getUserStakedB3trAmount(account: string) {
  const veDelegateContract = connex.thor.account(VEDELEGATE_CONTRACT_ADDRESS);
  const rawData = await veDelegateContract.method(find(ABI_VEDELEGATE, { name: "B3TRBalances" })).call(account);
  const balance = rawData.decoded[0];
  return BigInt(balance),
}
```

### User reward for the specific round

``` typescript
import find from "lodash.find";
import ABI_VEDELEGATE from "path/to/VeDelegate.json";

async function getUserReward(roundId: string, account: string) {
  const veDelegateContract = connex.thor.account(VEDELEGATE_CONTRACT_ADDRESS);
  const rawData = await veDelegateContract.method(find(ABI_VEDELEGATE, { name: "checkUserReward" })).call(roundId, account);
  const balance = rawData.decoded[0];
  return BigInt(balance),
}
```

### User claimed reward for the specific round

``` typescript
import find from "lodash.find";
import ABI_VEDELEGATE from "path/to/VeDelegate.json";

async function getUserClaimedReward(roundId: string, account: string) {
  const veDelegateContract = connex.thor.account(VEDELEGATE_CONTRACT_ADDRESS);
  const rawData = await veDelegateContract.method(find(ABI_VEDELEGATE, { name: "checkuserClaimed" })).call(roundId, account);
  const balance = rawData.decoded[0];
  return BigInt(balance),
}
```

## Contract Write Operations

### Stake B3TR

``` typescript
import find from "lodash.find";
import ABI_ERC20 from "path/to/erc20.json";
import ABI_VEDELEGATE from "path/to/VeDelegate.json";

import type { Connex } from "@vechain/connex";
type Receipt = Connex.Thor.Transaction.Receipt | null;

async function stakeB3TR(amount: string) {
  const baseUnit = 10n ** BigInt(TOKEN_B3TR.decimals);
  const amountInWei = (BigInt(amount) * baseUnit).toString();

  const approveB3trMethod = connex.thor
    .account(TOKEN_B3TR.address)
    .method(find(ABI_ERC20, { name: "approve" }));
  const approveB3trClause = approveB3trMethod.asClause(VEDELEGATE_CONTRACT_ADDRESS, amountInWei);

  const stakeB3trMethod = connex.thor
    .account(VEDELEGATE_CONTRACT_ADDRESS)
    .method(find(ABI_VEDELEGATE, { name: "depositB3TR" }));
  const stakeB3trClause = stakeB3trMethod.asClause(amountInWei);

  try {
    const tx = await connex.vendor
      .sign("tx", [approveB3trClause, stakeB3trClause])
      .comment(`Stake ${amount} B3TR`)
      .request();
    const receipt: Receipt = await poll(() => connex.thor.transaction(tx.txid).getReceipt());

    if (receipt) {
      const isSuccess = receipt.reverted === false;
      // success handling code here
    } else {
      throw new Error(`Failed to fetch receipt for transaction: ${tx.txid}`);
    }
  } catch(err) {
    // error handling code here
  }
}
```

### Unstake B3TR

``` typescript
import find from "lodash.find";
import ABI_VEDELEGATE from "path/to/VeDelegate.json";

import type { Connex } from "@vechain/connex";
type Receipt = Connex.Thor.Transaction.Receipt | null;

async function unstakeB3TR(amount: string) {
  const baseUnit = 10n ** BigInt(TOKEN_B3TR.decimals);
  const amountInWei = (BigInt(amount) * baseUnit).toString();

  const unstakeB3trMethod = connex.thor
    .account(VEDELEGATE_CONTRACT_ADDRESS)
    .method(find(ABI_VEDELEGATE, { name: "withdrawInB3TR" }));
  const unstakeB3trClause = unstakeB3trMethod.asClause(amountInWei);

  try {
    const tx = await connex.vendor
      .sign("tx", [unstakeB3trClause])
      .comment(`Unstake ${amount} B3TR`)
      .request();
    const receipt: Receipt = await poll(() => connex.thor.transaction(tx.txid).getReceipt());

    if (receipt) {
      const isSuccess = receipt.reverted === false;
      // success handling code here
    } else {
      throw new Error(`Failed to fetch receipt for transaction: ${tx.txid}`);
    }
  } catch(err) {
    // error handling code here
  }
}
```

### Claim reward

``` typescript
import find from "lodash.find";
import ABI_VEDELEGATE from "path/to/VeDelegate.json";

import type { Connex } from "@vechain/connex";
type Receipt = Connex.Thor.Transaction.Receipt | null;

async function claimReward(roundId: string) {
  const claimMethod = connex.thor
    .account(VEDELEGATE_CONTRACT_ADDRESS)
    .method(find(ABI_VEDELEGATE, { name: "claimReward" }));
  const claimClause = unstakeB3trMethod.asClause(ronudId);

  try {
    const tx = await connex.vendor
      .sign("tx", [claimClause])
      .comment(`Claim round ${roundId} reward`)
      .request();
    const receipt: Receipt = await poll(() => connex.thor.transaction(tx.txid).getReceipt());

    if (receipt) {
      const isSuccess = receipt.reverted === false;
      // success handling code here
    } else {
      throw new Error(`Failed to fetch receipt for transaction: ${tx.txid}`);
    }
  } catch(err) {
    // error handling code here
  }
}
```

### Claim reward and re-stake

``` typescript
import find from "lodash.find";
import ABI_ERC20 from "path/to/erc20.json";
import ABI_VEDELEGATE from "path/to/VeDelegate.json";

import type { Connex } from "@vechain/connex";
type Receipt = Connex.Thor.Transaction.Receipt | null;

async function claimRewardAndRestake(roundId: string) {
  const reward = await getUserReward(roundId, account);
  const rewardInWei = reward.toString();

  const veDelegateContract = connex.thor.account(VEDELEGATE_CONTRACT_ADDRESS);

  const claimMethod = veDelegateContract.method(find(ABI_VEDELEGATE, { name: "claimReward" }));
  const claimClause = unstakeB3trMethod.asClause(ronudId);

  const approveB3trMethod = connex.thor
    .account(TOKEN_B3TR.address)
    .method(find(ABI_ERC20, { name: "approve" }));
  const approveB3trClause = approveB3trMethod.asClause(VEDELEGATE_CONTRACT_ADDRESS, rewardInWei);

  const stakeB3trMethod = veDelegateContract.method(find(ABI_VEDELEGATE, { name: "depositB3TR" }));
  const stakeB3trClause = stakeB3trMethod.asClause(rewardInWei);

  try {
    const tx = await connex.vendor
      .sign("tx", [claimClause, approveB3trClause, stakeB3trClause])
      .comment(`Claim round ${roundId} reward and re-stake`)
      .request();
    const receipt: Receipt = await poll(() => connex.thor.transaction(tx.txid).getReceipt());

    if (receipt) {
      const isSuccess = receipt.reverted === false;
      // success handling code here
    } else {
      throw new Error(`Failed to fetch receipt for transaction: ${tx.txid}`);
    }
  } catch(err) {
    // error handling code here
  }
}
```
