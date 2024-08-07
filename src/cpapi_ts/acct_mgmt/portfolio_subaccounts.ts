import { axiosObj } from "../../util/cp_api_util";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";

// portfolio subaccounts endpoint
const PORTFOLIO_SUBACCOUNTS_ENDPOINT = `${BASE_URL}/portfolio/subaccounts`

// Get Request to portfolio subaccounts endpoint
async function getPortfolioSubaccounts() {
    let response = await axiosObj.get(PORTFOLIO_SUBACCOUNTS_ENDPOINT)

    return response.data;
}

async function main() {
    
    const portfolioSubaccounts = await getPortfolioSubaccounts()

    console.log(portfolioSubaccounts)
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
