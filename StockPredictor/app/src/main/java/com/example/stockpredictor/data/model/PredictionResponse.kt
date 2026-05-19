package com.example.stockpredictor.data.model

data class PredictionResponse(
    val symbol: String,
    val currentPrice: Double,
    val predictedPrice: Double,
    val confidence: Double,
    val timestamp: String,
    val predictions: Predictions,
    val historicalPrices: List<HistoricalPrice>
)

data class Predictions(
    val oneDay: Double,
    val oneWeek: Double,
    val oneMonth: Double
)

data class HistoricalPrice(
    val timestamp: String,
    val price: Double
)
