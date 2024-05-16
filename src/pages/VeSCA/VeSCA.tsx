// import { clsx } from "clsx";
import React from "react";
import Card from "~/components/Card/Card";
import Tabs from "~/components/Tabs/Tabs";
import css from "./VeSCA.module.scss";

export default function Lending() {
  const [activeTab1, setActiveTab1] = React.useState(0);
  const [activeTab2, setActiveTab2] = React.useState(0);

  return (
    <div className={css.vesca}>
      <div className={css.vesca__left}>
        <Card>
          <Card.Heading>Overview</Card.Heading>
          <Card.Pane className={css.sumPane}>
            <div className={css.entry}>
              <strong className={css.entry__title}>Total veSCA</strong>
              <div className={css.entry__value}>
                <span className={css.value}>3.2M</span>
                <div className={css.unit}>veSCA</div>
                <div className={css.icon} />
              </div>
            </div>
            <div className={css.entry}>
              <strong className={css.entry__title}>Total Locked SCA</strong>
              <div className={css.entry__value}>
                <span className={css.value}>3.97M</span>
                <div className={css.unit}>veSCA</div>
                <div className={css.icon} />
              </div>
            </div>
            <div className={css.entry}>
              <strong className={css.entry__title}>Average Lock Period</strong>
              <div className={css.entry__value}>
                <span className={css.value}>3.22</span>
                <div className={css.unit}>years</div>
              </div>
            </div>
          </Card.Pane>
          <Card.Pane>
            <h3 className={css.paneHeading}>My veSCA</h3>
            <div className={css.entry}>
              <strong className={css.entry__title}>Current veSCA</strong>
              <div className={css.entry__value}>
                <span className={css.value}>--</span>
                <div className={css.unit}>veSCA</div>
                <div className={css.icon} />
              </div>
            </div>
            <div className={css.entry}>
              <strong className={css.entry__title}>Locked SCA</strong>
              <div className={css.entry__value}>
                <span className={css.value}>--</span>
                <div className={css.unit}>veSCA</div>
                <div className={css.icon} />
              </div>
            </div>
            <div className={css.entry}>
              <strong className={css.entry__title}>Remaining Lock Period</strong>
              <div className={css.entry__value2}>
                <div className={css.value}>--</div>
                <div className={css.value} data-prefix="Unlocks at">
                  --
                </div>
              </div>
            </div>
            <div className={css.entry}>
              <strong className={css.entry__title}>Unlocked SCA</strong>
              <div className={css.entry__value2}>
                <span className={css.value}>--</span>
                <button className={css.withdrawButton}>Withdraw</button>
              </div>
            </div>
          </Card.Pane>
        </Card>
        <Card>
          <Tabs
            tabs={["Lending", "Borrowing"]}
            activeIdx={activeTab1}
            onTabChange={setActiveTab1}
          />
          <Card.Pane className={css.obligationPane}>
            <strong className={css.obligationPane__title}>Obligation ID</strong>
            <p className={css.obligationPane__text}>No data available</p>
          </Card.Pane>
        </Card>
      </div>
      <div className={css.vesca__right}>
        <Card>
          <Tabs
            tabs={["About veSCA", "Phase 3 (Ended)"]}
            activeIdx={activeTab2}
            onTabChange={setActiveTab2}
          />

          <div className={css.about}>
            <p className={css.about__text}>
              Lock SCA to receive veSCA and enjoy various benefits including boosted APR and voting
              governance (coming soon).
            </p>
            <button className={css.button}>New to VeSCA</button>
          </div>
        </Card>
        <Card>
          <Card.Heading>Stake SCA</Card.Heading>
          <Card.Pane className={css.stakePane}>
            <h3 className={css.paneHeading}>
              Enter Amount to Stake <span className={css.paneHeading__right}>Balance: 0</span>
            </h3>
            <p className={css.paneText}>Minimum Initial Lock Amount: 10 SCA</p>
            <p className={css.paneText}>Minimum Top Up Amount: 1 SCA</p>
          </Card.Pane>
          <Card.Pane>
            <h3 className={css.paneHeading}>Choose Lock Period</h3>
            <div className={css.periodPane}>
              <div className={css.periodPane__left}>
                <p className={css.paneText}>Maximum Lock Period: 4 years</p>
              </div>
              <Card.Pane className={css.periodPane__right}>
                <div className={css.entry}>
                  <strong className={css.entry__title}>SCA to be locked</strong>
                  <div className={css.entry__value}>
                    <span className={css.value}>0</span>
                    <div className={css.unit}>veSCA</div>
                    <div className={css.icon} />
                  </div>
                </div>
                <div className={css.entry}>
                  <strong className={css.entry__title}>Lock Duration</strong>
                  <div className={css.entry__value}>
                    <span className={css.value}>0</span>
                    <div className={css.unit}>days</div>
                  </div>
                </div>
                <div className={css.entry}>
                  <strong className={css.entry__title}>Estimated veSCA</strong>
                  <div className={css.entry__value}>
                    <span className={css.value}>0</span>
                    <div className={css.unit}>veSCA</div>
                    <div className={css.icon} />
                  </div>
                </div>
                <div className={css.entry}>
                  <strong className={css.entry__title}>Unlock Date</strong>
                  <div className={css.entry__value}>
                    <span className={css.value}>--</span>
                  </div>
                </div>
              </Card.Pane>
            </div>
            <div className={css.buttonWrapper}>
              <button className={css.button}>Connect Wallet</button>
            </div>
          </Card.Pane>
        </Card>
      </div>
    </div>
  );
}
