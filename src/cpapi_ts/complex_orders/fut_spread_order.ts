import axios from "axios";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";
const DEMO_ACCOUNT_ID = "DU144740";

// sleep function
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
async function placeFutSpreadOrder(orders: OrderArr): Promise<any> {
  const orderRes = await axios.post(
    `${BASE_URL}/iserver/account/${DEMO_ACCOUNT_ID}/orders`,
    { orders: orders }
  );
  console.log(orderRes.data);
  return orderRes.data;
}

function main() {
  const conid2 = 515416632; //ES Dec17'26
  const conid1 = 620731015; //ES Jun19'25
  const orders = [
    {
      acctId: DEMO_ACCOUNT_ID,
      conidex: "28812380;;;620731015/1,515416632/-1",
      orderType: "LMT",
      listingExchange: "SMART",
      isSingleGroup: true,
      outsideRTH: false,
      price: 110,
      side: "Buy",
      tif: "DAY",
      quantity: 1,
    },
  ];

  for (const order of orders) {
    placeFutSpreadOrder([order]);
    sleep(1000);
  }
}

export default main();
