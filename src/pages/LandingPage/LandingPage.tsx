// import { clsx } from "clsx";
import { Link } from "react-router-dom";
import css from "./LandingPage.module.scss";

import IconLogo from "~/assets/logo.svg?react";
import IconTwitter from "~/assets/twitter.svg?react";
import IconDiscord from "~/assets/discord.svg?react";
import IconTelegram from "~/assets/telegram.svg?react";
import IconGithub from "~/assets/github.svg?react";

export default function LandingPage() {
  return (
    <div className={css.page}>
      <nav className={css.nav}>
        <IconLogo className={css.nav__logo} />
        <div className={css.nav__links}>
          <Link to="/overview" className={css.nav__link}>
            Charts
          </Link>
          <Link to="/" className={css.nav__link}>
            Blogs
          </Link>
          <Link to="/" className={css.nav__link}>
            Helps
          </Link>
          <Link to="/" className={css.nav__link}>
            Chat
          </Link>
        </div>
        <Link to="/swap" className={css.nav__button}>
          Launch App
        </Link>
      </nav>

      <div className={css.hero}>
        <div className={css.hero__container}>
          <h1 className={css.hero__heading}>Audited, One-Click Token Swap on VeChain</h1>
          <p className={css.hero__subheading}>
            Fast VeChain native Dex with multi-task transaction, fee delation, automatic VTHO
            generation features enabled.
          </p>
          <div className={css.hero__bar}>
            <div className={css.hero__bGroup}>
              <Link to="/swap" className={css.hero__button}>
                Launch App
              </Link>
              <Link to="/overview" className={css.hero__button}>
                Charts
              </Link>
            </div>

            <div className={css.iconLinks}>
              <a href="" className={css.link}>
                <IconTwitter />
              </a>
              <a href="" className={css.link}>
                <IconDiscord />
              </a>
              <a href="" className={css.link}>
                <IconTelegram />
              </a>
              <a href="" className={css.link}>
                <IconGithub />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
