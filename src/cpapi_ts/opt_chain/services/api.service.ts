import { axiosObj } from "../../../util/cp_api_util";
import { API_CONFIG } from "../config/constants";
import {
  SecdefSearchParams,
  SecdefStrikesParams,
  SecdefInfoParams,
  MktDataRequest,
  SecdefSearchResult,
  SecdefStrikesResult,
} from "../types";

export class ApiService {
  private buildUrl(endpoint: string): string {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  }

  async secdefSearch(params: SecdefSearchParams): Promise<SecdefSearchResult[]> {
    try {
      const response = await axiosObj.post(
        this.buildUrl(API_CONFIG.ENDPOINTS.SECDEF_SEARCH),
        params
      );
      return response.data;
    } catch (error) {
      console.error("Error in secdefSearch:", error);
      throw new Error(`Failed to search security definitions: ${error.message}`);
    }
  }

  async secdefStrikes(params: SecdefStrikesParams): Promise<SecdefStrikesResult> {
    try {
      const response = await axiosObj.get(
        this.buildUrl(API_CONFIG.ENDPOINTS.SECDEF_STRIKES),
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error in secdefStrikes:", error);
      throw new Error(`Failed to get security strikes: ${error.message}`);
    }
  }

  async secdefInfo(params: SecdefInfoParams): Promise<any[]> {
    try {
      const response = await axiosObj.get(
        this.buildUrl(API_CONFIG.ENDPOINTS.SECDEF_INFO),
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error in secdefInfo:", error);
      throw new Error(`Failed to get security info: ${error.message}`);
    }
  }

  async getMktDataSnapshot(params: MktDataRequest): Promise<MarketDataSnapshot[]> {
    try {
      // Market data snapshot often requires multiple calls
      let response = await axiosObj.get(
        this.buildUrl(API_CONFIG.ENDPOINTS.MD_SNAPSHOT),
        { params }
      );
      
      // Second call to ensure data is available
      response = await axiosObj.get(
        this.buildUrl(API_CONFIG.ENDPOINTS.MD_SNAPSHOT),
        { params }
      );
      
      return response.data;
    } catch (error) {
      console.error("Error in getMktDataSnapshot:", error);
      throw new Error(`Failed to get market data snapshot: ${error.message}`);
    }
  }

  async getSessionId(): Promise<string> {
    try {
      const response = await axiosObj.get(
        this.buildUrl(API_CONFIG.ENDPOINTS.TICKLE)
      );
      return response.data.session;
    } catch (error) {
      console.error("Error in getSessionId:", error);
      throw new Error(`Failed to get session ID: ${error.message}`);
    }
  }
}