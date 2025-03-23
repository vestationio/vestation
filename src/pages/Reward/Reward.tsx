import { find } from "lodash";
import { useAtom } from "jotai";
import BigNumber from "bignumber.js";
import { Container, Button, Center, Loader } from "@mantine/core";
import { useState, useMemo, useEffect } from "react";
import { useWallet, useConnex } from "@vechain/dapp-kit-react";
import Card from "~/components/Card";
import ABI_MerkleDistributor from "~/abis/MerkleDistributor.json";
import poll from "~/utils/pool";
import { atomTransactionStatus } from "~/store";

// import rewardRonud1Data from "./round-1.json";

const roundList = [
  {
    title: "Round 1",
    address: "",
    userList: {}
    // userList: rewardRonud1Data.claims
  }
];

export default function Reward() {
  const connex = useConnex();
  const { account } = useWallet();
  const [claimedRecord, setClaimedRecord] = useState([] as boolean[]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setTransactionStatus] = useAtom(atomTransactionStatus);

  const myRewards = useMemo(() => {
    return roundList.reduce((a, c) => {
      const myClaimData = Object.entries(c.userList).find(
        ([key]) => key.toLowerCase() === account?.toLowerCase()
      )?.[1];
      if (myClaimData) a.push({ ...c, myClaimData });
      return a;
    }, [] as any[]);
  }, [account]);

  useEffect(() => {
    async function fetchRewardData() {
      try {
        Promise.all(
          myRewards.map((round) => {
            return connex.thor
              .account(round.address)
              .method(find(ABI_MerkleDistributor.abi, { name: "isClaimed" }))
              .call(round.myClaimData.index);
          })
        ).then((res) => {
          setClaimedRecord(res.map((i: any) => i?.decoded["0"]));
        });
      } catch (error) {
        console.log("fetch claimed data error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (myRewards && connex) {
      fetchRewardData();
    }
  }, [connex, myRewards, setIsLoading, setClaimedRecord]);

  const handleClaim = async (idx: number, round: any) => {
    const { address, myClaimData } = myRewards[idx];
    const method = connex.thor
      .account(address)
      .method(find(ABI_MerkleDistributor.abi, { name: "claim" }));
    const clause = method.asClause(
      myClaimData.index,
      account,
      myClaimData.amount,
      myClaimData.proof
    );

    setTransactionStatus({
      isPending: true,
      isSuccessful: false,
      isFailed: false,
      transactionHash: undefined,
      message: `Claim Reward`
    });

    connex.vendor
      .sign("tx", [clause])
      .comment("Claim Reward")
      .request()
      .then((tx: any) => {
        return poll(() => connex.thor.transaction(tx.txid).getReceipt());
      })
      .then((result: any) => {
        const isSuccess = result.reverted === false;
        setTransactionStatus({
          isPending: false,
          isSuccessful: isSuccess,
          isFailed: !isSuccess,
          transactionHash: result.meta.txID,
          message: undefined,
          rewardData: {
            round: round.title.match(/\d+/g)?.[0],
            amount: BigNumber(round.myClaimData.amount).div(1e18).toFixed(0)
          }
        });
        if (isSuccess) {
          setClaimedRecord((prev) => {
            const newRecord = [...prev];
            newRecord[idx] = true;
            return newRecord;
          });
        }
      })
      .catch((err: any) => {
        console.log("ERROR");
        console.log(err);
        setTransactionStatus(undefined);
      });
  };

  if (!account) {
    return (
      <Container size="32rem" pb="5rem" ta="center">
        <Card>Please connect your wallet before proceeding.</Card>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  if (!myRewards.length || myRewards.every((i) => !i)) {
    return (
      <Container size="32rem" pb="5rem" ta="center">
        <Card>Sorry, you have no rewards at this time.</Card>
      </Container>
    );
  }

  return (
    <Container size="32rem" pb="5rem">
      {myRewards.map((round: any, idx: number) => {
        return (
          <div key={`reward-${idx}`}>
            <Card>
              <h2>{round.title}</h2>
              <div>{BigNumber(round.myClaimData.amount).div(1e18).toFixed(6)}</div>
            </Card>
            {claimedRecord[idx] ? (
              <Button fullWidth disabled>
                Already Claimed
              </Button>
            ) : (
              <Button fullWidth onClick={() => handleClaim(idx, round)}>
                Claim
              </Button>
            )}
          </div>
        );
      })}
    </Container>
  );
}
