import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import moment from "moment";
import BigNumber from "bignumber.js";
import { parse } from "csv-parse/sync";
import { totalPoints, pointsLog } from "./_previous-points.js";
import { END_TIME, ENABLE_DEBUG, DEBUG_ADDRESS } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (ENABLE_DEBUG) {
  console.log("DEBUG_ADDRESS", DEBUG_ADDRESS);
}

// Start time
const startMoment = moment.utc(END_TIME).clone().startOf("isoWeek");
const START_TIME = Math.floor(startMoment.valueOf() / 1000);

function getWeekNumberFromTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  const baseDate = new Date(Date.UTC(2025, 2, 10, 0, 0, 0, 0));
  const baseWeek = 1;
  const dateDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const baseDateDay = new Date(
    Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), baseDate.getUTCDate())
  );
  const diffTime = dateDay.getTime() - baseDateDay.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const weekDiff = Math.floor(diffDays / 7);
  const weekNumber = baseWeek + weekDiff;

  return weekNumber;
}

const WEEK_INDEX = getWeekNumberFromTimestamp(START_TIME);

// --------------------------------------------

const userBalance = {};
const userPoints = {};
const pastRecords = [];
const currentRecords = [];

const csvData = fs.readFileSync("./_transaction-records.csv", "utf8");
const records = parse(csvData, {
  columns: ["type", "timestamp", "account", "amount", "txHash", "token"],
  skip_empty_lines: true,
  cast: (value, context) => {
    if (context.column === "timestamp" || context.column === "amount") {
      return Number(value);
    }
    return value;
  }
});
records.sort((a, b) => a.timestamp - b.timestamp);

for (let i = 0; i < records.length; i++) {
  if (records[i].timestamp < START_TIME) {
    pastRecords.push(records[i]);
  } else {
    currentRecords.push(records[i]);
  }
}

pastRecords.forEach((record) => {
  const { type, account, amount, timestamp, token } = record;

  if (!userBalance[account]) {
    userBalance[account] = BigNumber(0);
  }

  const amountBN = BigNumber(amount);
  if (type === "DEPOSIT") {
    userBalance[account] = userBalance[account].plus(amountBN);
  } else if (type === "WITHDRAW") {
    userBalance[account] = BigNumber.maximum(userBalance[account].minus(amountBN), BigNumber(0));
  }

  if (ENABLE_DEBUG && account.toLowerCase() === DEBUG_ADDRESS) {
    console.log(`${timestamp} actions:`, type, token, amount);
  }
});

if (ENABLE_DEBUG) {
  console.log("Past total balance: ", +userBalance[DEBUG_ADDRESS] || 0);
}

// ---------------------------------------------------------------

const SIX_HOURS_IN_SECONDS = 6 * 60 * 60;
const slots = Array.from({ length: 28 }, (_, i) => START_TIME + (i + 1) * SIX_HOURS_IN_SECONDS);

slots.forEach((slotEndTime, slotIndex) => {
  const slotStartTime = slotIndex === 0 ? START_TIME : slots[slotIndex - 1];

  const slotRecords = currentRecords.filter(
    (record) => record.timestamp >= slotStartTime && record.timestamp < slotEndTime
  );

  slotRecords.forEach((record) => {
    const { type, account, amount, token } = record;

    if (!userBalance[account]) {
      userBalance[account] = BigNumber(0);
    }

    const amountBN = BigNumber(amount);
    if (type === "DEPOSIT") {
      userBalance[account] = userBalance[account].plus(amountBN);
    } else if (type === "WITHDRAW") {
      userBalance[account] = BigNumber.maximum(userBalance[account].minus(amountBN), BigNumber(0));
    }

    if (ENABLE_DEBUG && account.toLowerCase() === DEBUG_ADDRESS) {
      console.log(`Slot ${String(slotIndex + 1).padStart(2, "0")} actions:`, type, token, amount);
    }
  });

  Object.entries(userBalance).forEach(([account, balance]) => {
    let slotPoints = 0;
    if (balance.gte(1000) && balance.lt(10000)) {
      slotPoints = 1;
    } else if (balance.gte(10000) && balance.lt(100000)) {
      slotPoints = 5;
    } else if (balance.gte(100000) && balance.lt(1000000)) {
      slotPoints = 25;
    } else if (balance.gte(1000000)) {
      slotPoints = 125;
    }

    if (slotPoints) {
      if (!userPoints[account]) {
        userPoints[account] = slotPoints;
      } else {
        userPoints[account] += slotPoints;
      }

      if (ENABLE_DEBUG && account.toLowerCase() === DEBUG_ADDRESS) {
        console.log(
          `Slot ${String(slotIndex + 1).padStart(2, "0")} points: `,
          slotPoints,
          balance.toFixed(2)
        );
      }
    }
  });
});

if (ENABLE_DEBUG) {
  console.log("Round total points: ", +userPoints[DEBUG_ADDRESS] || 0);
}

// total points
let _totalPoints = totalPoints;
Object.entries(userPoints).forEach(([account, points]) => {
  const idx = _totalPoints.findIndex((i) => i.account === account);
  if (idx === -1) {
    _totalPoints.push({ account, points });
  } else {
    _totalPoints[idx] = {
      account,
      points: _totalPoints[idx].points + points
    };
  }
});
_totalPoints.sort((a, b) => b.points - a.points);

// weekly points
let _weeklyPoints = [];
Object.entries(userPoints).forEach(([account, points]) => {
  _weeklyPoints.push({
    account,
    points
  });
});
_weeklyPoints.sort((a, b) => b.points - a.points);

// user points log
const _pointsLog = pointsLog;
Object.entries(userPoints).forEach(([account, points]) => {
  const entry = {
    weekIndex: WEEK_INDEX,
    weekPoints: points,
    totalPoints: _totalPoints.find((i) => i.account === account).points
  };

  if (_pointsLog[account]) {
    _pointsLog[account].unshift(entry);
  } else {
    _pointsLog[account] = [entry];
  }
});

if (!ENABLE_DEBUG) {
  fs.writeFileSync(
    path.join(__dirname, `../src/pages/Leaderboard/points.ts`),
    `export const totalPoints = ${JSON.stringify(_totalPoints)};\n\nexport const weeklyPoints = ${JSON.stringify(_weeklyPoints)};\n\nexport const pointsLog: Record<string, any> = ${JSON.stringify(_pointsLog)};`
  );
  fs.writeFileSync(
    path.join(__dirname, `./_previous-points.js`),
    `export const totalPoints = ${JSON.stringify(_totalPoints, null, 2)};\n\nexport const pointsLog = ${JSON.stringify(_pointsLog, null, 2)};`
  );
}
