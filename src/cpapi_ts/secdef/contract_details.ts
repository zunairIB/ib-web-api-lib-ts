import { axiosObj } from "../../util/cp_api_util";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";

// secdef search endpoint
const SECDEF_SEARCH_ENDPOINT = `${BASE_URL}/iserver/secdef/search`;

// Params for Secdef Search
interface SecdefSearchParamsI {
  symbol: string;
  name: boolean;
  secType: string;
}

/*  Security Definition by conid search api call
    params: secdef search params
    Return: Promise<void>
*/
async function secdefSearch(
  secdefSearchParams: SecdefSearchParamsI
): Promise<void> {
  await axiosObj.post(SECDEF_SEARCH_ENDPOINT, secdefSearchParams).then((res) => {
    console.log(res.data);
  });
}

function main() {
  const secdefSearchParams = { symbol: "F", name: false, secType: "STK" };
  secdefSearch(secdefSearchParams);
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
