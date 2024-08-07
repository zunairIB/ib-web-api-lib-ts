import { axiosObj } from "../../util/cp_api_util";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";
const DEMO_ACCOUNT_ID = "DU144740";
const PAGE_ID = "0";

// Run Scanner Endpoint
const RUN_SCANNER_ENDPOINT = `${BASE_URL}/iserver/scanner/run`;

interface ScannerParamsI {
  instrument: string;
  locations: string;
  type: string;
  filter: [
    {
      code: string;
      value: number;
    },
  ];
}

// Get Request to run scanner endpoint
async function runScanner(params: ScannerParamsI) {
  const response = await axiosObj.post(RUN_SCANNER_ENDPOINT, params);
  return response.data;
}

async function main() {
  const scannerParams = {
    instrument: "STK",
    locations: "STK.US.MAJOR",
    type: "TOP_PERC_GAIN",
    filter: [
      {
        code: "priceAbove",
        value: 100,
      },
      {
        code: "priceBelow",
        value: 110,
      },
    ]
  };
  const scanner = await runScanner(scannerParams);

  console.log(scanner);
}

export default main();
