import { smartEngine } from "./smart-recommendations"

// Helper function to calculate carbon savings
function calculateCarbonSavings(ecoScore) {
  const plasticEcoScore = 2 // Typical eco score for traditional plastic packaging
  return Math.max(0, (ecoScore - plasticEcoScore) * 50)
}

// Main recommendation function using smart algorithms and free APIs
export async function getRecommendations(specs) {
  try {
    console.log("🤖 Generating smart recommendations...")

    // Use the smart recommendation engine
    const recommendations = await smartEngine.generateIntelligentRecommendations(specs)

    console.log(`✅ Generated ${recommendations.length} recommendations`)
    return recommendations
  } catch (error) {
    console.error("❌ Smart recommendations failed:", error)
    return getFallbackRecommendations(specs)
  }
}

// Simple fallback if everything fails
function getFallbackRecommendations(specs) {
  console.log("🔄 Using fallback recommendations")

  return [
    {
      name: "Eco-Friendly Cardboard Insert",
      description: "Reliable recycled cardboard protection that's cost-effective and sustainable.",
      eco: 8,
      cost: 9,
      reason: "Best balance of cost, protection, and environmental impact for most products.",
      image: "/images/cardboard-packaging.jpg",
      supplierLink: "https://www.uline.com/BL_1360/Corrugated-Boxes",
      supplierName: "Uline",
      estimatedPrice: "$0.12-0.18 per unit",
      carbonSavings: 300,
      material: "cardboard",
      lastUpdated: new Date().toISOString(),
    },
    {
      name: "Biodegradable Protective Wrap",
      description: "Plant-based protective material that decomposes naturally within 6 months.",
      eco: 9,
      cost: 7,
      reason: "Superior environmental credentials with excellent protection for fragile items.",
      image: "/images/eco-bubble-wrap.jpg",
      supplierLink: "https://www.ranpak.com/products/void-fill/",
      supplierName: "Ranpak",
      estimatedPrice: "$0.18-0.28 per sq ft",
      carbonSavings: 350,
      material: "biodegradable",
      lastUpdated: new Date().toISOString(),
    },
  ]
}
