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

The examples below are for React environments. You'll need to use the `connex` instance from the `useConnex()` hook:

``` typescript
import { useConnex } from "@vechain/dapp-kit-react";

const connex = useConnex();
```

## Contract Read Operations

## Contract Write Operations

### Pool helper function

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

### Stake B3TR

``` typescript
import find from "lodash.find";
import ABI_ERC20 from "path/to/erc20.json";
import ABI_VEDELEGATE from "path/to/VeDelegate.json";

function stakeB3TR(amount: string) {
  const baseUnit = 10n ** BigInt(TOKEN_B3TR.decimals);
  const amountInWei = (BigInt(amount) * baseUnit).toString();
  
  const approveB3trMethod = connex.thor
    .account(TOKEN_B3TR.address)
    .method(find(ABI_ERC20, { name: "approve" }));
  const approveB3trClause = approveB3trMethod.asClause(VEDELEGATE_CONTRACT_ADDRESS, amountInWei);
  
  const stakeB3trMethod = connex.thor
    .account(VEDELEGATE_CONTRACT_ADDRESS)
    .method(find(ABI_VEDELEGATE, { name: "stakeB3TR" }));
  const stakeB3trClause = stakeB3trMethod.asClause(amountInWei);

  connex.vendor
    .sign("tx", [approveB3trClause, stakeB3trClause])
    .comment(`Stake ${amount} B3TR`)
    .request()
    .then((tx: any) => {
      return poll(() => connex.thor.transaction(tx.txid).getReceipt());
    })
    .then((result: any) => {
      const isSuccess = result.reverted === false;
      // add your result handling code
    })
    .catch(console.error);
}
```

### Unstake B3TR

``` typescript

```

### Claim Reward

``` typescript

```
