import fs from "fs";
import path from "path";
import { stringify } from "csv-stringify/sync";
import { fileURLToPath } from "url";
import BigNumber from "bignumber.js";
import { TRANSACTION_INDEX, END_TIME } from "./config.js";

const END_TIMESTAMP = Math.floor(new Date(END_TIME).getTime() / 1000);

async function fetchTransactions(index) {
  return await fetch(`http://34.150.93.179:8000/subgraphs/name/vestation/record`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: `{
        transfers(orderDirection: asc, orderBy: timestamp, first: 500, skip: ${index}) {
          id
          to
          from
          type
          value
          methodId
          timestamp
          token {
            name
            symbol
          }
        }
      }`
    })
  }).then((res) => res.json());
}

let transactionIndex = TRANSACTION_INDEX;
let allTransactions = [];
let reachedEndTime = false;

console.log(`Starting to fetch transactions from index ${transactionIndex}`);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

while (!reachedEndTime) {
  try {
    const { data } = await fetchTransactions(transactionIndex);

    for (const c of data.transfers) {
      if (c.timestamp > END_TIMESTAMP) {
        reachedEndTime = true;
        break;
      }

      transactionIndex += 1;

      if (c.type === "deposit") {
        allTransactions.push({
          type: "DEPOSIT",
          timestamp: c.timestamp,
          account: c.from,
          amount: BigNumber(c.value)
            .div(10 ** 18)
            .toNumber(),
          txHash: c.id,
          token: c.token.symbol
        });
      } else if (c.type === "withdraw") {
        allTransactions.push({
          type: "WITHDRAW",
          timestamp: c.timestamp,
          account: c.to,
          amount: BigNumber(c.value)
            .div(10 ** 18)
            .toNumber(),
          txHash: c.id,
          token: c.token.symbol
        });
      }
    }

    console.log("log", data.transfers.length, transactionIndex);

    if (reachedEndTime) {
      console.log("All transactions has been fetched!");
      break;
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    break;
  }
}

// Append new transactions
const txCsvPath = path.join(__dirname, "./_transaction-records.csv");
// ["type", "timestamp", "account", "amount", "txHash", "token"];
const rows = allTransactions.map((tx) => [
  tx.type,
  tx.timestamp,
  tx.account,
  tx.amount,
  tx.txHash,
  tx.token
]);
const csvContent = stringify(rows);
fs.appendFileSync(txCsvPath, csvContent);

// Updatethe transaction index in the config file
const configPath = path.join(__dirname, "./config.js");
const configContent = fs.readFileSync(configPath, "utf8");
const updatedConfigContent = configContent.replace(
  /export const TRANSACTION_INDEX = \d+;/,
  `export const TRANSACTION_INDEX = ${transactionIndex};`
);
fs.writeFileSync(configPath, updatedConfigContent);

// All done
console.log("Finished writing results.");
