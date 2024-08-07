import { axiosObj } from "../../util/cp_api_util";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";

// Scanner Params Endpoint
const SCANNER_PARAMS_ENDPOINT = `${BASE_URL}/iserver/scanner/params`

// Get Request to scanner params by conid
async function getScannerParams() {
    const response = await axiosObj.get(SCANNER_PARAMS_ENDPOINT)
    return response.data;
}

async function main() {
    
    const scannerParams = await getScannerParams()

    console.log(scannerParams)
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
