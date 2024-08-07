import { axiosObj } from "../../util/cp_api_util";


// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";
const DEMO_ACCOUNT_ID = "DU144740";

// Account PnL Endpoint
const ACCOUNT_PNL_ENDPOINT = `${BASE_URL}/iserver/account/pnl/partitioned`

// Get Request to account PnL endpoint
// NB: repeat get request to receive data
async function getAccountPnl() {
    let response = await axiosObj.get(ACCOUNT_PNL_ENDPOINT)
    response = await axiosObj.get(ACCOUNT_PNL_ENDPOINT)

    return response.data;
}

async function main() {
    
    const accountPnl = await getAccountPnl()

    console.log(accountPnl)
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