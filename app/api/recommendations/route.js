import { NextResponse } from "next/server"
import { getRecommendations } from "@/lib/recommend"

export async function POST(request) {
  try {
    const specs = await request.json()

    // Validate input
    if (!specs.length || !specs.width || !specs.height || !specs.weight) {
      return NextResponse.json({ error: "Missing required specifications" }, { status: 400 })
    }

    const recommendations = await getRecommendations(specs)

    return NextResponse.json({
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 })
  }
}
