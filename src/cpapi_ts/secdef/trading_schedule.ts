import { axiosObj } from "../../util/cp_api_util";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";

// secdef info endpoint
const SECDEF_SCHEDULE_ENDPOINT = `${BASE_URL}/trsrv/secdef/schedule`;

// Params for Secdef Schedule
interface SecdefScheduleParamsI {
  assetClass: string;
  conid?: string; //either conid or symbol need to specified
  symbol?: string; 
  exchange?: string;
  exchangeFilter?: string;
}

/*  Provides Trading schedules based on conid or symbol
    params: secdef schedule params
    Return: Promise<void>
*/
async function secdefSchedule(secdefScheduleParams: SecdefScheduleParamsI): Promise<void> {
  await axiosObj.get(SECDEF_SCHEDULE_ENDPOINT, {params: secdefScheduleParams}).then((res) => {
    console.log(res.data);
  });
}

function main() {
  const secdefScheduleParams = {
    assetClass: "SWB",
    // conid: "12087797",
    symbol: "AUD.USD",
    exchange: "IDEALPRO",
  };
  secdefSchedule(secdefScheduleParams);
}

try {
  main()
}
catch(e)
{
  const error = (e as Error).message
  console.log(error)
}

// export default main();
