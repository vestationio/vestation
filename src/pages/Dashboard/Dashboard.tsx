// import React from "react";
import { clsx } from "clsx";
import Card from "~/components/Card";
// import Tabs from "~/components/Tabs";
import css from "./Dashboard.module.scss";

import IconVet from "~/assets/tokens/vet.svg?react";
import IconSSUSD from "~/assets/tokens/ssusd.svg?react";

export default function Dashboard() {
  return (
    <div className={css.dashboard}>
      <div className={css.dashboard__row}>
        <Card>
          <Card.Heading>Dashboard</Card.Heading>
          <div className={css.dashboardCard}>
            <div className={css.twoColumnGrid}>
              <Card.Pane>
                <h3 className={css.paneHeading}>$ssUSD Total Supply</h3>
                <strong className={css.number}>$123,212,123</strong>
              </Card.Pane>
              <Card.Pane>
                <h3 className={css.paneHeading}>Station Level</h3>
                <strong className={css.number}>42.42%</strong>
              </Card.Pane>
            </div>
          </div>
        </Card>
        <Card>
          <div className={css.cardHeading}>
            <div className={css.cardHeading__icon}>
              <IconSSUSD />
            </div>
            <div className={css.cardHeading__content}>
              <h3 className={css.cardHeading__title}>
                <strong>Mint $ssUSD</strong>
                <div className={css.cardHeading__row}>
                  <button className={clsx(css.button, css.small)}>Mint</button>
                  <button className={clsx(css.button, css.small)}>Redeem</button>
                </div>
              </h3>

              <div className={css.threeColumnGrid}>
                <Card.Pane small>
                  <h3 className={clsx(css.paneHeading, css.small)}>Available</h3>
                  <strong className={clsx(css.number, css.small)}>335,822</strong>
                </Card.Pane>
                <Card.Pane small>
                  <h3 className={clsx(css.paneHeading, css.small)}>Minted</h3>
                  <strong className={clsx(css.number, css.small)}>33,822</strong>
                </Card.Pane>
                <Card.Pane small>
                  <h3 className={clsx(css.paneHeading, css.small)}>Risk</h3>
                  <strong className={clsx(css.number, css.small, css.green)}>10%</strong>
                </Card.Pane>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className={css.cardHeading}>
            <div className={css.cardHeading__icon}>
              <IconVet />
            </div>
            <div className={css.cardHeading__content}>
              <h3 className={css.cardHeading__title}>
                <strong>Mint Vet</strong>
                <div className={css.cardHeading__row}>
                  <button className={clsx(css.button, css.small)}>Mint</button>
                  <button className={clsx(css.button, css.small)}>Redeem</button>
                </div>
              </h3>

              <div className={css.threeColumnGrid}>
                <Card.Pane small>
                  <h3 className={clsx(css.paneHeading, css.small)}>Available</h3>
                  <strong className={clsx(css.number, css.small)}>335,822</strong>
                </Card.Pane>
                <Card.Pane small>
                  <h3 className={clsx(css.paneHeading, css.small)}>Minted</h3>
                  <strong className={clsx(css.number, css.small)}>33,822</strong>
                </Card.Pane>
                <Card.Pane small>
                  <h3 className={clsx(css.paneHeading, css.small)}>Risk</h3>
                  <strong className={clsx(css.number, css.small, css.red)}>10%</strong>
                </Card.Pane>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
