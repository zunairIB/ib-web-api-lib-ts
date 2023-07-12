//Contract Details: /iserver/contract/{conid}/info response
export interface Contract {
  "r_t_h": boolean,
  "con_id": string,
  "company_name": string,
  "exchange": string,
  "local_symbol": string,
  "instrument_type": string,
  "currency": string,
  "companyName": string,
  "category": string,
  "industry": string,
  "rules": {
    "orderTypes": string[],
    "orderTypesOutside": string[],
    "defaultSize": number,
    "sizeIncrement": number,
    "tifTypes": string[],
    "limitPrice": number,
    "stopprice": number,
    "preview": boolean,
    "displaySize": string,
    "increment": string
  }
}

export interface SecdefSearchRequest {
  "symbol":string,
  "name":boolean,
  "secType":string
}

export interface MktDataRequest {
  "conids":string,
  "fields":string,
  "since"?: number
}

export const DefaultContract = {
  "r_t_h": true,
  "con_id": "string",
  "company_name": "string",
  "exchange": "string",
  "local_symbol": "string",
  "instrument_type": "string",
  "currency": "string",
  "companyName": "string",
  "category": "string",
  "industry": "string",
  "rules": {
    "orderTypes": [
      "string"
    ],
    "orderTypesOutside": [
      "string"
    ],
    "defaultSize": 0,
    "sizeIncrement": 0,
    "tifTypes": [
      "string"
    ],
    "limitPrice": 0,
    "stopprice": 0,
    "preview": true,
    "displaySize": "string",
    "increment": "string"
  }
}



// Auth Status Response Type - /iserver/auth/status
export interface AuthStatus {
    "authenticated": boolean,
    "connected": boolean,
    "competing": boolean,
    "fail": string,
    "message": string,
    "prompts": [
        string
    ] 
}

export interface SecDef {
    

}

// Order Request Type - /iserver/account/{accountId}/orders Request
export interface OrderArr {
  
    "orders": Order[]
  
}

interface Order {
  
  "acctId"?: string,
  "conid"?: number,
  "conidex"?: string, // e.g. "conidex = 265598",
  "secType"?: string  // e.g. "secType = 265598:STK",
  "cOID"?: string,
  "parentId"?: string,
  "orderType"?: string,
  "listingExchange"?: string,
  "isSingleGroup"?: boolean,
  "outsideRTH"?: boolean,
  "price"?: number,
  "auxPrice"?: string,
  "side"?: string,
  "ticker"?: string,
  "tif"?: string,
  "trailingAmt"?: number,
  "trailingType"?: string,
  "referrer"?: string //e.g. "QuickTrade",
  "quantity"?: number,
  "cashQty"?: number,
  "fxQty"?: number,
  "useAdaptive"?: boolean,
  "isCcyConv"?: boolean,
  "allocationMethod"?: string,
  "strategy"?: string,
  "strategyParameters"?: Object
  
}

export interface Accounts {

}

export interface Account {

}

// Params for Secdef Search
export interface SecdefSearchParams {
  "symbol": string,
  "name": boolean,
  "secType": string
}

export const sleep = (ms : number) => new Promise(r => setTimeout(r, ms));

export interface Tracker {
    "bid": number,
    "ask": number,
    "last": number,
    // "oldBid": number,
    // "oldAsk": number,
    // "oldLast": number
}

export interface PriceTracker {
  [conid: string] : Tracker
}

export const rand_conid: string = '265598'

const DEFAULT_TRACKER = {
  "bid": 0,
  "ask": 0,
  "last": 0
}
export const DEFAULT_PRICE_TRACKER = {
  [rand_conid] : DEFAULT_TRACKER
}
//{229: <reqId>
// (2135397206544: 
// 265598,AAPL,STK,,0,,,SMART,NASDAQ,USD,AAPL,NMS,False,,,,
// combo:, {'BID': 192.39, 'ASK': 192.42, 'LAST': 192.4, 'oldlast': 192.4, 'oldbid': 192.39, 'oldask': 192.42})
//, 230: (2135397206608: 4815747,NVDA,STK,,0,,,SMART,NASDAQ,USD,NVDA,NMS,False,,,,
// combo:, {'BID': 423.96, 'ASK': 424.12, 'LAST': 424.01, 'oldlast': 424.01, 'oldbid': 423.96, 'oldask': 424.12}), 
// 231: (2135397207888: 9599491,F,STK,,0,,,SMART,NYSE,USD,F,F,False,,,,
// combo:, {'BID': 15.22, 'ASK': 15.23, 'LAST': 15.22, 'oldlast': 15.22, 'oldbid': 15.22, 'oldask': 15.23}), 
// 232: (2135397207824: 498843743,GE,STK,,0,,,SMART,NYSE,USD,GE,GE,False,,,,
// combo:, {'BID': 108.15, 'ASK': 108.63, 'LAST': 108.07, 'oldlast': 108.07, 'oldbid': 108.15, 'oldask': 108.63})}

export const DEFAULT_ORDER = {
  "orders": [
    {
      //"conid": 265598, --> SET IN TRADE STRAT FUNC
      "secType":"STK", //--> SET IN TRADE STRAT FUNC
      "orderType": "LMT",
      "price": 170, //--> SET IN TRADE STRAT FUNC
      "side": "BUY", //--> SET IN TRADE STRAT FUNC
      "tif":"DAY",
      "quantity": 5,
      "outsideRTH":true
    }
  ]
}

export type MktDataRes = Array<MktDataType>

export interface MktDataType {
  '31': string, // Last
  '84': string, // Bid
  '86': string, // Ask
  '6119': string,
  '6509': string,
  conidEx: string,
  conid: number,
  server_id: string,
  _updated: number
}

