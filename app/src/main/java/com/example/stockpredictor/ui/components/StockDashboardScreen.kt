
package com.example.stockpredictor.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.stockpredictor.data.model.PredictionResponse
import com.example.stockpredictor.data.remote.ApiService
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import com.patrykandpatrick.vico.core.entry.FloatEntry
import com.patrykandpatrick.vico.core.entry.entryModelOf
import com.patrykandpatrick.vico.compose.chart.Chart
import com.patrykandpatrick.vico.compose.chart.line.lineChart
import com.patrykandpatrick.vico.compose.chart.line.lineSpec
import com.patrykandpatrick.vico.compose.axis.horizontal.bottomAxis
import com.patrykandpatrick.vico.compose.axis.vertical.startAxis

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StockDashboardScreen() {
    var symbol by remember { mutableStateOf("") }
    var triggerFetch by remember { mutableStateOf(false) }
    var stockData by remember { mutableStateOf<PredictionResponse?>(null) }
    var error by remember { mutableStateOf<String?>(null) }
    var isLoading by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "📊 Stock Predictor",
                        fontWeight = FontWeight.Bold
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.White,
                    titleContentColor = Color.Black
                )
            )
        },
        containerColor = Color.White
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
                .background(Color.White),
            verticalArrangement = Arrangement.Top
        ) {
            OutlinedTextField(
                value = symbol,
                onValueChange = { symbol = it },
                label = { Text("Enter Stock Symbol (e.g. AAPL)") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFF1E88E5),
                    unfocusedBorderColor = Color.Gray,
                    focusedLabelColor = Color(0xFF1E88E5),
                    cursorColor = Color(0xFF1E88E5),
                    focusedTextColor = Color.Black,
                    unfocusedTextColor = Color.Black
                )
            )

            Spacer(modifier = Modifier.height(12.dp))

            Button(
                onClick = { triggerFetch = true },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(10.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E88E5))
            ) {
                Text("🔍 Predict", color = Color.White)
            }

            Spacer(modifier = Modifier.height(20.dp))

            when {
                isLoading -> {
                    Box(
                        modifier = Modifier.fillMaxWidth(),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(color = Color(0xFF1E88E5))
                    }
                }
                stockData != null -> StockInfoDisplay(stockData!!)
                error != null -> Text(
                    "Error: $error",
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodyMedium
                )
            }
        }
    }

    LaunchedEffect(triggerFetch) {
        if (!triggerFetch) return@LaunchedEffect

        isLoading = true
        error = null
        stockData = null

        val retrofit = Retrofit.Builder()
            .baseUrl("http://16.170.143.63:8000/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        val api = retrofit.create(ApiService::class.java)

        try {
            stockData = api.getPrediction(symbol.uppercase())
        } catch (e: Exception) {
            error = e.message ?: "Unknown error occurred"
        } finally {
            isLoading = false
            triggerFetch = false
        }
    }
}

@Composable
fun StockInfoDisplay(data: PredictionResponse) {
    val priceUp = data.predictedPrice >= data.currentPrice

    Card(
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp)
            .shadow(4.dp, RoundedCornerShape(16.dp), clip = false),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFFFFFFF))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "📈 ${data.symbol}",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Current Price: \$${"%.2f".format(data.currentPrice)}",
                style = MaterialTheme.typography.bodyLarge
            )

            Text(
                text = "Predicted Price (1 Day): \$${"%.2f".format(data.predictedPrice)}",
                color = if (priceUp) Color(0xFF2E7D32) else Color(0xFFC62828),
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.SemiBold
            )

            Text(
                text = "Confidence: ${(data.confidence * 100).toInt()}%",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.Gray
            )
        }
    }

    Spacer(modifier = Modifier.height(20.dp))

    Text(
        "📊 Price History",
        style = MaterialTheme.typography.titleMedium,
        fontWeight = FontWeight.Medium
    )

    val entries = data.historicalPrices.mapIndexed { index, item ->
        FloatEntry(x = index.toFloat(), y = item.price.toFloat())
    }

    if (entries.isNotEmpty()) {
        val model = remember(entries) { entryModelOf(entries) }

        val customLineSpec = lineSpec(
            lineColor = Color(0xFF1E88E5),
            lineThickness = 2.dp,
            lineCap = StrokeCap.Round
        )

        Chart(
            chart = lineChart(lines = listOf(customLineSpec)),
            model = model,
            startAxis = startAxis(), // ✅ Y-axis labels
            bottomAxis = bottomAxis(), // Optional: X-axis labels
            modifier = Modifier
                .fillMaxWidth()
                .height(250.dp)
                .padding(top = 8.dp)
        )
    }
}