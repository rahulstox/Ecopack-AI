import { freeAPIService } from "./free-apis"

// Smart recommendation engine using free APIs and algorithms
export class SmartRecommendationEngine {
  constructor() {
    this.materialDatabase = {
      cardboard: {
        ecoScore: 8,
        costScore: 9,
        durability: 6,
        recyclable: true,
        compostable: true,
        carbonFootprint: 0.8,
      },
      hemp: {
        ecoScore: 9,
        costScore: 6,
        durability: 8,
        recyclable: true,
        compostable: true,
        carbonFootprint: 0.5,
      },
      pulp: {
        ecoScore: 7,
        costScore: 8,
        durability: 5,
        recyclable: true,
        compostable: true,
        carbonFootprint: 0.7,
      },
      compostable: {
        ecoScore: 10,
        costScore: 5,
        durability: 6,
        recyclable: false,
        compostable: true,
        carbonFootprint: 0.4,
      },
      cotton: {
        ecoScore: 8,
        costScore: 4,
        durability: 9,
        recyclable: true,
        compostable: true,
        carbonFootprint: 1.2,
      },
    }
  }

  async generateIntelligentRecommendations(specs) {
    console.log("🤖 Starting intelligent recommendation generation...")

    try {
      // Get data with individual error handling
      const [marketData, exchangeRates, weatherImpact, environmentalQuote] = await Promise.allSettled([
        Promise.resolve(freeAPIService.generateMarketData()),
        freeAPIService.getExchangeRates(),
        freeAPIService.getWeatherImpact(),
        freeAPIService.getEnvironmentalQuote(),
      ])

      // Extract successful results or use fallbacks
      const marketResult = marketData.status === "fulfilled" ? marketData.value : this.getFallbackMarketData()
      const exchangeResult =
        exchangeRates.status === "fulfilled" ? exchangeRates.value : this.getFallbackExchangeRates()
      const weatherResult = weatherImpact.status === "fulfilled" ? weatherImpact.value : this.getFallbackWeatherData()
      const quoteResult = environmentalQuote.status === "fulfilled" ? environmentalQuote.value : this.getFallbackQuote()

      console.log("📊 Data sources:", {
        market: marketResult.source || "algorithm",
        exchange: exchangeResult.source || "fallback",
        weather: weatherResult.source || "simulation",
        quote: quoteResult.source || "fallback",
      })

      // Calculate product requirements
      const volume = Number.parseFloat(specs.length) * Number.parseFloat(specs.width) * Number.parseFloat(specs.height)
      const weight = Number.parseFloat(specs.weight)
      const fragility = this.getFragilityScore(specs.fragility)
      const productType = specs.productType

      // Smart material selection algorithm
      const recommendations = this.selectOptimalMaterials(
        { volume, weight, fragility, productType },
        marketResult,
        weatherResult,
      )

      // Enhance with real-time pricing
      const enhancedRecommendations = recommendations.map((rec) => ({
        ...rec,
        realTimePricing: this.calculateDynamicPricing(rec, marketResult, exchangeResult),
        weatherImpact: weatherResult,
        marketTrend: marketResult.trend,
        environmentalQuote: quoteResult,
        lastUpdated: new Date().toISOString(),
        dataQuality: {
          market: marketResult.source || "algorithm",
          pricing: exchangeResult.source || "fallback",
          weather: weatherResult.source || "simulation",
          quote: quoteResult.source || "fallback",
        },
      }))

      console.log(`✅ Generated ${enhancedRecommendations.length} enhanced recommendations`)
      return enhancedRecommendations
    } catch (error) {
      console.error("❌ Smart recommendations failed:", error)
      return this.getFallbackRecommendations(specs)
    }
  }

  selectOptimalMaterials(requirements, marketData, weatherImpact) {
    const { volume, weight, fragility, productType } = requirements
    const recommendations = []

    // Algorithm 1: High fragility or electronics
    if (fragility >= 7 || productType === "electronics") {
      const material = this.materialDatabase.hemp
      recommendations.push({
        name: "EcoFlex Hemp Protective Wrap",
        description:
          "Advanced hemp fiber cushioning with superior strength-to-weight ratio. Naturally antimicrobial and biodegradable within 6 months.",
        eco: material.ecoScore,
        cost: Math.round(material.costScore * marketData.factors.hemp),
        reason: `High protection needed. Hemp provides ${material.durability}/10 durability with excellent eco credentials.`,
        image: "/images/hemp-packaging.jpg",
        supplierLink: "https://www.amazon.com/s?k=hemp+packaging+materials",
        supplierName: "EcoHemp Solutions",
        estimatedPrice: this.calculatePrice(volume, weight, "hemp", marketData),
        carbonSavings: this.calculateCarbonSavings(material.ecoScore),
        material: "hemp",
        durability: material.durability,
        weatherResistant: true,
      })
    }

    // Algorithm 2: Food products
    if (productType === "food") {
      const material = this.materialDatabase.compostable
      recommendations.push({
        name: "FDA-Approved Compostable Liner",
        description:
          "Plant-based PLA liner that meets all food safety standards. Composts in 90 days in commercial facilities.",
        eco: material.ecoScore,
        cost: Math.round(material.costScore * marketData.factors.plastic * 0.8), // Better than plastic
        reason: "Food safety compliance with zero plastic waste. Meets FDA regulations for direct food contact.",
        image: "/images/compostable-packaging.jpg",
        supplierLink: "https://www.worldcentric.com/compostable-packaging",
        supplierName: "World Centric",
        estimatedPrice: this.calculatePrice(volume, weight, "compostable", marketData),
        carbonSavings: this.calculateCarbonSavings(material.ecoScore),
        material: "compostable",
        foodSafe: true,
        certifications: ["FDA Approved", "BPI Certified"],
      })
    }

    // Algorithm 3: Clothing and soft goods
    if (productType === "clothing") {
      const material = this.materialDatabase.cotton
      recommendations.push({
        name: "GOTS Organic Cotton Pouch",
        description:
          "Certified organic cotton with drawstring closure. Customers love reusing these for travel and storage.",
        eco: material.ecoScore,
        cost: material.costScore,
        reason: "Reusable packaging creates customer value. 89% of customers report reusing these pouches.",
        image: "/images/fabric-bags.jpg",
        supplierLink: "https://www.4imprint.com/product/126659/Cotton-Drawstring-Bag",
        supplierName: "4imprint",
        estimatedPrice: this.calculatePrice(volume, weight, "cotton", marketData),
        carbonSavings: this.calculateCarbonSavings(material.ecoScore),
        material: "cotton",
        reusable: true,
        customerSatisfaction: 89,
      })
    }

    // Algorithm 4: Default/other products
    if (recommendations.length < 2) {
      const material = this.materialDatabase.cardboard
      const adjustedCost = Math.round(material.costScore * marketData.factors.cardboard)

      recommendations.push({
        name: "Recycled Cardboard Insert System",
        description:
          "Precision-cut inserts from 100% post-consumer recycled cardboard. Optimized for your exact dimensions.",
        eco: material.ecoScore,
        cost: adjustedCost,
        reason: `Cost-effective protection with ${material.ecoScore}/10 sustainability. Market trend: ${marketData.trend}.`,
        image: "/images/cardboard-packaging.jpg",
        supplierLink: "https://www.uline.com/BL_1360/Corrugated-Boxes",
        supplierName: "Uline",
        estimatedPrice: this.calculatePrice(volume, weight, "cardboard", marketData),
        carbonSavings: this.calculateCarbonSavings(material.ecoScore),
        material: "cardboard",
        customFit: true,
        marketTrend: marketData.trend,
      })
    }

    // Algorithm 5: Heavy items get pulp molding
    if (weight > 2 && recommendations.length < 2) {
      const material = this.materialDatabase.pulp
      recommendations.push({
        name: "Molded Pulp Heavy-Duty Tray",
        description: "Industrial-strength molded pulp from agricultural waste. Perfect for heavy items up to 10kg.",
        eco: material.ecoScore,
        cost: Math.round(material.costScore * marketData.factors.pulp),
        reason: `Heavy items (${weight}kg) need structured support. Pulp molding provides excellent protection.`,
        image: "/images/pulp-molding.jpg",
        supplierLink: "https://www.pactiv.com/foodservice/products/",
        supplierName: "Pactiv Evergreen",
        estimatedPrice: this.calculatePrice(volume, weight, "pulp", marketData),
        carbonSavings: this.calculateCarbonSavings(material.ecoScore),
        material: "pulp",
        weightCapacity: "10kg",
        industrialGrade: true,
      })
    }

    return recommendations.slice(0, 2)
  }

  calculateDynamicPricing(recommendation, marketData, exchangeRates) {
    const basePriceUSD = Number.parseFloat(recommendation.estimatedPrice.match(/[\d.]+/)[0])
    const marketFactor = marketData.factors[recommendation.material] || 1
    const adjustedPrice = basePriceUSD * marketFactor

    return {
      USD: `$${adjustedPrice.toFixed(2)}`,
      EUR: `€${(adjustedPrice * exchangeRates.EUR).toFixed(2)}`,
      GBP: `£${(adjustedPrice * exchangeRates.GBP).toFixed(2)}`,
      CAD: `C$${(adjustedPrice * exchangeRates.CAD).toFixed(2)}`,
      marketFactor: marketFactor.toFixed(2),
      trend: marketData.trend,
      lastUpdated: exchangeRates.lastUpdated,
    }
  }

  calculatePrice(volume, weight, material, marketData) {
    const basePrices = {
      cardboard: 0.12,
      hemp: 0.35,
      pulp: 0.22,
      compostable: 0.18,
      cotton: 2.5,
    }

    const basePrice = basePrices[material] || 0.15
    const volumeFactor = Math.max(1, volume / 1000) // Price increases with volume
    const marketFactor = marketData.factors[material] || 1

    const finalPrice = basePrice * volumeFactor * marketFactor
    return `$${finalPrice.toFixed(2)}-${(finalPrice * 1.3).toFixed(2)}`
  }

  calculateCarbonSavings(ecoScore) {
    const plasticEcoScore = 2
    return Math.max(0, (ecoScore - plasticEcoScore) * 50)
  }

  getFragilityScore(fragility) {
    const scores = { low: 3, medium: 6, high: 9 }
    return scores[fragility] || 5
  }

  getFallbackRecommendations(specs) {
    return [
      {
        name: "Recycled Cardboard Insert",
        description: "Standard recycled cardboard protection with reliable performance.",
        eco: 8,
        cost: 9,
        reason: "Reliable, cost-effective solution for most packaging needs.",
        image: "/images/cardboard-packaging.jpg",
        supplierLink: "https://www.uline.com/BL_1360/Corrugated-Boxes",
        supplierName: "Uline",
        estimatedPrice: "$0.12-0.18",
        carbonSavings: 300,
        material: "cardboard",
      },
    ]
  }

  // Add fallback data methods
  getFallbackMarketData() {
    return {
      timestamp: new Date().toISOString(),
      factors: { cardboard: 1.0, hemp: 1.3, pulp: 1.1, compostable: 1.2, plastic: 1.4 },
      trend: "stable",
      confidence: 75,
      source: "fallback",
    }
  }

  getFallbackExchangeRates() {
    return {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      CAD: 1.25,
      lastUpdated: new Date().toISOString().split("T")[0],
      source: "fallback",
    }
  }

  getFallbackWeatherData() {
    return {
      location: "global",
      impact: "normal",
      shippingDelay: 0,
      temperature: 22,
      humidity: 60,
      severity: "low",
      source: "fallback",
    }
  }

  getFallbackQuote() {
    const quotes = [
      {
        text: "The best time to plant a tree was 20 years ago. The second best time is now.",
        author: "Chinese Proverb",
      },
      {
        text: "We do not inherit the earth from our ancestors; we borrow it from our children.",
        author: "Native American Proverb",
      },
      { text: "The Earth is what we all have in common.", author: "Wendell Berry" },
    ]
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    return { ...randomQuote, tags: ["environment"], source: "fallback" }
  }
}

export const smartEngine = new SmartRecommendationEngine()
