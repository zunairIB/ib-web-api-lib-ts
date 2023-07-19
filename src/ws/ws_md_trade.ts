import WebSocket from "ws";
import { getConId, getSessionId } from "../util/api_reqs";
import {
  DEFAULT_PRICE_TRACKER,
  MktDataType,
  PriceTracker,
} from "../util/cp_api_util";
import { wsTradeStrat } from "../cp_api_bot/trade_md";
import axios from "axios";
import { PORTFOLIO_ACCOUNTS_ENDPOINT } from "../util/constants";

export class TradingBot {
  private ws: WebSocket;
  private priceTracker: PriceTracker = DEFAULT_PRICE_TRACKER;

  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.ws.on("open", this.onOpen);
    this.ws.on("message", this.onMessage);
  }

  private async subMktData(ticker: string) {
    // call secdef search to get conid
    const conid = await getConId({
      symbol: ticker,
      name: false,
      secType: "STK",
    });

    // sub to mkt data send conid to websocket smd with fields text
    this.ws.send("smd+" + conid + '+{"fields":["31","84","86"]}');
  }

  private onOpen = async () => {
    this.ws.send(await getSessionId());
    await axios.get(PORTFOLIO_ACCOUNTS_ENDPOINT);

    const tickers = ["AAPL", "NVDA", "F"];
    tickers.forEach((ticker) => this.subMktData(ticker));
    console.log("Connected");
  };

  private onMessage = (message: string) => {
    const data: MktDataType = JSON.parse(message.toString());

    var mktDataTrack = {};

    if (data.topic?.includes("smd")) {
      if (data[31] !== undefined) {
        Object.assign(mktDataTrack, { last: Number(data[31]) });
      }
      if (data[86] !== undefined) {
        Object.assign(mktDataTrack, { ask: Number(data[86]) });
      }
      if (data[84] !== undefined) {
        Object.assign(mktDataTrack, { bid: Number(data[84]) });
      }

      const oldX = this.priceTracker;
      console.log('old: ', oldX)

      this.priceTracker[data.conid] = {
        ...this.priceTracker[data.conid],
        ...mktDataTrack,
      };
      const conids = Object.keys(this.priceTracker);
      const curr = this.priceTracker;
      console.log('curr: ', curr)
      
     
      wsTradeStrat(oldX, curr);
      
    }
  };

  public stop() {
    this.ws.close();
  }
}
