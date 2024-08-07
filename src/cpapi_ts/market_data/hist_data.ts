import { axiosObj } from "../../util/cp_api_util";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";

// Historical data endpoint
const HIST_DATA_ENDPOINT = `${BASE_URL}/hmds/history`;

// Params for historical data
interface HistDataParamsI {
  conid: string;
  period: string;
  bar: string;
  outsideRth: boolean;
  barType: string;
}

/*  Historical data get request
    params: Historical Data params interface
    Return: Promise<void>
*/
async function histData(histDataParams: HistDataParamsI): Promise<void> {
  await axiosObj.get(HIST_DATA_ENDPOINT, {params: histDataParams}).then((res) => {
    console.log(res.data);
  });
}

function main() {
  const histDataParams = {
    conid: "265598",
    period: "1w",
    bar: "1d",
    outsideRth: true,
    barType: "midpoint",
  };
  histData(histDataParams);
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
