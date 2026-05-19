// This service simulates the ML backend responses with smoother transitions
export const mockStockService = {
  lastPrice: null as number | null,
  
  async getPrediction(symbol: string): Promise<any> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Initialize price if it's the first call
    if (this.lastPrice === null) {
      this.lastPrice = 100 + Math.random() * 50;
    }
    
    // Generate small random price movement
    const priceChange = (Math.random() - 0.5) * 2; // Random change between -1 and 1
    this.lastPrice = this.lastPrice + priceChange;
    
    const timestamp = new Date().toISOString();
    
    // Generate historical data with smoother transitions
    const historicalPrices = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const volatility = 0.05; // 5% maximum daily change
      const dailyChange = (Math.random() - 0.5) * 2 * volatility;
      return {
        timestamp: date.toISOString(),
        price: this.lastPrice * (1 + dailyChange * (i / 29)) // Smoother progression towards current price
      };
    });
    
    // Ensure the last historical price matches current price
    historicalPrices[historicalPrices.length - 1].price = this.lastPrice;
    
    return {
      symbol: symbol.toUpperCase(),
      currentPrice: this.lastPrice,
      predictedPrice: this.lastPrice * (1 + (Math.random() * 0.02 - 0.01)), // Smaller prediction range
      confidence: 0.7 + Math.random() * 0.2,
      timestamp: timestamp,
      predictions: {
        oneDay: this.lastPrice * (1 + (Math.random() * 0.03 - 0.015)),
        oneWeek: this.lastPrice * (1 + (Math.random() * 0.05 - 0.025)),
        oneMonth: this.lastPrice * (1 + (Math.random() * 0.08 - 0.04))
      },
      historicalPrices
    };
  }
};