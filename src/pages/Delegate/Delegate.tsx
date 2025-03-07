import { useMemo, useState } from "react";
import {
  Box,
  Button,
  CheckIcon,
  Container,
  Flex,
  Modal,
  Stack,
  Tabs,
  Text,
  Title,
  Input,
  Select
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAtom } from "jotai";
import { find } from "lodash";
import BigNumber from "bignumber.js";
import { useConnex, useWallet } from "@vechain/dapp-kit-react";
import { queryClient } from "~/query";
import { atomTransactionStatus } from "~/store";
import { DELEGATE_ADDRESS } from "~/constants/addresses";
import useDelegateData from "~/hooks/useDelegateData";
import useRewardList from "~/hooks/useRewardList";
import useMyBalance from "~/hooks/useMyBalance";
import VeDelegate from "~/abis/VeDelegate.json";
import ABI_ERC20 from "~/abis/erc20.json";
import Card from "~/components/Card";
import poll from "~/utils/pool";
import css from "./Delegate.module.scss";

import IconB3tr from "~/assets/tokens/b3tr.svg?react";

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function InfoEntry({ heading, content }: { heading: string; content: string }) {
  return (
    <Flex gap="md" align="flex-start">
      <Flex style={{ border: "1px solid rgba(255, 255, 255, .25)", padding: 8, borderRadius: 6 }}>
        <CheckIcon size={16} />
      </Flex>
      <Box>
        <Title order={5} c="white">
          {heading}
        </Title>
        <Text size="md" lh={1.3} mt="2">
          {content}
        </Text>
      </Box>
    </Flex>
  );
}

export default function Delegate() {
  const [opened, { open, close }] = useDisclosure(false);
  const connex = useConnex();
  const { account } = useWallet();
  const { data: delegateData } = useDelegateData();
  const { data: myRewardList } = useRewardList(delegateData?.roundId);
  const { data: myBalance } = useMyBalance();
  const [, setTransactionStatus] = useAtom(atomTransactionStatus);

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositType, setDepositType] = useState("B3TR");
  const [withdrawType, setWithdrawType] = useState("VOT3");

  const { thisMonday, nextMonday, nextSunday } = useMemo(() => {
    let now = new Date();

    let thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() - (now.getDay() || 7) + 1);
    thisMonday.setHours(0, 0, 0, 0);

    let nextMonday = new Date(thisMonday);
    nextMonday.setDate(thisMonday.getDate() + 7);

    let nextSunday = new Date(thisMonday);
    nextSunday.setDate(thisMonday.getDate() + 14);

    return {
      thisMonday: formatDate(thisMonday),
      nextMonday: formatDate(nextMonday),
      nextSunday: formatDate(nextSunday)
    };
  }, []);

  const handleDeposit = async () => {
    if (!connex) return;

    const amount = BigNumber(depositAmount).times(1e18).toString(10);

    const approveB3trMethod = connex.thor
      .account("0x5ef79995FE8a89e0812330E4378eB2660ceDe699")
      .method(find(ABI_ERC20, { name: "approve" }));
    const approveB3trClause = approveB3trMethod.asClause(DELEGATE_ADDRESS, amount);

    const approveVot3Method = connex.thor
      .account("0x76ca782b59c74d088c7d2cce2f211bc00836c602")
      .method(find(ABI_ERC20, { name: "approve" }));
    const approveVot3Clause = approveVot3Method.asClause(DELEGATE_ADDRESS, amount);

    const depositB3TR_abi = find(VeDelegate.abi, { name: "depositB3TR" });
    const depositB3trMethod = connex.thor.account(DELEGATE_ADDRESS).method(depositB3TR_abi);
    const depositB3trClause = depositB3trMethod.asClause(amount);

    const depositVOT3_abi = find(VeDelegate.abi, { name: "depositVOT3" });
    const depositVot3Method = connex.thor.account(DELEGATE_ADDRESS).method(depositVOT3_abi);
    const depositVot3Clause = depositVot3Method.asClause(amount);

    let clauses;
    if (depositType === "B3TR") {
      clauses = [{ ...approveB3trClause }, { ...depositB3trClause }];
    } else if (depositType === "VOT3") {
      clauses = [{ ...approveVot3Clause }, { ...depositVot3Clause }];
    } else {
      clauses = [
        { ...approveB3trClause },
        { ...approveVot3Clause },
        { ...depositB3trClause },
        { ...depositVot3Clause }
      ];
    }

    setTransactionStatus({
      isPending: true,
      message: `Deposit ${depositAmount} ${depositType}`
    });

    connex.vendor
      .sign("tx", clauses)
      .comment(`Deposit ${depositAmount} ${depositType}`)
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
          message: undefined
        });
        if (isSuccess) {
          setDepositAmount("");
          queryClient.clear();
        }
      })
      .catch((err: any) => {
        console.log("ERROR");
        console.log(err);
        setTransactionStatus(undefined);
      });
  };

  const handleWithdraw = async () => {
    if (!connex) return;

    const amount = BigNumber(withdrawAmount).times(1e18).toString(10);

    const withdraw_abi =
      withdrawType === "VOT3"
        ? find(VeDelegate.abi, { name: "withdraw" })
        : {
            inputs: [
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
              }
            ],
            name: "withdrawInB3TR",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function"
          };
    const withdrawMethod = connex.thor.account(DELEGATE_ADDRESS).method(withdraw_abi);
    const withdrawClause = withdrawMethod.asClause(amount);

    setTransactionStatus({
      isPending: true,
      message: `Withdrawing ${withdrawAmount} ${withdrawType}`
    });

    connex.vendor
      .sign("tx", [withdrawClause])
      .comment(`Withdraw ${withdrawAmount} ${withdrawType}`)
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
          message: undefined
        });
        if (isSuccess) {
          setWithdrawAmount("");
          queryClient.clear();
        }
      })
      .catch((err: any) => {
        console.log("ERROR");
        console.log(err);
        setTransactionStatus(undefined);
      });
  };

  const handleClaim = (roundId: number) => {
    if (!connex) return;

    const claim_abi = find(VeDelegate.abi, { name: "claimReward" });
    const claimMethod = connex.thor.account(DELEGATE_ADDRESS).method(claim_abi);
    const claimClause = claimMethod.asClause(roundId);

    setTransactionStatus({
      isPending: true,
      message: `Claiming my round ${roundId} rewards.`
    });

    connex.vendor
      .sign("tx", [{ ...claimClause }])
      .comment(`Claiming my round ${roundId} rewards.`)
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
          message: undefined
        });
        if (isSuccess) {
          queryClient.clear();
        }
      })
      .catch((err: any) => {
        console.log("ERROR");
        console.log(err);
        setTransactionStatus(undefined);
      });
  };

  const handleClaimAndRedeposit = (roundId: number, reward: string) => {
    if (!connex) return;

    const claim_abi = find(VeDelegate.abi, { name: "claimReward" });
    const claimMethod = connex.thor.account(DELEGATE_ADDRESS).method(claim_abi);
    const claimClause = claimMethod.asClause(roundId);

    const approveB3trMethod = connex.thor
      .account("0x5ef79995FE8a89e0812330E4378eB2660ceDe699")
      .method(find(ABI_ERC20, { name: "approve" }));
    const approveB3trClause = approveB3trMethod.asClause(DELEGATE_ADDRESS, reward);

    const depositB3TR_abi = find(VeDelegate.abi, { name: "depositB3TR" });
    const depositB3trMethod = connex.thor.account(DELEGATE_ADDRESS).method(depositB3TR_abi);
    const depositB3trClause = depositB3trMethod.asClause(reward);

    setTransactionStatus({
      isPending: true,
      message: `Claiming my round ${roundId} rewards.`
    });

    connex.vendor
      .sign("tx", [claimClause, approveB3trClause, depositB3trClause])
      .comment(`Claiming my round ${roundId} rewards.`)
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
          message: undefined
        });
        if (isSuccess) {
          queryClient.clear();
        }
      })
      .catch((err: any) => {
        console.log("ERROR");
        console.log(err);
        setTransactionStatus(undefined);
      });
  };

  return (
    <Container size="30rem" pb="5rem">
      <Stack gap="lg">
        <Title order={2} fw="bold" c="white">
          Stake for Sustainability
        </Title>

        <Card>
          <Title order={5} mb="sm" c="white">
            Your total deposited voting allocation
          </Title>

          <Flex>
            <Title mr="auto" order={6}>
              Your Delegated VOT3
            </Title>
            <Text size="sm">{delegateData?.delegateBalance.toFormat(2)}</Text>
          </Flex>

          <Button fullWidth size="md" my="md" radius="md" onClick={open} disabled={!account}>
            Manage Deposit
          </Button>

          <Modal
            opened={opened}
            onClose={close}
            centered
            closeOnEscape={false}
            closeOnClickOutside={false}
            radius="md"
            size="sm"
            styles={{
              header: { paddingTop: 0, paddingBottom: 0, minHeight: "3rem" }
            }}
          >
            <Tabs defaultValue="deposit">
              <Tabs.List justify="center" grow>
                <Tabs.Tab value="deposit" fw="600">
                  Deposit
                </Tabs.Tab>
                <Tabs.Tab value="withdraw" fw="600">
                  Withdraw
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="deposit">
                <Stack pt="sm" pb="xs">
                  <Input.Wrapper
                    label="Amount"
                    description={
                      <>
                        <Text
                          component="span"
                          size="xs"
                          style={{ display: "flex", justifyContent: "space-between" }}
                        >
                          B3TR Balance: <span>{myBalance?.b3trBalance.toFormat(4)} B3TR</span>
                        </Text>
                        <Text
                          component="span"
                          size="xs"
                          style={{ display: "flex", justifyContent: "space-between" }}
                        >
                          VOT3 Balance: <span>{myBalance?.vot3Balance.toFormat(4)} VOT3</span>
                        </Text>
                      </>
                    }
                  >
                    <Input
                      placeholder="0"
                      radius="lg"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />
                  </Input.Wrapper>
                  <Select
                    label="Token"
                    data={["VOT3", "B3TR"]}
                    value={depositType}
                    onChange={(value) => setDepositType(value!)}
                    description={`You have ${delegateData?.delegateBalance.toFormat(2)} Delegated B3TR`}
                    radius="lg"
                    disabled
                  />
                  <Button size="md" radius="md" onClick={handleDeposit}>
                    Deposit
                  </Button>
                </Stack>
              </Tabs.Panel>
              <Tabs.Panel value="withdraw">
                <Stack pt="sm" pb="xs">
                  <Input.Wrapper label="Amount">
                    <Input
                      placeholder="0"
                      radius="lg"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                  </Input.Wrapper>
                  <Select
                    label="Token"
                    data={["VOT3"]}
                    value={withdrawType}
                    onChange={(value) => setWithdrawType(value!)}
                    description={`You have ${delegateData?.delegateBalance.toFormat(2)} Delegated VOT3`}
                    radius="lg"
                    disabled
                  />
                  <Button size="md" radius="md" disabled>
                    Withdraw
                  </Button>
                </Stack>
              </Tabs.Panel>
            </Tabs>

            <Text size="xs">
              Your new deposit will earn rewards in the next voting round, starting on {nextMonday}.
              Rewards are claimable when the next voting round ends on {nextSunday}.
            </Text>
          </Modal>

          <div className={css.twoColumnGrid}>
            <Card.Pane>
              <Title order={6} mb="xs">
                GM NFT (Now 150%)
              </Title>
              <strong className={css.number}>VENUS1.5x</strong>
            </Card.Pane>
            <Card.Pane>
              <Title order={6} mb="xs">
                Current Annual Yield
              </Title>
              <strong className={css.number}>
                239 <i>%</i>
              </strong>
            </Card.Pane>
          </div>
        </Card>

        <Card>
          <Tabs mt="-12" defaultValue="default">
            <Tabs.List justify="center" grow>
              <Tabs.Tab value="default" fw="600" px="0" py="8">
                <Title order={5} m="0" c="white">
                  Claim Rewards
                </Title>
              </Tabs.Tab>
              <Tabs.Tab value="better" fw="600" px="0" py="8">
                <Title order={5} m="0" c="white" display="flex">
                  <IconB3tr width={20} style={{ marginRight: 8 }} />
                  Better Rewards
                </Title>
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="default" pt="sm">
              {!!myRewardList?.length ? (
                myRewardList.map((i: any) => (
                  <Flex key={i.roundId} align="center" mt="8">
                    <Title mr="auto" order={6}>
                      Round {i.roundId}
                    </Title>
                    <Text size="sm">{i.reward.toFormat(2)} B3TR</Text>
                    <Button
                      ml="xs"
                      size="compact-xs"
                      onClick={() =>
                        handleClaimAndRedeposit(
                          i.roundId,
                          BigNumber(i.reward).times(1e18).toString(10)
                        )
                      }
                      disabled={i.isClaimed}
                    >
                      Claim & Re-deposit
                    </Button>
                    <Button
                      ml="xs"
                      size="compact-xs"
                      onClick={() => handleClaim(i.roundId)}
                      disabled={i.isClaimed}
                    >
                      Claim
                    </Button>
                  </Flex>
                ))
              ) : (
                <Text size="sm">No rewards to claim</Text>
              )}
            </Tabs.Panel>
            <Tabs.Panel value="better" pt="sm">
              <Text size="sm">Coming soon...</Text>
            </Tabs.Panel>
          </Tabs>
        </Card>

        <Card>
          <Stack gap="sm">
            <Flex align="center" justify="space-between">
              <Title order={6} c="white">
                Assets under Management
              </Title>
              <Text size="sm">{delegateData?.totalBalance.toFormat(2)} VOT3</Text>
            </Flex>
            <Flex align="center" justify="space-between">
              <Title order={6} c="white">
                Platform Fees
              </Title>
              <Text size="sm">10% of Rewards</Text>
            </Flex>
            <Flex align="center" justify="space-between">
              <Title order={6} c="white">
                Last Updated
              </Title>
              <Text size="sm">{thisMonday}</Text>
            </Flex>
          </Stack>
        </Card>

        <Card>
          <Stack gap="lg">
            <InfoEntry
              heading="Effortless Voting Rewards:"
              content="Maximize voting rewards through strategic, preference-based voting and pooled staking."
            />
            <InfoEntry
              heading="Enhanced Rewards with GM NFT:"
              content="Access higher reward rates with higher level GM NFT boost."
            />
            <InfoEntry
              heading="Hands-Free Experience:"
              content="Just delegate and let VeStation 3arn manage weekly voting and reward distribution on your behalf."
            />
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
