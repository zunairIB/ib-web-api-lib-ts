//WARNING: INSECURE REMOVE
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import main from "./src/cp_api_bot/trade_bot_api";
import { WEBSOCKET_URL } from "./src/util/constants";
import { TradingBot } from "./src/ws/ws_md_trade";

const bot = new TradingBot(WEBSOCKET_URL);

setTimeout(() => bot.stop(), 60000);

//main
