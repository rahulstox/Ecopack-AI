import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const prompt = `
You are an expert Eco-Log parser.
Your task is to carefully analyze a user's free-form text and extract only those activities that have a carbon footprint, based on the strict valid list below.

### Rules
1. Match activities using the given keywords and synonyms, even if phrased casually (e.g. "took the bus" = bus, "Tesla" = car_electric).
2. Extract numeric values whenever possible (e.g. "15 km", "2 meals", "5 kWh").
   - Default to 1 if a quantity is implied but not mentioned (e.g. "ate chicken" = 1 meal).
3. Units:
   - Transport → "km"
   - Food → "meal"
   - Energy → "kWh"
4. If an activity is not on the list, ignore it completely.
5. Output must be a clean JSON array with objects: { "category", "activity", "value", "unit" }.
6. Do not include explanations, only return JSON.

### Valid categories and activities
- category: "transport"
  - activity: "car_petrol" (keywords: petrol car, drove my car, gas car)
  - activity: "car_diesel" (keywords: diesel car)
  - activity: "car_electric" (keywords: electric car, EV, Tesla)
  - activity: "bus" (keywords: bus, ride bus)
  - activity: "train" (keywords: train, railway, metro)
- category: "food"
  - activity: "red_meat_meal" (keywords: beef, lamb, mutton, red meat, steak, burger)
  - activity: "chicken_meal" (keywords: chicken, poultry)
  - activity: "vegetarian_meal" (keywords: vegetarian, veggie, paneer, dal, rajma)
  - activity: "vegan_meal" (keywords: vegan, plant-based)
- category: "energy"
  - activity: "grid_electricity" (keywords: electricity, power, kWh, unit of power, energy usage)

### Examples
User text: "I drove my petrol car 15 km and ate dal"
Output:
[
  { "category": "transport", "activity": "car_petrol", "value": 15, "unit": "km" },
  { "category": "food", "activity": "vegetarian_meal", "value": 1, "unit": "meal" }
]

User text: "Drove my Tesla 50 km and had chicken curry"
Output:
[
  { "category": "transport", "activity": "car_electric", "value": 50, "unit": "km" },
  { "category": "food", "activity": "chicken_meal", "value": 1, "unit": "meal" }
]

User text: "I took a flight and ate fish"
Output:
[]
`


export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { text } = await request.json()
    if (!text) {
      return NextResponse.json({ error: 'No text provided.' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // We combine our instruction prompt with the user's text
    const fullPrompt = prompt + `"${text}"`

    const result = await model.generateContent(fullPrompt)
    const response = result.response

    // Clean up the response from Gemini to make sure it's valid JSON
    const jsonResponse = response
      .text()
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    // Parse the JSON string into an actual object
    const parsedActions = JSON.parse(jsonResponse)

    return NextResponse.json({ actions: parsedActions })
  } catch (error) {
    console.error('Error in /api/interpret:', error)
    return NextResponse.json(
      { error: 'Failed to interpret text.' },
      { status: 500 }
    )
  }
}
