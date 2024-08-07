// import axios
import { axiosObj } from "../../util/cp_api_util";

// NB : Run command = 'npm run auth'

// base url for iserver api requests
const BASE_URL = "https://localhost:5000/v1/api";

// auth endpoint
const AUTH_ENDPOINT = `${BASE_URL}/iserver/auth/status`;

interface authResponse {
  authenticated: boolean;
  competing: boolean;
  connected: boolean;
  message: string;
  MAC: string;
  serverInfo: {
    serverName: string;
    serverVersion: string;
  };
  fail: string;
}

/*  Auth Status api call
    NB: No params for auth call
    Return: Promise<void>
*/
export async function authStatus(): Promise<void> {
  await axiosObj.get(AUTH_ENDPOINT).then((response) => {
    console.log(response.data);
  });
}

try {
  authStatus()
}
catch(e)
{
  const error = (e as Error).message
  console.log(error)
}