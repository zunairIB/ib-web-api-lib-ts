import { axiosObj } from "../../util/cp_api_util";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";
const DEMO_ACCOUNT_ID = "DU144740";

// Open Poisiton Endpoint
// NB: append conid to the end for open position by conid
const OPEN_POSITIONS_ENDPOINT = `${BASE_URL}/portfolio/${DEMO_ACCOUNT_ID}/position`

// Get Request to open position by conid
async function getOpenPositions(conid: string) {
    const response = await axiosObj.get(`${OPEN_POSITIONS_ENDPOINT}/${conid}`)
    return response.data;
}

async function main() {
    
    const aaplStkConid = '265598'

    const openPositionByConid = await getOpenPositions(aaplStkConid)

    console.log(openPositionByConid)
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
