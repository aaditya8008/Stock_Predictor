package com.example.stockpredictor.data.remote

import com.example.stockpredictor.data.model.PredictionResponse
import retrofit2.http.GET
import retrofit2.http.Path

interface ApiService {
    @GET("predict/{symbol}")
    suspend fun getPrediction(@Path("symbol") symbol: String): PredictionResponse
}
