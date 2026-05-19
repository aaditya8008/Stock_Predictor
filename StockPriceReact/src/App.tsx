import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { StockPredictionCard } from './components/StockPredictionCard';
import { StockChart } from './components/StockChart';
import { mockStockService as stockService } from './services/mockStockService';
import type { StockPrediction } from './types/stock';

function App() {
  const [symbol, setSymbol] = useState('AAPL');
  const [prediction, setPrediction] = useState<StockPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPrediction = async (stockSymbol: string) => {
    try {
      setIsLoading(true);
      setError('');
      const data = await stockService.getPrediction(stockSymbol);
      setPrediction(data);
    } catch (err) {
      setError('Failed to fetch prediction. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction(symbol);
    // Update predictions every 5 seconds
    const interval = setInterval(() => {
      fetchPrediction(symbol);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [symbol]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrediction(symbol);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Stock Price Predictor</h1>
          <p className="text-gray-600">Enter a stock symbol to see price predictions</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <button
              type="submit"
              className="absolute right-2 top-1.5 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Predict
            </button>
          </div>
        </form>

        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        <div className="space-y-6">
          {prediction && (
            <>
              <StockPredictionCard prediction={prediction} isLoading={isLoading} />
              <StockChart prediction={prediction} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;