import { axiosObj } from "../../util/cp_api_util";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";

// use the  "id" from the response of "Place Order" endpoint
const DEMO_ID = "d9a06f9e-15eb-4558-8dcf-763cd0309642";

// order status endpoint
const ORDER_REPLY_ENDPOINT = `${BASE_URL}/iserver/reply/${DEMO_ID}`;

interface ReplyParam {
  confirmed: boolean;
}

async function orderReply(replyParam: ReplyParam): Promise<void> {
  await axiosObj
    .post(ORDER_REPLY_ENDPOINT, replyParam)
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
}

function main() {
  const replyParam = {confirmed : true}
  orderReply(replyParam); //first call will respond with query to confirm order
  //orderReply(replyParam); //second call will confirm order and respond with order_id, order_status and encrypt_message
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
