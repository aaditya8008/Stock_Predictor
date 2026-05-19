# Stock Price Prediction ML Backend

This is a machine learning backend service that provides stock price predictions using historical data and advanced ML techniques.

## Features

- Real-time stock data fetching using yfinance
- Machine learning model using Random Forest Regression
- Feature engineering including:
  - Moving averages (5 and 20 days)
  - Returns
  - Volatility
  - Volume
- Automatic model training and persistence
- RESTful API endpoints
- CORS support for frontend integration

## Setup

1. Create a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:
   ```bash
   python main.py
   ```

The server will start on http://localhost:8000

## API Endpoints

### GET /predict/{symbol}

Predicts stock prices for the given symbol.

Example response:
```json
{
  "symbol": "AAPL",
  "currentPrice": 150.25,
  "predictedPrice": 152.75,
  "confidence": 0.85,
  "timestamp": "2024-02-20T10:30:00Z",
  "predictions": {
    "oneDay": 152.75,
    "oneWeek": 154.20,
    "oneMonth": 158.90
  },
  "historicalPrices": [
    {
      "timestamp": "2024-02-19T00:00:00Z",
      "price": 149.50
    },
    ...
  ]
}
```

## Model Details

The prediction model uses Random Forest Regression with the following features:
- Price returns
- 5-day moving average
- 20-day moving average
- 20-day volatility
- Trading volume

Models are automatically saved and loaded from the `models` directory.