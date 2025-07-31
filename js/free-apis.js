// Free API integrations with better error handling and fallbacks
class FreeAPIService {
  constructor() {
    // Using more reliable free APIs with CORS support
    this.exchangeRateAPI = "https://api.exchangerate-api.com/v4/latest/USD"
    this.quotableAPI = "https://api.quotable.io/random?tags=environment"

    // Fallback data in case APIs fail
    this.fallbackData = {
      exchangeRates: { USD: 1, EUR: 0.85, GBP: 0.73, CAD: 1.25 },
      environmentalQuotes: [
        {
          text: "The Earth does not belong to us; we belong to the Earth.",
          author: "Chief Seattle",
          tags: ["environment"],
        },
        {
          text: "What we are doing to the forests of the world is but a mirror reflection of what we are doing to ourselves and to one another.",
          author: "Mahatma Gandhi",
          tags: ["environment"],
        },
        {
          text: "The environment is where we all meet; where we all have a mutual interest; it is the one thing all of us share.",
          author: "Lady Bird Johnson",
          tags: ["environment"],
        },
      ],
    }
  }

  // Get current exchange rates with better error handling
  async getExchangeRates() {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(this.exchangeRateAPI, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        USD: 1,
        EUR: data.rates?.EUR || 0.85,
        GBP: data.rates?.GBP || 0.73,
        CAD: data.rates?.CAD || 1.25,
        lastUpdated: data.date || new Date().toISOString().split("T")[0],
        source: "live",
      }
    } catch (error) {
      console.warn("Exchange rate API failed, using fallback:", error.message)
      return {
        ...this.fallbackData.exchangeRates,
        lastUpdated: new Date().toISOString().split("T")[0],
        source: "fallback",
      }
    }
  }

  // Get environmental quote with fallback
  async getEnvironmentalQuote() {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

      const response = await fetch(this.quotableAPI, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        text: data.content || "The best time to plant a tree was 20 years ago. The second best time is now.",
        author: data.author || "Chinese Proverb",
        tags: data.tags || ["environment"],
        source: "live",
      }
    } catch (error) {
      console.warn("Quote API failed, using fallback:", error.message)
      // Return random fallback quote
      const randomQuote =
        this.fallbackData.environmentalQuotes[Math.floor(Math.random() * this.fallbackData.environmentalQuotes.length)]
      return {
        ...randomQuote,
        source: "fallback",
      }
    }
  }

  // Simulate real-time market data using deterministic algorithms
  generateMarketData() {
    const now = Date.now()
    const dayOfYear = Math.floor(now / (1000 * 60 * 60 * 24)) % 365
    const hourOfDay = new Date().getHours()

    // Create realistic market fluctuations based on time
    const marketFactors = {
      cardboard: 0.8 + Math.sin(dayOfYear * 0.017) * 0.15 + Math.cos(hourOfDay * 0.26) * 0.05,
      plastic: 1.2 + Math.cos(dayOfYear * 0.023) * 0.25 + Math.sin(hourOfDay * 0.31) * 0.08,
      hemp: 1.5 + Math.sin(dayOfYear * 0.019) * 0.3 + Math.cos(hourOfDay * 0.28) * 0.1,
      pulp: 0.9 + Math.cos(dayOfYear * 0.021) * 0.2 + Math.sin(hourOfDay * 0.33) * 0.06,
      compostable: 1.1 + Math.sin(dayOfYear * 0.025) * 0.22 + Math.cos(hourOfDay * 0.29) * 0.07,
    }

    // Ensure factors stay within reasonable bounds
    Object.keys(marketFactors).forEach((key) => {
      marketFactors[key] = Math.max(0.5, Math.min(2.0, marketFactors[key]))
    })

    const trendValue = Math.sin(dayOfYear * 0.017) + Math.cos(hourOfDay * 0.26)

    return {
      timestamp: new Date().toISOString(),
      factors: marketFactors,
      trend: trendValue > 0 ? "up" : "down",
      confidence: Math.abs(trendValue) * 100,
      source: "algorithm",
    }
  }

  // Get weather impact with realistic simulation
  async getWeatherImpact(location = "global") {
    try {
      // Simulate weather conditions based on current time and location
      const now = new Date()
      const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % 365
      const seasonFactor = Math.sin(((dayOfYear - 80) * 2 * Math.PI) / 365) // Peak summer = 1, peak winter = -1

      const weatherFactors = {
        temperature: 20 + seasonFactor * 15 + (Math.random() - 0.5) * 10, // 5-35°C range
        humidity: 50 + seasonFactor * 20 + (Math.random() - 0.5) * 30, // 20-80% range
        shippingDelay: Math.random() > 0.85 ? Math.floor(Math.random() * 3) + 1 : 0, // 15% chance of delay
        windSpeed: Math.random() * 25 + 5, // 5-30 km/h
        precipitation: Math.random() > 0.7 ? Math.random() * 10 : 0, // 30% chance of rain
      }

      // Clamp values to realistic ranges
      weatherFactors.temperature = Math.max(-10, Math.min(45, weatherFactors.temperature))
      weatherFactors.humidity = Math.max(10, Math.min(95, weatherFactors.humidity))

      return {
        location,
        ...weatherFactors,
        impact: weatherFactors.shippingDelay > 0 ? "delayed" : "normal",
        severity: weatherFactors.shippingDelay > 2 ? "high" : weatherFactors.shippingDelay > 0 ? "medium" : "low",
        lastUpdated: now.toISOString(),
        source: "simulation",
      }
    } catch (error) {
      console.warn("Weather simulation failed:", error)
      return {
        location,
        impact: "normal",
        shippingDelay: 0,
        temperature: 22,
        humidity: 60,
        source: "fallback",
      }
    }
  }
}

// Create global instance
const freeAPIService = new FreeAPIService()

// Make the service globally available
window.freeAPIService = freeAPIService
