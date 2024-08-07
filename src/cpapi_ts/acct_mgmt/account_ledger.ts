import { axiosObj } from "../../util/cp_api_util";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";
const DEMO_ACCOUNT_ID = "DU144740";

// Account Ledger Endpoint
const ACCOUNT_LEDGER_ENDPOINT = `${BASE_URL}/portfolio/${DEMO_ACCOUNT_ID}/ledger`
  
// Get Request to account ledger endpoint
async function getAccountLedger() {
  
    const response = await axiosObj.get(ACCOUNT_LEDGER_ENDPOINT)
    return response.data;
}

async function main() {
    
    const accountLedger = await getAccountLedger()

    console.log(accountLedger)
}

try {
    main()
}
catch(e){
    const error = (e as Error).message
    console.log(error)
}
