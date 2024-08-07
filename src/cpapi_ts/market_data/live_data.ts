import { axiosObj } from "../../util/cp_api_util";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";

// Market Data Snapshot endpoint
const MD_SNAP_ENDPOINT = `${BASE_URL}/iserver/marketdata/snapshot`;

interface MktDataRequestI {
  conids: string;
  fields: string;
  since?: number;
}

/*  Market Data Snapshot Get Request
    params: MktDataRequest interface
    Return: Promise<void>
    NB: Mkt Data Snapshot may need to be called a few times
*/
export async function getMktDataSnap(mktDataRequest: MktDataRequestI) {
  var mktData = await axiosObj.get(MD_SNAP_ENDPOINT, { params: mktDataRequest });
  mktData = await axiosObj.get(MD_SNAP_ENDPOINT, { params: mktDataRequest });
  mktData = await axiosObj.get(MD_SNAP_ENDPOINT, { params: mktDataRequest });
  console.log(mktData.data);
  return mktData.data;
}

function main() {
  const mktDataSnapParams = {
    conids: "265598,8314",
    fields: "31,84,86,55", //list of available fields in client portal api docs
  };
  getMktDataSnap(mktDataSnapParams);
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
