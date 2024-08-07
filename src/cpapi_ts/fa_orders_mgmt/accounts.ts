import { axiosObj } from "../../util/cp_api_util";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";

// iserver accounts endpoint
const ACCOUNTS_ENDPOINT = `${BASE_URL}/iserver/accounts`;

async function getAccounts(): Promise<void> {
  await axiosObj
    .get(ACCOUNTS_ENDPOINT)
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
}

function main() {
  getAccounts();
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
