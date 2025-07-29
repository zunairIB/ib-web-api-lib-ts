import WebSocket from "ws";
import { WEBSOCKET_URL } from "../../../util/constants";
import { ApiService } from "./api.service";
import { SecdefSearchResult, SecdefStrikesResult } from "../types";

export class MarketDataService {
  private apiService: ApiService;
  private mdSocket: WebSocket | null = null;

  constructor() {
    this.apiService = new ApiService();
  }

  private async extractOptionsData(searchResults: SecdefSearchResult[]): Promise<{
    conid: string;
    currentMonth: string;
  }> {
    const validExchanges = ["CBOE", "NASDAQ"];
    
    for (const result of searchResults) {
      if (validExchanges.includes(result.description)) {
        const optionsSection = result.sections.find(s => s.secType === "OPT");
        if (optionsSection) {
          return {
            conid: result.conid,
            currentMonth: optionsSection.months.split(";")[0],
          };
        }
      }
    }
    
    throw new Error("No valid options data found in search results");
  }

  private async getUnderlyingLastPrice(conid: string): Promise<number> {
    const maxAttempts = 10;
    const delayMs = 1000;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const snapshot = await this.apiService.getMktDataSnapshot({
        conids: conid,
        fields: "31,7296",
      });
      
      const lastPrice = snapshot[0]?.["31"];
      if (lastPrice && lastPrice > 0) {
        return lastPrice;
      }
      
      if (attempt < maxAttempts - 1) {
        await this.sleep(delayMs);
      }
    }
    
    throw new Error("Failed to get underlying last price after multiple attempts");
  }

  private selectNearbyStrikes(
    strikes: number[],
    underlyingPrice: number,
    count: number = 2
  ): number[] {
    const closestStrikeIndex = strikes.findIndex(price => price >= underlyingPrice);
    
    if (closestStrikeIndex === -1) {
      // All strikes are below underlying price
      return strikes.slice(-count);
    }
    
    const startIndex = Math.max(0, closestStrikeIndex - Math.floor(count / 2));
    const endIndex = Math.min(strikes.length, startIndex + count);
    
    return strikes.slice(startIndex, endIndex);
  }

  private async getContractsForStrikes(
    strikes: number[],
    baseParams: { conid: string; month: string }
  ): Promise<string[]> {
    const contractList: string[] = [];
    const rights = ["C", "P"] as const;
    
    for (const strike of strikes) {
      for (const right of rights) {
        const contracts = await this.apiService.secdefInfo({
          conid: baseParams.conid,
          sectype: "OPT",
          month: baseParams.month,
          strike: strike.toString(),
          right,
        });
        
        contractList.push(...contracts.map(c => c.conid));
      }
    }
    
    return contractList;
  }

  private initializeWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.mdSocket = new WebSocket(WEBSOCKET_URL, { rejectUnauthorized: false });
      
      this.mdSocket.on("open", async () => {
        try {
          const sessionId = await this.apiService.getSessionId();
          this.mdSocket!.send(sessionId);
          console.log("WebSocket connection established");
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      
      this.mdSocket.on("message", (data) => {
        console.log("Market data received:", data.toString());
      });
      
      this.mdSocket.on("error", (error) => {
        console.error("WebSocket error:", error);
        reject(error);
      });
      
      this.mdSocket.on("close", () => {
        console.log("WebSocket connection closed");
      });
    });
  }

  private subscribeToContracts(contractIds: string[]): void {
    if (!this.mdSocket || this.mdSocket.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not connected");
    }
    
    for (const conid of contractIds) {
      const message = `smd+${conid}+{"fields":["31"]}`;
      this.mdSocket.send(message);
    }
  }

  async startMarketDataStream(symbol: string): Promise<void> {
    try {
      // 1. Search for security
      const searchResults = await this.apiService.secdefSearch({
        symbol,
        secType: "STK",
      });
      
      // 2. Extract options data
      const { conid, currentMonth } = await this.extractOptionsData(searchResults);
      
      // 3. Get available strikes
      const strikesResult = await this.apiService.secdefStrikes({
        conid,
        sectype: "OPT",
        month: currentMonth,
      });
      
      // 4. Get underlying last price
      const underlyingLast = await this.getUnderlyingLastPrice(conid);
      console.log(`Underlying last price: ${underlyingLast}`);
      
      // 5. Select nearby strikes
      const selectedStrikes = this.selectNearbyStrikes(
        strikesResult.call,
        underlyingLast,
        2 // Get 2 strikes around the current price
      );
      console.log(`Selected strikes: ${selectedStrikes.join(", ")}`);
      
      // 6. Get contracts for selected strikes
      const contractIds = await this.getContractsForStrikes(selectedStrikes, {
        conid,
        month: currentMonth,
      });
      console.log(`Found ${contractIds.length} contracts`);
      
      // 7. Initialize WebSocket and subscribe
      await this.initializeWebSocket();
      this.subscribeToContracts(contractIds);
      
    } catch (error) {
      console.error("Error in market data stream setup:", error);
      this.cleanup();
      throw error;
    }
  }

  cleanup(): void {
    if (this.mdSocket) {
      this.mdSocket.close();
      this.mdSocket = null;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}