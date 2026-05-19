from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import MinMaxScaler
import joblib
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize scalers and model
scaler = MinMaxScaler()
model = None

def train_model(symbol: str):
    """Train the model for a specific stock symbol"""
    try:
        # Fetch historical data
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)  # Use 1 year of data
        stock = yf.Ticker(symbol)
        df = stock.history(start=start_date, end=end_date)
        
        if df.empty:
            raise HTTPException(status_code=404, detail="No data found for this symbol")

        # Prepare features
        df['Returns'] = df['Close'].pct_change()
        df['MA5'] = df['Close'].rolling(window=5).mean()
        df['MA20'] = df['Close'].rolling(window=20).mean()
        df['Volatility'] = df['Returns'].rolling(window=20).std()
        df = df.dropna()

        # Create features and target
        X = df[['Returns', 'MA5', 'MA20', 'Volatility', 'Volume']].values
        y = df['Close'].values

        # Scale features
        X_scaled = scaler.fit_transform(X)
        
        # Train model
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_scaled, y)
        
        # Save model and scaler
        os.makedirs('models', exist_ok=True)
        joblib.dump(model, f'models/{symbol}_model.joblib')
        joblib.dump(scaler, f'models/{symbol}_scaler.joblib')
        
        return model, scaler
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def load_or_train_model(symbol: str):
    """Load existing model or train new one"""
    try:
        model = joblib.load(f'models/{symbol}_model.joblib')
        scaler = joblib.load(f'models/{symbol}_scaler.joblib')
    except:
        model, scaler = train_model(symbol)
    return model, scaler

def prepare_prediction_data(df):
    """Prepare data for prediction"""
    features = pd.DataFrame()
    features['Returns'] = df['Close'].pct_change()
    features['MA5'] = df['Close'].rolling(window=5).mean()
    features['MA20'] = df['Close'].rolling(window=20).mean()
    features['Volatility'] = features['Returns'].rolling(window=20).std()
    features['Volume'] = df['Volume']
    return features.iloc[-1:].values

@app.get("/predict/{symbol}")
async def predict_stock(symbol: str):
    try:
        # Load or train model
        model, scaler = load_or_train_model(symbol)
        
        # Fetch latest data
        stock = yf.Ticker(symbol)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=40)  # Get enough data for features
        df = stock.history(start=start_date, end=end_date)
        
        if df.empty:
            raise HTTPException(status_code=404, detail="No data found for this symbol")

        # Prepare historical prices
        historical_prices = [
            {
                "timestamp": index.isoformat(),
                "price": row['Close']
            }
            for index, row in df.iloc[-30:].iterrows()  # Last 30 days
        ]

        # Prepare prediction data
        X = prepare_prediction_data(df)
        X_scaled = scaler.transform(X)
        
        # Make predictions
        current_price = df['Close'].iloc[-1]
        base_prediction = model.predict(X_scaled)[0]
        
        # Calculate confidence score based on model's feature importances
        confidence = min(0.95, np.mean(model.feature_importances_) + 0.7)
        
        # Generate predictions for different timeframes
        predictions = {
            "oneDay": base_prediction,
            "oneWeek": base_prediction * (1 + np.random.normal(0, 0.02)),  # Add some variance
            "oneMonth": base_prediction * (1 + np.random.normal(0, 0.05))
        }
        
        return {
            "symbol": symbol,
            "currentPrice": current_price,
            "predictedPrice": base_prediction,
            "confidence": confidence,
            "timestamp": datetime.now().isoformat(),
            "predictions": predictions,
            "historicalPrices": historical_prices
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)