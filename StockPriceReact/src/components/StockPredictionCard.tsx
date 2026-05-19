import React from 'react';
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import type { StockPrediction } from '../types/stock';

interface Props {
  prediction: StockPrediction;
  isLoading: boolean;
}

export function StockPredictionCard({ prediction, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="animate-pulse bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const isPriceUp = prediction.predictedPrice > prediction.currentPrice;
  const changePercent = ((prediction.predictedPrice - prediction.currentPrice) / prediction.currentPrice) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{prediction.symbol}</h2>
        <BarChart2 className="text-blue-600" size={24} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Current Price</p>
          <p className="text-xl font-bold">${prediction.currentPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Predicted Price</p>
          <div className="flex items-center">
            <p className="text-xl font-bold">${prediction.predictedPrice.toFixed(2)}</p>
            <span className={`ml-2 flex items-center ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
              {isPriceUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(changePercent).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-3">Future Predictions</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500">24 Hours</p>
            <p className="font-semibold">${prediction.predictions.oneDay.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">1 Week</p>
            <p className="font-semibold">${prediction.predictions.oneWeek.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">1 Month</p>
            <p className="font-semibold">${prediction.predictions.oneMonth.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <p>Confidence Score: {(prediction.confidence * 100).toFixed(1)}%</p>
        <p>Last Updated: {new Date(prediction.timestamp).toLocaleTimeString()}</p>
      </div>
    </div>
  );
}