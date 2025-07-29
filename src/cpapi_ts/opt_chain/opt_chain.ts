import { WEBSOCKET_URL } from "../../util/constants";
import { axiosObj } from "../../util/cp_api_util";
import WebSocket from "ws";

// Create market data stream for 5 puts and calls within 5 strikes of current last price of index

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";

// secdef search endpoint
const SECDEF_SEARCH_ENDPOINT = `${BASE_URL}/iserver/secdef/search`;

// Params for Secdef Search
interface SecdefSearchParamsI {
  symbol: string;
  name?: boolean;
  secType?: string;
}

// secdef info endpoint
const SECDEF_STRIKES_ENDPOINT = `${BASE_URL}/iserver/secdef/strikes`;

// Params for Secdef Info
interface SecdefStrikesParamsI {
  conid: string;
  sectype: string;
  month: string; //format MMMYY
  exchange?: string;
}

/*  Security Definition by conid search api call
    params: secdef search params
    Return: Promise<void>
*/
async function secdefSearch(
  secdefSearchParams: SecdefSearchParamsI
): Promise<void|Array<Object>> {
  try { 
    const response  = await axiosObj.post(SECDEF_SEARCH_ENDPOINT, secdefSearchParams)
    return response.data
  }
  catch(err) {
    console.log(err)
  };
}

/* 
    params: secdef strikes params
    Return: Promise<void>
*/
async function secdefStrikes(
  secdefStrikesParams: SecdefStrikesParamsI
): Promise<void> {

  try {
    const response =  await axiosObj.get(SECDEF_STRIKES_ENDPOINT, { params: secdefStrikesParams })
    return response.data
  }
  catch (err) {
    console.log(err)
  }
}

// Market Data Snapshot endpoint
const MD_SNAP_ENDPOINT = `${BASE_URL}/iserver/marketdata/snapshot`;

interface MktDataRequestI {
  conids: string;
  fields: string;
}

/*  Market Data Snapshot Get Request
    params: MktDataRequest interface
    Return: Promise<void>
    NB: Mkt Data Snapshot may need to be called a few times
*/
export async function getMktDataSnap(mktDataRequest: MktDataRequestI) {
  let mktData = await axiosObj.get(MD_SNAP_ENDPOINT, { params: mktDataRequest });
  mktData = await axiosObj.get(MD_SNAP_ENDPOINT, { params: mktDataRequest });
  // console.log(mktData.data);
  return mktData.data;
}

// secdef info endpoint
const SECDEF_INFO_ENDPOINT = `${BASE_URL}/iserver/secdef/info`;

// Params for Secdef Info
interface SecdefInfoParamsI {
  conid: string;
  sectype: string;
  month?: string; //format MMMYY
  exchange?: string;
  strike?: string;
  right? : string;
  issuerId?: string;
}

/*  Provides Contract Details of Futures, 
    Options, Warrants, Cash and CFDs based on conid.
    params: secdef info params
    Return: Promise<void>
*/
async function secdefInfo(secdefInfoParams: SecdefInfoParamsI): Promise<void> {
  const secdefInfo = await axiosObj.get(SECDEF_INFO_ENDPOINT, {params: secdefInfoParams});
  return secdefInfo.data;
}

// tickle endpoint
const TICKLE_ENDPOINT = `${BASE_URL}/tickle`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Tickle get request for session id
async function getSessionId() {
  const response = await axiosObj.get(TICKLE_ENDPOINT);
  return response.data.session;
}

async function main() {

  // Define the symbol of the underlying and send a request to secdef search endpoint
  const secdefSearchParams = { symbol: "AAPL", secType : "STK"};
  const secdefSearchResults: void|Array<Object> = await secdefSearch(secdefSearchParams);

  let secdefStrikesParams: SecdefStrikesParamsI = {conid:"",sectype: "OPT",  month: ""};


  secdefSearchResults.forEach(element => {
    if (element.description === "CBOE" || element.description === "NASDAQ"){
      secdefStrikesParams.conid = element.conid;
      for (let section of element.sections){
        if (section.secType === "OPT"){
          const currentMonth = section.months.split(";")[0];
          secdefStrikesParams.month = currentMonth;
        }
      }
    }
  })

  const secdefStrikesResult = await secdefStrikes(secdefStrikesParams);

  // Filter secdef strikes by current value of spx index last
  const underlyingConid = secdefStrikesParams.conid;

  const mktDataSnapParams: MktDataRequestI = {conids: underlyingConid, fields: "31,7296"}


  // receive a response from md snapsot
  let underlyingLast: number = 0;

  while(underlyingLast == 0) {
    const underlyingSnapshotResult = await getMktDataSnap(mktDataSnapParams)
    underlyingLast = underlyingSnapshotResult[0]["31"];
  }

  //pick +-5 valid strikes

  let closestStrike = secdefStrikesResult["call"].find(price => price >= underlyingLast )

  const strikes = secdefStrikesResult["call"].slice(secdefStrikesResult["call"].indexOf(closestStrike)-1, secdefStrikesResult["call"].indexOf(closestStrike)+1)
  // const putStrikes = secdefStrikesResult["put"].slice(secdefStrikesResult["put"].indexOf(closestStrike)-1, secdefStrikesResult["put"].indexOf(closestStrike)+5)
  
  let contractList = [];
  const mdSocket = new WebSocket(WEBSOCKET_URL,{rejectUnauthorized: false});

  mdSocket.addEventListener("open", async (event) =>{
    mdSocket.send(await getSessionId());
    console.log("Websocket open")
  })

  mdSocket.addEventListener("message", async (message) => {
    console.log(message.data.toString())
    
  })
  // Build an array with each contract as a member
  for (let strike of strikes){
    let secdefInfoParams: SecdefInfoParamsI = {conid : secdefStrikesParams.conid, sectype : "OPT", month : secdefStrikesParams.month }
    secdefInfoParams.strike = strike;
    for (let right of ['C','P']){
      secdefInfoParams.right = right;
      // console.log(secdefInfoParams)
      const contracts = await secdefInfo(secdefInfoParams);
      for (let contract of contracts){
        contractList.push(contract.conid)
        mdSocket.send(`smd+${contract.conid}+{"fields":["31"]}`)
        
      }
    }
  }

  

    
  
  // request 


  
//   const getValidConids = (strikes) => {
//     strikes = 
    
//   }

//   // validate the contracts
//   secdefInfo = 
//  console.log(callStrikes)
//  console.log(putStrikes)



  
  
}

main()