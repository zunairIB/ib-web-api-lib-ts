import axios from "axios";
import {
  DEFAULT_ORDER,
  MktDataRequest,
  MktDataRes,
  OrderArr,
  PriceTracker,
  SecdefSearchParams,
  Tracker,
  sleep,
} from "../util/cp_api_util";
import { MarketDataWebsocket } from "../ws/websocket_md";
import {
  authStatus,
  getAccountId,
  getConId,
  getMktDataSnap,
  getNumPositions,
  placeOrder,
  portfolioMonitor,
} from "../util/api_reqs";
import { PORTFOLIO_ACCOUNTS_ENDPOINT } from "../util/constants";

export async function populatePriceTracker(mktData: MktDataRes) {
  var priceTracker: PriceTracker = {};
  for (let i = 0; i < mktData.length; i++) {
    var tracker: Tracker = {
      last: Number(mktData[i][31]),
      ask: Number(mktData[i][86]),
      bid: Number(mktData[i][84]),
    };

    priceTracker[mktData[i].conid.toString()] = tracker;
  }
  return priceTracker;
}

export async function runTradeStrat(
  conids: Array<string>,
  oldX: PriceTracker,
  curr: PriceTracker
) {
  const accountId: string = await getAccountId();
  const balance = (await portfolioMonitor(accountId)).availablefunds.amount;

  for (var contract in oldX) {
    const conid = conids[conids.indexOf(contract)];

    var last = curr[conid].last;
    var bid = curr[conid].bid;
    var ask = curr[conid].ask;
    var oldLast = oldX[conid].last;
    var oldAsk = oldX[conid].ask;
    var oldBid = oldX[conid].bid;

    if (balance >= 10000) {
      if (
        (bid > oldBid + 0.02 && ask + 0.02 > oldAsk) ||
        last > oldLast + 0.02
      ) {
        const order: OrderArr = DEFAULT_ORDER;
        order.orders[0].conid = Number(conid);
        order.orders[0].side = "BUY";
        order.orders[0].price = bid;

        const orderId = await placeOrder(accountId, order);
      }
    }

    // We only want to sell if we have position - we do not want to short in this scenario.
    const pos = await getNumPositions(accountId, conid);

    try {
      if (pos >= 10) {
        if (
          (bid < oldBid - 0.02 && ask - 0.02 < oldAsk) ||
          last < oldLast - 0.02
        ) {
          const order: OrderArr = DEFAULT_ORDER;
          order.orders[0].side = "Sell";
          order.orders[0].price = ask;
          order.orders[0].conid = Number(conid);

          const orderId = await placeOrder(accountId, order);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

async function main() {
  // log auth status
  authStatus();
  await axios.get(PORTFOLIO_ACCOUNTS_ENDPOINT);

  // input tickers list
  const tickers = ["AAPL", "NVDA", "F"];
  let conidsArr: string[] = [];

  // request conids for symbols in ticker array and request market data snapshot
  var conids: string = "";

  for (var i of tickers) {
    const params = { symbol: i, name: false, secType: "STK" };

    var conid: string = await getConId(params);

    conidsArr.push(conid);

    if (tickers.indexOf(i) === tickers.length - 1) {
      conids += conid;
    } else {
      conids += conid + ",";
    }
  }

  // Run WS Tradebot

  // init mktsnap
  var mktDataRes: MktDataRes;
  mktDataRes = await getMktDataSnap({ conids: conids, fields: "31,84,86" });

  let oldX = {};
  let curr = {};

  // Call Market Data Snapshot every 5 seconds
  const snapInter = setInterval(async () => {
    oldX = curr;
    mktDataRes = await getMktDataSnap({ conids: conids, fields: "31,84,86" });
    curr = await populatePriceTracker(mktDataRes);

    console.log("old: ", oldX);
    console.log("curr: ", curr);

    if (Object.keys(oldX).length != 0) {
      runTradeStrat(conidsArr, oldX, curr);
    }
  }, 1000);

  setTimeout(() => {
    clearInterval(snapInter);
  }, 60000);
}

export default main();
