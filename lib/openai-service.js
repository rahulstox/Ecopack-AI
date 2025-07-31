// OpenAI integration for AI-powered recommendations
export class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY
    this.baseURL = "https://api.openai.com/v1"
  }

  async generateRecommendations(specs) {
    if (!this.apiKey) {
      console.warn("OpenAI API key not found, using mock data")
      return this.getMockRecommendations(specs)
    }

    const prompt = this.buildPrompt(specs)

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "You are an expert in sustainable packaging solutions. Provide detailed recommendations based on product specifications.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      return this.parseAIResponse(data.choices[0].message.content, specs)
    } catch (error) {
      console.error("OpenAI API failed, falling back to mock data:", error)
      return this.getMockRecommendations(specs)
    }
  }

  buildPrompt(specs) {
    return `
      Please recommend 2 sustainable packaging solutions for a product with these specifications:
      - Dimensions: ${specs.length}cm x ${specs.width}cm x ${specs.height}cm
      - Weight: ${specs.weight}kg
      - Fragility: ${specs.fragility}
      - Product Type: ${specs.productType}

      For each recommendation, provide:
      1. Name of the packaging material
      2. Detailed description (50-80 words)
      3. Eco score (1-10, where 10 is most sustainable)
      4. Cost score (1-10, where 10 is most cost-effective)
      5. Reasoning for this choice (30-50 words)
      6. Estimated price range
      7. Suitable supplier name

      Format as JSON array with these exact keys: name, description, eco, cost, reason, estimatedPrice, supplierName
    `
  }

  parseAIResponse(content, specs) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const recommendations = JSON.parse(jsonMatch[0])
        return recommendations.map((rec) => ({
          ...rec,
          image: this.getImageForMaterial(rec.name),
          supplierLink: this.getSupplierLink(rec.supplierName),
          carbonSavings: this.calculateCarbonSavings(rec.eco),
        }))
      }
    } catch (error) {
      console.error("Failed to parse AI response:", error)
    }

    // Fallback to mock data if parsing fails
    return this.getMockRecommendations(specs)
  }

  getImageForMaterial(materialName) {
    const imageMap = {
      cardboard: "/images/cardboard-packaging.jpg",
      bubble: "/images/eco-bubble-wrap.jpg",
      compostable: "/images/compostable-packaging.jpg",
      cotton: "/images/fabric-bags.jpg",
      pulp: "/images/pulp-molding.jpg",
      foam: "/images/biodegradable-foam.jpg",
      hemp: "/images/hemp-packaging.jpg",
    }

    const key = Object.keys(imageMap).find((k) => materialName.toLowerCase().includes(k))

    return imageMap[key] || "/images/cardboard-packaging.jpg"
  }

  getSupplierLink(supplierName) {
    const supplierMap = {
      Ranpak: "https://www.ranpak.com/products/void-fill/",
      Uline: "https://www.uline.com/BL_1360/Corrugated-Boxes",
      "World Centric": "https://www.worldcentric.com/compostable-packaging",
      "4imprint": "https://www.4imprint.com/product/126659/Cotton-Drawstring-Bag",
      "Pactiv Evergreen": "https://www.pactiv.com/foodservice/products/",
      Grainger: "https://www.grainger.com/category/material-handling/packaging-supplies",
    }

    return supplierMap[supplierName] || "https://www.amazon.com/s?k=sustainable+packaging"
  }

  calculateCarbonSavings(ecoScore) {
    const plasticEcoScore = 2
    return Math.max(0, (ecoScore - plasticEcoScore) * 50)
  }

  // Fallback mock data (same as before)
  getMockRecommendations(specs) {
    // Import the existing mock logic from recommend.js
    const { getRecommendations } = require("./recommend")
    return getRecommendations(specs)
  }
}

export const openAIService = new OpenAIService()
