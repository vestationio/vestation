import { useQuery } from "@tanstack/react-query";
import { useConnex, useWallet } from "@vechain/dapp-kit-react";
import { find } from "lodash";
import BigNumber from "bignumber.js";
import { DELEGATE_ADDRESS } from "~/constants/addresses";
import VeDelegate from "~/abis/VeDelegate.json";

export default function useRewardList(roundId: string) {
  const connex = useConnex();
  const { account } = useWallet();
  const roundList = Array.from({ length: +roundId - 20 + 1 }, (_, i) => +roundId - i);

  return useQuery({
    queryKey: ["reward-list", account],
    enabled: !!account && !!roundId,
    refetchInterval: 1000 * 30,
    queryFn: async () => {
      const contract = connex.thor.account(DELEGATE_ADDRESS);

      const rewardList = await Promise.all(
        roundList.map((roundId) =>
          contract.method(find(VeDelegate.abi, { name: "checkUserReward" })).call(roundId, account)
        )
      );

      const claimedList = await Promise.all(
        roundList.map((roundId) =>
          contract.method(find(VeDelegate.abi, { name: "checkuserClaimed" })).call(roundId, account)
        )
      );

      return { rewardList, claimedList };
    },
    select: (data: any) => {
      return data.rewardList
        .map((i: any, idx: number) => {
          return {
            roundId: roundList[idx],
            reward: BigNumber(i.decoded["0"]).div(1e18),
            isClaimed: !!data.claimedList[idx].decoded["0"]
          };
        })
        .filter((i: any) => i.reward.isGreaterThan(0));
    }
  });
}
