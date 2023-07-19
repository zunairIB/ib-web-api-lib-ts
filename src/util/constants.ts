// base url for api requests
export const BASE_URL = "https://localhost:5000/v1/api";

// tickle endpoint
export const TICKLE_ENDPOINT = `${BASE_URL}/tickle`;

// websocket url
export const WEBSOCKET_URL = "wss://localhost:5000/v1/api/ws";

// auth endpoint
export const AUTH_ENDPOINT = `${BASE_URL}/iserver/auth/status`;

// iserver accounts endpoint
export const ISERV_ACCT_ENDPOINT = `${BASE_URL}/iserver/accounts`;

export const SECDEF_SEARCH_ENDPOINT = `${BASE_URL}/iserver/secdef/search`;

export const MD_SNAP_ENDPOINT = `${BASE_URL}/iserver/marketdata/snapshot`;

export const PORTFOLIO_ACCOUNTS_ENDPOINT = `${BASE_URL}/portfolio/accounts`;

//export const PORTFOLIO_POSITION_ENDPOINT = `${BASE_URL}/portfolio/${accountId}/position/`
