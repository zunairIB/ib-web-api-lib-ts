import { axiosObj } from "../../util/cp_api_util";
// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";

// order id,  use /iservers/account/orders endpoint to query order_id.
const DEMO_ORDER_ID = 2040409775;

// order status endpoint
const ORDER_STATUS_ENDPOINT = `${BASE_URL}/iserver/account/order/status/${DEMO_ORDER_ID}`;

async function orderStatus(): Promise<void> {
  await axiosObj
    .get(ORDER_STATUS_ENDPOINT)
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
}

function main() {
  orderStatus();
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
