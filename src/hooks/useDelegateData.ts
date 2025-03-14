import { useQuery } from "@tanstack/react-query";
import { useConnex, useWallet } from "@vechain/dapp-kit-react";
import { find } from "lodash";
import BigNumber from "bignumber.js";
import { DELEGATE_ADDRESS } from "~/constants/addresses";
import ABI_ERC20 from "~/abis/erc20.json";
import VeDelegate from "~/abis/VeDelegateV2.json";

export default function useDelegateData() {
  const connex = useConnex();
  const { account } = useWallet();

  return useQuery({
    queryKey: ["delegate-data", account],
    enabled: !!account,
    refetchInterval: 1000 * 30,
    queryFn: async () => {
      const contract = connex.thor.account(DELEGATE_ADDRESS);

      const roundData = await fetch(`https://graph.vet/subgraphs/name/vebetter/dao`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: `{rounds(orderBy: voteStart, orderDirection: desc, first: 2) { id }}`
        })
      })
        .then((res: any) => res.json())
        .then(({ data }) => ({
          currentRoundId: data.rounds[0].id,
          lastEndedRoundId: data.rounds[1].id
        }));

      return Promise.all([
        contract.method(find(ABI_ERC20, { name: "balanceOf" })).call(account),
        contract.method(find(ABI_ERC20, { name: "totalSupply" })).call(),
        contract
          .method(find(VeDelegate.abi, { name: "getTotalVotes" }))
          .call(roundData.lastEndedRoundId),
        contract
          .method(find(VeDelegate.abi, { name: "getUserVotes" }))
          .call(account, roundData.lastEndedRoundId),
        contract.method(find(VeDelegate.abi, { name: "balanceOf" })).call(account),
        contract.method(find(VeDelegate.abi, { name: "B3TRBalances" })).call(account),
        () => roundData
      ]);
    },
    select: (data: any) => {
      const delegateBalance = BigNumber(data[0].decoded["0"]).div(1e18);
      const totalBalance = BigNumber(data[1].decoded["0"]).div(1e18);
      const totalVotes = BigNumber(data[2].decoded["0"]);
      const userVotes = BigNumber(data[3].decoded["0"]);
      const b3trBalance = BigNumber(data[5].decoded["0"]).div(1e18);
      const vot3Balance = BigNumber(data[4].decoded["0"]).minus(data[5].decoded["0"]).div(1e18);
      const roundData = data[6]();
      return {
        delegateBalance,
        totalBalance,
        totalVotes,
        userVotes,
        b3trBalance,
        vot3Balance,
        roundId: roundData.lastEndedRoundId
      };
    }
  });
}
