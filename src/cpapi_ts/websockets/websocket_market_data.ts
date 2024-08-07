import WebSocket from "ws";
import { axiosObj } from "../../util/cp_api_util";

// base url for api requests
const BASE_URL = "https://localhost:5000/v1/api";

// websocket url
const WEBSOCKET_URL = "wss://localhost:5000/v1/api/ws";

// tickle endpoint
const TICKLE_ENDPOINT = `${BASE_URL}/tickle`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Tickle get request for session id
async function getSessionId() {
  const response = await axiosObj.get(TICKLE_ENDPOINT);
  return response.data.session;
}

class MdSocket {
  private ws: WebSocket;

  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.ws.on("open", this.onOpen);
    this.ws.on("message", this.onMessage);
    this.ws.on("close", this.onClose);
    this.ws.on("error", this.onError);
  }

  private onOpen = async () => {
    this.ws.send(await getSessionId());

    console.log("Connected");
    sleep(3000);
    const conids = ["265598", "8314"];

    for (var conid of conids) {
      this.ws.send("smd+" + conid + '+{"fields":["31","84","86"]}');
    }
  };

  private onMessage = (message: string) => {
    console.log(message.toString());
  };

  private onClose = () => {
    console.log("Closed");
  };

  private onError = (error: string) => {
    console.log(error);
  };

  public stop = () => {
    this.ws.close();
  };
}

function main() {
  // initialize market data feed
  const mktDataFeed = new MdSocket(WEBSOCKET_URL);

  // Stop after 60 seconds
  setTimeout(() => mktDataFeed.stop(), 60000);
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
