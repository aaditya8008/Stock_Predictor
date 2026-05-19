import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { StockPrediction } from '../types/stock';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  prediction: StockPrediction;
}

export function StockChart({ prediction }: Props) {
  const lastHistoricalPrice = prediction.historicalPrices[prediction.historicalPrices.length - 1].price;
  
  // Format dates more concisely
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };
  
  const historicalDates = prediction.historicalPrices.map(item => formatDate(item.timestamp));
  const historicalPrices = prediction.historicalPrices.map(item => item.price);
  
  // Calculate future timestamps
  const now = new Date();
  const futureDates = [
    formatDate(new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()),
    formatDate(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()),
    formatDate(new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString())
  ];
  
  const futurePrices = [
    lastHistoricalPrice,
    prediction.predictions.oneDay,
    prediction.predictions.oneWeek,
    prediction.predictions.oneMonth
  ];

  const data = {
    labels: [...historicalDates, 'Now', ...futureDates],
    datasets: [
      {
        label: 'Historical Price',
        data: [...historicalPrices, lastHistoricalPrice, null, null, null],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: (ctx: any) => {
          return ctx.dataIndex < historicalPrices.length ? 2 : 0;
        }
      },
      {
        label: 'Predicted Price',
        data: [...Array(historicalPrices.length).fill(null), ...futurePrices],
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        borderDash: [5, 5],
        fill: true,
        tension: 0.4,
        pointRadius: (ctx: any) => {
          return ctx.dataIndex >= historicalPrices.length ? 2 : 0;
        }
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750 // Smooth transition duration
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            if (context.parsed.y !== null) {
              return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
            }
            return undefined;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10
          },
          maxTicksLimit: 8 // Limit the number of visible dates
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value.toFixed(2);
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Price History & Predictions</h3>
      <div className="h-[400px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}