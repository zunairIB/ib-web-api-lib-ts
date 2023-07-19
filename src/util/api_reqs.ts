import axios from "axios";
import {
  AUTH_ENDPOINT,
  BASE_URL,
  ISERV_ACCT_ENDPOINT,
  MD_SNAP_ENDPOINT,
  PORTFOLIO_ACCOUNTS_ENDPOINT,
  SECDEF_SEARCH_ENDPOINT,
  TICKLE_ENDPOINT,
} from "./constants";
import { MktDataRequest, OrderArr, SecdefSearchParams } from "./cp_api_util";

// TODO: update comments

/*  Auth Status api call
    NB: No params for auth call
    Return: Promis<void>
*/
export async function authStatus() {
  await axios.get(AUTH_ENDPOINT).then((response) => {
    console.log(response.data);
  });
}

// Tickle get request for session id
export async function getSessionId() {
  const response = await axios.get(TICKLE_ENDPOINT);
  return response.data.session;
}

/*  Account ID api call
    params: none
    Return: Promise<void>
    Todo: make it work with returning nothing
*/
export async function getAccountId() {
  const response = await axios.get(ISERV_ACCT_ENDPOINT);
  const accountId: string = response.data.accounts[0];
  return accountId;
}

/*  Security Definition by conid search api call
    params: secdef search params
    Return: Promise<void>
*/
export async function getConId(SecdefSearchParams: SecdefSearchParams) {
  const response = await axios.post(SECDEF_SEARCH_ENDPOINT, SecdefSearchParams);
  const conid = response.data[0].conid;

  return conid;
}

/*  Market Data Snapshot Get Request
    params: MktDataRequest interface
    Return: Promise<void>
*/
// Mkt Data Snapshot needs to be called twice
export async function getMktDataSnap(mktDataRequest: MktDataRequest) {
  var mktData = await axios.get(MD_SNAP_ENDPOINT, { params: mktDataRequest });
  mktData = await axios.get(MD_SNAP_ENDPOINT, { params: mktDataRequest });
  return mktData.data;
}

/*  Positions api call for given conid
    params: account Id and conid
    Return: Promis<any>
*/
export async function getNumPositions(accountId: string, conid: string) {
  var posRes = await axios.get(
    `${BASE_URL}/portfolio/${accountId}/position/${conid}`
  );
  return posRes.data[0].position;
}

//Assuming 1 account, get account summary object
export async function portfolioMonitor(accountId: string) {
  const response = await axios.get(
    `${BASE_URL}/portfolio/${accountId}/summary`
  );

  return response.data;
}

//NB: Pacing limitation of 1 req/5 sec
export async function placeOrder(acctId: string, order: OrderArr) {
  const orderRes = await axios.post(
    `${BASE_URL}/iserver/account/${acctId}/orders`,
    order
  );
  console.log(orderRes.data);
  return orderRes.data;
}
