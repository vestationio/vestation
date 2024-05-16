import { Outlet, NavLink } from "react-router-dom";

import css from "./PageLayout.module.scss";

export default function Home() {
  return (
    <div className={css.root}>
      <nav className={css.nav}>
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
