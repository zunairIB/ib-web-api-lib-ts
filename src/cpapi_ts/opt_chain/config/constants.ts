export const API_CONFIG = {
  BASE_URL: "https://localhost:5000/v1/api",
  ENDPOINTS: {
    SECDEF_SEARCH: "/iserver/secdef/search",
    SECDEF_STRIKES: "/iserver/secdef/strikes",
    SECDEF_INFO: "/iserver/secdef/info",
    MD_SNAPSHOT: "/iserver/marketdata/snapshot",
    TICKLE: "/tickle",
  },
} as const;