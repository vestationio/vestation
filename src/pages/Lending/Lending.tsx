import React from "react";
// import { clsx } from "clsx";
import Card from "~/components/Card";
import Tabs from "~/components/Tabs";
import css from "./Lending.module.scss";

export default function Lending() {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div className={css.lending}>
      <Card>
        <Card.Heading>Overview</Card.Heading>
        <div className={css.overview}>
          <Card.Pane>
            <strong className={css.paneHeading}>VeStation TVL</strong>
            <div className={css.number}>
              <div className={css.number__value}>$100.99M</div>
              <div className={css.number__unit}>USD</div>
              <div className={css.number__percentage}>-20.00%</div>
              <div className={css.number__text}>than last week</div>
            </div>
          </Card.Pane>
          <Card.Pane>
            <strong className={css.paneHeading}>Total Supply</strong>
            <div className={css.number}>
              <div className={css.number__value}>$100.99M</div>
              <div className={css.number__unit}>USD</div>
              <div className={css.number__percentage}>-20.00%</div>
              <div className={css.number__text}>than last week</div>
            </div>
          </Card.Pane>
          <Card.Pane>
            <strong className={css.paneHeading}>Total Borrow</strong>
            <div className={css.number}>
              <div className={css.number__value}>$100.99M</div>
              <div className={css.number__unit}>USD</div>
              <div className={css.number__percentage}>-20.00%</div>
              <div className={css.number__text}>than last week</div>
            </div>
          </Card.Pane>
        </div>
      </Card>
      <Card>
        <Card.Heading>Rewards</Card.Heading>
        <div className={css.rewards}>
          <div className={css.rewards__card}>
            <h3 className={css.rewards__heading}>Incentive Program</h3>
            <p className={css.rewards__intro}>
              The Scallop Incentive Program aims to reward early lenders and borrowers by providing
              extra limited SUI tokens and SCA tokens during the Rewards Period. This program is
              expected to persist throughout the entirety of the current year.
            </p>
          </div>
          <Card.Pane>
            <strong className={css.paneHeading}>Rewards Period</strong>
            <div className={css.rewardsValue}>03.25 - 04.07</div>
          </Card.Pane>
          <Card.Pane>
            <strong className={css.paneHeading}>Pending Yield</strong>
            <div className={css.rewardsAmount}>
              <div className={css.rewardsAmount__icon} /> 0.00000
            </div>
            <div className={css.rewardsAmount}>
              <div className={css.rewardsAmount__icon} /> 0.00000
            </div>
          </Card.Pane>
        </div>
      </Card>
      <Card>
        <div className={css.tabs}>
          <div className={css.tabs__card}>
            <Tabs
              tabs={["Lending", "Borrowing"]}
              activeIdx={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
          <Card.Pane>
            <strong className={css.paneHeading}>Your Supply</strong>
            <div className={css.number}>
              <div className={css.number__value}>$100.99M</div>
              <div className={css.number__unit}>USD</div>
            </div>
          </Card.Pane>
          <Card.Pane>
            <strong className={css.paneHeading}>Pending Yield</strong>
            <div className={css.number}>
              <div className={css.number__value}>0%</div>
            </div>
            <div className={css.paneText}>Supplied 0 Pools</div>
          </Card.Pane>
        </div>

        <Card.Pane>
          <div className={css.controller}>
            <strong className={css.controller__heading}>
              {activeTab === 0 ? "Lending" : "Borrowing"} Pools
            </strong>
          </div>

          <table className={css.table}>
            <thead>
              <tr>
                <th>Coin</th>
                <th>Your Supply</th>
                <th>Total Supply</th>
                <th>Total Borrow</th>
                <th>Utilization Rate</th>
                <th>Supply APY</th>
                <th>Reward APR</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className={css.coin}>
                    <div className={css.coin__data}>
                      <span className={css.coin__name}>SUI</span>
                      <span className={css.coin__label1}>Wormhole</span>
                      <span className={css.coin__label2}>Deprecated</span>
                    </div>
                    <div className={css.coin__price}>≈ 1.67 USD</div>
                  </div>
                </td>
                <td>0</td>
                <td>38.35M SUI</td>
                <td>38.35M SUI</td>
                <td>6.31%</td>
                <td>0.05%</td>
                <td>27.99%</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </Card.Pane>
      </Card>
    </div>
  );
}
