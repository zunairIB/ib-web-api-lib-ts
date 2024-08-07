import { axiosObj } from "../../util/cp_api_util";
/*
  The endpoint is meant to be used in polling mode, e.g. requesting every x seconds.
  The response will contain two objects, one is notification, the other is orders.
  Orders is the list of live orders (cancelled, filled, submitted).
  Notifications contains information about execute orders as they happen, see status field. 
*/

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";

// account orders endpoint
const ACCOUNT_ORDER_ENDPOINT = `${BASE_URL}/iserver/account/orders`;

async function accountOrders(): Promise<void> {
  await axiosObj
    .get(ACCOUNT_ORDER_ENDPOINT)
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
}

function main() {
  accountOrders();
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
