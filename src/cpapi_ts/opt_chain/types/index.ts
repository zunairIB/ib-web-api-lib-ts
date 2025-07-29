export interface SecdefSearchParams {
  symbol: string;
  name?: boolean;
  secType?: string;
}

export interface SecdefStrikesParams {
  conid: string;
  sectype: string;
  month: string; // format: MMMYY
  exchange?: string;
}

export interface SecdefInfoParams {
  conid: string;
  sectype: string;
  month?: string; // format: MMMYY
  exchange?: string;
  strike?: string;
  right?: string;
  issuerId?: string;
}

export interface MktDataRequest {
  conids: string;
  fields: string;
}

export interface SecdefSearchResult {
  conid: string;
  description: string;
  sections: Array<{
    secType: string;
    months: string;
  }>;
}

export interface SecdefStrikesResult {
  call: number[];
  put: number[];
}

export interface MarketDataSnapshot {
  "31"?: number;
  "7296"?: number;
  [key: string]: any;
}