"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Leaf, DollarSign, Download, Loader2, ExternalLink, ShoppingCart } from "lucide-react"
import { getRecommendations } from "@/lib/recommend"
import type { PackagingRecommendation, ProductSpecs } from "@/lib/recommend"
import { generatePDF } from "@/lib/pdf-generator"

export default function RecommendPage() {
  const [specs, setSpecs] = useState<ProductSpecs>({
    length: "",
    width: "",
    height: "",
    weight: "",
    fragility: "",
    productType: "",
  })

  const [recommendations, setRecommendations] = useState<PackagingRecommendation[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const results = await getRecommendations(specs)
      setRecommendations(results)
    } catch (error) {
      console.error("Error getting recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid =
    specs.length && specs.width && specs.height && specs.weight && specs.fragility && specs.productType

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Package Recommendations</h1>
          <p className="text-gray-600">Enter your product specifications to get AI-powered packaging suggestions</p>
        </div>

        {/* Form Card */}
        <Card className="rounded-xl shadow-sm border-0 bg-white mb-8">
          <CardHeader>
            <CardTitle>Product Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dimensions Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Length (cm)</Label>
                  <Input
                    id="length"
                    type="number"
                    placeholder="0"
                    value={specs.length}
                    onChange={(e) => setSpecs((prev) => ({ ...prev, length: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Width (cm)</Label>
                  <Input
                    id="width"
                    type="number"
                    placeholder="0"
                    value={specs.width}
                    onChange={(e) => setSpecs((prev) => ({ ...prev, width: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="0"
                    value={specs.height}
                    onChange={(e) => setSpecs((prev) => ({ ...prev, height: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={specs.weight}
                  onChange={(e) => setSpecs((prev) => ({ ...prev, weight: e.target.value }))}
                  className="rounded-xl"
                />
              </div>

              {/* Fragility */}
              <div className="space-y-2">
                <Label>Fragility</Label>
                <Select
                  value={specs.fragility}
                  onValueChange={(value) => setSpecs((prev) => ({ ...prev, fragility: value }))}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select fragility level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Product Type */}
              <div className="space-y-2">
                <Label>Product Type</Label>
                <Select
                  value={specs.productType}
                  onValueChange={(value) => setSpecs((prev) => ({ ...prev, productType: value }))}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="toys">Toys</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isFormValid || loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Getting Recommendations...
                  </>
                ) : (
                  "Get Recommendations"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {recommendations.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Recommended Packaging</h2>
              <Button
                onClick={() => generatePDF(specs, recommendations)}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={recommendations.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => (
                <Card key={index} className="rounded-xl shadow-sm border-0 bg-white overflow-hidden">
                  <div className="aspect-video w-full bg-gray-100 overflow-hidden">
                    <img
                      src={rec.image || "/placeholder.svg"}
                      alt={rec.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{rec.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{rec.description}</p>

                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 rounded-full">
                        <Leaf className="w-3 h-3 mr-1" />
                        Eco Score: {rec.eco}/10
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 rounded-full">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Cost Score: {rec.cost}/10
                      </Badge>
                    </div>

                    {/* Carbon Savings */}
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Carbon Impact</span>
                      </div>
                      <p className="text-lg font-bold text-green-700 mt-1">
                        ≈ {rec.carbonSavings}g CO₂ saved vs. plastic
                      </p>
                      <p className="text-xs text-green-600 mt-1">Per unit compared to traditional plastic packaging</p>
                    </div>

                    {/* Pricing Information */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Estimated Price</p>
                      <p className="text-lg font-bold text-emerald-600">{rec.estimatedPrice}</p>
                    </div>

                    {/* Supplier Information */}
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Supplier</p>
                        <p className="text-sm text-blue-600 font-medium">{rec.supplierName}</p>
                      </div>
                      <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                        <a href={rec.supplierLink} target="_blank" rel="noopener noreferrer">
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Order Now
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    </div>

                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Why:</span> {rec.reason}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
