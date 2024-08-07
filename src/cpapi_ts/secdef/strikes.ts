import { axiosObj } from "../../util/cp_api_util";
//secdef search needs to be called first

//base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";

// secdef info endpoint
const SECDEF_INFO_ENDPOINT = `${BASE_URL}/iserver/secdef/strikes`;

// Params for Secdef Info
interface SecdefStrikesParamsI {
  conid: string;
  sectype: string;
  month: string; //format MMMYY
  exchange?: string;
}

/* 
    params: secdef strikes params
    Return: Promise<void>
*/
async function secdefStrikes(
  secdefStrikesParams: SecdefStrikesParamsI
): Promise<void> {
  await axiosObj
    .get(SECDEF_INFO_ENDPOINT, { params: secdefStrikesParams })
    .then((res) => {
      console.log(res.data);
    });
}

function main() {
  const secdefStrikesParams = {
    conid: "265598",
    sectype: "OPT",
    month: "AUG23",
  };
  secdefStrikes(secdefStrikesParams);
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
