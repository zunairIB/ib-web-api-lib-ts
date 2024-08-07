import { axiosObj } from "../../util/cp_api_util";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";
const DEMO_ACCOUNT_ID = "DU144740";
const PAGE_ID = '0'

// Open Poisitons Endpoint
const OPEN_POSITIONS_ENDPOINT = `${BASE_URL}/portfolio/${DEMO_ACCOUNT_ID}/positions/${PAGE_ID}`

// Get Request to open position by conid
async function getOpenPositions() {
    const response = await axiosObj.get(OPEN_POSITIONS_ENDPOINT)
    return response.data;
}

async function main() {
    
    const openPositions = await getOpenPositions()

    console.log(openPositions)
}

try {
    main()
  }
  catch(e)
  {
    const error = (e as Error).message
    console.log(error)
  }

export default main()
