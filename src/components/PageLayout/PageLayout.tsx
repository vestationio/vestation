import { Outlet, NavLink } from "react-router-dom";
import css from "./PageLayout.module.scss";

import IconLogo from "~/assets/logo.svg?react";

export default function Home() {
  return (
    <div className={css.root}>
      <nav className={css.nav}>
        <IconLogo className={css.nav__logo} />

        <NavLink to="/lending" className={css.nav__link}>
          Lending
        </NavLink>
        <NavLink to="/vesca" className={css.nav__link}>
          VeSCA
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
}
