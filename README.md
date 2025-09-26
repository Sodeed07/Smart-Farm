# 🌱 Smart Farm - AI-Powered Soil Analysis System

An intelligent agricultural platform that uses AI to analyze soil reports and provide comprehensive farming recommendations.

## 🚀 Features

### Core Functionality
- **📊 AI-Powered Soil Analysis** - Extract soil metrics from PDF reports using Google Gemini AI
- **🌱 Smart Crop Recommendations** - Get personalized crop suggestions based on soil conditions
- **🌤️ Weather Integration** - Real-time weather-based farming recommendations
- **⚠️ Pathogenicity Alerts** - Automatic detection of soil health risks
- **📋 Detailed Farming Plans** - Comprehensive agricultural roadmaps
- **💡 Nutrient Management** - Intelligent fertilizer and soil improvement suggestions

### Soil Metrics Analyzed
- Moisture Content
- pH Level
- Electrical Conductivity
- Organic Matter
- Primary Nutrients (N, P, K)
- Secondary Nutrients (Ca, Mg, S)
- Pathogen Count

## 🛠️ Technical Stack

- **Backend**: Node.js + Express.js
- **AI Engine**: Google Gemini AI
- **Weather API**: OpenWeatherMap
- **File Processing**: PDF-parse, Multer
- **Frontend**: HTML5 + CSS3 + JavaScript

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Smart-Farm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   PORT=3000
   ```

4. **Get API Keys**
   - **Gemini API**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **OpenWeatherMap API**: Get from [OpenWeatherMap](https://openweathermap.org/api) (optional)

5. **Start the server**
   ```bash
   npm start
   ```

## 🔗 API Endpoints

### Main Analysis Endpoint
```http
POST /api/analyze
Content-Type: multipart/form-data

Body:
- soilReport: PDF file
- location: string (optional, defaults to "New Delhi, India")
```

**Response:**
```json
{
  "message": "Comprehensive soil analysis completed successfully!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "data": {
    "soilAnalysis": {
      "moisture": 27,
      "phLevel": 6.3,
      "conductivity": 0.45,
      "organicMatter": 1.25,
      "nitrogen": 390,
      "phosphorus": 29,
      "potassium": 210,
      "calcium": 520,
      "magnesium": 260,
      "sulfur": 5.18,
      "pathogenCount": 57
    },
    "cropRecommendations": {
      "soilHealth": "good",
      "recommendedCrops": ["Wheat", "Rice", "Corn"],
      "pathogenAlert": {
        "alert": true,
        "message": "High pathogen count detected"
      },
      "soilImprovements": ["Add organic compost", "Improve drainage"],
      "farmingPlan": {
        "timeline": "6 months",
        "activities": ["Soil preparation", "Planting", "Monitoring"]
      },
      "nutrientRecommendations": ["Add phosphorus", "Balance pH"],
      "riskFactors": ["High pathogen count", "Low organic matter"]
    },
    "weatherData": {
      "temperature": 25,
      "humidity": 65,
      "description": "clear sky",
      "windSpeed": 3.5,
      "pressure": 1013
    },
    "weatherRecommendations": {
      "weatherSuitability": "excellent",
      "seasonalRecommendations": ["Plant in spring", "Harvest in autumn"],
      "weatherAlerts": ["Monitor for heavy rain"],
      "irrigationAdvice": "Moderate watering needed",
      "farmingActivities": ["Soil preparation", "Planting"]
    },
    "location": "New Delhi, India"
  }
}
```

### Additional Endpoints

#### Get Crop Recommendations
```http
POST /api/crop-recommendations
Content-Type: application/json

Body:
{
  "soilData": { /* soil analysis data */ }
}
```

#### Get Weather Recommendations
```http
POST /api/weather-recommendations
Content-Type: application/json

Body:
{
  "soilData": { /* soil analysis data */ },
  "location": "New Delhi, India"
}
```

#### Health Check
```http
GET /api/health
```

## 🎯 Usage Examples

### 1. Basic Soil Analysis
```javascript
const formData = new FormData();
formData.append('soilReport', pdfFile);
formData.append('location', 'Mumbai, India');

fetch('http://localhost:3000/api/analyze', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Soil Analysis:', data.data.soilAnalysis);
  console.log('Crop Recommendations:', data.data.cropRecommendations);
  console.log('Weather Data:', data.data.weatherData);
});
```

### 2. Get Weather-Based Recommendations
```javascript
fetch('http://localhost:3000/api/weather-recommendations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    soilData: { /* your soil data */ },
    location: 'Bangalore, India'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Weather Recommendations:', data.data.recommendations);
});
```

## 🧪 Testing

Run the test script to verify your setup:
```bash
node test-backend.js
```

This will check:
- ✅ Environment configuration
- ✅ API key validation
- ✅ Server health status
- ✅ Available endpoints

## 📊 Response Data Structure

### Soil Analysis
- **moisture**: Soil moisture percentage
- **phLevel**: pH level (0-14)
- **conductivity**: Electrical conductivity (dS/m)
- **organicMatter**: Organic matter percentage
- **nitrogen**: Nitrogen content (ppm)
- **phosphorus**: Phosphorus content (ppm)
- **potassium**: Potassium content (ppm)
- **calcium**: Calcium content (ppm)
- **magnesium**: Magnesium content (ppm)
- **sulfur**: Sulfur content (ppm)
- **pathogenCount**: Pathogen count per sample

### Crop Recommendations
- **soilHealth**: Overall soil health assessment
- **recommendedCrops**: Array of suitable crops
- **pathogenAlert**: Pathogen risk assessment
- **soilImprovements**: Suggested improvements
- **farmingPlan**: Detailed farming timeline
- **nutrientRecommendations**: Nutrient management advice
- **riskFactors**: Identified risks and concerns

## 🔧 Configuration

### Environment Variables
- `GEMINI_API_KEY`: Required for AI analysis
- `OPENWEATHER_API_KEY`: Optional for weather data
- `PORT`: Server port (default: 3000)

### API Rate Limits
- Gemini API: Check Google's rate limits
- OpenWeatherMap: 1000 calls/day (free tier)

## 🚨 Error Handling

The API includes comprehensive error handling:
- Invalid file formats
- Missing API keys
- Network timeouts
- AI processing errors
- Weather API failures

## 📈 Future Enhancements

- [ ] Database integration for historical data
- [ ] Machine learning model training
- [ ] Mobile app integration
- [ ] IoT sensor data integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
- Check the API health endpoint
- Review the test script output
- Verify your API keys
- Check the server logs

---

**Built with ❤️ for Smart Agriculture**
