// Main recommendation functionality
class RecommendationApp {
  constructor() {
    this.form = document.getElementById("recommendForm")
    this.submitBtn = document.getElementById("submitBtn")
    this.resultsSection = document.getElementById("resultsSection")
    this.recommendationsGrid = document.getElementById("recommendationsGrid")
    this.environmentalQuote = document.getElementById("environmentalQuote")
    this.downloadBtn = document.getElementById("downloadBtn")

    // Use the global smartEngine instance from smart-recommendations.js
    this.smartEngine = window.smartEngine || window.SmartRecommendationEngine

    this.init()
  }

  init() {
    this.form.addEventListener("submit", this.handleSubmit.bind(this))
    this.downloadBtn.addEventListener("click", this.handleDownload.bind(this))
  }

  async handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData(this.form)
    const specs = {
      length: formData.get("length"),
      width: formData.get("width"),
      height: formData.get("height"),
      weight: formData.get("weight"),
      fragility: formData.get("fragility"),
      productType: formData.get("productType"),
    }

    this.setLoading(true)

    try {
      console.log("🚀 Starting recommendation request...")
      const recommendations = await this.smartEngine.generateIntelligentRecommendations(specs)

      if (!recommendations || recommendations.length === 0) {
        console.warn("⚠️ No recommendations received")
        this.showError("No recommendations could be generated. Please try again.")
      } else {
        console.log(`✅ Received ${recommendations.length} recommendations`)
        this.displayRecommendations(recommendations)
        this.currentRecommendations = recommendations
        this.currentSpecs = specs
      }
    } catch (error) {
      console.error("❌ Error getting recommendations:", error)
      this.showError("Failed to get recommendations. Please try again.")
    } finally {
      this.setLoading(false)
    }
  }

  setLoading(loading) {
    const btnText = this.submitBtn.querySelector(".btn-text")
    const loadingIcon = this.submitBtn.querySelector(".loading-icon")

    if (loading) {
      btnText.textContent = "Generating Smart Recommendations..."
      loadingIcon.style.display = "inline-block"
      this.submitBtn.disabled = true
    } else {
      btnText.textContent = "Get Smart Recommendations"
      loadingIcon.style.display = "none"
      this.submitBtn.disabled = false
    }
  }

  displayRecommendations(recommendations) {
    // Show results section
    this.resultsSection.style.display = "block"

    // Display environmental quote if available
    if (recommendations[0]?.environmentalQuote) {
      const quote = recommendations[0].environmentalQuote
      document.getElementById("quoteText").textContent = `"${quote.text}"`
      document.getElementById("quoteAuthor").textContent = `— ${quote.author}`
      this.environmentalQuote.style.display = "block"
    }

    // Clear previous recommendations
    this.recommendationsGrid.innerHTML = ""

    // Display each recommendation
    recommendations.forEach((rec, index) => {
      const card = this.createRecommendationCard(rec, index)
      this.recommendationsGrid.appendChild(card)
    })

    // Scroll to results
    this.resultsSection.scrollIntoView({ behavior: "smooth" })
  }

  createRecommendationCard(rec, index) {
    const card = document.createElement("div")
    card.className = "recommendation-card"

    card.innerHTML = `
            <div class="recommendation-image">
                <img src="${rec.image || "/placeholder.svg?height=200&width=400&text=Packaging"}" alt="${rec.name}" loading="lazy">
            </div>
            <div class="recommendation-header">
                <h3 class="recommendation-title">${rec.name}</h3>
                ${
                  rec.marketTrend
                    ? `
                    <div class="trend-badge ${rec.marketTrend === "up" ? "trend-up" : ""}">
                        <i class="fas fa-trending-up"></i>
                        ${rec.marketTrend}
                    </div>
                `
                    : ""
                }
            </div>
            <div class="recommendation-content">
                <p class="recommendation-description">${rec.description}</p>

                <div class="badges">
                    <div class="badge badge-eco">
                        <i class="fas fa-leaf"></i>
                        Eco Score: ${rec.eco}/10
                    </div>
                    <div class="badge badge-cost">
                        <i class="fas fa-dollar-sign"></i>
                        Cost Score: ${rec.cost}/10
                    </div>
                    ${
                      rec.weatherImpact?.impact === "delayed"
                        ? `
                        <div class="badge badge-warning">
                            <i class="fas fa-cloud"></i>
                            Weather Delay
                        </div>
                    `
                        : ""
                    }
                </div>

                <div class="carbon-impact">
                    <div class="carbon-header">
                        <i class="fas fa-leaf"></i>
                        <span>Carbon Impact</span>
                    </div>
                    <div class="carbon-value">≈ ${rec.carbonSavings}g CO₂ saved vs. plastic</div>
                    <div class="carbon-note">Per unit compared to traditional plastic packaging</div>
                </div>

                <div class="pricing-section">
                    <div class="pricing-header">Live Pricing</div>
                    ${
                      rec.realTimePricing
                        ? `
                        <div class="pricing-grid">
                            <div class="pricing-item">
                                <span>USD:</span>
                                <span class="pricing-value">${rec.realTimePricing.USD}</span>
                            </div>
                            <div class="pricing-item">
                                <span>EUR:</span>
                                <span class="pricing-value">${rec.realTimePricing.EUR}</span>
                            </div>
                            <div class="pricing-item">
                                <span>GBP:</span>
                                <span class="pricing-value">${rec.realTimePricing.GBP}</span>
                            </div>
                            <div class="pricing-item">
                                <span>CAD:</span>
                                <span class="pricing-value">${rec.realTimePricing.CAD}</span>
                            </div>
                        </div>
                    `
                        : `
                        <div class="pricing-value">${rec.estimatedPrice}</div>
                    `
                    }
                </div>

                <div class="supplier-section">
                    <div class="supplier-info">
                        <h4>Supplier</h4>
                        <div class="supplier-name">${rec.supplierName}</div>
                        ${
                          rec.lastUpdated
                            ? `
                            <div class="supplier-updated">
                                Updated: ${new Date(rec.lastUpdated).toLocaleTimeString()}
                            </div>
                        `
                            : ""
                        }
                    </div>
                    <a href="${rec.supplierLink}" target="_blank" rel="noopener noreferrer" class="btn-supplier">
                        <i class="fas fa-shopping-cart"></i>
                        Order Now
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>

                <div class="ai-analysis">
                    <span class="font-medium">AI Analysis:</span> ${rec.reason}
                </div>
            </div>
        `

    return card
  }

  showError(message) {
    // Create error message
    const errorDiv = document.createElement("div")
    errorDiv.className = "error-message"
    errorDiv.style.cssText = `
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 1rem;
            border-radius: 0.5rem;
            margin: 1rem 0;
            text-align: center;
        `
    errorDiv.textContent = message

    // Insert after form
    this.form.parentNode.insertBefore(errorDiv, this.form.nextSibling)

    // Remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv)
      }
    }, 5000)
  }

  handleDownload() {
    if (!this.currentRecommendations || !this.currentSpecs) {
      alert("No recommendations to download. Please generate recommendations first.")
      return
    }

    // Generate PDF content
    const pdfContent = this.generatePDFContent(this.currentSpecs, this.currentRecommendations)

    // Create and download file
    const blob = new Blob([pdfContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ecopack-recommendations-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  generatePDFContent(specs, recommendations) {
    const date = new Date().toLocaleDateString()
    const time = new Date().toLocaleTimeString()

    let content = `
ECOPACK AI - SUSTAINABLE PACKAGING RECOMMENDATIONS
Generated on: ${date} at ${time}

PRODUCT SPECIFICATIONS:
- Dimensions: ${specs.length} x ${specs.width} x ${specs.height} cm
- Weight: ${specs.weight} kg
- Fragility: ${specs.fragility}
- Product Type: ${specs.productType}

RECOMMENDATIONS:
`

    recommendations.forEach((rec, index) => {
      content += `
${index + 1}. ${rec.name}
   Description: ${rec.description}
   Eco Score: ${rec.eco}/10
   Cost Score: ${rec.cost}/10
   Carbon Savings: ${rec.carbonSavings}g CO₂ vs plastic
   Estimated Price: ${rec.estimatedPrice}
   Supplier: ${rec.supplierName}
   Link: ${rec.supplierLink}
   AI Analysis: ${rec.reason}
   
`
    })

    content += `
Generated by EcoPack AI - Sustainable Packaging Recommendations
Built for Walmart Sparkathon 2025
`

    return content
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new RecommendationApp()
})
