import { Outlet, NavLink } from "react-router-dom";
import Background from "~/components/Background";
import css from "./PageLayout.module.scss";

import IconLogo from "~/assets/logo.svg?react";

export default function Home() {
  return (
    <div className={css.root}>
      <nav className={css.nav}>
        <NavLink to="/" className={css.nav__logo}>
          <IconLogo />
        </NavLink>

        <NavLink to="/dashboard" className={css.nav__link}>
          Dashboard
        </NavLink>
        <NavLink to="/my-positions" className={css.nav__link}>
          My Positions
        </NavLink>
        <NavLink to="/reward" className={css.nav__link}>
          Reward
        </NavLink>
      </nav>
      <div className={css.root__content}>
        <Outlet />
      </div>
      <Background />
    </div>
  );
}
