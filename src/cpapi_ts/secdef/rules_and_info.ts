import { axiosObj } from "../../util/cp_api_util";
//base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";

// Info and rules endpoint 
const CONTRACT_INFO_ENDPOINT = `${BASE_URL}/iserver/contract/265598/info-and-rules`;

// Params for Secdef Info
interface ConInfoParamsI {
  "conid": string;
  "isBuy": boolean;
}

/* 
    params: secdef strikes params
    Return: Promise<void>
*/
async function contractInfo(
  conInfoParams: ConInfoParamsI
): Promise<void> {
  await axiosObj
    .get(CONTRACT_INFO_ENDPOINT, { params: conInfoParams })
    .then((res) => {
      console.log(res.data);
    });
}

function main() {
  const conInfoParams = {
    "conid": "265598",
    "isBuy": true
  };
  contractInfo(conInfoParams);
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
