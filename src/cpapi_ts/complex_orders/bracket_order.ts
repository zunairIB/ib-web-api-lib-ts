import axios from "axios";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";
const DEMO_ACCOUNT_ID = "DU144740";

// sleep function
export const sleep = (ms : number) => new Promise(r => setTimeout(r, ms));

interface OrderArr {
  orders: Order[];
}

interface Order {
  acctId?: string;
  conid?: number;
  conidex?: string; // e.g. "conidex = 265598",
  secType?: string; // e.g. "secType = 265598:STK",
  cOID?: string;
  parentId?: string;
  orderType?: string;
  listingExchange?: string;
  isSingleGroup?: boolean;
  outsideRTH?: boolean;
  price?: number;
  auxPrice?: string;
  side?: string;
  ticker?: string;
  tif?: string;
  trailingAmt?: number;
  trailingType?: string;
  referrer?: string; //e.g. "QuickTrade",
  quantity?: number;
  cashQty?: number;
  fxQty?: number;
  useAdaptive?: boolean;
  isCcyConv?: boolean;
  allocationMethod?: string;
  strategy?: string;
  strategyParameters?: Object;
}

//NB: Pacing limitation of 1 req/5 sec
async function placeBracketOrder(orders: OrderArr): Promise<any> {
  const orderRes = await axios.post(
    `${BASE_URL}/iserver/account/${DEMO_ACCOUNT_ID}/orders`,
     {"orders": orders}
  );
  console.log(orderRes.data);
  return orderRes.data;
}

function main() {
  const mocCoid = "Test1Bracket";
  const conid = 76792991; //TSLA STK
  const orders = [
    {
      acctId: DEMO_ACCOUNT_ID, //Parent Order
      conid: conid,
      cOID: mocCoid,
      orderType: "LMT",
      outsideRTH: false,
      price: 250,
      side: "BUY",
      tif: "GTC",
      quantity: 50,
    },
    {
      acctId: DEMO_ACCOUNT_ID, //Stop Loss
      conid: conid,
      parentId: mocCoid,
      orderType: "STP",
      outsideRTH: false,
      price: 240,
      side: "SELL",
      tif: "GTC",
      quantity: 50,
    },
    {
      acctId: DEMO_ACCOUNT_ID, //Profit Taker
      conid: conid,
      parentId: mocCoid,
      orderType: "LMT",
      outsideRTH: false,
      price: 260,
      side: "SELL",
      tif: "GTC",
      quantity: 50,
    },
  ];

  // NB: id should be read and reply endpoint should be called to confirm each order
  for (const order of orders){
    placeBracketOrder([order]);
    sleep(3000)
  }
}

export default main();
