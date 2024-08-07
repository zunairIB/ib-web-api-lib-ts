import { axiosObj } from "../../util/cp_api_util";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";

// switch account endpoint
const ISERVER_ACCOUNT_ENDPOINT = `${BASE_URL}/iserver/account`;

// Params for Iserver Account
interface IserverAccountParamsI {
  acctId: string;
}

async function switchAccount(
  accountParams: IserverAccountParamsI
): Promise<void> {
  await axiosObj.post(ISERVER_ACCOUNT_ENDPOINT, accountParams).then((res) => {
    console.log(res.data);
  });
}

function main() {
  const acctParams = { acctId: "video_group" };
  switchAccount(acctParams);
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
