import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useWallet, useWalletModal } from "@vechain/dapp-kit-react";
import Background from "~/components/Background";
import css from "./PageLayout.module.scss";

import IconLogo from "~/assets/logo.svg?react";

export default function PageLayout() {
  const { account } = useWallet();
  const { open, onConnectionStatusChange } = useWalletModal();
  const [buttonText, setButtonText] = useState("Connect Wallet");

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
        <NavLink to="/reward" className={css.nav__link}>
          Reward
        </NavLink>

        <button className={css.nav__wallet} onClick={open}>
          {buttonText}
        </button>
      </nav>

      <div className={css.root__content}>
        <Outlet />
      </div>

      <Background />
    </div>
  );
}
