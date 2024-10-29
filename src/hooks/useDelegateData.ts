import { useQuery } from "@tanstack/react-query";
import { useConnex, useWallet } from "@vechain/dapp-kit-react";
import { find } from "lodash";
import BigNumber from "bignumber.js";
import { DELEGATE_ADDRESS } from "~/constants/addresses";
import ABI_ERC20 from "~/abis/erc20.json";
import VeDelegate from "~/abis/VeDelegate.json";

export default function useDelegateData() {
  const connex = useConnex();
  const { account } = useWallet();

  return useQuery({
    queryKey: ["delegate-data", account],
    enabled: !!account,
    refetchInterval: 1000 * 30,
    queryFn: async () => {
      const contract = connex.thor.account(DELEGATE_ADDRESS);

      const roundId = await fetch(`https://graph.vet/subgraphs/name/vebetter/dao`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: `{rounds(orderBy: voteStart, orderDirection: desc, first: 1) { id }}`
        })
      })
        .then((res: any) => res.json())
        .then(({ data }) => data.rounds[0].id);

      return Promise.all([
        contract.method(find(ABI_ERC20, { name: "balanceOf" })).call(account),
        contract.method(find(VeDelegate.abi, { name: "checkReward" })).call(roundId),
        contract.method(find(VeDelegate.abi, { name: "getTotalVotes" })).call(roundId),
        contract.method(find(VeDelegate.abi, { name: "getUserVotes" })).call(account, roundId)
      ]);
    },
    select: (data: any) => {
      const delegateBalance = BigNumber(data[0].decoded["0"]).div(1e18);
      const reward = BigNumber(data[1].decoded["0"]);
      const totalVotes = BigNumber(data[2].decoded["0"]);
      const userVotes = BigNumber(data[3].decoded["0"]);
      return { delegateBalance, reward, totalVotes, userVotes };
    }
  });
}
