import { useQuery } from "@tanstack/react-query";
import { useConnex, useWallet } from "@vechain/dapp-kit-react";
import { find } from "lodash";
import BigNumber from "bignumber.js";
import ABI_ERC20 from "~/abis/erc20.json";

export default function useDelegateData() {
  const connex = useConnex();
  const { account } = useWallet();

  return useQuery({
    queryKey: ["my-balance", account],
    enabled: !!account,
    refetchInterval: 1000 * 30,
    queryFn: async () => {
      const b3trContract = connex.thor.account("0x5ef79995FE8a89e0812330E4378eB2660ceDe699");
      const vot3Contract = connex.thor.account("0x76ca782b59c74d088c7d2cce2f211bc00836c602");

      return Promise.all([
        b3trContract.method(find(ABI_ERC20, { name: "balanceOf" })).call(account),
        vot3Contract.method(find(ABI_ERC20, { name: "balanceOf" })).call(account)
      ]);
    },
    select: (data: any) => {
      return {
        b3trBalance: BigNumber(data[0].decoded["0"]).div(1e18),
        vot3Balance: BigNumber(data[1].decoded["0"]).div(1e18)
      };
    }
  });
}
