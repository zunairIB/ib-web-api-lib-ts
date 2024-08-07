import { axiosObj } from "../../util/cp_api_util";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";
const DEMO_ACCOUNT_ID = "DU144740";

// Account Summary Endpoint
const ACCOUNT_SUMMARY_ENDPOINT = `${BASE_URL}/portfolio/${DEMO_ACCOUNT_ID}/summary`

//Assuming 1 account, get account summary object
async function getAccountSummary() {
    const response = await axiosObj.get(ACCOUNT_SUMMARY_ENDPOINT)
    return response.data;
}

async function main() {
    const accountSummary = await getAccountSummary()

    console.log(accountSummary)
}

export default main()

try {
    main()
  }
  catch(e)
  {
    const error = (e as Error).message
    console.log(error)
  }