import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useWallet, useWalletModal } from "@vechain/dapp-kit-react";
import { Title, Text, Modal, Anchor, Loader, Flex } from "@mantine/core";
import { useAtom } from "jotai";
import { atomTransactionStatus } from "~/store";
import Background from "~/components/Background";
import css from "./PageLayout.module.scss";

import IconLogo from "~/assets/logo.svg?react";
import { IconRosetteDiscountCheck, IconExclamationCircle } from "@tabler/icons-react";

export default function PageLayout() {
  const { account } = useWallet();
  const { open, onConnectionStatusChange } = useWalletModal();
  const [buttonText, setButtonText] = useState("Connect Wallet");
  const [transactionStatus, setTransactionStatus] = useAtom(atomTransactionStatus);

  useEffect(() => {
    const handleConnected = (address: string | null) => {
      if (address) {
        const formattedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
        setButtonText(`Disconnect from ${formattedAddress}`);
      } else {
        setButtonText("Connect Wallet");
      }
    };
    handleConnected(account);
    onConnectionStatusChange(handleConnected);
  }, [account, onConnectionStatusChange]);

  return (
    <div className={css.root}>
      <nav className={css.nav}>
        <NavLink to="/" className={css.nav__logo}>
          <IconLogo />
        </NavLink>

        <NavLink to="/delegate" className={css.nav__link}>
          Delegate
        </NavLink>

        <NavLink to="/leaderboard" className={css.nav__link}>
          Leaderboard
        </NavLink>

        <NavLink to="/rewards" className={css.nav__link}>
          Rewards
        </NavLink>

        <button className={css.nav__wallet} onClick={open}>
          {buttonText}
        </button>
      </nav>

      <div className={css.root__content}>
        <Outlet />
      </div>

      <Modal
        opened={!!transactionStatus}
        onClose={() => setTransactionStatus(undefined)}
        closeOnEscape={false}
        closeOnClickOutside={false}
        radius="lg"
        size="sm"
        centered
      >
        <Flex gap="sm" justify="center" align="center" direction="column" pb="sm">
          {transactionStatus?.isPending && (
            <>
              <Loader />
              <Title order={5} mt="md" c="white">
                Waiting for confirmation....
              </Title>
            </>
          )}
          {transactionStatus?.isSuccessful && (
            <>
              <IconRosetteDiscountCheck size="3rem" color="green" />
              <Title order={4} c="white">
                Transaction Successful
              </Title>
            </>
          )}
          {transactionStatus?.isFailed && (
            <>
              <IconExclamationCircle size="3rem" color="red" />
              <Title order={4} c="white">
                Transaction Failed
              </Title>
            </>
          )}
          {!!transactionStatus?.message && (
            <Text c={transactionStatus.isFailed ? "red.2" : "white"} size="sm">
              {transactionStatus.message}
            </Text>
          )}
          {!!transactionStatus?.transactionHash && !transactionStatus?.isPending && (
            <Anchor
              variant="outline"
              href={`https://explore.vechain.org/transactions/${transactionStatus.transactionHash}#info`}
              target="_blank"
              underline="never"
            >
              View on explorer
            </Anchor>
          )}
        </Flex>
      </Modal>

      <Background />
    </div>
  );
}
