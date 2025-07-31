// API client for external services
class APIClient {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.ecopack.ai"
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API Request failed:", error)
      throw error
    }
  }

  // Get packaging recommendations from AI service
  async getPackagingRecommendations(specs) {
    return this.request("/recommendations", {
      method: "POST",
      body: JSON.stringify(specs),
    })
  }

  // Get supplier information
  async getSupplierInfo(materialType) {
    return this.request(`/suppliers/${materialType}`)
  }

  // Get real-time pricing
  async getPricing(materialId, quantity = 1) {
    return this.request(`/pricing/${materialId}?quantity=${quantity}`)
  }

  // Calculate carbon footprint
  async calculateCarbonFootprint(specs, materialType) {
    return this.request("/carbon-calculator", {
      method: "POST",
      body: JSON.stringify({ specs, materialType }),
    })
  }
}

export const apiClient = new APIClient()
