import { clsx } from "clsx";
import { Link } from "react-router-dom";
import Background from "~/components/Background";
import css from "./LandingPage.module.scss";

import IconLogo from "~/assets/logo.svg?react";
import IconTwitter from "~/assets/twitter.svg?react";
import Medium from "~/assets/medium-brands-solid.svg?react";
import IconTelegram from "~/assets/telegram.svg?react";
import IconLinktree from "~/assets/linktree-logo-icon.svg?react";

export default function LandingPage() {
  return (
    <div className={css.page}>
      <Background />

      <nav className={css.nav}>
        <Link to="/">
          <IconLogo className={css.nav__logo} />
        </Link>
        <div className={css.nav__links}>
          <div className={clsx(css.nav__link, css.coming)}>
            <span>Charts</span>
          </div>
          <Link to="https://medium.com/@vestationve" className={css.nav__link}>
            Blogs
          </Link>
          <Link to="https://t.me/VeStation" className={css.nav__link}>
            Chat
          </Link>
        </div>
        <Link to="/delegate" className={css.nav__button}>
          Launch App
        </Link>
      </nav>

      <div className={css.hero}>
        <div className={css.hero__container}>
          <h1 className={css.hero__heading}>Seamless, secure, and sustainable VeFi ecosystem</h1>
          <p className={css.hero__subheading}>
            The pioneering DeFi platform integrating VeBetterDAO for sustainability on VeChain.
          </p>
          <div className={css.hero__bar}>
            <div className={css.hero__bGroup}>
              <Link to="/delegate" className={css.hero__button}>
                Launch App
              </Link>
              <div className={clsx(css.hero__button, css.coming)}>
                <span>Charts</span>
              </div>
            </div>

            <div className={css.iconLinks}>
              <a href="https://x.com/VeStation_" className={css.link}>
                <IconTwitter />
              </a>
              <a href="https://medium.com/@vestationve" className={css.link}>
                <Medium />
              </a>
              <a href="https://t.me/VeStation" className={css.link}>
                <IconTelegram />
              </a>
              <a href="https://linktr.ee/VeStation" className={css.link}>
                <IconLinktree />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
