import { axiosObj } from "../../util/cp_api_util";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";
const DEMO_ACCOUNT_ID = "DU144740";

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
async function placeOrder(order: OrderArr):Promise<any> {
  const orderRes = await axiosObj.post(
    `${BASE_URL}/iserver/account/${DEMO_ACCOUNT_ID}/orders`,
    order
  );
  console.log(orderRes.data);
  return orderRes.data;
}

function main() {
  const orderParams = {
    orders: [
      {
        acctId: DEMO_ACCOUNT_ID,
        conid: 265598,
        secType: "STK",
        orderType: "MKT",
        side: "BUY",
        tif: "DAY",
        quantity: 1000,
        isSingleGroup: true,
      },
    ],
  };

  placeOrder(orderParams);
}

try {
  main()
}
catch(e)
{
  const error = (e as Error).message
  console.log(error)
}

export default main();
