import React from "react";
import { clsx } from "clsx";
import Card from "~/components/Card";
import Tabs from "~/components/Tabs";
import css from "./Lending.module.scss";

function TableRow({ setShowModal }: { setShowModal: (show: boolean) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <tr className={clsx(isOpen && css.openRow)}>
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
        <td>
          <button onClick={() => setIsOpen(!isOpen)}>open</button>
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan="8" className={css.expandTD}>
            <div className={css.expandPane}>
              <div className={css.expandPane__left}>
                <div className={css.pane}>
                  <strong className={css.paneHeading}>
                    <div className={css.paneHeading__icon}></div> SUI
                  </strong>
                  <div className={css.entry}>
                    <strong className={css.entry__title}>Price</strong>
                    <div className={css.entry__value}>
                      <span className={css.value}>$1.73</span>
                    </div>
                  </div>
                  <div className={css.entry}>
                    <strong className={css.entry__title}>Address</strong>
                    <div className={css.entry__value}>
                      <span className={css.value}>0x0000....0001</span>
                      <a href="">x</a>
                    </div>
                  </div>
                </div>
                <div className={css.pane}>
                  <strong className={css.paneHeading}>Collateral Info</strong>
                  <div className={css.entry}>
                    <strong className={css.entry__title}>Collateral Weight</strong>
                    <div className={css.entry__value}>
                      <span className={css.value}>75%</span>
                    </div>
                  </div>
                  <div className={css.entry}>
                    <strong className={css.entry__title}>Total Collateral</strong>
                    <div className={css.entry__value}>
                      <span className={css.value}>5.95M</span>
                      <div className={css.icon} />
                    </div>
                  </div>
                </div>
              </div>
              <div className={css.expandPane__center}>
                <div className={css.pane}>
                  <strong className={css.paneHeading}>Asset Info</strong>
                  <div className={css.entry}>
                    <strong className={css.entry__title}>Borrow Weight</strong>
                    <div className={css.entry__value}>
                      <span className={css.value}>100%</span>
                    </div>
                  </div>
                  <div className={css.entry}>
                    <strong className={css.entry__title}>Supply APR</strong>
                    <div className={css.entry__value}>
                      <span className={clsx(css.value, css.green)}>0.05%</span>
                    </div>
                  </div>
                  <div className={css.entry}>
                    <strong className={css.entry__title}>Borrow APR</strong>
                    <div className={css.entry__value}>
                      <span className={clsx(css.value, css.red)}>100%</span>
                    </div>
                  </div>
                  <div className={css.entry}>
                    <strong className={css.entry__title}>Utilization Rate</strong>
                    <div className={css.entry__value}>
                      <span className={css.value}>6.36%</span>
                    </div>
                  </div>
                  <div className={css.entry}>
                    <strong className={css.entry__title}>Total Supply</strong>
                    <div className={css.entry__value}>
                      <span className={css.value}>38.71M</span>
                      <div className={css.icon} />
                    </div>
                  </div>
                  <div className={css.entry}>
                    <strong className={css.entry__title}>Total Borrow</strong>
                    <div className={css.entry__value}>
                      <span className={css.value}>2.71M</span>
                      <div className={css.icon} />
                    </div>
                  </div>
                  <div className={css.entry}>
                    <strong className={css.entry__title}>Total Available Liquidity</strong>
                    <div className={css.entry__value}>
                      <span className={css.value}>35.25M</span>
                      <div className={css.icon} />
                    </div>
                  </div>
                </div>
              </div>
              <div className={css.expandPane__right}>
                <button className={css.button} onClick={() => setShowModal(true)}>
                  Supply
                </button>
                <button className={css.button} onClick={() => setShowModal(true)}>
                  Withdraw
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Modal({ show, close }: { show: boolean; close: () => void }) {
  const [activeTab, setActiveTab] = React.useState(0);

  if (!show) return null;

  return (
    <div className={css.modal}>
      <div className={css.modal__bg} onClick={close} />
      <Card className={css.modal__box}>
        <div className={css.modal__inner}>
          <Tabs tabs={["Supply", "Withdraw"]} activeIdx={activeTab} onTabChange={setActiveTab} />

          <Card.Pane>
            <strong className={css.paneHeading}>
              0 in Wallet <span className={css.paneHeading__right}>0 Supplied</span>
            </strong>
          </Card.Pane>

          <p className={css.modal__text}>
            Notice: You will send sCoins (Scallop Market Coins) to represent your debt when you
            withdraw coins in lending pools, transfer sCoin means transfer the debt to another
            address.
          </p>

          <div className={css.modal__row}>
            <Card.Pane>
              <div className={css.entry}>
                <strong className={css.entry__title}>Max Supply</strong>
                <div className={css.entry__value}>
                  <span className={css.value}>0</span>
                </div>
              </div>
              <div className={css.entry}>
                <strong className={css.entry__title}>Supply APY</strong>
                <div className={css.entry__value}>
                  <span className={css.value}>24.25%</span>
                </div>
              </div>
              <div className={css.entry}>
                <strong className={css.entry__title}>Market Price</strong>
                <div className={css.entry__value}>
                  <span className={css.value}>$1.21</span>
                </div>
              </div>
              <div className={css.entry}>
                <strong className={css.entry__title}>Utilization Rate</strong>
                <div className={css.entry__value}>
                  <span className={css.value}>13.39%</span>
                </div>
              </div>
              <div className={css.entry}>
                <strong className={css.entry__title}>Utilization Rate on Mid Kink</strong>
                <div className={css.entry__value}>
                  <span className={css.value}>60%</span>
                </div>
              </div>
              <div className={css.entry}>
                <strong className={css.entry__title}>Utilization Rate on High Kink</strong>
                <div className={css.entry__value}>
                  <span className={css.value}>90%</span>
                </div>
              </div>
            </Card.Pane>
            <Card.Pane>
              {activeTab === 0 && (
                <div className={css.entry}>
                  <strong className={css.entry__title}>Base Borrow APY</strong>
                  <div className={css.entry__value}>
                    <span className={css.value}>0%</span>
                  </div>
                </div>
              )}
              <div className={css.entry}>
                <strong className={css.entry__title}>Borrow APY on Mid Kink</strong>
                <div className={css.entry__value}>
                  <span className={css.value}>8.25%</span>
                </div>
              </div>
              <div className={css.entry}>
                <strong className={css.entry__title}>Borrow APY on High Kink</strong>
                <div className={css.entry__value}>
                  <span className={css.value}>171.46%</span>
                </div>
              </div>
              <div className={css.entry}>
                <strong className={css.entry__title}>Max Borrow APY</strong>
                <div className={css.entry__value}>
                  <span className={css.value}>1884.39%</span>
                </div>
              </div>
              <div className={css.entry}>
                <strong className={css.entry__title}>Borrow Fee</strong>
                <div className={css.entry__value}>
                  <span className={css.value}>10%</span>
                </div>
              </div>
              <div className={css.entry}>
                <strong className={css.entry__title}>Coin Address</strong>
                <div className={css.entry__value}>
                  <span className={css.value}>0x0000....0001</span>
                  <a href="">x</a>
                </div>
              </div>
            </Card.Pane>
          </div>

          {activeTab === 0 && <div className={css.modal__checkbox}>Stake sSUI into sCoin Pool</div>}

          <div className={css.modal__bgroup}>
            {activeTab === 0 ? (
              <button className={css.button}>Supply</button>
            ) : (
              <button className={css.button}>Withdraw</button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function Lending() {
  const [activeTab, setActiveTab] = React.useState(0);
  const [showModal, setShowModal] = React.useState(false);

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

        <Card.Pane className={css.tablePane}>
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
              <TableRow setShowModal={setShowModal} />
              <TableRow setShowModal={setShowModal} />
              <TableRow setShowModal={setShowModal} />
            </tbody>
          </table>
        </Card.Pane>
      </Card>

      <Modal show={showModal} close={() => setShowModal(false)} />
    </div>
  );
}
