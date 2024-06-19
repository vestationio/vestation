import React from "react";
import { clsx } from "clsx";
import Card from "~/components/Card";
import Tabs from "~/components/Tabs";
import css from "./Lending.module.scss";

function Input() {
  return (
    <div className={css.input}>
      <div className={css.input__top}>
        <input className={css.input__input} placeholder="0.0" />
        <div className={css.input__token}>
          <div className={css.input__tokenIcon}></div>
          <div className={css.input__takenSymbol}>WETH</div>
        </div>
      </div>
      <div className={css.input__bottom}>
        <div className={css.input__price}>$ 0.0</div>
        <div className={css.input__max}>Max: 0.0</div>
      </div>
    </div>
  );
}

function TableRow() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);

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
        <td>$4.36M</td>
        <td>2.01M</td>
        <td>38.23k</td>
        <td>6%</td>
        <td>-</td>
        <td>
          <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "close" : "open"}</button>
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan={8} className={css.expandTD}>
            <div className={css.expandPane}>
              <Tabs
                small
                tabs={["Borrow", "Repay"]}
                activeIdx={activeTab}
                onTabChange={setActiveTab}
              />
              <div className={css.expandPane__container}>
                {activeTab === 0 ? (
                  <div className={css.expandPane__left}>
                    <div className={css.pane}>
                      <strong className={css.paneHeading}>Deposit Collateral</strong>
                      <p className={css.paneSubheading}>
                        Select the amount of WETH to deposit in the Cauldron
                      </p>
                      <Input />
                    </div>
                    <div className={css.pane}>
                      <strong className={css.paneHeading}>Mint MIM</strong>
                      <p className={css.paneSubheading}>
                        Select the amount of MIM to borrow from the Cauldron
                      </p>
                      <Input />
                    </div>
                    <button className={css.button}>Connect Wallet</button>
                  </div>
                ) : (
                  <div className={css.expandPane__left}>
                    <div className={css.pane}>
                      <strong className={css.paneHeading}>Remove Collateral</strong>
                      <p className={css.paneSubheading}>
                        Select the amount of WETH to withdraw from the Cauldron
                      </p>
                      <Input />
                    </div>
                    <div className={css.pane}>
                      <strong className={css.paneHeading}>Repay MIM</strong>
                      <p className={css.paneSubheading}>Select the amount of MIM to Repay</p>
                      <Input />
                    </div>
                    <button className={css.button}>Connect Wallet</button>
                  </div>
                )}
                <div className={css.expandPane__center}>
                  <div className={css.pane}>
                    <strong className={css.paneHeading}>Open Position</strong>
                    <div className={css.positionPane}>
                      <div className={css.positionPane__title}>Collateral Deposit</div>
                      <div className={css.positionPane__value}>0.0</div>
                      <div className={css.positionPane__price}>$0.0</div>
                    </div>
                    <div className={css.positionPane}>
                      <div className={css.positionPane__title}>MIM to Repay</div>
                      <div className={css.positionPane__value}>0.0</div>
                    </div>
                    <div className={css.positionPane}>
                      <div className={css.positionPane__title}>Liquidation Price</div>
                      <div className={css.positionPane__value}>$0.0</div>
                    </div>
                    <div className={css.positionPane}>
                      <div className={css.positionPane__title}>Current Price</div>
                      <div className={css.positionPane__value}>1 = 3,553.7</div>
                    </div>
                  </div>
                </div>
                <div className={css.expandPane__right}>
                  <div className={css.pane}>
                    <strong className={css.paneHeading}>Cauldron Stats</strong>
                    <div className={css.entry}>
                      <strong className={css.entry__title}>Mint Fee</strong>
                      <div className={css.entry__value}>
                        <span className={css.value}>0.5%</span>
                      </div>
                    </div>
                    <div className={css.entry}>
                      <strong className={css.entry__title}>Interest Fee</strong>
                      <div className={css.entry__value}>
                        <span className={css.value}>6%</span>
                      </div>
                    </div>
                    <div className={css.entry}>
                      <strong className={css.entry__title}>Liquidation Fee</strong>
                      <div className={css.entry__value}>
                        <span className={css.value}>6%</span>
                      </div>
                    </div>
                    <div className={css.entry}>
                      <strong className={css.entry__title}>MCR</strong>
                      <div className={css.entry__value}>
                        <span className={css.value}>80%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// function Modal({ show, close }: { show: boolean; close: () => void }) {
//   const [activeTab, setActiveTab] = React.useState(0);

//   if (!show) return null;

//   return (
//     <div className={css.modal}>
//       <div className={css.modal__bg} onClick={close} />
//       <Card className={css.modal__box}>
//         <div className={css.modal__inner}>
//           <Tabs tabs={["Supply", "Withdraw"]} activeIdx={activeTab} onTabChange={setActiveTab} />

//           <Card.Pane>
//             <strong className={css.paneHeading}>
//               0 in Wallet <span className={css.paneHeading__right}>0 Supplied</span>
//             </strong>
//           </Card.Pane>

//           <p className={css.modal__text}>
//             Notice: You will send sCoins (Scallop Market Coins) to represent your debt when you
//             withdraw coins in lending pools, transfer sCoin means transfer the debt to another
//             address.
//           </p>

//           <div className={css.modal__row}>
//             <Card.Pane>
//               <div className={css.entry}>
//                 <strong className={css.entry__title}>Max Supply</strong>
//                 <div className={css.entry__value}>
//                   <span className={css.value}>0</span>
//                 </div>
//               </div>
//               <div className={css.entry}>
//                 <strong className={css.entry__title}>Supply APY</strong>
//                 <div className={css.entry__value}>
//                   <span className={css.value}>24.25%</span>
//                 </div>
//               </div>
//               <div className={css.entry}>
//                 <strong className={css.entry__title}>Market Price</strong>
//                 <div className={css.entry__value}>
//                   <span className={css.value}>$1.21</span>
//                 </div>
//               </div>
//               <div className={css.entry}>
//                 <strong className={css.entry__title}>Utilization Rate</strong>
//                 <div className={css.entry__value}>
//                   <span className={css.value}>13.39%</span>
//                 </div>
//               </div>
//               <div className={css.entry}>
//                 <strong className={css.entry__title}>Utilization Rate on Mid Kink</strong>
//                 <div className={css.entry__value}>
//                   <span className={css.value}>60%</span>
//                 </div>
//               </div>
//               <div className={css.entry}>
//                 <strong className={css.entry__title}>Utilization Rate on High Kink</strong>
//                 <div className={css.entry__value}>
//                   <span className={css.value}>90%</span>
//                 </div>
//               </div>
//             </Card.Pane>
//             <Card.Pane>
//               {activeTab === 0 && (
//                 <div className={css.entry}>
//                   <strong className={css.entry__title}>Base Borrow APY</strong>
//                   <div className={css.entry__value}>
//                     <span className={css.value}>0%</span>
//                   </div>
//                 </div>
//               )}
//               <div className={css.entry}>
//                 <strong className={css.entry__title}>Borrow APY on Mid Kink</strong>
//                 <div className={css.entry__value}>
//                   <span className={css.value}>8.25%</span>
//                 </div>
//               </div>
//               <div className={css.entry}>
//                 <strong className={css.entry__title}>Borrow APY on High Kink</strong>
//                 <div className={css.entry__value}>
//                   <span className={css.value}>171.46%</span>
//                 </div>
//               </div>
//               <div className={css.entry}>
//                 <strong className={css.entry__title}>Max Borrow APY</strong>
//                 <div className={css.entry__value}>
//                   <span className={css.value}>1884.39%</span>
//                 </div>
//               </div>
//               <div className={css.entry}>
//                 <strong className={css.entry__title}>Borrow Fee</strong>
//                 <div className={css.entry__value}>
//                   <span className={css.value}>10%</span>
//                 </div>
//               </div>
//               <div className={css.entry}>
//                 <strong className={css.entry__title}>Coin Address</strong>
//                 <div className={css.entry__value}>
//                   <span className={css.value}>0x0000....0001</span>
//                   <a href="">x</a>
//                 </div>
//               </div>
//             </Card.Pane>
//           </div>

//           {activeTab === 0 && <div className={css.modal__checkbox}>Stake sSUI into sCoin Pool</div>}

//           <div className={css.modal__bgroup}>
//             {activeTab === 0 ? (
//               <button className={css.button}>Supply</button>
//             ) : (
//               <button className={css.button}>Withdraw</button>
//             )}
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }

export default function Lending() {
  return (
    <div className={css.lending}>
      <Card>
        <Card.Heading>Staking</Card.Heading>
        <div className={css.overview}>
          <Card.Pane>
            <strong className={css.paneHeading}>Total APY</strong>
            <div className={css.number}>
              <div className={css.number__value}>47.24%</div>
              <div className={css.number__text}>(last 24hrs)</div>
            </div>
          </Card.Pane>
          <Card.Pane>
            <strong className={css.paneHeading}>Total Reward</strong>
            <div className={css.number}>
              <div className={css.number__value}>1,533,238</div>
              <div className={css.number__unit}>USD</div>
            </div>
          </Card.Pane>
          <Card.Pane>
            <strong className={css.paneHeading}>My Reward</strong>
            <div className={css.rewardAmount}>$123 VTHO</div>
            <div className={css.rewardAmount}>$123 BETR</div>
            <div className={css.rewardAmount}>$123 VSTA</div>
          </Card.Pane>
        </div>
        <div className={css.bgroup}>
          <button className={css.button}>Stake $VET</button>
          <button className={css.button}>Unstake & Claim</button>
          <button className={css.button}>Claim Reward</button>
        </div>
      </Card>
      <Card>
        <Card.Heading>Sustainable - USD</Card.Heading>
        <div className={css.overview}>
          <Card.Pane>
            <strong className={css.paneHeading}>Total Supply</strong>
            <div className={css.number}>
              <div className={css.number__value}>73,005,077</div>
            </div>
          </Card.Pane>
          <Card.Pane>
            <strong className={css.paneHeading}>Risk Management</strong>
            <div className={css.number}>
              <div className={css.number__value}>50%</div>
            </div>
          </Card.Pane>
          <Card.Pane>
            <strong className={css.paneHeading}>Station Level</strong>
            <div className={css.number}>
              <div className={css.number__value}>Premium</div>
            </div>
          </Card.Pane>
        </div>
        <div className={css.bgroup}>
          <button className={css.button}>Mint $stUSD</button>
          <button className={css.button}>Redeem $stUSD</button>
          <button className={css.button}>Stake $VSTA</button>
        </div>
      </Card>
      <Card>
        <Card.Heading>My Positions</Card.Heading>
        <Card.Pane className={css.tablePane}>
          <table className={css.table}>
            <thead>
              <tr>
                <th>Collateral</th>
                <th>TVL</th>
                <th>TMB</th>
                <th>MIMS LB</th>
                <th>Interest</th>
                <th>APR</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <TableRow />
              <TableRow />
              <TableRow />
            </tbody>
          </table>
        </Card.Pane>
      </Card>
    </div>
  );
}
