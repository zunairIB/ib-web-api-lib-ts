import { axiosObj } from "../../util/cp_api_util";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";
const DEMO_ACCOUNT_ID = "DU144740";

// portfolio accounts endpoint
const PORTFOLIO_ACCOUNTS_ENDPOINT = `${BASE_URL}/portfolio/accounts`

// Get Request to portfolio accounts endpoint
async function getPortfolioAccounts() {
    let response = await axiosObj.get(PORTFOLIO_ACCOUNTS_ENDPOINT)

    return response.data;
}

async function main() {
    
    const portfolioAccounts = await getPortfolioAccounts()

    console.log(portfolioAccounts)
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
