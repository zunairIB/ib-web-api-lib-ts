import {
  getAccountId,
  portfolioMonitor,
  placeOrder,
  getNumPositions,
} from "../util/api_reqs";
import { PriceTracker, OrderArr, DEFAULT_ORDER } from "../util/cp_api_util";

export async function wsTradeStrat(oldX: PriceTracker, curr: PriceTracker) {
  const accountId: string = await getAccountId();
  const balance = (await portfolioMonitor(accountId)).availablefunds.amount;
  //console.log('oldx: ', oldX)
  //console.log('curr: ', curr)
  for (var conid in oldX) {
    //const conid = conids[conids.indexOf(contract)]

    var last = curr[conid].last;
    var bid = curr[conid].bid;
    var ask = curr[conid].ask;
    var oldLast = oldX[conid].last;
    var oldAsk = oldX[conid].ask;
    var oldBid = oldX[conid].bid;

    const isDiff = (last !== oldLast) && (bid !== oldBid) && (ask !== oldAsk)

    if (balance >= 1000) {
      if (
        (bid > oldBid || ask > oldAsk) ||
        last > oldLast
      ) {
        const order: OrderArr = DEFAULT_ORDER;
        order.orders[0].conid = Number(conid);
        order.orders[0].side = "BUY";
        order.orders[0].price = bid;
        console.log('buy: ', conid)
        await placeOrder(accountId, order);
      }
    }

    // We only want to sell if we have position - we do not want to short in this scenario.
    const pos = await getNumPositions(accountId, conid);

    try {
      if (pos >= 10) {
        if (
          (bid < oldBid || ask < oldAsk) ||
          last < oldLast
        ) {
          const order: OrderArr = DEFAULT_ORDER;
          order.orders[0].side = "Sell";
          order.orders[0].price = ask;
          order.orders[0].conid = Number(conid);
          console.log('sell: ', conid)
          await placeOrder(accountId, order);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
