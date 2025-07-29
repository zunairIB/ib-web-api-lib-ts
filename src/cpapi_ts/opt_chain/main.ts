import { MarketDataService } from "./services/market-data.service";

async function main() {
  const marketDataService = new MarketDataService();
  
  try {
    await marketDataService.startMarketDataStream("SPX");
    
    // Keep the process running
    process.on("SIGINT", () => {
      console.log("\nShutting down...");
      marketDataService.cleanup();
      process.exit(0);
    });
    
  } catch (error) {
    console.error("Failed to start market data stream:", error);
    process.exit(1);
  }
}

// Run the application
main();