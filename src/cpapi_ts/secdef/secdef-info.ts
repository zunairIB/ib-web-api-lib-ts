import { axiosObj } from "../../util/cp_api_util";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";

// secdef info endpoint
const SECDEF_INFO_ENDPOINT = `${BASE_URL}/iserver/secdef/info`;

// Params for Secdef Info
interface SecdefInfoParamsI {
  conid: string;
  sectype: string;
  month: string; //format MMMYY
  exchange?: string;
}

/*  Provides Contract Details of Futures, 
    Options, Warrants, Cash and CFDs based on conid.
    params: secdef info params
    Return: Promise<void>
*/
async function secdefInfo(secdefInfoParams: SecdefInfoParamsI): Promise<void> {
  await axiosObj.get(SECDEF_INFO_ENDPOINT, {params: secdefInfoParams}).then((res) => {
    console.log(res.data);
  });
}

function main() {
  const secdefInfoParams = {
    conid: "569064866",
    sectype: "FUT",
    month: "JUL23",
    exchange: "EUREX",
  };
  secdefInfo(secdefInfoParams);
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
