// --- Enhanced Smart Farm Backend: AI-Powered Soil Analysis with Recommendations ---

// 1. Import libraries and load environment variables
require('dotenv').config(); // MUST be at the top
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');

// 2. CRITICAL: API Key Setup and Validation
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("FATAL ERROR: GEMINI_API_KEY is not defined in the .env file.");
  process.exit(1); // Exit the application if the key is missing
}

// 3. Initialize the Gemini AI Model
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
console.log("Gemini AI model initialized successfully.");

// 4. Standard Express and Multer setup (from Phase 2)
const app = express();
const port = 3000;
app.use(cors());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// 5. --- Enhanced AI Analysis Functions ---

/**
 * Sends text from a PDF to the Gemini API for comprehensive soil analysis.
 * @param {string} text - The raw text from the PDF file.
 * @returns {Promise<object>} A promise that resolves to the structured JSON data from the AI.
 */
async function analyzeTextWithGemini(text) {
  const prompt = `
    Analyze the following text from a soil report. Your task is to extract the specific values for the metrics listed below.
    The required metrics are: Moisture, pH Level, Conductivity, Organic Matter, Nitrogen (N), Phosphorus (P), Potassium (K), Calcium (Ca), Magnesium (Mg), Sulfur (S), and Pathogen count.

    Your response MUST be a single, minified JSON object.
    - The keys must be in camelCase (e.g., "phLevel", "organicMatter").
    - The values must be numbers, not strings.
    - If a specific metric's value cannot be found in the text, its value in the JSON should be null.
    - Do not include any explanatory text, markdown formatting, or anything other than the single JSON object.

    Here is the text to analyze:
    ---
    ${text}
    ---
  `;

  console.log("Sending text to Gemini API for analysis...");
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const aiResponseText = response.text();
  console.log("Received raw response from Gemini:", aiResponseText);

  const cleanedJsonString = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanedJsonString);
}

/**
 * Generates smart crop recommendations based on soil analysis data.
 * @param {object} soilData - The soil analysis data.
 * @returns {Promise<object>} Crop recommendations and farming plan.
 */
async function generateCropRecommendations(soilData) {
  const prompt = `
    Based on the following soil analysis data, provide smart crop recommendations and a detailed farming plan:

    Soil Data: ${JSON.stringify(soilData)}

    Please provide a comprehensive analysis including:
    1. Soil health assessment
    2. Recommended crops based on soil conditions
    3. Pathogenicity alerts (if pathogen count is high)
    4. Soil improvement recommendations
    5. Detailed farming plan with timelines
    6. Nutrient management suggestions

    Respond with a JSON object containing:
    - soilHealth: "excellent" | "good" | "fair" | "poor"
    - recommendedCrops: array of crop names
    - pathogenAlert: boolean and message
    - soilImprovements: array of improvement suggestions
    - farmingPlan: detailed plan object
    - nutrientRecommendations: array of nutrient suggestions
    - riskFactors: array of identified risks
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const aiResponseText = response.text();
  const cleanedJsonString = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
  
  return JSON.parse(cleanedJsonString);
}

/**
 * Gets current weather data for the specified location.
 * @param {string} location - The location (city, country).
 * @returns {Promise<object>} Weather data.
 */
async function getWeatherData(location) {
  try {
    // Using OpenWeatherMap API (you'll need to add OPENWEATHER_API_KEY to .env)
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('Weather API key not configured');
    }
    
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
    );
    
    return {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      windSpeed: response.data.wind.speed,
      pressure: response.data.main.pressure
    };
  } catch (error) {
    console.error('Weather API error:', error.message);
    return null;
  }
}

/**
 * Generates weather-based crop recommendations.
 * @param {object} weatherData - Current weather data.
 * @param {object} soilData - Soil analysis data.
 * @returns {Promise<object>} Weather-based recommendations.
 */
async function generateWeatherBasedRecommendations(weatherData, soilData) {
  const prompt = `
    Based on the current weather conditions and soil analysis, provide weather-based crop recommendations:

    Weather Data: ${JSON.stringify(weatherData)}
    Soil Data: ${JSON.stringify(soilData)}

    Provide:
    1. Weather-based crop suitability
    2. Seasonal planting recommendations
    3. Weather risk alerts
    4. Irrigation recommendations
    5. Weather-appropriate farming activities

    Respond with a JSON object containing:
    - weatherSuitability: assessment of current weather for farming
    - seasonalRecommendations: array of seasonal advice
    - weatherAlerts: array of weather-related warnings
    - irrigationAdvice: irrigation recommendations
    - farmingActivities: recommended activities for current weather
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const aiResponseText = response.text();
  const cleanedJsonString = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
  
  return JSON.parse(cleanedJsonString);
}


// 6. --- Enhanced API Endpoints ---

// Main soil analysis endpoint with comprehensive recommendations
app.post('/api/analyze', upload.single('soilReport'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded.' });
  }

  try {
    console.log("File received. Extracting text from PDF...");
    const pdfData = await pdf(req.file.buffer);
    
    // Extract soil data
    const soilData = await analyzeTextWithGemini(pdfData.text);
    
    // Generate crop recommendations
    const cropRecommendations = await generateCropRecommendations(soilData);
    
    // Get location from request body (optional)
    const location = req.body.location || 'New Delhi, India';
    
    // Get weather data and generate weather-based recommendations
    let weatherData = null;
    let weatherRecommendations = null;
    
    try {
      weatherData = await getWeatherData(location);
      if (weatherData) {
        weatherRecommendations = await generateWeatherBasedRecommendations(weatherData, soilData);
      }
    } catch (weatherError) {
      console.log('Weather data not available:', weatherError.message);
    }

    // Comprehensive response
    res.status(200).json({
      message: 'Comprehensive soil analysis completed successfully!',
      timestamp: new Date().toISOString(),
      data: {
        soilAnalysis: soilData,
        cropRecommendations: cropRecommendations,
        weatherData: weatherData,
        weatherRecommendations: weatherRecommendations,
        location: location
      }
    });

  } catch (error) {
    console.error("Error during the analysis process:", error);
    res.status(500).json({ 
      error: 'Failed to process the PDF with the AI model.', 
      details: error.message 
    });
  }
});

// Get weather-based recommendations for existing soil data
app.post('/api/weather-recommendations', async (req, res) => {
  try {
    const { soilData, location } = req.body;
    
    if (!soilData || !location) {
      return res.status(400).json({ 
        error: 'Both soilData and location are required.' 
      });
    }

    const weatherData = await getWeatherData(location);
    if (!weatherData) {
      return res.status(500).json({ 
        error: 'Unable to fetch weather data.' 
      });
    }

    const weatherRecommendations = await generateWeatherBasedRecommendations(weatherData, soilData);

    res.status(200).json({
      message: 'Weather-based recommendations generated successfully!',
      data: {
        weatherData: weatherData,
        recommendations: weatherRecommendations,
        location: location
      }
    });

  } catch (error) {
    console.error("Error generating weather recommendations:", error);
    res.status(500).json({ 
      error: 'Failed to generate weather recommendations.', 
      details: error.message 
    });
  }
});

// Get crop recommendations for existing soil data
app.post('/api/crop-recommendations', async (req, res) => {
  try {
    const { soilData } = req.body;
    
    if (!soilData) {
      return res.status(400).json({ 
        error: 'Soil data is required.' 
      });
    }

    const cropRecommendations = await generateCropRecommendations(soilData);

    res.status(200).json({
      message: 'Crop recommendations generated successfully!',
      data: cropRecommendations
    });

  } catch (error) {
    console.error("Error generating crop recommendations:", error);
    res.status(500).json({ 
      error: 'Failed to generate crop recommendations.', 
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      gemini: 'available',
      weather: process.env.OPENWEATHER_API_KEY ? 'available' : 'not configured'
    }
  });
});


// 7. Start the server
app.listen(port, () => {
  console.log(`AI-powered backend server started.`);
  console.log(`Listening for uploads at http://localhost:${port}/api/analyze`);
});

