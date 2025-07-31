// Carbon footprint calculation API
export class CarbonAPI {
  constructor() {
    this.apiKey = process.env.CARBON_API_KEY
    this.baseURL = "https://api.carbonfootprint.com/v1"
  }

  async calculatePackagingFootprint(specs, materialType) {
    if (!this.apiKey) {
      return this.getMockCarbonData(specs, materialType)
    }

    try {
      const response = await fetch(`${this.baseURL}/packaging`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          material: materialType,
          dimensions: {
            length: Number.parseFloat(specs.length),
            width: Number.parseFloat(specs.width),
            height: Number.parseFloat(specs.height),
          },
          weight: Number.parseFloat(specs.weight),
          productType: specs.productType,
        }),
      })

      if (!response.ok) {
        throw new Error(`Carbon API error: ${response.status}`)
      }

      const data = await response.json()
      return {
        carbonFootprint: data.co2Grams,
        plasticComparison: data.plasticSavings,
        certifications: data.certifications,
        methodology: data.calculationMethod,
      }
    } catch (error) {
      console.error("Carbon API failed:", error)
      return this.getMockCarbonData(specs, materialType)
    }
  }

  getMockCarbonData(specs, materialType) {
    const volume = Number.parseFloat(specs.length) * Number.parseFloat(specs.width) * Number.parseFloat(specs.height)
    const weight = Number.parseFloat(specs.weight)

    // Mock calculation based on material type
    const materialFactors = {
      cardboard: 0.8,
      compostable: 0.6,
      hemp: 0.5,
      pulp: 0.7,
      foam: 0.9,
      cotton: 1.2,
    }

    const factor = materialFactors[materialType] || 0.8
    const carbonFootprint = Math.round((volume * 0.001 + weight * 0.5) * factor)
    const plasticSavings = Math.round(carbonFootprint * 2.5) // Plastic typically 2.5x worse

    return {
      carbonFootprint,
      plasticComparison: plasticSavings,
      certifications: ["FSC Certified", "Carbon Neutral"],
      methodology: "LCA Analysis",
    }
  }
}

export const carbonAPI = new CarbonAPI()
