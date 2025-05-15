package com.example.stockpredictor.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

// Define the color scheme for Dark Mode with Blue tones
private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF1E88E5),  // Blue
    secondary = Color(0xFF1565C0),  // Darker Blue
    tertiary = Color(0xFF1976D2)  // Lighter Blue
)

// Define the color scheme for Light Mode (White background and Blue theme)
private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF1E88E5),  // Blue
    secondary = Color(0xFF1565C0),  // Darker Blue
    tertiary = Color(0xFF1976D2),  // Lighter Blue
    background = Color.White,  // White background
    surface = Color.White,  // White surface
    onPrimary = Color.White,  // White text on blue
    onSecondary = Color.White,  // White text on blue
    onTertiary = Color.White,  // White text on blue
    onBackground = Color.Black,  // Black text on white background
    onSurface = Color.Black  // Black text on white surface
)

@Composable
fun StockPredictorTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    // Dynamic color is available on Android 12+
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }

        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
