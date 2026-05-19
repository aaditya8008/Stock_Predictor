export interface StockPrediction {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  timestamp: string;
  predictions: {
    oneDay: number;
    oneWeek: number;
    oneMonth: number;
  };
  historicalPrices: {
    timestamp: string;
    price: number;
  }[];
}